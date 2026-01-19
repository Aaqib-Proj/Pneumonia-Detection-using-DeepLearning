import torch
import numpy as np
import cv2
from PIL import Image

class ViTGradCAM:
    def __init__(self, model):
        self.model = model
        self.gradients = None
        self.activations = None
        
        # Hook into the final LayerNorm of the last block
        # This is where ViT features are most semantic before classification
        target_layer = self.model.blocks[-1].norm1
        
        target_layer.register_forward_hook(self.save_activation)
        target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate_cam(self, input_tensor, target_class=None):
        # 1. Forward Pass to populate activations
        output = self.model(input_tensor)
        
        if target_class is None:
            target_class = output.argmax(dim=1).item()
            
        # 2. Zero grads and Backward Pass to get gradients
        self.model.zero_grad()
        
        # Safety: Ensure output requires grad
        target = output[0][target_class]
        target.backward()
        
        # 3. Get Gradients & Activations safely
        if self.gradients is None or self.activations is None:
            # Fallback for empty gradients
            return np.zeros((14, 14))

        grads = self.gradients[0] 
        acts = self.activations[0]
        
        # 4. Global Average Pooling to weigh importance
        weights = torch.mean(grads, dim=0)
        
        # 5. Weighted Combination
        cam = (acts * weights).sum(dim=1)
        
        # 6. Reshape Tokens (197) to Grid (14x14)
        # We drop the first token (Class Token) and keep the 196 image patches
        cam_image_tokens = cam[1:] 
        heatmap = cam_image_tokens.reshape(14, 14).detach().cpu().numpy()
        
        # 7. Normalize (ReLU + MinMax)
        heatmap = np.maximum(heatmap, 0) # ReLU
        max_val = np.max(heatmap)
        if max_val != 0:
            heatmap /= max_val
            
        return heatmap

def overlay_heatmap(original_pil_img, heatmap, alpha=0.4):
    """
    Overlays the 14x14 heatmap onto the original image, preserving its aspect ratio.
    """
    width, height = original_pil_img.size
    
    # Resize heatmap to match original image dimensions
    heatmap_resized = cv2.resize(heatmap, (width, height))
    
    # Apply Color Map (Jet: Blue=Cold/Normal, Red=Hot/Attention)
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    # Blend with original image
    img_np = np.array(original_pil_img)
    superimposed = (heatmap_colored * alpha) + (img_np * (1 - alpha))
    
    return Image.fromarray(np.uint8(superimposed))
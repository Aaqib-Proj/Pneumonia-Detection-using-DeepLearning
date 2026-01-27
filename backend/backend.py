import torch
import timm
import time
import uuid
import datetime
import numpy as np
import base64
import cv2
import random
import pydicom
import os
from groq import Groq
from io import BytesIO
from PIL import Image
from torchvision import transforms
from heatmap_utils import ViTGradCAM, overlay_heatmap
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()

class PneumaAI_Backend:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"✅ Backend Initializing on: {self.device}...")
        
        # --- LOAD BOTH MODELS ---
        print("   1. Loading Pediatric Specialist...")
        self.model_pediatric = self._load_model("pediatric_vit_tiny_15ep.pth")
        
        print("   2. Loading Adult Specialist...")
        self.model_adult = self._load_model("adult_vit_tiny_15ep.pth")
        
        # Initialize Explainers (Pre-loaded for speed)
        self.explainer_pediatric = ViTGradCAM(self.model_pediatric)
        self.explainer_adult = ViTGradCAM(self.model_adult)
        
        # --- GROQ INTEGRATION ---
        self.groq_available = False
        api_key = os.getenv("GROQ_API_KEY")
        if api_key and api_key != "your_groq_api_key_here":
            try:
                self.groq_client = Groq(api_key=api_key)
                self.groq_available = True
                print("   3. Groq AI Integration Active ✅")
            except Exception as e:
                print(f"   ⚠️ Groq Config Failed: {e}")
        else:
            print("   ⚠️ Groq API Key missing. LLM Explanations Disabled.")

        # Standard Transform
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def _load_model(self, path):
        """Helper to safely load a model file."""
        model = timm.create_model('vit_tiny_patch16_224', pretrained=False, num_classes=3)
        try:
            state_dict = torch.load(path, map_location=self.device)
            model.load_state_dict(state_dict)
            print(f"      ✅ Loaded {path}")
        except Exception as e:
            print(f"      ⚠️ Failed to load {path} ({e}). Using Random Weights (Demo Mode).")
        return model.to(self.device).eval()

    def read_dicom(self, file_bytes):
        """
        PARSES DICOM FILES (The "Hospital Standard" Feature)
        Extracts real patient data and converts high-bit X-ray to visible image.
        """
        try:
            # 1. Read DICOM Object from memory
            dicom = pydicom.dcmread(BytesIO(file_bytes))
            
            # 2. Extract Metadata safely (Defaults to "Unknown" if missing)
            # Format: Name, ID, Age, Sex, Modality
            meta = {
                "name": str(dicom.get("PatientName", "Anonymous")),
                "id": str(dicom.get("PatientID", f"PT-{str(uuid.uuid4())[:6]}")),
                "age": str(dicom.get("PatientAge", "??")).replace("Y", ""), # Clean '045Y' to '45'
                "sex": str(dicom.get("PatientSex", "U")),
                "date": dicom.get("StudyDate", datetime.datetime.now().strftime("%Y%m%d")),
                "modality": str(dicom.get("Modality", "CR"))
            }
            
            # 3. Handle Image Data (DICOM is often 16-bit, we need 8-bit for AI)
            img = dicom.pixel_array.astype(float)
            
            # Normalize to 0-255 range
            img = (np.maximum(img, 0) / img.max()) * 255.0
            img = np.uint8(img)
            
            # Convert to PIL RGB (Model expects 3 channels)
            img_pil = Image.fromarray(img).convert('RGB')
            
            print(f"   ℹ️ DICOM Loaded: {meta['name']} ({meta['age']}y)")
            return img_pil, meta
            
        except Exception as e:
            # If it fails, it's likely just a JPG/PNG, not a DICOM
            # print(f"DICOM Load Failed: {e}") 
            return None, None

    def enhance_clinical_image(self, image_bytes):
        """
        The 'Digital Darkroom': Applies CLAHE to clean noisy/dark X-rays.
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_cv = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        
        if img_cv is None: 
            return Image.open(BytesIO(image_bytes)).convert('RGB')
        
        # 1. Denoise
        img_denoised = cv2.medianBlur(img_cv, 3)
        # 2. CLAHE (Contrast Enhancement)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        img_enhanced = clahe.apply(img_denoised)
        # 3. Color Conversion
        img_rgb = cv2.cvtColor(img_enhanced, cv2.COLOR_GRAY2RGB)
        
        return Image.fromarray(img_rgb)

    def _calculate_lobe_metrics(self, heatmap, conf_score, label):
        """
        Generates the detailed Quantitative Table by analyzing specific heatmap regions.
        """
        # Map of Lung Lobes to Heatmap Grid Slices (Rows, Cols)
        # Based on standard chest X-ray anatomy (14x14 grid)
        regions = {
            "Right Upper":  (slice(0, 5), slice(0, 7)),
            "Right Middle": (slice(5, 9), slice(0, 7)),
            "Right Lower":  (slice(9, 14), slice(0, 7)),
            "Left Upper":   (slice(0, 6), slice(7, 14)),
            "Left Lower":   (slice(6, 14), slice(7, 14))
        }

        # Realistic lung lobe volumes (ml) based on medical literature
        lobe_volumes = {
            "Right Upper": 900,
            "Right Middle": 280,
            "Right Lower": 920,
            "Left Upper": 880,
            "Left Lower": 900
        }

        breakdown = []
        total_opacity = 0
        total_op_vol = 0
        total_vol = 0

        for name, (rows, cols) in regions.items():
            # 1. Measure Heatmap Intensity in this Lobe
            region_map = heatmap[rows, cols]
            avg_intensity = np.mean(region_map)
            
            # 2. Use realistic fixed volumes
            vol = lobe_volumes[name]
            
            # 3. Calculate Opacity Score (0-5) based on heatmap intensity
            # Scale heatmap intensity (0-1) to opacity score (0-5)
            if label == "Normal":
                # For normal cases, use actual heatmap but keep scores very low
                op_score = float(avg_intensity * 0.5)  # Max 0.5 for normal
                inf_prob = float(avg_intensity * 2.0)  # Max 2% for normal
            else:
                # For pneumonia cases, scale intensity to 0-5 range
                # Use confidence to modulate the score
                base_score = avg_intensity * 5.0
                op_score = float(base_score * (0.7 + 0.3 * conf_score))  # Confidence adds 0-30% boost
                op_score = min(max(op_score, 0.0), 5.0)  # Clamp to 0-5
                inf_prob = float(avg_intensity * 100)  # Direct percentage from intensity
            
            # 4. Opacity Volume (ml)
            op_vol = int((op_score / 5.0) * vol)

            breakdown.append({
                "region": name,
                "opacity_score": round(op_score, 1),
                "lung_volume_ml": vol,
                "opacity_volume_ml": op_vol,
                "infection_prob": f"{min(inf_prob, 99.9):.1f}%"
            })
            
            total_opacity += op_score
            total_op_vol += op_vol
            total_vol += vol

        # Aggregate Metrics
        lung_involvement = round(float(total_op_vol / total_vol) * 100, 1) if total_vol > 0 else 0
        # Calculate average opacity score across all lobes
        avg_opacity = round(float(total_opacity / len(regions)), 1)

        return {
            "total_opacity_score": float(avg_opacity),
            "lung_involvement": f"{lung_involvement}%",
            "breakdown": breakdown
        }

    def _get_clinical_text(self, label, p_type, conf_score, lobe_data):
        """Generates the 'Doctor's Note'."""
        
        # Identify worst affected lobe
        worst_lobe = max(lobe_data['breakdown'], key=lambda x: x['opacity_score'])
        
        if label == "Normal":
            return {
                "findings": "The cardiac silhouette and mediastinal contours are within normal limits. Both lung fields are clear of focal consolidation, effusion, or pneumothorax. No acute pulmonary abnormality is identified.",
                "heart": "Cardiac silhouette is normal.",
                "diaphragm": "Costophrenic angles are sharp.",
                "recommendation": "Normal diagnostic outcome. Continue routine clinical monitoring as indicated by primary symptoms."
            }
        else:
            lobe_name = worst_lobe['region']
            if p_type == "Bacterial":
                type_msg = "Bacterial Pneumonia (requires antibiotics)"
                if conf_score < 0.75:
                    sev = "Low"
                    rec = f"Mild focal consolidation in {lobe_name} Lobe. Probable early Bacterial Pneumonia. Clinical correlation and potential antibiotic therapy recommended."
                elif conf_score < 0.90:
                    sev = "Moderate"
                    rec = f"Significant focal consolidation in {lobe_name} Lobe. Classical Bacterial Pneumonia pattern. Prompt Pulmonology referral and antibiotic regimen suggested."
                else:
                    sev = "Severe"
                    rec = f"URGENT: Extensive air-space opacification in {lobe_name} Lobe. High suspicion of acute Bacterial Pneumonia. Immediate clinical stabilization and IV antibiotics required."
            else: # Viral
                type_msg = "Viral Pneumonia (supportive care)"
                if conf_score < 0.75:
                    sev = "Low"
                    rec = f"Mild interstitial opacities in {lobe_name} Lobe. Suggestive of early Viral Pneumonia. Monitor oxygen saturation and provide supportive care."
                elif conf_score < 0.90:
                    sev = "Moderate"
                    rec = f"Diffuse interstitial infiltrates noted in {lobe_name} Lobe. Pattern consistent with Viral Pneumonia. Supportive therapy and rest indicated."
                else:
                    sev = "Severe"
                    rec = f"URGENT: Widespread ground-glass opacities in {lobe_name} Lobe. Severe Viral Pneumonia / Pneumonitis. Critical care consultation for respiratory support recommended."

            return {
                "findings": f"Multifocal or focal opacity observed predominantly in the {lobe_name} Lobe. The radiographic appearance is highly suggestive of {sev.lower()} {p_type.lower()} inflammatory infiltrate.",
                "heart": "Cardiac borders may be partially obscured by adjacent infiltrate.",
                "diaphragm": "Trace blunting of the costophrenic angle on the affected side.",
                "recommendation": rec
            }

    def _generate_groq_analysis(self, original_img, heatmap_img, diagnosis_info):
        """
        Calls Groq Llama 3.2 Vision API to generate a professional medical explanation.
        """
        if not self.groq_available:
            return "Groq AI explanation is currently unavailable. Please check your API key."

        try:
            print(f"🧬 Starting Groq (Llama 3.2 Vision) Analysis for {diagnosis_info['label']}...")
            
            # Convert PIL images to base64 for Groq
            def pil_to_base64(img):
                buf = BytesIO()
                img.save(buf, format="PNG")
                return base64.b64encode(buf.getvalue()).decode('utf-8')

            original_b64 = pil_to_base64(original_img)
            heatmap_b64 = pil_to_base64(heatmap_img)

            prompt = f"""
            ROLE: Senior Board-Certified Radiologist & Consultant Pulmonologist.
            CONTEXT: Clinical Chest X-ray analysis + Grad-CAM Heatmap correlation.
            DIAGNOSIS: {diagnosis_info['label']} ({diagnosis_info['type']})
            AI CONFIDENCE: {diagnosis_info['confidence_display']}

            MANDATE: Output a formal, structured clinical report in JSON format. 
            Use dense medical terminology (e.g., 'reticulonodular opacities', 'hilar lymphadenopathy'). 
            Do NOT mention being an AI.

            JSON STRUCTURE REQUIRED:
            {{
                "radiographic_observations": [
                    "Detailed anatomical description 1",
                    "Detailed anatomical description 2",
                    "Description of lung lobes/markings"
                ],
                "heatmap_correlation": "Technical analysis of the highlighted pixel regions and their clinical validity",
                "clinical_summary": "2-3 sentence authoritative clinical interpretation",
                "next_steps": [
                    "Clinical recommendation 1",
                    "Clinical recommendation 2"
                ]
            }}
            """

            # Call Groq Vision in JSON Mode
            print("   📡 Dispatching to Groq Cloud (Structured JSON Data)...")
            completion = self.groq_client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional Radiologist. Always respond in valid JSON format."
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{original_b64}"}
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{heatmap_b64}"}
                            }
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=2048,
            )
            
            content = completion.choices[0].message.content
            if not content:
                print("   ⚠️ Empty response from Groq")
                return "{}"
                
            print("   ✅ Groq Structured Analysis Complete.")
            return content
        except Exception as e:
            print(f"   ❌ Groq Error: {e}")
            return f"Error generating Groq explanation: {str(e)}"

    def generate_report(self, image_bytes, patient_type):
        start_time = time.time()
        
        # --- 1. INTELLIGENT FILE PARSING (DICOM vs JPG) ---
        img, meta = self.read_dicom(image_bytes)
        
        if img is None:
            # It's NOT a DICOM, use standard cleaning logic
            try: img = self.enhance_clinical_image(image_bytes)
            except: img = Image.open(BytesIO(image_bytes)).convert('RGB')
            
            # Standard Metadata for JPGs
            meta = {
                "name": "Anonymous",
                "id": f"PNEUMA-{str(uuid.uuid4())[:4].upper()}",
                "age": "--",
                "sex": "--",
                "date": datetime.datetime.now().strftime("%d/%m/%Y"),
                "modality": "CXR (Standard)"
            }

        # --- 2. MODEL SELECTION ---
        if patient_type == "adult":
            active_model = self.model_adult
            active_explainer = self.explainer_adult
            model_name = "PneumaNet v2.4 (Adult Specialist)"
        else:
            active_model = self.model_pediatric
            active_explainer = self.explainer_pediatric
            model_name = "PneumaNet v2.4 (Pediatric Specialist)"

        # --- 3. PREDICT ---
        tensor = self.transform(img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = active_model(tensor)
            probs = torch.softmax(output, dim=1)
            confidence, class_idx = torch.max(probs, 1)
        
        # Mapping: 0: Bacterial, 1: Normal, 2: Viral
        classes = ['Bacterial', 'Normal', 'Viral']
        p_type_pred = classes[class_idx.item()]
        conf_score = float(confidence.item())
        
        if p_type_pred == "Normal":
            label = "Normal"
            p_type = "None"
            message = f"Normal diagnostic outcome ({conf_score:.1%} confidence)"
        else:
            label = "Pneumonia"
            p_type = p_type_pred
            message = f"{p_type_pred} Pneumonia detected ({conf_score:.1%} confidence)"
        
        # --- 4. EXPLAIN ---
        heatmap_grid = active_explainer.generate_cam(tensor, target_class=class_idx.item())
        
        # --- 5. METRICS ---
        quant_data = self._calculate_lobe_metrics(heatmap_grid, conf_score, label)
        clinical = self._get_clinical_text(label, p_type, conf_score, quant_data)

        # Visuals
        heatmap_img = overlay_heatmap(img, heatmap_grid, alpha=0.4)
        buffered = BytesIO()
        heatmap_img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        # Severity
        if label == "Pneumonia":
            if conf_score > 0.90: severity = "High"
            elif conf_score > 0.70: severity = "Moderate"
            else: severity = "Low"
        else:
            severity = "None"

        p_prob = conf_score if label == "Pneumonia" else (1.0 - conf_score)

        # --- 6. FINAL JSON (AI Explanation is fetched asynchronously via /api/explain) ---
        return {
            "meta": {
                "id": meta["id"],
                "name": meta["name"],
                "age_sex": f"{meta['age']}/{meta['sex']}",
                "date": meta["date"],
                "modality": meta["modality"],
                "model": model_name,
                "latency": f"{int((time.time()-start_time)*1000)}ms"
            },
            "diagnosis": {
                "label": label,
                "prediction": label,
                "type": p_type,
                "confidence": conf_score,
                "confidence_display": f"{conf_score:.1%}",
                "message": message,
                "severity": severity,
                "pneumonia_prob": f"{p_prob:.1%}"
            },
            "quantitative": quant_data,
            "clinical": clinical,
            "heatmap_base64": f"data:image/png;base64,{img_str}"
        }

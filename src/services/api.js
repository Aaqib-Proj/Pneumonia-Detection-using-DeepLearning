const API_URL = "http://localhost:8000/api";

export const uploadXRay = async (file, patientType = 'pediatric', patientData = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_type", patientType);
    if (patientData.name) formData.append("patient_name", patientData.name);
    if (patientData.age) formData.append("patient_age", patientData.age);
    if (patientData.gender) formData.append("patient_gender", patientData.gender);

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Upload failed", error);
        throw error;
    }
};

export const fetchHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) throw new Error("Failed to fetch history");
        return await response.json();
    } catch (error) {
        console.error("History fetch failed", error);
        return [];
    }
};

export const deleteReport = async (id) => {
    try {
        const response = await fetch(`${API_URL}/history/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete report");
        return true;
    } catch (error) {
        console.error("Delete failed", error);
        return false;
    }
};

export const explainXRay = async (originalBlob, heatmapBlob, label, type, confidence) => {
    const formData = new FormData();
    formData.append('image', originalBlob, 'original.png');
    formData.append('heatmap', heatmapBlob, 'heatmap.png');
    formData.append('label', label);
    formData.append('p_type', type);
    formData.append('confidence', confidence);

    try {
        const response = await fetch(`${API_URL}/explain`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Explanation server error");
        return await response.json();
    } catch (error) {
        console.error("Gemini explain failed", error);
        throw error;
    }
};

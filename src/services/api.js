const API_URL = "http://localhost:8000/api";

export const uploadXRay = async (file, patientType = 'pediatric') => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_type", patientType);

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

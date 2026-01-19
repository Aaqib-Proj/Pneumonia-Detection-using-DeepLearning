import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { uploadXRay } from '../services/api';
import Button from '../components/Button';
import { CheckCircle2, Loader2, Calendar, User, Phone, Mail, FileText, Activity, Hash } from 'lucide-react';

const UploadPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState(0); // 0: Idle, 1: Uploading, 2: Processing, 3: Complete
    const [patientId, setPatientId] = useState('');

    useEffect(() => {
        // Generate a random patient ID on mount
        setPatientId(`P-${Math.floor(100000 + Math.random() * 900000)}`);
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        age: '',
        gender: 'male',
        weight: '',
        email: '',
        phone: '',
        clinicalNotes: '',
        patientType: 'adult' // 'adult' | 'pediatric'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Auto-calculate age if DOB changes
        if (name === 'dob') {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setFormData(prev => ({
                ...prev,
                dob: value,
                age: age >= 0 ? age.toString() : ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload an X-Ray image first.");
            return;
        }

        // Expanded Validation
        if (!formData.name || !formData.age || !formData.gender || !formData.weight || !formData.phone) {
            alert("Please fill in all mandatory fields: Name, Age, Gender, Weight, and Phone.");
            return;
        }

        setAnalyzing(true);
        setStage(1);
        setProgress(0);

        try {
            // Start fake progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return 90;
                    return prev + Math.random() * 5;
                });
            }, 500);

            // Call Real API
            const report = await uploadXRay(file, formData.patientType);

            clearInterval(progressInterval);
            setProgress(100);
            setStage(3);

            // Convert to Base64 for history
            const toBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

            try {
                const base64Image = await toBase64(file);
                // Save to History
                const historyItem = {
                    id: report.meta?.id || patientId,
                    timestamp: Date.now(),
                    patientData: { ...formData, id: patientId },
                    diagnosis: report.diagnosis?.label || 'Unknown',
                    confidence: report.diagnosis?.confidence || '--',
                    reportData: report,
                    originalImageBase64: base64Image
                };

                const existingHistory = JSON.parse(localStorage.getItem('pneuma_history') || '[]');
                const newHistory = [historyItem, ...existingHistory].slice(0, 10);
                localStorage.setItem('pneuma_history', JSON.stringify(newHistory));
            } catch (err) {
                console.error("Failed to save history", err);
            }

            setTimeout(() => {
                navigate('/dashboard', {
                    state: {
                        fileUrl: URL.createObjectURL(file), // Original file for local preview
                        patientData: { ...formData, id: patientId },
                        report: report
                    }
                });
            }, 1000);

        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please ensure the backend is running.");
            setAnalyzing(false);
            setStage(0);
            setProgress(0);
        }
    };

    useEffect(() => {
        if (progress > 30 && stage === 1) setStage(2);
    }, [progress, stage]);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Radiology Request Form</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Use this form to submit chest X-ray scans for AI-assisted analysis.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Form ID</div>
                        <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{patientId}</div>
                    </div>
                </div>

                {/* Main Form Container */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

                    {/* Form Header Strip */}
                    <div className="bg-slate-100 dark:bg-slate-900/50 px-8 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Activity className="text-emerald-500" size={20} />
                            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm">New Case Entry</span>
                        </div>
                        <div className="text-sm text-slate-500">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <form onSubmit={handleAnalyze} className="p-8">

                        {/* Section 1: Patient Demographics */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                <User className="text-emerald-500" size={20} />
                                Patient Demographics
                            </h3>

                            <div className="grid md:grid-cols-12 gap-6">
                                {/* Name */}
                                <div className="md:col-span-8 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Patient Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter full legal name"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Patient ID (Read Only) */}
                                <div className="md:col-span-4 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Patient ID
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            readOnly
                                            value={patientId}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-500 font-mono"
                                        />
                                    </div>
                                </div>

                                {/* DOB */}
                                <div className="md:col-span-4 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Age */}
                                <div className="md:col-span-4 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        placeholder="Age"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Gender */}
                                <div className="md:col-span-4 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Gender <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        required
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Weight */}
                                <div className="md:col-span-6 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Weight (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="weight"
                                        required
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 75"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Contact Info */}
                                <div className="md:col-span-6 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="patient@email.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-12 space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="(555) 123-4567"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Clinical Information */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                <FileText className="text-emerald-500" size={20} />
                                Clinical Information
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Clinical History / Reason for Examination
                                    </label>
                                    <textarea
                                        name="clinicalNotes"
                                        value={formData.clinicalNotes}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Describe patient symptoms, history of present illness, or specific clinical questions..."
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Cough</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Fever</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Shortness of Breath</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Chest Pain</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Imaging Details */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                                <Activity className="text-emerald-500" size={20} />
                                Diagnostic Imaging
                            </h3>

                            <div className="grid md:grid-cols-1 gap-8">
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Patient Type Classification
                                    </label>
                                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, patientType: 'adult' }))}
                                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${formData.patientType === 'adult'
                                                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Adult
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, patientType: 'pediatric' }))}
                                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${formData.patientType === 'pediatric'
                                                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Pediatric (Child)
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        * Select 'Pediatric' for patients under 18 or 'Adult' for standard analysis models.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Upload Study (DICOM / JPEG / PNG)
                                    </label>
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <FileUpload onFileSelect={(f) => setFile(f)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col items-center">
                            {!analyzing && (
                                <p className="text-xs text-slate-500 mb-4 max-w-lg text-center">
                                    By submitting this form, you confirm that you have the necessary authorization to process this patient data for diagnostic purposes.
                                </p>
                            )}

                            <div className={`transition-all duration-500 w-full ${analyzing ? 'opacity-100' : 'opacity-100'}`}>
                                {!analyzing ? (
                                    <div className="flex justify-end">
                                        <Button type="submit" className="w-full text-lg font-bold py-4 shadow-xl hover:shadow-emerald-500/20">
                                            Submit Request for Analysis
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                            <span className={stage >= 1 ? 'text-emerald-500 font-bold' : ''}>1. Uploading</span>
                                            <span className={stage >= 2 ? 'text-emerald-500 font-bold' : ''}>2. Processing</span>
                                            <span className={stage >= 3 ? 'text-emerald-500 font-bold' : ''}>3. Reporting</span>
                                        </div>
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-500 ease-out relative"
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            {stage < 3 ? (
                                                <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400">
                                                    <Loader2 className="animate-spin" size={20} />
                                                    <span className="font-mono">Processing Request ID: {patientId}...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
                                                    <CheckCircle2 size={24} />
                                                    <span>Analysis Complete. Redirecting...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;

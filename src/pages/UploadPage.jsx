import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import Card from '../components/Card';
import { CheckCircle2, Loader2 } from 'lucide-react';

const UploadPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState(0); // 0: Idle, 1: Uploading, 2: Processing, 3: Complete

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        weight: '',
        email: '',
        phone: '',
        patientType: 'adult' // 'adult' | 'pediatric'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload an X-Ray image first.");
            return;
        }

        // Basic validation
        if (!formData.name || !formData.age) {
            alert("Please fill in at least the Patient Name and Age.");
            return;
        }

        setAnalyzing(true);
        setStage(1);
        // Simulate process
    };

    useEffect(() => {
        if (analyzing) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    // Speed variation logic
                    const increment = Math.random() * 5 + 1;
                    return Math.min(prev + increment, 100);
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [analyzing]);

    useEffect(() => {
        if (progress > 30 && stage === 1) setStage(2);
        if (progress === 100 && stage === 2) {
            setStage(3);
            setTimeout(() => {
                const fileUrl = URL.createObjectURL(file);
                // Pass form data and file URL to dashboard
                navigate('/dashboard', { state: { fileUrl, patientData: formData } });
            }, 1000);
        }
    }, [progress, stage, navigate, file, formData]);

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">Patient Information & Analysis</h1>
                    <p className="text-gray-500 dark:text-gray-400">Please fill in the patient details and upload an X-ray.</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleAnalyze} className="space-y-6">

                        {/* 1. Patient Details Form - Grid Layout */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Patient Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    required
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 45"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
                                <input
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 75"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="patient@example.com"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+1 234 567 8900"
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                        {/* 2. File Upload Section */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-lg font-semibold text-gray-800 dark:text-white">Upload X-Ray Scan</span>
                                <span className="text-sm text-gray-500">Supported formats: DICOM, JPEG, PNG</span>
                            </div>
                            <FileUpload onFileSelect={(f) => setFile(f)} />
                        </div>

                        {/* 3. Patient Type Selection (At the last as requested) */}
                        <div className="flex flex-col items-center gap-3 pt-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Analysis Mode (Select Patient Type)</span>
                            <div className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl inline-flex border border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, patientType: 'adult' }))}
                                    className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.patientType === 'adult'
                                        ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm scale-100'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Adult
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, patientType: 'pediatric' }))}
                                    className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.patientType === 'pediatric'
                                        ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm scale-100'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Pediatric (Child)
                                </button>
                            </div>
                        </div>

                        {/* Submit Action */}
                        <div className={`transition-all duration-500 ${analyzing ? 'opacity-100' : 'opacity-100'}`}>
                            {!analyzing ? (
                                <div className="text-center pt-4">
                                    <Button type="submit" className="w-full md:w-auto px-12 py-3 text-lg font-bold shadow-lg hover:shadow-emerald-500/20">
                                        Generate Diagnostic Report
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6 pt-4">
                                    <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <span className={stage >= 1 ? 'text-emerald-500' : ''}>Uploading...</span>
                                        <span className={stage >= 2 ? 'text-emerald-500' : ''}>Analyzing w/ Deep Learning...</span>
                                        <span className={stage >= 3 ? 'text-emerald-500' : ''}>Finalizing...</span>
                                    </div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-200 ease-out relative"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        {stage < 3 ? (
                                            <div className="flex items-center justify-center gap-2 text-emerald-500">
                                                <Loader2 className="animate-spin" />
                                                <span>Processing {formData.patientType} scan... {Math.round(progress)}%</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold">
                                                <CheckCircle2 />
                                                <span>Analysis Complete!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default UploadPage;

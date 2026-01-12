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

    const handleAnalyze = () => {
        if (!file) return;
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
                navigate('/dashboard', { state: { fileUrl } });
            }, 1000);
        }
    }, [progress, stage, navigate]);

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">Upload & Analyze Page</h1>
                    <p className="text-gray-500 dark:text-gray-400">Upload your chest X-ray image for instant AI analysis.</p>
                </div>

                <Card className="min-h-[500px] flex flex-col justify-center gap-8">
                    <FileUpload onFileSelect={(f) => setFile(f)} />

                    {file && (
                        <div className={`transition-all duration-500 ${analyzing ? 'opacity-100' : 'opacity-100'}`}>
                            {!analyzing ? (
                                <div className="text-center">
                                    <Button onClick={handleAnalyze} className="w-full md:w-auto px-12 py-3 text-lg">
                                        View Results
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
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
                                                <span>Processing... {Math.round(progress)}%</span>
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
                    )}
                </Card>
            </div>
        </div>
    );
};

export default UploadPage;

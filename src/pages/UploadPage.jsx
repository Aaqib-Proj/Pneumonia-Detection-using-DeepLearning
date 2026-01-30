import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FileUpload from '../components/FileUpload';
import { uploadXRay } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import {
    CheckCircle2, Loader2, Calendar, User,
    Phone, Mail, FileText, Activity, Hash,
    UploadCloud, ShieldCheck, ArrowRight, X,
    ChevronRight, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Zap = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UploadPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState(0);
    const [patientId, setPatientId] = useState('');
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        setPatientId(`P-${Math.floor(100000 + Math.random() * 900000)}`);
    }, []);

    const [formData, setFormData] = useState({
        name: '', dob: '', age: '', gender: 'male',
        weight: '', email: '', phone: '', clinicalNotes: '',
        patientType: 'adult'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dob') {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            setFormData(prev => ({ ...prev, dob: value, age: age >= 0 ? age.toString() : '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (f) => {
        setFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file) { alert("Please upload an X-Ray image."); return; }
        if (!formData.name || !formData.age) { alert("Please complete patient details."); return; }

        setAnalyzing(true);
        setStage(1);
        setProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setProgress((prev) => (prev >= 90 ? 90 : prev + Math.random() * 8));
            }, 600);

            const report = await uploadXRay(file, formData.patientType, formData);
            if (report.error) {
                throw new Error(report.error);
            }

            clearInterval(progressInterval);
            setProgress(100);
            setStage(3);

            const toBase64 = (fileRef) => new Promise((res, rej) => {
                const reader = new FileReader();
                reader.readAsDataURL(fileRef);
                reader.onload = () => res(reader.result);
                reader.onerror = e => rej(e);
            });

            try {
                const base64 = await toBase64(file);
                const historyItem = {
                    id: report.meta?.id || patientId,
                    timestamp: Date.now(),
                    patientData: { ...formData, id: patientId },
                    diagnosis: report.diagnosis?.label || 'Unknown',
                    confidence: report.diagnosis?.confidence || '--',
                    reportData: report,
                    originalImageBase64: base64
                };
                const existing = JSON.parse(localStorage.getItem('pneuma_history') || '[]');
                localStorage.setItem('pneuma_history', JSON.stringify([historyItem, ...existing].slice(0, 15)));
            } catch (err) { console.error(err); }

            setTimeout(() => {
                navigate('/dashboard', { state: { fileUrl: URL.createObjectURL(file), patientData: { ...formData, id: patientId }, report } });
            }, 1000);

        } catch (error) {
            console.error(error);
            alert("Analysis failed.");
            setAnalyzing(false);
            setStage(0);
        }
    };

    const steps = [
        { id: 1, label: 'Demographics', icon: User },
        { id: 2, label: 'Clinical Info', icon: FileText },
        { id: 3, label: 'Imaging', icon: UploadCloud },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Stepper UI */}
                <div className="flex items-center justify-between mb-12 relative px-4">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-10"></div>
                    {steps.map((s, idx) => (
                        <div key={s.id} className="flex flex-col items-center gap-3">
                            <motion.div
                                animate={{
                                    scale: activeStep === s.id ? 1.2 : 1,
                                    backgroundColor: activeStep >= s.id ? '#10b981' : (activeStep < s.id ? '#e2e8f0' : '#1e293b')
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-colors`}
                            >
                                {activeStep > s.id ? <CheckCircle2 size={20} /> : <s.icon size={18} />}
                            </motion.div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${activeStep === s.id ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAnalyze}>
                    <AnimatePresence mode="wait">
                        {/* Step 1: Demographics */}
                        {activeStep === 1 && (
                            <motion.div
                                key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('upload.title')}</h1>
                                    <p className="text-slate-500 font-medium">{t('upload.subtitle')}</p>
                                </div>

                                <Card className="p-8 border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="input-field" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                                            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="input-field dark:[color-scheme:dark]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                                            <input type="number" name="age" required value={formData.age} onChange={handleInputChange} className="input-field" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                                            <select name="gender" required value={formData.gender} onChange={handleInputChange} className="input-field">
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                                            <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="input-field" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                            <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="input-field" />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <Button onClick={() => setActiveStep(2)} type="button" className="px-8 py-3 rounded-xl gap-2">
                                            Continue <ArrowRight size={18} />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 2: Clinical */}
                        {activeStep === 2 && (
                            <motion.div
                                key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Clinical History</h1>
                                    <p className="text-slate-500 font-medium">Add symptoms and prior history for AI context.</p>
                                </div>

                                <Card className="p-8 border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Examination</label>
                                            <textarea name="clinicalNotes" rows="4" value={formData.clinicalNotes} onChange={handleInputChange} className="input-field resize-none h-32" placeholder="e.g. Persistent cough for 3 weeks..."></textarea>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Cough', 'Fever', 'Dyspnea', 'Chest Pain'].map(symp => (
                                                <label key={symp} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" />
                                                    <span className="text-sm font-bold">{symp}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-between">
                                        <Button onClick={() => setActiveStep(1)} type="button" variant="ghost" className="px-8 py-3">Back</Button>
                                        <Button onClick={() => setActiveStep(3)} type="button" className="px-8 py-3 rounded-xl gap-2">
                                            Continue <ArrowRight size={18} />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 3: Imaging */}
                        {activeStep === 3 && (
                            <motion.div
                                key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Upload Scanning</h1>
                                    <p className="text-slate-500 font-medium">Submit high-resolution radiographic data.</p>
                                </div>

                                <Card className="p-8 border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-center">
                                            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                <button type="button" onClick={() => setFormData(p => ({ ...p, patientType: 'adult' }))} className={`px-10 py-3 rounded-xl text-sm font-black transition-all ${formData.patientType === 'adult' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-900'}`}>ADULT</button>
                                                <button type="button" onClick={() => setFormData(p => ({ ...p, patientType: 'pediatric' }))} className={`px-10 py-3 rounded-xl text-sm font-black transition-all ${formData.patientType === 'pediatric' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-900'}`}>PEDIATRIC</button>
                                            </div>
                                        </div>

                                        {!previewUrl ? (
                                            <div className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center group hover:border-emerald-500/30 transition-colors">
                                                <FileUpload onFileSelect={handleFileChange} />
                                            </div>
                                        ) : (
                                            <div className="relative rounded-[2rem] overflow-hidden group border-4 border-slate-100 dark:border-slate-800 aspect-[4/3] max-w-md mx-auto shadow-2xl">
                                                <img src={previewUrl} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => setFile(null) || setPreviewUrl(null)} className="p-4 bg-red-500 text-white rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                                                        <X size={32} />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex justify-between items-center">
                                                    <span className="text-xs font-black text-white uppercase tracking-widest">{file.name}</span>
                                                    <span className="text-[10px] font-bold text-emerald-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!analyzing ? (
                                        <div className="mt-12 flex justify-between items-center">
                                            <Button onClick={() => setActiveStep(2)} type="button" variant="ghost" className="px-8 py-3">Back</Button>
                                            <Button type="submit" disabled={!file} className="px-12 py-4 rounded-2xl gap-2 text-lg font-black shadow-2xl shadow-emerald-500/30 disabled:opacity-30 transition-all">
                                                Run Deep Analysis <Zap size={20} className="fill-current" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] text-center border border-white/5 shadow-3xl">
                                            <div className="mb-8">
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Processing Inference Engine</div>
                                                <div className="flex justify-between items-end mb-4 px-2">
                                                    <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{stage === 1 ? 'Uploading Study' : (stage === 2 ? 'Neural Processing' : 'Building Report')}</span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        animate={{ width: `${progress}%` }}
                                                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                                        style={{ willChange: 'width' }}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-4 text-emerald-500/80">
                                                <Loader2 className="animate-spin" size={24} />
                                                <span className="text-sm font-black uppercase tracking-widest">Optimizing Voxels...</span>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>

                <div className="mt-12 flex flex-col md:flex-row gap-8 items-center justify-center opacity-40 grayscale pointer-events-none">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={16} /> HIPAA Secure
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Activity size={16} /> Edge Processing
                    </div>
                </div>
            </div>

            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.875rem 1.25rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(226, 232, 240, 1);
                    background-color: rgba(248, 250, 252, 1);
                    font-size: 0.875rem;
                    font-weight: 700;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                }
                .dark .input-field {
                    border-color: rgba(30, 41, 59, 1);
                    background-color: rgba(15, 23, 42, 0.9);
                    color: white;
                }
                .input-field:focus {
                    border-color: #10b981;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                    background-color: white;
                }
                .dark .input-field:focus {
                    background-color: #0f172a;
                }
                ::-webkit-calendar-picker-indicator {
                    filter: invert(0);
                    cursor: pointer;
                }
                .dark ::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                }
            `}</style>
        </div>
    );
};


export default UploadPage;

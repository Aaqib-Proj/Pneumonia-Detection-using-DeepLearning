import React, { useRef, useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Download, Share2, FileText, Printer,
    Maximize2, X, Activity, ShieldAlert,
    Monitor, Layout, Layers, AlertCircle,
    CheckCircle2, Clock, Scale, Info, User,
    ChevronRight, ArrowLeft, Calendar
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useHeader } from '../context/HeaderContext';
import MedicalReport from '../components/MedicalReport';
import { motion, AnimatePresence } from 'framer-motion';
import { explainXRay } from '../services/api';
import AIChat from '../components/AIChat';

const DashboardPage = () => {
    const { t } = useTranslation();
    const reportRef = useRef(null);
    const location = useLocation();
    const [imageSrc, setImageSrc] = useState(null);
    const [originalImageSrc, setOriginalImageSrc] = useState(null);
    const [heatmapSrc, setHeatmapSrc] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const { setActions } = useHeader();
    const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' | 'original' | 'side-by-side'
    const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
    const [report, setReport] = useState(null);
    const [explanationError, setExplanationError] = useState(null);

    useEffect(() => {
        if (location.state?.fileUrl) {
            setOriginalImageSrc(location.state.fileUrl);
        }
        if (location.state?.patientData) {
            setPatientData(location.state.patientData);
        }
        if (location.state?.report) {
            setReport(location.state.report);
            if (location.state.report.heatmap_base64) {
                setHeatmapSrc(location.state.report.heatmap_base64);
            }
        }
    }, [location]);

    // Async AI Fetching for Efficiency
    useEffect(() => {
        const fetchAIExplanation = async () => {
            if (!report || report.diagnosis?.ai_explanation || !originalImageSrc || !heatmapSrc || explanationError) return;

            try {
                const originalResp = await fetch(originalImageSrc);
                const originalBlob = await originalResp.blob();

                const heatmapResp = await fetch(heatmapSrc);
                const heatmapBlob = await heatmapResp.blob();

                const result = await explainXRay(
                    originalBlob,
                    heatmapBlob,
                    report.diagnosis.label,
                    report.diagnosis.type,
                    report.diagnosis.confidence_display
                );

                if (result.explanation) {
                    setReport(prev => ({
                        ...prev,
                        diagnosis: {
                            ...prev.diagnosis,
                            ai_explanation: result.explanation
                        }
                    }));
                    setExplanationError(null);
                } else if (result.error) {
                    setExplanationError(result.error);
                }
            } catch (err) {
                console.error("AI Fetch Error:", err);
                setExplanationError(t('dashboard.ai_unavailable'));
            }
        };

        if (report && !report.diagnosis?.ai_explanation && !explanationError) {
            fetchAIExplanation();
        }
    }, [report, originalImageSrc, heatmapSrc, explanationError]);

    // Data for Chart
    const chartData = report?.quantitative?.breakdown?.map(item => ({
        name: item.region.replace('Right ', 'R-').replace('Left ', 'L-').replace(' Upper', 'U').replace(' Middle', 'M').replace(' Lower', 'L'),
        opacity: item.opacity_score,
        infection: parseFloat(item.infection_prob) || 0
    })) || [];

    const handleDownloadPDF = async () => {
        const element = reportRef.current;
        if (!element) return;
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`PneumaScan_Report_${report?.meta?.id || 'Analysis'}.pdf`);
        } catch (error) {
            console.error("PDF Failed", error);
        }
    };

    const handlePrint = () => window.print();
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'PneumaScan Analysis Results',
                text: `Diagnosis: ${report?.diagnosis?.label} (${report?.diagnosis?.confidence})`,
                url: window.location.href
            }).catch(() => { });
        }
    };

    useEffect(() => {
        setActions([
            { label: t('dashboard.download_pdf'), icon: Download, onClick: handleDownloadPDF },
            { label: t('dashboard.share_results'), icon: Share2, onClick: handleShare },
            { label: t('dashboard.print_label'), icon: Printer, onClick: handlePrint }
        ]);
        return () => setActions([]);
    }, [setActions, report, patientData]);

    const isPneumonia = report?.diagnosis?.label === "Pneumonia";
    const pneumoniaProb = report?.diagnosis?.pneumonia_prob || (isPneumonia ? report?.diagnosis?.confidence : "0%");
    const confidenceVal = report ? parseFloat(report.diagnosis.confidence) : 0;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Print Settings */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-report-container, #printable-report-container * { visibility: visible; }
                    #printable-report-container { position: absolute; left: 0; top: 0; width: 100%; border: none; }
                }
            `}</style>

            {/* Hidden PDF Report */}
            <div id="printable-report-container" className="fixed top-0 left-[-10000px] w-[210mm]">
                <MedicalReport ref={reportRef} imageSrc={originalImageSrc} data={report?.diagnosis} patientData={patientData} report={report} />
            </div>

            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <NavLink to="/upload" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-2 transition-colors text-sm font-medium">
                            <ArrowLeft size={16} /> {t('dashboard.back')}
                        </NavLink>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('dashboard.results')}</h1>
                        <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mt-1">Ref: #{report?.meta?.id || '----'}</p>
                    </motion.div>

                    <div className="flex gap-3 no-print">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 border-slate-200 dark:border-slate-800">
                            <Printer size={16} /> {t('dashboard.print')}
                        </Button>
                        <Button size="sm" onClick={handleDownloadPDF} className="gap-2 shadow-lg shadow-emerald-500/20">
                            <Download size={16} /> {t('dashboard.results')}
                        </Button>
                    </div>
                </div>

                {/* Patient Summary Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: t('dashboard.patient'), value: report?.meta?.name || patientData?.name || 'Anonymous', icon: User },
                        { label: t('dashboard.age_sex'), value: report?.meta?.age_sex || `${patientData?.age || '--'} / ${patientData?.gender || '--'}`, icon: Activity },
                        { label: t('dashboard.modality'), value: report?.meta?.modality || 'CXR Standard', icon: FileText },
                        { label: t('dashboard.study_date'), value: report?.meta?.date || new Date().toLocaleDateString(), icon: Calendar }
                    ].map((item, idx) => (
                        <Card key={idx} className="p-4 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-100 dark:border-slate-800">
                            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${item.color || 'text-slate-500'}`}>
                                <item.icon size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-0.5">{item.label}</p>
                                <p className={`text-sm font-bold truncate ${item.color || 'text-slate-900 dark:text-white'}`}>{item.value}</p>
                            </div>
                        </Card>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Analysis Column (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Image Viewer Card */}
                        <Card className="p-0 overflow-hidden border-none shadow-xl bg-black ring-1 ring-white/5">
                            <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                        {[
                                            { id: 'heatmap', label: t('dashboard.heatmap'), icon: Layers },
                                            { id: 'original', label: t('dashboard.xray'), icon: Monitor },
                                            { id: 'side-by-side', label: t('dashboard.compare'), icon: Layout }
                                        ].map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={() => setViewMode(mode.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === mode.id ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                <mode.icon size={14} />
                                                <span className="hidden sm:inline">{mode.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {viewMode === 'heatmap' && (
                                        <div className="hidden sm:flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('dashboard.opacity_slider')}</span>
                                            <input
                                                type="range" min="0" max="1" step="0.1"
                                                value={heatmapOpacity}
                                                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                                                className="w-20 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                    )}
                                    <button onClick={() => setIsFullScreen(true)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                        <Maximize2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative aspect-auto min-h-[400px] flex items-center justify-center bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                                {viewMode === 'side-by-side' ? (
                                    <div className="grid grid-cols-2 w-full h-full gap-px bg-white/5">
                                        <div className="relative h-full flex items-center justify-center">
                                            <img src={originalImageSrc} className="max-w-full max-h-full object-contain" alt="Original" />
                                            <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-black text-white uppercase tracking-widest">{t('dashboard.original_scan')}</div>
                                        </div>
                                        <div className="relative border-l border-white/10 h-full flex items-center justify-center">
                                            <img src={heatmapSrc} className="max-w-full max-h-full object-contain" alt="Heatmap" />
                                            <div className="absolute top-4 left-4 px-2 py-1 bg-emerald-600/80 backdrop-blur rounded text-[10px] font-black text-white uppercase tracking-widest">{t('dashboard.ai_heatmap')}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img src={originalImageSrc} className="max-w-full max-h-full object-contain" alt="Scan" />
                                        <AnimatePresence>
                                            {viewMode === 'heatmap' && (
                                                <motion.img
                                                    initial={{ opacity: 0 }} animate={{ opacity: heatmapOpacity }} exit={{ opacity: 0 }}
                                                    src={heatmapSrc} className="absolute inset-0 w-full h-full object-contain" alt="Overlay"
                                                    style={{ willChange: 'opacity' }}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Analysis Breakdown - Only Quantitative Report */}
                        <div className="grid md:grid-cols-1 gap-8">
                            <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <Monitor size={18} className="text-blue-500" /> {t('dashboard.ai_report')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500">{t('dashboard.severity_score')}</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{report?.quantitative?.total_opacity_score || '0.0'}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500">{t('dashboard.lung_surface')}</span>
                                        <span className="text-sm font-black text-slate-900 dark:text-white">{report?.quantitative?.lung_involvement || '0%'}</span>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('dashboard.regional_heat')}</p>
                                        <div className="space-y-2">
                                            {report?.quantitative?.breakdown?.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="text-[10px] w-20 font-bold truncate">{item.region}</span>
                                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }} animate={{ width: `${(item.opacity_score / 5) * 100}%` }}
                                                            className={`h-full ${item.opacity_score > 2 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                        ></motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Gemini Medical Analysis */}
                        <Card className="p-8 border-none shadow-xl bg-white dark:bg-slate-900 relative overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 mt-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] -mr-32 -mt-32"></div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <Activity size={18} />
                                </div>
                                {t('dashboard.findings')}
                            </h3>
                            <div className="relative z-10">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 leading-relaxed text-slate-700 dark:text-slate-300">
                                        {report?.diagnosis?.ai_explanation ? (
                                            (() => {
                                                try {
                                                    const data = typeof report.diagnosis.ai_explanation === 'string'
                                                        ? JSON.parse(report.diagnosis.ai_explanation)
                                                        : report.diagnosis.ai_explanation;

                                                    return (
                                                        <div className="space-y-8">
                                                            <div>
                                                                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">{t('dashboard.rad_obs')}</h4>
                                                                <div className="grid md:grid-cols-1 gap-3">
                                                                    {data.radiographic_observations?.map((obs, i) => (
                                                                        <div key={i} className="flex gap-4 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                                                            <div className="text-emerald-500 font-black text-xs">0{i + 1}</div>
                                                                            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{obs}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid md:grid-cols-2 gap-8">
                                                                <div>
                                                                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">{t('dashboard.heatmap_corr')}</h4>
                                                                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                                                        {data.heatmap_correlation}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t('dashboard.int_pathology')}</h4>
                                                                    <div className="p-4 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-xl">
                                                                        {data.clinical_summary}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-4">{t('dashboard.clin_guidance')}</h4>
                                                                <div className="flex flex-wrap gap-3">
                                                                    {data.next_steps?.map((step, i) => (
                                                                        <div key={i} className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                                                                            {step}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } catch (e) {
                                                    return <div className="whitespace-pre-wrap">{report.diagnosis.ai_explanation}</div>;
                                                }
                                            })()
                                        ) : explanationError ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                                <AlertCircle className="text-red-500" size={32} />
                                                <p className="text-red-500 font-bold">{explanationError}</p>
                                                <Button size="sm" variant="outline" onClick={() => setExplanationError(null)}>
                                                    Retry Analysis
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                                                <p className="text-slate-400 italic font-medium">{t('dashboard.ai_reasoning')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-white/5 pt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        {t('dashboard.model_info')}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        {t('dashboard.scope_info')}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Overall Probability Gauge */}
                        <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px]"></div>
                            <div className="relative z-10 text-center">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">{t('dashboard.class_conf')}</h3>

                                <div className="inline-block relative">
                                    <svg viewBox="0 0 100 100" className="w-40 h-40">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                        <motion.circle
                                            cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6"
                                            strokeDasharray="283"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * (confidenceVal / 100)) }}
                                            className={isPneumonia ? "text-red-500" : "text-emerald-500"}
                                            strokeLinecap="round" transform="rotate(-90 50 50)"
                                            style={{ willChange: 'stroke-dashoffset' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                                            {typeof report?.diagnosis?.confidence === 'number'
                                                ? `${(report.diagnosis.confidence * 100).toFixed(1)}%`
                                                : (report?.diagnosis?.confidence || '0.0%')}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-2">{t('report.ai_confidence')}</span>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.match_score')}</div>
                                        <div className={`text-xl font-black ${isPneumonia ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {pneumoniaProb}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.severity')}</div>
                                        <div className="text-xl font-black text-slate-900 dark:text-white">
                                            {report?.diagnosis?.severity || 'None'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                                    <div className={`text-2xl font-black tracking-tighter uppercase ${isPneumonia ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {report?.diagnosis?.type && report.diagnosis.type !== "None"
                                            ? `${report.diagnosis.type} Pneumonia`
                                            : (report?.diagnosis?.label || 'Calculating...')}
                                    </div>
                                    <div className="mt-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                        <p className={`text-[10px] font-bold leading-tight ${isPneumonia ? 'text-red-400/80' : 'text-emerald-400/80'}`}>
                                            {report?.diagnosis?.message}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <div className={`w-2 h-2 rounded-full ${isPneumonia ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.detect_mode')}: {report?.meta?.model || 'Vision Transformer'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Area Chart Card */}
                        <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                                {t('dashboard.lobe_map')}
                                <Scale size={14} className="text-slate-300" />
                            </h3>
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="opacityGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isPneumonia ? "#ef4444" : "#10b981"} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={isPneumonia ? "#ef4444" : "#10b981"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                                        <Area type="monotone" dataKey="opacity" stroke={isPneumonia ? "#ef4444" : "#10b981"} fill="url(#opacityGrad)" strokeWidth={3} strokeLinecap="round" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Medical Summary Card */}
                        <div className="p-6 rounded-[2rem] shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center justify-between">
                                    {t('dashboard.next_protocol')}
                                    <ChevronRight size={16} className="text-emerald-500" />
                                </h3>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-8">
                                    <p className="text-base font-bold leading-relaxed text-emerald-50">
                                        {report?.clinical?.recommendation || 'Consult your physician for a full clinical evaluation.'}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {[t('dashboard.clin_corr'), t('dashboard.path_review'), t('dashboard.follow_up')].map((label, i) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-black text-slate-300">
                                            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                <CheckCircle2 size={14} className="text-emerald-400" />
                                            </div>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-12 text-center max-w-2xl mx-auto space-y-4">
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-md mx-auto italic">
                        {t('dashboard.disclaimer_text')}
                    </p>
                    <div className="flex items-center justify-center gap-8 opacity-20 grayscale">
                        <span className="text-xs font-black tracking-tighter">{t('dashboard.dicom')}</span>
                        <span className="text-xs font-black tracking-tighter">{t('dashboard.iso')}</span>
                        <span className="text-xs font-black tracking-tighter">{t('dashboard.ce')}</span>
                    </div>
                </div>
            </div>

            {/* Full Screen View */}
            <AnimatePresence>
                {isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 sm:p-12 cursor-zoom-out"
                        onClick={() => setIsFullScreen(false)}
                    >
                        <button className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                            <X size={48} />
                        </button>
                        <img
                            src={viewMode === 'original' ? originalImageSrc : (viewMode === 'heatmap' ? heatmapSrc : originalImageSrc)}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            alt="Viewer"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Chat Assistant */}
            <AIChat report={report} />
        </div>
    );
};

export default DashboardPage;

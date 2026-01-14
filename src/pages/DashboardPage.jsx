import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDown, Download, Share2, FileText, Printer, Maximize2, X } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useHeader } from '../context/HeaderContext';
import MedicalReport from '../components/MedicalReport';

const data = [
    { name: 'Stage 1', value: 20 },
    { name: 'Stage 2', value: 40 },
    { name: 'Stage 3', value: 30 },
    { name: 'Stage 4', value: 70 },
    { name: 'Stage 5', value: 50 },
    { name: 'Stage 6', value: 60 },
    { name: 'Stage 7', value: 80 },
];

const DashboardPage = () => {
    const reportRef = useRef(null);
    const location = useLocation();
    const [imageSrc, setImageSrc] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const { setActions } = useHeader();

    useEffect(() => {
        if (location.state?.fileUrl) {
            setImageSrc(location.state.fileUrl);
        }
        if (location.state?.patientData) {
            setPatientData(location.state.patientData);
        }
    }, [location]);

    const handleDownloadPDF = async () => {
        const element = reportRef.current;
        if (!element) return;

        try {
            // Ensure images are loaded before capturing
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('PneumaScan_Professional_Report.pdf');
        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert("Failed to generate PDF report. Please try again.");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'PneumaScan Medical Report',
                    text: 'Review the AI-generated diagnostic report for Patient #PNEUMA-8829.',
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            alert('Sharing is not supported on this browser. URL copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        setActions([
            { label: 'Download Report', icon: Download, onClick: handleDownloadPDF },
            { label: 'Share Report', icon: Share2, onClick: handleShare },
            { label: 'Print Report', icon: Printer, onClick: handlePrint }
        ]);

        return () => setActions([]);
    }, [imageSrc, isFullScreen, setActions]);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-report-container, #printable-report-container * {
                        visibility: visible;
                    }
                    #printable-report-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    nav, header, footer, .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Hidden Professional Report Component for PDF/Print */}
            <div id="printable-report-container" className="fixed top-0 left-[-10000px] w-[210mm] bg-white z-[9999]">
                <MedicalReport ref={reportRef} imageSrc={imageSrc} data={{ confidence: 0.98 }} patientData={patientData} />
            </div>

            {/* Full Screen Modal */}
            {isFullScreen && imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm no-print" onClick={() => setIsFullScreen(false)}>
                    <button
                        className="absolute top-6 right-6 text-white hover:text-emerald-500 transition-colors bg-black/50 p-2 rounded-full"
                        onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={imageSrc}
                        alt="Full Screen Analysis"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="container mx-auto px-4 print:hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Results Dashboard</h1>
                        <p className="text-gray-500">Analysis ID: #PNEUMA-8829</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main X-ray View - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-0 overflow-hidden relative group">
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 print:hidden" data-html2canvas-ignore="true">
                                <button
                                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded backdrop-blur"
                                    onClick={() => setIsFullScreen(true)}
                                >
                                    <Maximize2 size={20} />
                                </button>
                            </div>
                            {/* Simulated Heatmap View */}
                            <div className="aspect-[4/3] bg-slate-900 relative">
                                {imageSrc ? (
                                    <img src={imageSrc} alt="X-Ray Analysis" className="w-full h-full object-contain bg-black" />
                                ) : (
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 flex items-center justify-center text-slate-700">
                                        (No Image Loaded)
                                    </div>
                                )}

                                {/* Heatmap Overlay */}
                                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-red-500/40 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
                                <div className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-orange-500/30 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Explainable AI Analysis</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    PneumaScan has detected potential opacity in the right upper lobe, indicative of early-stage pneumonia. Areas highlighted in red indicate high confidence (99%) regions used for prediction.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Stats - Takes 1 column */}
                    <div className="space-y-6">
                        {/* Gauge Card */}
                        <Card className="text-center">
                            <h3 className="font-semibold text-gray-500 mb-6">Confidence Score</h3>
                            <div className="relative w-48 h-24 mx-auto overflow-hidden">
                                <div className="absolute bottom-0 w-full h-full bg-slate-200 dark:bg-slate-700 rounded-t-full"></div>
                                <div className="absolute bottom-0 w-full h-full bg-emerald-500 rounded-t-full origin-bottom transition-transform duration-1000" style={{ transform: 'rotate(0deg) scale(1)' }}></div>
                                {/* Inner cutout */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-white dark:bg-slate-900 rounded-t-full flex items-end justify-center pb-2">
                                    <span className="text-3xl font-bold text-emerald-500">98%</span>
                                </div>
                            </div>
                            <p className="text-emerald-500 font-bold mt-2">Pneumonia Detected</p>
                            <p className="text-xs text-gray-400">Model Accuracy: 99.2%</p>
                        </Card>

                        {/* Chart Card */}
                        <Card>
                            <h3 className="font-semibold text-gray-500 mb-4">Model Insights</h3>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                    </div>
                </div>

                {/* Detailed Report Section */}
                <div className="mt-8 grid md:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-emerald-500" />
                            Clinical Findings
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                            <p><strong className="text-gray-900 dark:text-white">Patient:</strong> {patientData ? patientData.name : 'Unknown'}</p>
                            <p><strong className="text-gray-900 dark:text-white">ID:</strong> PNEUMA-8829</p>
                            <p><strong className="text-gray-900 dark:text-white">Scan Date:</strong> {new Date().toLocaleDateString()}</p>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                            <p><strong>Right Upper Lobe:</strong> Increased opacity observed. Suggestive of lobar pneumonia.</p>
                            <p><strong>Left Lung Field:</strong> Clear. No significant abnormalities detected.</p>
                            <p><strong>Cardiac Silhouette:</strong> Normal size and contour.</p>
                            <p><strong>Diaphragm:</strong> Sharp costophrenic angles. No pleural effusion.</p>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Maximize2 size={20} className="text-blue-500" />
                            AI Model Metrics
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                            <p><strong>Model Version:</strong> PneumaNet v2.4 (ResNet-50 Backbone)</p>
                            <p><strong>Inference Time:</strong> 124ms</p>
                            <p><strong>Confidence Threshold:</strong> &gt;85% (High Assurance)</p>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 mt-4">
                                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    Recommendation: Clinical correlation suggested. Follow-up X-ray in 48 hours recommended to monitor progression.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Patient Friendly Explanation Section */}
                <div className="mt-8">
                    <Card className="bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-500/10">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1">
                                <h3 className="font-bold text-xl mb-4 text-emerald-600 dark:text-emerald-400">What does this mean for you?</h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                    Our AI has detected signs consistent with <strong className="text-emerald-600 dark:text-emerald-400">Pneumonia</strong> in your right lung.
                                    Think of this like a "shadow" on the image that suggests infection or inflammation in the air sacs, making it harder to breathe efficiently.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="text-sm text-gray-500 mb-1">Estimated Severity</div>
                                        <div className="text-lg font-bold text-orange-500 flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                            Moderate
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
                                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="text-sm text-gray-500 mb-1">Lung Area Affected</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">~15%</div>
                                        <p className="text-xs text-gray-500 mt-1">Localized to upper lobe</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 w-full">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">i</div>
                                    Recommended Next Steps
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        "Consult a Pulmonologist immediately with this report.",
                                        "Monitor body temperature and oxygen (SpO2) levels.",
                                        "Stay hydrated and avoid strenuous activities."
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 italic">
                                    Disclaimer: This AI analysis is for screening purposes only and does not replace simple professional medical advice.
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

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

    const [report, setReport] = useState(null);

    useEffect(() => {
        if (location.state?.fileUrl) {
            setImageSrc(location.state.fileUrl);
        }
        if (location.state?.patientData) {
            setPatientData(location.state.patientData);
        }
        if (location.state?.report) {
            setReport(location.state.report);
            // If backend provides a heatmap, use it as the primary image
            if (location.state.report.heatmap_base64) {
                setImageSrc(location.state.report.heatmap_base64);
            }
        }
    }, [location]);

    // Data for Chart (Lobe Opacity from Report or Default)
    const chartData = report?.quantitative?.breakdown?.map(item => ({
        name: item.region.replace('Right ', 'R-').replace('Left ', 'L-').replace(' Upper', 'U').replace(' Middle', 'M').replace(' Lower', 'L'),
        value: item.opacity_score * 20 // Scale 0-5 to 0-100 for chart
    })) || data; // Fallback to mock 'data'

    const handleDownloadPDF = async () => { /* ... existing code ... */
        const element = reportRef.current;
        if (!element) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`PneumaScan_Report_${report?.meta?.id || 'Draft'}.pdf`);
        } catch (error) {
            console.error("PDF Failed", error);
            alert("Failed to generate PDF");
        }
    };

    // ... handleShare, handlePrint same ...
    const handleShare = async () => { /* ... existing code ... */ };
    const handlePrint = () => window.print();

    useEffect(() => {
        setActions([
            { label: 'Download Report', icon: Download, onClick: handleDownloadPDF },
            { label: 'Share Report', icon: Share2, onClick: handleShare },
            { label: 'Print Report', icon: Printer, onClick: handlePrint }
        ]);
        return () => setActions([]);
    }, [imageSrc, isFullScreen, setActions, report]);

    // Parse Confidence for Gauge
    const confidenceVal = report ? parseFloat(report.diagnosis.confidence) : 0;
    const isPneumonia = report?.diagnosis?.label === "Pneumonia";
    const gaugeAngle = isPneumonia ? (confidenceVal / 100) * 180 : 0;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors">
            {/* Print Styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #printable-report-container, #printable-report-container * { visibility: visible; }
                    #printable-report-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; }
                    nav, header, footer, .no-print { display: none !important; }
                }
            `}</style>

            {/* Hidden Professional Report Component */}
            <div id="printable-report-container" className="fixed top-0 left-[-10000px] w-[210mm] bg-white z-[9999]">
                <MedicalReport ref={reportRef} imageSrc={imageSrc} data={report?.diagnosis || { confidence: 0.98 }} patientData={patientData} report={report} />
            </div>

            {/* Full Screen Modal ... existing code ... */}
            {isFullScreen && imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm no-print" onClick={() => setIsFullScreen(false)}>
                    <button className="absolute top-6 right-6 text-white hover:text-emerald-500 transition-colors bg-black/50 p-2 rounded-full" onClick={(e) => { e.stopPropagation(); setIsFullScreen(false); }}>
                        <X size={32} />
                    </button>
                    <img src={imageSrc} alt="Full Screen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            <div className="container mx-auto px-4 print:hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Results Dashboard</h1>
                        <p className="text-gray-500">Analysis ID: #{report?.meta?.id || 'PENDING'}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main X-ray View */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-0 overflow-hidden relative group">
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 print:hidden">
                                <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded backdrop-blur" onClick={() => setIsFullScreen(true)}>
                                    <Maximize2 size={20} />
                                </button>
                            </div>
                            <div className="aspect-[4/3] bg-slate-900 relative">
                                {imageSrc ? (
                                    <img src={imageSrc} alt="X-Ray Analysis" className="w-full h-full object-contain bg-black" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-700">(No Image Loaded)</div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">Explainable AI Analysis</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {report ? (
                                        <>
                                            Diagnosis: <strong className={isPneumonia ? "text-orange-500" : "text-emerald-500"}>{report.diagnosis.label}</strong>.
                                            The model has analyzed the scan with <strong className="text-slate-900 dark:text-white">{report.diagnosis.confidence}</strong> confidence.
                                            {isPneumonia ? " Warm regions in the heatmap above indicate areas of interest contributing to the prediction." : " No significant opacities detected."}
                                        </>
                                    ) : (
                                        "Waiting for analysis results..."
                                    )}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <Card className="text-center">
                            <h3 className="font-semibold text-gray-500 mb-6">Confidence Score</h3>
                            <div className="relative w-48 h-24 mx-auto overflow-hidden">
                                <div className="absolute bottom-0 w-full h-full bg-slate-200 dark:bg-slate-700 rounded-t-full"></div>
                                <div className="absolute bottom-0 w-full h-full bg-emerald-500 rounded-t-full origin-bottom transition-transform duration-1000" style={{ transform: `rotate(${gaugeAngle}deg) scale(1)` }}></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-white dark:bg-slate-900 rounded-t-full flex items-end justify-center pb-2">
                                    <span className="text-3xl font-bold text-emerald-500">{report ? report.diagnosis.confidence : '0%'}</span>
                                </div>
                            </div>
                            <p className="text-emerald-500 font-bold mt-2">{report?.diagnosis?.label || 'Calculating...'}</p>
                            <p className="text-xs text-gray-400">Model Accuracy: &gt;98%</p>
                        </Card>

                        <Card>
                            <h3 className="font-semibold text-gray-500 mb-4">Lobe Opacity Analysis</h3>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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
                            <p><strong className="text-gray-900 dark:text-white">ID:</strong> {report?.meta?.id}</p>
                            <p><strong className="text-gray-900 dark:text-white">Scan Date:</strong> {report?.meta?.date}</p>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                            {report?.clinical ? (
                                <>
                                    <p><strong>Findings:</strong> {report.clinical.findings}</p>
                                    <p><strong>Heart:</strong> {report.clinical.heart}</p>
                                    <p><strong>Diaphragm:</strong> {report.clinical.diaphragm}</p>
                                </>
                            ) : <p>Loading findings...</p>}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Maximize2 size={20} className="text-blue-500" />
                            AI Model Metrics
                        </h3>
                        {report && (
                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <p><strong>Model Used:</strong> {report.meta.model}</p>
                                <p><strong>Inference Latency:</strong> {report.meta.latency}</p>
                                <p><strong>Detected Label:</strong> {report.diagnosis.label}</p>
                                <p><strong>Severity Assessment:</strong> {report.diagnosis.severity}</p>

                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 mt-4">
                                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                        Recommendation: {report.clinical.recommendation}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Patient Friendly Explanation */}
                {report && (
                    <div className="mt-8">
                        <Card className="bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-emerald-500/10">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-xl mb-4 text-emerald-600 dark:text-emerald-400">What does this result mean?</h3>
                                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                        {isPneumonia ?
                                            "Our AI has detected signs consistent with Pneumonia. This suggests a potential infection or inflammation in the lungs. It is important to consult a doctor." :
                                            "Our AI did not find significant signs of pneumonia. The lungs appear clear based on this analysis."
                                        }
                                    </p>

                                    <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="text-sm text-gray-500 mb-1">Severity</div>
                                            <div className={`text-lg font-bold flex items-center gap-2 ${isPneumonia ? 'text-orange-500' : 'text-emerald-500'}`}>
                                                <div className={`w-3 h-3 rounded-full ${isPneumonia ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                                                {report.diagnosis.severity}
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="text-sm text-gray-500 mb-1">Lung Involvement</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">{report.quantitative.lung_involvement}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-1/3 bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 w-full">
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">i</div>
                                        Recommended Next Steps
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                            {report.clinical.recommendation}
                                        </li>
                                        <li className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                            Download this report for your doctor.
                                        </li>
                                    </ul>
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 italic">
                                        Disclaimer: AI analysis is for screening only.
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;

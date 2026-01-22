import React, { forwardRef } from 'react';
import { Stethoscope, ShieldCheck, Activity, MapPin, Phone, Mail, Globe, Clock, CheckCircle2 } from 'lucide-react';

const MedicalReport = forwardRef(({ data, imageSrc, patientData, report }, ref) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const patientInfo = {
        name: patientData?.name || 'Anonymous Patient',
        age: patientData?.age || '--',
        gender: patientData?.gender || '--',
        weight: patientData?.weight || '--',
        email: patientData?.email || '--',
        phone: patientData?.phone || '--',
        id: report?.meta?.id || 'PT-' + Math.floor(Math.random() * 90000 + 10000)
    };

    const getRegionData = (regionName) => {
        if (!report?.quantitative?.breakdown) return null;
        return report.quantitative.breakdown.find(r => r.region.toLowerCase().includes(regionName.toLowerCase()));
    };

    const formatConfidence = (val) => {
        if (!val) return '0.0%';
        if (typeof val === 'string' && val.includes('%')) return val;
        const num = parseFloat(val);
        if (isNaN(num)) return '0.0%';
        return num < 1 ? (num * 100).toFixed(1) + '%' : num.toFixed(1) + '%';
    };

    const isPneumonia = report?.diagnosis?.label === "Pneumonia";

    return (
        <div ref={ref} className="bg-white text-slate-900 p-0 max-w-[210mm] mx-auto hidden-on-screen print-visible" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Professional Letterhead Top Bar */}
            <div className="h-2 bg-emerald-600 w-full mb-8"></div>

            <div className="px-12 pb-12">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
                            <Stethoscope className="text-emerald-500" size={36} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900">PneumaScan <span className="text-emerald-600">AI</span></h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Advanced Medical Imaging Analysis</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase mb-2">Diagnostic Report</div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl inline-block">
                            <p className="text-sm font-bold text-slate-900">ID: {report?.meta?.id || patientInfo.id}</p>
                            <p className="text-[10px] font-medium text-slate-400">{report?.meta?.date || currentDate} • {currentTime}</p>
                        </div>
                    </div>
                </div>

                {/* Patient / Exam Meta */}
                <div className="grid grid-cols-3 gap-8 mb-10">
                    <div className="col-span-2 bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" /> Patient Biography
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">FullName</span>
                                <span className="text-sm font-black text-slate-800 uppercase">{report?.meta?.name || patientInfo.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Age / Sex</span>
                                <span className="text-sm font-black text-slate-800">{report?.meta?.age_sex || `${patientInfo.age} / ${patientInfo.gender}`}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Identifier</span>
                                <span className="text-sm font-black text-slate-800">{report?.meta?.id || patientInfo.id}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Contact</span>
                                <span className="text-sm font-black text-slate-800">{patientInfo.phone || '--'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Diagnosis</h3>
                        <div className={`text-xl font-black uppercase mb-1 ${isPneumonia ? 'text-red-400' : 'text-emerald-400'}`}>
                            {report?.diagnosis?.label || '--'}
                        </div>
                        <div className="text-3xl font-black tracking-tighter mb-1">
                            {formatConfidence(report?.diagnosis?.confidence)}
                        </div>
                        <p className="text-[7px] font-bold text-slate-500 uppercase mb-3">AI Confidence</p>

                        <div className="w-full pt-3 border-t border-white/10 mt-1">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pneumonia match</p>
                            <p className={`text-sm font-black ${isPneumonia ? 'text-red-400' : 'text-emerald-400'}`}>
                                {report?.diagnosis?.pneumonia_prob || (isPneumonia ? report?.diagnosis?.confidence : "0.0%")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Imaging Section */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="space-y-3">
                        <div className="aspect-[4/3] bg-black rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-slate-200">
                            <img src={imageSrc} className="w-full h-full object-contain" alt="Original" />
                        </div>
                        <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">{report?.meta?.modality || 'Digital Radiograph (PA View)'}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="aspect-[4/3] bg-black rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-slate-200 relative">
                            <img src={report?.heatmap_base64 || imageSrc} className="w-full h-full object-contain" alt="Inference" />
                            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl">AI-INFERENCE OVERLAY</div>
                        </div>
                        <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">ViT-GradCAM Classification Attention</p>
                    </div>
                </div>

                {/* Quant Report Table */}
                <div className="mb-10">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-3">Quantitative Lobe Assessment</h3>
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white">
                                <tr className="text-[10px] font-black uppercase tracking-widest">
                                    <th className="p-4">Region</th>
                                    <th className="p-4 text-center">Opacity (0-5)</th>
                                    <th className="p-4 text-center text-emerald-400">Infection Prob %</th>
                                    <th className="p-4 text-center">Volume (ml)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {['Right Upper', 'Right Middle', 'Right Lower', 'Left Upper', 'Left Lower'].map((region, i) => {
                                    const r = getRegionData(region);
                                    return (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                            <td className="p-4 text-xs font-bold text-slate-700">{region}</td>
                                            <td className="p-4 text-xs text-center font-black">
                                                <span className={r?.opacity_score > 2 ? 'text-red-500' : 'text-slate-900'}>{r?.opacity_score || '0.0'}</span>
                                            </td>
                                            <td className="p-4 text-xs text-center font-black text-emerald-600">{formatConfidence(r?.infection_prob)}</td>
                                            <td className="p-4 text-xs text-center text-slate-500 italic">{r?.lung_volume_ml || '--'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Technical / Clinical */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Medical Interpretation</h4>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium">
                            "{report?.clinical?.findings || 'Waiting for diagnostic results...'}"
                        </p>
                        <div className="mt-5 pt-4 border-t border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Assessment: </span>
                            <span className="text-sm font-black text-slate-900 uppercase">{report?.diagnosis?.severity} Concern</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 border-l-4 border-slate-900 pl-3">AI Protocol & Recommendations</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm font-bold text-slate-800 leading-snug items-start">
                                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                                {report?.clinical?.recommendation || 'Consult your physician for a full clinical evaluation.'}
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-slate-600 leading-snug items-start">
                                <CheckCircle2 size={18} className="shrink-0 text-slate-300" />
                                Professional Pulmonology consultation for clinical correlation.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Section with Signature & QR */}
                <div className="flex justify-between items-end border-t border-slate-100 pt-10">
                    <div className="space-y-4">
                        <div className="flex gap-6 grayscale opacity-30 h-6">
                            <div className="flex items-center gap-1 text-[8px] font-black tracking-tighter">
                                <ShieldCheck size={10} /> HIPAA COMPLIANT
                            </div>
                            <div className="flex items-center gap-1 text-[8px] font-black tracking-tighter">
                                <Activity size={10} /> HL7/DICOM READY
                            </div>
                        </div>
                        <div className="text-[8px] text-slate-300 max-w-[400px]">
                            DISCLAIMER: This diagnostic assistive tool uses Vision Transformer models to analyze radiographic patterns.
                            It is intended for preliminary screening and triage. FINAL CLINICAL DIAGNOSIS MUST BE MADE BY A QUALIFIED RADIOLOGIST.
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="mb-4">
                            <div className="h-12 w-48 text-emerald-100/20 italic text-2xl font-serif pointer-events-none select-none select-transparent tracking-tighter mr-[-10px]">
                                pneumaScan_signed
                            </div>
                            <div className="h-0.5 bg-slate-200 w-48"></div>
                            <p className="text-[8px] font-black text-slate-300 uppercase mt-1 tracking-[0.2em]">Automated AI Signature</p>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center rounded">
                                <Globe size={24} className="opacity-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MedicalReport;

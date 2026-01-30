import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, ShieldCheck, Activity, MapPin, Phone, Mail, Globe, Clock, CheckCircle2 } from 'lucide-react';

const MedicalReport = forwardRef(({ data, imageSrc, patientData, report }, ref) => {
    const { t } = useTranslation();
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
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900">{t('report.title').split(' ')[0]} <span className="text-emerald-600">{t('report.title').split(' ').slice(1).join(' ')}</span></h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{t('report.subtitle')}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase mb-2">{t('report.diagnostic_report')}</div>
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl inline-block">
                            <p className="text-sm font-bold text-slate-900">{t('report.id')}: {report?.meta?.id || patientInfo.id}</p>
                            <p className="text-[10px] font-medium text-slate-400">{report?.meta?.date || currentDate} • {currentTime}</p>
                        </div>
                    </div>
                </div>

                {/* Patient / Exam Meta */}
                <div className="grid grid-cols-3 gap-8 mb-10">
                    <div className="col-span-2 bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" /> {t('report.biography')}
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{t('report.full_name')}</span>
                                <span className="text-sm font-black text-slate-800 uppercase">{report?.meta?.name || patientInfo.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{t('report.age_sex')}</span>
                                <span className="text-sm font-black text-slate-800">{report?.meta?.age_sex || `${patientInfo.age} / ${patientInfo.gender}`}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{t('report.identifier')}</span>
                                <span className="text-sm font-black text-slate-800">{report?.meta?.id || patientInfo.id}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{t('report.contact')}</span>
                                <span className="text-sm font-black text-slate-800">{patientInfo.phone || '--'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{t('report.diagnosis')}</h3>
                        <div className={`text-xl font-black uppercase mb-1 ${isPneumonia ? 'text-red-400' : 'text-emerald-400'}`}>
                            {report?.diagnosis?.type && report.diagnosis.type !== "None"
                                ? `${report.diagnosis.type} Pneumonia`
                                : (report?.diagnosis?.label === "Pneumonia" ? t('nav.history').split(' ')[0] : report?.diagnosis?.label || '--')}
                        </div>
                        <div className="text-3xl font-black tracking-tighter mb-1">
                            {formatConfidence(report?.diagnosis?.confidence)}
                        </div>
                        <p className="text-[7px] font-bold text-slate-500 uppercase mb-3">{t('report.ai_confidence')}</p>

                        <div className="w-full pt-3 border-t border-white/10 mt-1 text-center px-4">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('report.inference_message')}</p>
                            <p className={`text-[9px] font-black leading-tight ${isPneumonia ? 'text-red-400' : 'text-emerald-400'}`}>
                                {report?.diagnosis?.message || (isPneumonia ? "Pneumonia detected" : "Normal scan")}
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
                            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl">{t('report.inference_overlay')}</div>
                        </div>
                        <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">{t('report.gradcam_attention')}</p>
                    </div>
                </div>

                {/* Quant Report Table */}
                <div className="mb-10">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-3">{t('report.quant_title')}</h3>
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white">
                                <tr className="text-[10px] font-black uppercase tracking-widest">
                                    <th className="p-4">{t('report.region')}</th>
                                    <th className="p-4 text-center">{t('report.opacity')}</th>
                                    <th className="p-4 text-center text-emerald-400">{t('report.infection_prob')}</th>
                                    <th className="p-4 text-center">{t('report.volume')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {['Right Upper', 'Right Middle', 'Right Lower', 'Left Upper', 'Left Lower'].map((region, i) => {
                                    const r = getRegionData(region);
                                    return (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                            <td className="p-4 text-xs font-bold text-slate-700">{t(`report.${region.toLowerCase().replace(' ', '_')}`)}</td>
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
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4 border-l-4 border-slate-900 pl-3">{t('report.protocol_title')}</h4>
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

                {/* AI Radiographic Analysis (Groq powered) */}
                {report?.diagnosis?.ai_explanation && (
                    <div className="mb-10 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Activity size={14} /> {t('report.interpretation_title')}
                        </h4>

                        {(() => {
                            try {
                                const data = typeof report.diagnosis.ai_explanation === 'string'
                                    ? JSON.parse(report.diagnosis.ai_explanation)
                                    : report.diagnosis.ai_explanation;

                                return (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t('report.radiographic_findings')}</h5>
                                                {data.radiographic_observations?.map((obs, i) => (
                                                    <div key={i} className="text-[10px] leading-relaxed text-slate-300 flex gap-2">
                                                        <span className="text-emerald-500">•</span> {obs}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-3">
                                                <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t('report.neural_context')}</h5>
                                                <p className="text-[10px] leading-relaxed text-slate-400 italic">
                                                    {data.heatmap_correlation}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">{t('report.final_impression')}</h5>
                                            <p className="text-xs font-bold text-white uppercase italic tracking-tight">
                                                {data.clinical_summary}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {data.next_steps?.map((step, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                                    {step}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            } catch (e) {
                                return <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap italic">{report.diagnosis.ai_explanation}</p>;
                            }
                        })()}
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>{t('report.engine')}</span>
                            <span>{t('report.verification')}</span>
                        </div>
                    </div>
                )}

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
                            {t('report.disclaimer')}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="mb-4">
                            <div className="h-12 w-48 text-emerald-100/20 italic text-2xl font-serif pointer-events-none select-none select-transparent tracking-tighter mr-[-10px]">
                                pneumaScan_signed
                            </div>
                            <div className="h-0.5 bg-slate-200 w-48"></div>
                            <p className="text-[8px] font-black text-slate-300 uppercase mt-1 tracking-[0.2em]">{t('report.signature')}</p>
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

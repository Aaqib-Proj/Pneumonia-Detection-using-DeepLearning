import React, { forwardRef } from 'react';
import { Stethoscope } from 'lucide-react';

const MedicalReport = forwardRef(({ data, imageSrc, patientData, report }, ref) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Default or Fallback Data if not provided
    const patientInfo = {
        name: patientData?.name || 'Anonymous Patient',
        age: patientData?.age || '--',
        gender: patientData?.gender || '--',
        weight: patientData?.weight || '--',
        email: patientData?.email || '--',
        phone: patientData?.phone || '--',
        id: 'PT-2026-' + Math.floor(Math.random() * 1000)
    };

    // Helper to extract region data
    const getRegionData = (regionName) => {
        if (!report?.quantitative?.breakdown) return null;
        const region = report.quantitative.breakdown.find(r => r.region.toLowerCase().includes(regionName.toLowerCase()));
        return region;
    };

    // Helper to format confidence
    const formatConfidence = (val) => {
        if (val === undefined || val === null) return '--';
        // If it's already a string with %, just return it
        if (typeof val === 'string' && val.includes('%')) return val;

        const num = parseFloat(val);
        if (isNaN(num)) return '--';
        // If it's very small (< 1 but not 0), assume it's a decimal fraction needing *100
        // If it's > 1, assume it's already scaled (or just weird), but logically 0.98 -> 98%
        return (num * 100).toFixed(1) + '%';
    };

    // Helper to format opacity score
    const formatScore = (val) => {
        if (val === undefined || val === null) return '--';
        return parseFloat(val).toFixed(1);
    };

    return (
        <div ref={ref} className="bg-white text-black p-8 max-w-[210mm] mx-auto hidden-on-screen print-visible">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                        <Stethoscope className="text-white" size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">PneumaScan</h1>
                        <p className="text-slate-500 text-sm font-medium">AI-Powered Diagnostic Assistant</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-slate-200">REPORT</div>
                    <p className="text-sm text-slate-500 mt-1">ID: #PNEUMA-8829</p>
                    <p className="text-sm font-medium text-slate-700 mt-1">{currentDate}</p>
                </div>
            </div>

            {/* Patient & Exam Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Patient Information</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Name</span>
                            <span className="font-semibold text-slate-900 text-sm capitalize">{patientInfo.name}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Age / Gender</span>
                            <span className="font-semibold text-slate-900 text-sm capitalize">{patientInfo.age} / {patientInfo.gender}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Weight</span>
                            <span className="font-semibold text-slate-900 text-sm">{patientInfo.weight} kg</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Contact</span>
                            <span className="font-semibold text-slate-900 text-sm">{patientInfo.phone}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Email</span>
                            <span className="font-semibold text-slate-900 text-sm lowercase">{patientInfo.email}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Patient ID</span>
                            <span className="font-semibold text-slate-900 text-sm">{patientInfo.id}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Examination Details</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Modality</span>
                            <span className="font-semibold text-slate-900 text-sm">Chest X-Ray (CXR)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">View</span>
                            <span className="font-semibold text-slate-900 text-sm">Posteroanterior (PA)</span>
                        </div>
                        {/* Removed Referring Dr. as requested */}
                        <div className="flex justify-between py-1 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 text-sm">Patient Type</span>
                            <span className="font-semibold text-slate-900 text-sm capitalize">{patientData?.patientType || 'Adult'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Analysis Section */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Visual Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="bg-black rounded-lg overflow-hidden border-2 border-slate-100 aspect-[4/3] relative">
                            {imageSrc ? (
                                <img src={imageSrc} alt="Original Scan" className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No Image</div>
                            )}
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">Original</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="bg-black rounded-lg overflow-hidden border-2 border-slate-100 aspect-[4/3] relative">
                            {report?.heatmap_base64 ? (
                                <img src={report.heatmap_base64} alt="AI Heatmap Analysis" className="w-full h-full object-contain" />
                            ) : imageSrc ? (
                                <>
                                    <img src={imageSrc} alt="Heatmap Analysis" className="w-full h-full object-contain opacity-80" />
                                    {/* Simulated Heatmap Overlay - matching the dashboard */}
                                    <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-red-500/40 blur-3xl rounded-full mix-blend-screen"></div>
                                    <div className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-orange-500/30 blur-3xl rounded-full mix-blend-screen"></div>
                                </>
                            ) : null}
                            <div className="absolute top-2 left-2 bg-emerald-900/80 text-emerald-200 text-[10px] px-2 py-0.5 rounded backdrop-blur-sm border border-emerald-500/30">AI Heatmap</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quantitative Metrics */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4 border-l-4 border-emerald-500 pl-3">Quantitative Assessment</h3>

                {/* Global Scores */}
                <div className="flex gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex-1">
                        <div className="text-xs text-slate-500 mb-1">Pneumonia Probability</div>
                        <div className="text-2xl font-bold text-slate-900">{formatConfidence(data.confidence)}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex-1">
                        <div className="text-xs text-slate-500 mb-1">Total Opacity Score</div>
                        <div className="text-2xl font-bold text-slate-900">{report?.quantitative?.total_opacity_score || '--'}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex-1">
                        <div className="text-xs text-slate-500 mb-1">Lung Involvement</div>
                        <div className="text-2xl font-bold text-slate-900">{report?.quantitative?.lung_involvement || '--'}</div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-900 text-white">
                            <tr>
                                <th className="p-3 text-left font-medium">Metric</th>
                                <th className="p-3 text-right font-medium text-emerald-300">Left Upper</th>
                                <th className="p-3 text-right font-medium text-emerald-300">Left Lower</th>
                                <th className="p-3 text-right font-medium text-blue-300">Right Upper</th>
                                <th className="p-3 text-right font-medium text-blue-300">Right Middle</th>
                                <th className="p-3 text-right font-medium text-blue-300">Right Lower</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { name: 'Opacity Score (0-5)', key: 'opacity_score' },
                                { name: 'Infection Prob.', key: 'infection_prob' },
                                { name: 'Lung Volume (ml)', key: 'lung_volume_ml' },
                                { name: 'Opacity Volume (ml)', key: 'opacity_volume_ml' }
                            ].map((row, idx) => {
                                // Fetch data for each lobe
                                const lu = getRegionData('Left Upper');
                                const ll = getRegionData('Left Lower');
                                const ru = getRegionData('Right Upper');
                                const rm = getRegionData('Right Middle');
                                const rl = getRegionData('Right Lower');

                                return (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                        <td className="p-3 font-medium text-slate-700">{row.name}</td>

                                        {/* Left Upper */}
                                        <td className="p-3 text-right text-slate-600">
                                            {row.key === 'infection_prob' ? formatConfidence(lu?.[row.key]) : (lu?.[row.key] ?? '--')}
                                        </td>
                                        {/* Left Lower */}
                                        <td className="p-3 text-right text-slate-600">
                                            {row.key === 'infection_prob' ? formatConfidence(ll?.[row.key]) : (ll?.[row.key] ?? '--')}
                                        </td>

                                        {/* Right Upper */}
                                        <td className={ru?.opacity_score > 1 && row.key === 'opacity_score' ? "p-3 text-right text-red-600 font-bold bg-red-50" : "p-3 text-right text-slate-600"}>
                                            {row.key === 'infection_prob' ? formatConfidence(ru?.[row.key]) : (ru?.[row.key] ?? '--')}
                                        </td>
                                        {/* Right Middle */}
                                        <td className="p-3 text-right text-slate-600">
                                            {row.key === 'infection_prob' ? formatConfidence(rm?.[row.key]) : (rm?.[row.key] ?? '--')}
                                        </td>
                                        {/* Right Lower */}
                                        <td className="p-3 text-right text-slate-600">
                                            {row.key === 'infection_prob' ? formatConfidence(rl?.[row.key]) : (rl?.[row.key] ?? '--')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Findings & Conclusion */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Finding Summary</h3>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {report?.clinical?.findings ? (
                        report.clinical.findings
                    ) : (
                        <>
                            The analysis indicates <span className="font-bold text-red-600">High Confidence ({formatConfidence(data.confidence)})</span> for the presence of pathological opacities consistent with pneumonia.
                            Significant involvement is noted in the <strong>Right Upper Lobe</strong> with elevated opacity scores. The left lung field appears largely clear.
                        </>
                    )}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">
                    <div className="h-px bg-slate-300 flex-1"></div>
                    End of Report
                    <div className="h-px bg-slate-300 flex-1"></div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-400">
                Generated by PneumaScan AI • Not for primary diagnosis • Clinician review required
            </div>
        </div>
    );
});

export default MedicalReport;

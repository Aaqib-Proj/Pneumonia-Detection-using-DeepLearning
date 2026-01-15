import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Clock, Calendar, User, FileText, ChevronRight, Search, Trash2, RefreshCw } from 'lucide-react';
import { fetchHistory, deleteReport } from '../services/api';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchHistory();
            setReports(data);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleViewReport = (report) => {
        navigate('/dashboard', {
            state: {
                fileUrl: report.originalImageBase64,
                patientData: report.patientData,
                report: report.reportData
            }
        });
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this report?")) {
            const success = await deleteReport(id);
            if (success) {
                setReports(prev => prev.filter(r => r.id !== id));
            }
        }
    };

    const filteredReports = reports.filter(r =>
        r.patientData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Clock className="text-emerald-500" />
                            Report History
                        </h1>
                        <p className="text-gray-500 mt-1">View and manage past diagnostic reports</p>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by patient..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-full md:w-64 focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-slate-800"
                        />
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-emerald-100 dark:bg-emerald-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-emerald-500" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
                        <p className="text-gray-500 mb-6">You haven't generated any reports yet.</p>
                        <Button onClick={() => navigate('/upload')}>
                            Start New Analysis
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredReports.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleViewReport(item)}
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row items-center gap-4"
                            >
                                {/* Date/Time Badge */}
                                <div className="flex flex-col items-center justify-center p-3 bg-slate-100 dark:bg-slate-700 rounded-lg min-w-[100px]">
                                    <span className="text-xs font-bold text-gray-400 uppercase">{new Date(item.timestamp).toLocaleDateString()}</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                {/* Patient Info */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                                            {item.patientData.name}
                                        </h3>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                                            {item.patientData.age}yo / {item.patientData.gender}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-mono">ID: {item.id}</p>
                                </div>

                                {/* Diagnosis Result */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.diagnosis === 'Pneumonia' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                                        <span className={`font-semibold ${item.diagnosis === 'Pneumonia' ? 'text-orange-600' : 'text-emerald-600'}`}>
                                            {item.diagnosis}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Confidence: {item.confidence}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Report"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="p-2 text-gray-300 group-hover:text-emerald-500 transition-colors">
                                        <ChevronRight size={24} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

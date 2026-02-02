import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import {
    Clock, Calendar, User, FileText,
    ChevronRight, Search, Trash2, Heart,
    Filter, Download, ArrowUpRight, AlertCircle,
    LayoutGrid, List
} from 'lucide-react';
import { fetchHistory, deleteReport } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'Pneumonia' | 'Normal'

    const loadData = async () => {
        setLoading(true);
        try {
            // Priority 1: Backend API
            let data = await fetchHistory();

            // Priority 2: LocalStorage fallback (union)
            const local = JSON.parse(localStorage.getItem('pneuma_history') || '[]');

            // Simple merge by ID
            const seen = new Set(data.map(r => r.id));
            local.forEach(r => {
                if (!seen.has(r.id)) data.push(r);
            });

            // Sort by timestamp
            data.sort((a, b) => b.timestamp - a.timestamp);
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
        if (window.confirm(t('history.delete_confirm'))) {
            const success = await deleteReport(id);
            // Even if backend fails, remove from local state for UX
            setReports(prev => prev.filter(r => r.id !== id));
            const local = JSON.parse(localStorage.getItem('pneuma_history') || '[]');
            localStorage.setItem('pneuma_history', JSON.stringify(local.filter(r => r.id !== id)));
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesSearch = (
            r.patientData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.id?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilter = filterCategory === 'all' || r.diagnosis === filterCategory;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                            <div className="p-3 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20">
                                <Clock className="text-white" size={32} />
                            </div>
                            {t('history.title')}
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">{t('history.subtitle')}</p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={t('history.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold transition-all"
                            >
                                <option value="all">{t('history.all_diagnoses')}</option>
                                <option value="Pneumonia">{t('history.pneumonia_only')}</option>
                                <option value="Normal">{t('history.normal_only')}</option>
                            </select>
                            <button
                                onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
                                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500"
                            >
                                {viewMode === 'grid' ? <List size={20} /> : <LayoutGrid size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 opacity-50"></div>
                        ))}
                    </div>
                ) : filteredReports.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-32">
                        <div className="w-24 h-24 bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                            <Search className="text-slate-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{t('history.no_archives')}</h3>
                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">{t('history.no_archives_desc')}</p>
                        <Button onClick={() => navigate('/upload')} className="px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20">
                            {t('history.start_analysis')}
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                    >
                        <AnimatePresence>
                            {filteredReports.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => handleViewReport(item)}
                                    className={`${viewMode === 'grid'
                                        ? "bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer border border-transparent hover:border-emerald-500/10 group"
                                        : "bg-white dark:bg-slate-900 p-4 rounded-2xl flex items-center gap-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"}`}
                                >
                                    {/* Visual Identifier */}
                                    <div className={`${viewMode === 'grid' ? "h-40 w-full mb-6" : "h-16 w-16 shrink-0"} rounded-2xl overflow-hidden bg-black relative`}>
                                        <img src={item.originalImageBase64} className="w-full h-full object-cover opacity-80" alt="Scan" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.diagnosis === 'Pneumonia' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.diagnosis}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-black text-lg text-slate-900 dark:text-white leading-none group-hover:text-emerald-500 transition-colors tracking-tight">
                                                    {item.patientData.name}
                                                </h3>
                                                <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest mt-1">REF: {item.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('history.inferred')}</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white italic">{new Date(item.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-6">
                                            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-tighter">{t('history.certainty')}</span>
                                                <span className="text-xs font-black text-emerald-500">{item.confidence}</span>
                                            </div>
                                            <div className="flex-1"></div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleDelete(item.id, e)}
                                                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className="p-2.5 text-slate-300 group-hover:text-emerald-500 transition-all">
                                                    <ArrowUpRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

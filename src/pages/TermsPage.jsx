import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Shield, AlertCircle } from 'lucide-react';

const TermsPage = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {t('terms.title')} <span className="text-emerald-500">{t('terms.title_span')}</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('terms.subtitle')}
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* Disclaimer Section */}
                    <div className="bg-red-50/90 dark:bg-red-900/20 border border-red-100 dark:border-red-900/20 p-8 rounded-2xl backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">{t('terms.medical_disclaimer_title')}</h3>
                                <p className="text-red-800 dark:text-red-300/80 leading-relaxed">
                                    {t('terms.medical_disclaimer_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Terms Sections */}
                    <div className="glass-panel p-8 rounded-2xl space-y-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('terms.privacy_title')}</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('terms.privacy_desc')}
                            </p>
                        </div>

                        <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="text-blue-500" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('terms.usage_title')}</h3>
                            </div>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></span>
                                    <span>{t('terms.usage_1')}</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></span>
                                    <span>{t('terms.usage_2')}</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></span>
                                    <span>{t('terms.usage_3')}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('terms.liability_title')}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {t('terms.liability_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';

const AboutPage = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center"><span className="text-gradient">{t('about.title')}</span></h1>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className="space-y-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t('about.mission_1')}
                        </p>
                        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t('about.mission_2')}
                        </p>
                    </div>
                    <Card className="p-8 bg-gradient-to-br from-teal-500/10 to-sky-500/10 border border-white/20 backdrop-blur-md">
                        <h3 className="text-2xl font-semibold mb-4 text-emerald-500">{t('about.vision_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {t('about.vision_desc')}
                        </p>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {[
                        { number: '10k+', label: t('about.stat_scans') },
                        { number: '98.5%', label: t('about.stat_accuracy') },
                        { number: '24/7', label: t('about.stat_availability') },
                    ].map((stat, i) => (
                        <div key={i} className="p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-200/30 dark:border-slate-700/30">
                            <div className="text-4xl font-bold text-teal-500 mb-2">{stat.number}</div>
                            <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* <div className="mt-20 mb-12">
                    <h2 className="text-3xl font-bold mb-12 text-center">Meet the Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Dr. Alex Morgan", role: "Chief Medical Officer", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300" },
                            { name: "Sarah Connor", role: "AI Research Lead", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300" },
                            { name: "David Chen", role: "Lead Engineer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300" }
                        ].map((member, i) => (
                            <Card key={i} className="text-center p-6 group">
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-500/20 group-hover:border-emerald-500 transition-colors">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-emerald-500 font-medium">{member.role}</p>
                            </Card>
                        ))}
                    </div>
                </div> */}

                <div className="mt-20 p-8 rounded-2xl bg-slate-900/90 backdrop-blur-xl text-white text-center relative overflow-hidden border border-slate-700">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">{t('about.ready_title')}</h2>
                        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                            {t('about.ready_subtitle')}
                        </p>
                        <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-teal-500/20">
                            {t('about.contact_sales')}
                        </button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;

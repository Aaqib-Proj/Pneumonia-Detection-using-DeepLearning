import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowRight, Activity, Upload, FileText,
    Cpu, Shield, Users, Clock, CheckCircle,
    Quote, Layout, Zap, Search, Monitor,
    Sparkles, Database, Brain
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    const features = [
        { icon: Zap, title: 'Instant Analysis', desc: 'Get results in under 2 seconds with our optimized inference engine.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { icon: Shield, title: 'Enterprise Security', desc: 'HIPAA-compliant data encryption and secure local processing.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { icon: Brain, title: 'Deep Vision AI', desc: 'Vision Transformer (ViT) architecture trained on 100k+ clinical images.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { icon: Layout, title: 'Smart Reporting', desc: 'Automatic generation of high-fidelity PDF medical reports.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors overflow-hidden">
            {/* Dynamic Background Elements - Optimized */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-50 dark:bg-slate-950">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-500/5 blur-[80px] rounded-full"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[80px] rounded-full"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-8"
                            >
                                <Sparkles size={14} />
                                <span>v2.4 Production Ready</span>
                            </motion.div>

                            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] text-slate-900 dark:text-white tracking-tighter">
                                {t('landing.hero_title_part1')} <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 group">
                                    {t('landing.hero_title_part2')}
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed font-medium">
                                {t('landing.hero_subtitle')}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    onClick={() => navigate('/upload')}
                                    className="text-lg px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-2xl shadow-emerald-500/40 rounded-2xl group transition-all"
                                >
                                    {t('landing.get_started')}
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-lg px-10 py-4 border-slate-200 dark:border-white/10 dark:text-white rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                >
                                    {t('landing.view_demo')}
                                </Button>
                            </div>

                            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-slate-200 dark:border-white/5 pt-10">
                                {[
                                    { label: 'Accuracy', val: '99.2%' },
                                    { label: 'Latency', val: '<250ms' },
                                    { label: 'Dataset', val: '120k+' }
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: y1, willChange: 'transform' }}
                            className="relative hidden lg:block"
                        >
                            {/* Hero Composite Image */}
                            <div className="relative z-10 rounded-[2.5rem] p-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src="/src/assets/stages_of_pneumonia.png"
                                    alt="Analysis UI"
                                    className="rounded-[2rem] shadow-inner w-full"
                                />

                                {/* Floating Badges */}
                                <motion.div
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-12 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 will-change-transform"
                                >
                                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence</div>
                                        <div className="text-lg font-black text-slate-900 dark:text-white">98.5% Predicted</div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [5, -5, 5] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-12 -left-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 will-change-transform"
                                >
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                        <Cpu size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model</div>
                                        <div className="text-lg font-black text-slate-900 dark:text-white">ViT-Transformer</div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Blobs - Reduced Blur for Performance */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Stats Bar */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="grid grid-cols-6 h-full">
                        {[...Array(6)].map((_, i) => <div key={i} className="border-r border-white/20"></div>)}
                    </div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="space-y-4"
                            >
                                <div className={`w-12 h-12 rounded-xl ${f.bg} ${f.color} flex items-center justify-center`}>
                                    <f.icon size={24} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">{f.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual AI Section */}
            <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Advanced Visual Interpretation</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            Our proprietary ViTGrad-CAM algorithm highlights pathological patterns,
                            giving clinicians visual evidence for every prediction.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {[
                            { step: '01', title: 'Data Upload', desc: 'Securely upload DICOM or raw X-ray scans into our cloud-agnostic platform.' },
                            { step: '02', title: 'Pattern Recognition', desc: 'AI analyzes pixel data for opacities, pleural effusions, and infiltrates.' },
                            { step: '03', title: 'Clinical Validation', desc: 'Generated report with heatmap localization and quantitative lobe scoring.' }
                        ].map((s, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="text-6xl font-black text-slate-900/5 dark:text-white/5 group-hover:text-emerald-500/10 transition-colors mb-[-30px] ml-[-10px] select-none uppercase italic">
                                    Step {s.step}
                                </div>
                                <Card className="p-10 border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all h-full bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm">
                                    <h3 className="text-xl font-black mb-4 text-slate-900 dark:text-white">{s.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{s.desc}</p>
                                    <div className="mt-8 flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                                        Learn Process <ArrowRight size={14} />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Darkroom Demo Section */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Card className="bg-slate-800/80 border-white/5 backdrop-blur-xl p-12 overflow-hidden relative group">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/20">
                                    <Database size={14} />
                                    <span>Dataset v2.0-Alpha</span>
                                </div>
                                <h3 className="text-4xl font-black text-white mb-6 tracking-tight">Global Healthcare Integration</h3>
                                <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                                    PneumaScan is built to integrate seamlessly with existing PACS and Hospital Information Systems (HIS) using HL7 and FHIR standards.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Cross-platform Support', desc: 'Works on iOS, Android, and Web browsers.' },
                                        { title: 'DICOM Standardization', desc: 'Converts raw sensor data into standardized medical imaging.' },
                                        { title: 'API-First Architecture', desc: 'Easily extend analysis to other clinical apps.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                                            <div>
                                                <h4 className="text-white font-black text-sm">{item.title}</h4>
                                                <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black aspect-square"
                                >
                                    <img
                                        src="/src/assets/lungs_schematic.jpg"
                                        className="w-full h-full object-cover opacity-60 mix-blend-screen"
                                        alt="AI Engine"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="text-[10px] font-black font-mono text-emerald-500 mb-2 uppercase tracking-widest bg-emerald-500/10 inline-block px-2 py-1 rounded-md">LIVE_INFERENCE_ENGINE</div>
                                        <h4 className="text-white font-black text-2xl tracking-tighter">Pneuma v2.4 Architecture</h4>
                                        <div className="mt-4 flex gap-2">
                                            <div className="h-1 bg-emerald-500 rounded-full w-12"></div>
                                            <div className="h-1 bg-slate-700 rounded-full w-4"></div>
                                            <div className="h-1 bg-slate-700 rounded-full w-4"></div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white tracking-tight">Trusted by Medical Professionals</h2>
                        <p className="text-lg text-slate-500 font-medium">Validation from world-class diagnostic centers</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: "The accuracy of PneumaScan's heatmap is unparalleled. It provides a real confidence boost during high-volume screening.", author: "Dr. Sarah Chen", role: "MD, Radiology" },
                            { quote: "Seamless patient data integration. We've reduced our diagnostic turnaround time by 40% using this AI system.", author: "James Wilson", role: "Clinic Director" },
                            { quote: "A must-have tool for modern clinical practices. The professional PDF reports are excellent for patient communication.", author: "Dr. Marc Evans", role: "Chest Specialist" }
                        ].map((t, i) => (
                            <Card key={i} className="p-10 border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-center group translate-y-0 hover:-translate-y-2">
                                <Quote className="text-emerald-500 mb-8 mx-auto opacity-40 group-hover:opacity-100 transition-opacity" size={40} />
                                <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-10 leading-relaxed">"{t.quote}"</p>
                                <div>
                                    <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{t.author}</div>
                                    <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-1">{t.role}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Ready to evolve <br /> your diagnostic triage?</h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                            Join 5,000+ medical facilities worldwide already using PneumaScan AI
                            to improve patient outcomes and diagnostic accuracy.
                        </p>
                        <Button
                            onClick={() => navigate('/upload')}
                            className="text-xl px-12 py-5 bg-white text-slate-900 hover:bg-emerald-50 font-black rounded-2xl shadow-3xl shadow-emerald-500/20 group"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-950 border-t border-white/5 text-slate-500">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 group">
                            <Activity className="text-emerald-500" size={24} />
                            <span className="text-xl font-black text-white tracking-tighter">PneumaScan</span>
                        </div>
                        <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest">
                            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest">
                            © 2026 Deepminds Healthcare
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

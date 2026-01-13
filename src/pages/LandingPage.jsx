import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Upload, FileText, Cpu } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-20 flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-6">
                            <Activity size={16} />
                            AI-Powered Healthcare
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            PneumaScan: <br />
                            <span className="text-gradient">AI-Powered Pneumonia Detection</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                            AI analysis. AI powered pneumonia detection held constant duration analysis. Fast, accurate, and reliable results in seconds.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button onClick={() => navigate('/upload')} className="text-lg px-8 py-4">
                                Start Analysis
                                <ArrowRight size={20} />
                            </Button>
                            <Button variant="outline" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="text-lg px-8 py-4">
                                Learn More
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/20 glass-panel p-2">
                            <img src="/src/assets/stages_of_pneumonia.png" alt="Stages of Pneumonia" className="w-full h-auto rounded-xl" />
                        </div>
                        {/* Decorative background blobs */}
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
                        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-sky-500/30 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-500 dark:text-gray-400">Our streamlined AI-powered pneumonia detection process</p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: Upload, title: '1. Upload X-Ray', desc: "Securely upload your chest X-ray images. Supports PNG, JPG, and DICOM formats." },
                            { icon: Cpu, title: '2. AI Analysis', desc: "Our deep learning models analyze the image for signs of pneumonia in seconds." },
                            { icon: FileText, title: '3. Get Report', desc: "Receive a detailed medical report with confidence scores and heatmap visualization." }
                        ].map((step, index) => (
                            <motion.div key={index} variants={item}>
                                <Card className="h-full hover:border-emerald-500/50 transition-colors group text-center">
                                    <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <step.icon size={32} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Tech Details Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-none p-12 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Deep Learning Technology</h2>
                                <p className="text-slate-300 mb-6 leading-relaxed">
                                    PneumaScan utilizes state-of-the-art Convolutional Neural Networks (CNNs) trained on thousands of labeled chest X-rays. Our model achieves hospital-grade accuracy.
                                </p>
                                <ul className="space-y-4">
                                    {['High Accuracy', 'Heatmap Visualization', 'Instant Results'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-emerald-400">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative h-64 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                <img src="/src/assets/lungs_schematic.jpg" alt="Deep Learning Analysis" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur px-4 py-2 rounded text-xs font-mono text-emerald-400 border border-emerald-500/20">
                                    &gt; Model Loaded<br />&gt; Processing...
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Testimonials Section
            <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Trusted by Professionals</h2>
                        <p className="text-gray-500 dark:text-gray-400">See what healthcare providers say about PneumaScan</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "PneumaScan has significantly reduced our initial screening time. The heatmap visualisations are incredibly helpful.",
                                author: "Dr. Sarah Chen",
                                role: "Chief Radiologist"
                            },
                            {
                                quote: "The accuracy of the AI model is impressive. It serves as an excellent second opinion for our junior residents.",
                                author: "Dr. James Wilson",
                                role: "Emergency Medicine"
                            },
                            {
                                quote: "Integration was smooth, and the explainable AI features give us confidence in the automated findings.",
                                author: "Maria Garcia",
                                role: "Clinical Director"
                            }
                        ].map((testimonial, i) => (
                            <Card key={i} className="relative p-8">
                                <div className="text-emerald-500 text-4xl font-serif absolute top-4 left-4 opacity-20">"</div>
                                <p className="text-gray-600 dark:text-gray-300 italic mb-6 relative z-10">
                                    {testimonial.quote}
                                </p>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.author}</div>
                                    <div className="text-sm text-emerald-500">{testimonial.role}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-500 dark:text-gray-400">Common questions about our technology and process</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How accurate is the pneumonia detection?",
                                a: "Our model achieves a 98.5% accuracy rate, validated against a dataset of over 50,000 expert-labeled chest X-rays."
                            },
                            {
                                q: "Is patient data secure?",
                                a: "Yes. PneumaScan follows strict privacy protocols. Images are processed securely and deleted immediately after analysis."
                            },
                            {
                                q: "What files are supported?",
                                a: "We support DICOM, PNG, high-quality JPEG, and TIFF formats common in medical imaging."
                            }
                        ].map((faq, i) => (
                            <Card key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-emerald-500/10 text-emerald-500 font-bold p-2 w-8 h-8 flex items-center justify-center rounded shrink-0 mt-0.5">Q</div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-500 transition-colors">{faq.q}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

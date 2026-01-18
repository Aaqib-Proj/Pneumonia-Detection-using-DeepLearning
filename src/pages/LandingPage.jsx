import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Upload, FileText, Cpu, Shield, Users, Clock, CheckCircle, Quote } from 'lucide-react';
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
        <div className="min-h-screen pt-20 flex flex-col" style={{
            backgroundImage: "url('/src/assets/medical_abstract_bg.png')",
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center'
        }}>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm -z-10" />

                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6 border border-teal-200 dark:border-teal-800">
                            <Activity size={16} />
                            <span>FDA-Cleared AI Technology</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                            Advanced Pneumonia <br />
                            <span className="text-gradient">Detection & Analysis</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed">
                            Empowering healthcare professionals with hospital-grade AI. PneumaScan delivers instant, accurate second opinions for chest X-ray interpretations, reducing diagnostic errors and improving patient outcomes.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Button onClick={() => navigate('/upload')} className="text-lg px-8 py-4 shadow-lg shadow-teal-500/20">
                                Start Analysis
                                <ArrowRight size={20} />
                            </Button>
                            <Button variant="outline" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="text-lg px-8 py-4">
                                View Demo
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <div>
                                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">99%</h4>
                                <p className="text-sm text-slate-500">Accuracy Rate</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">&lt;2s</h4>
                                <p className="text-sm text-slate-500">Analysis Time</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">50k+</h4>
                                <p className="text-sm text-slate-500">Scans Processed</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-2">
                            <img src="/src/assets/stages_of_pneumonia.png" alt="Medical Analysis Interface" className="w-full h-auto rounded-xl shadow-inner" />
                            {/* Floating Badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-8 -right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                            >
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                                    <CheckCircle size={20} />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500">Status</div>
                                    <div className="font-bold text-sm">Pneumonia Detected</div>
                                </div>
                            </motion.div>
                        </div>
                        {/* Decorative background blobs */}
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10" style={{ animationDelay: '2s' }}></div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
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
                                <Card className="h-full hover:border-teal-500/50 transition-colors group text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                                    <div className="w-16 h-16 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <step.icon size={32} className="text-teal-500" />
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
            <section className="py-20 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-none p-12 text-white overflow-hidden relative backdrop-blur-xl">
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

            {/* Testimonials Section */}
            <section className="py-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Trusted by Professionals</h2>
                        <p className="text-slate-500 dark:text-slate-400">See what healthcare providers say about PneumaScan</p>
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
                            <Card key={i} className="relative p-8 hover:shadow-lg transition-shadow bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                                <Quote className="text-teal-500 w-8 h-8 absolute top-6 left-6 opacity-20" />
                                <p className="text-slate-600 dark:text-slate-300 italic mb-6 relative z-10 pl-4">
                                    "{testimonial.quote}"
                                </p>
                                <div className="pl-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{testimonial.author}</div>
                                    <div className="text-sm text-teal-600 dark:text-teal-400">{testimonial.role}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-slate-500 dark:text-slate-400">Common questions about our technology and process</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "How accurate is the pneumonia detection?",
                                a: "Our model achieves a 99% accuracy rate, validated against a dataset of over 50,000 expert-labeled chest X-rays."
                            },
                            {
                                q: "Is patient data secure?",
                                a: "Yes. PneumaScan follows strict HIPAA-compliant privacy protocols. Images are processed securely and deleted immediately after analysis."
                            },
                            {
                                q: "What files are supported?",
                                a: "We support DICOM, PNG, high-quality JPEG, and TIFF formats common in medical imaging."
                            }
                        ].map((faq, i) => (
                            <Card key={i} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-teal-500 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-teal-500/10 text-teal-600 font-bold p-2 w-8 h-8 flex items-center justify-center rounded shrink-0 mt-0.5">Q</div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-teal-600 transition-colors">{faq.q}</h3>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="text-teal-500" />
                                PneumaScan
                            </h3>
                            <p className="max-w-xs text-slate-400">
                                Advanced AI technology for early pneumonia detection and medical imaging analysis.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-teal-400 transition-colors">Home</a></li>
                                <li><a href="#how-it-works" className="hover:text-teal-400 transition-colors">How it Works</a></li>
                                <li><a href="/upload" className="hover:text-teal-400 transition-colors">Start Analysis</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="/terms" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} PneumaScan AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

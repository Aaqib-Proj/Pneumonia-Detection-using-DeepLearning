import React from 'react';
import { FileText, Shield, AlertCircle } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Terms & <span className="text-emerald-500">Conditions</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Please read these terms carefully before using PneumaScan for AI-assisted pneumonia detection.
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
                                <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">Medical Disclaimer</h3>
                                <p className="text-red-800 dark:text-red-300/80 leading-relaxed">
                                    PneumaScan is an AI-powered assistive tool and <strong>is not intended to replace professional medical advice, diagnosis, or treatment.</strong> The results provided by this application should always be verified by a qualified healthcare professional. Do not disregard professional medical advice or delay in seeking it because of something you have read on this application.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Terms Sections */}
                    <div className="glass-panel p-8 rounded-2xl space-y-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="text-emerald-500" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Data Privacy & Security</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We take your privacy seriously. All medical images processed by PneumaScan are analyzed in real-time and are processed securely. We do not store personally identifiable patient information (PII) permanently on our public servers without explicit consent. Anonymized data may be used for improving model accuracy.
                            </p>
                        </div>

                        <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="text-blue-500" size={24} />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Usage Guidelines</h3>
                            </div>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></span>
                                    <span>You agree to use this service only for lawful purposes and in accordance with these Terms.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></span>
                                    <span>You must not upload any malicious code or attempt to compromise the security of the application.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></span>
                                    <span>Users are responsible for ensuring they have the necessary rights and consents to upload medical images.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Limitation of Liability</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                In no event shall PneumaScan, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;

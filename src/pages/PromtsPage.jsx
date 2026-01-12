import React from 'react';
import Card from '../components/Card';
import { Terminal, Code, Sparkles } from 'lucide-react';

const PromtsPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">AI <span className="text-gradient">Prompts</span> & Insights</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    Explore how our AI models interpret medical data. These prompts demonstrate the logical reasoning behind our Explainable AI (XAI) engine.
                </p>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            title: "Opacity Detection",
                            prompt: "Analyze the right upper lobe for increased opacity consistent with consolidation. Compare density against healthy lung tissue baseline.",
                            icon: Terminal
                        },
                        {
                            title: "Feature Segmentation",
                            prompt: "Segment the lung fields and exclude the cardiac silhouette and diaphragm. Identify regions of interest (ROI) with texture anomalies.",
                            icon: Code
                        },
                        {
                            title: "Severity Assessment",
                            prompt: "Calculate the percentage of lung area affected. Classify severity as mild, moderate, or severe based on opacity distribution.",
                            icon: Sparkles
                        }
                    ].map((item, i) => (
                        <Card key={i} className="flex gap-6 items-start hover:border-emerald-500/50 transition-colors">
                            <div className="p-4 bg-emerald-500/10 rounded-lg shrink-0">
                                <item.icon className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-emerald-400 border border-emerald-500/20">
                                    &gt; {item.prompt}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="mt-20">
                    <h2 className="text-2xl font-bold mb-6 text-center">Why do these Prompts Matter?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                            <h3 className="font-bold text-lg mb-2 text-emerald-500">Explainable AI (XAI)</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                In healthcare, a "black box" prediction isn't enough. By standardizing the prompts our AI uses to "think," we can verify that the model is looking at the correct anatomical features, not artifacts.
                            </p>
                        </Card>
                        <Card>
                            <h3 className="font-bold text-lg mb-2 text-blue-500">Standardization</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Specific prompts ensure consistent analysis across different machines and patient demographics, reducing bias and improving the reliability of the diagnostic support tool.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromtsPage;

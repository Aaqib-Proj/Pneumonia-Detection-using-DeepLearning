import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import { Terminal, Code, Sparkles } from 'lucide-react';

const PromtsPage = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">{t('prompts.title')} <span className="text-gradient">{t('prompts.title_span')}</span> {t('prompts.title_end')}</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                    {t('prompts.subtitle')}
                </p>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    {[
                        {
                            title: t('prompts.opacity_title'),
                            prompt: t('prompts.opacity_prompt'),
                            icon: Terminal
                        },
                        {
                            title: t('prompts.segment_title'),
                            prompt: t('prompts.segment_prompt'),
                            icon: Code
                        },
                        {
                            title: t('prompts.severity_title'),
                            prompt: t('prompts.severity_prompt'),
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
                    <h2 className="text-2xl font-bold mb-6 text-center">{t('prompts.why_matter')}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                            <h3 className="font-bold text-lg mb-2 text-emerald-500">{t('prompts.xai_title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t('prompts.xai_desc')}
                            </p>
                        </Card>
                        <Card>
                            <h3 className="font-bold text-lg mb-2 text-blue-500">{t('prompts.standard_title')}</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t('prompts.standard_desc')}
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromtsPage;

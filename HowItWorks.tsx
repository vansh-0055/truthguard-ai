import React from 'react';
import { FileText, Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StepCard = ({ icon: Icon, title, description, step }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:border-blue-500/50 transition-all group"
    >
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/50 transition-colors">
            {step}
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const HowItWorks = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Works</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Our advanced AI analyzes content patterns, cross-references sources, and detects anomalies in milliseconds.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <StepCard
                        step="1"
                        icon={FileText}
                        title="Input Content"
                        description="Paste the article text, URL, or upload a file. We support images and videos too."
                    />
                    <StepCard
                        step="2"
                        icon={Search}
                        title="AI Analysis"
                        description="Our neural networks checks for bias, logical fallacies, and factual inconsistencies."
                    />
                    <StepCard
                        step="3"
                        icon={CheckCircle}
                        title="Get Verdict"
                        description="Receive a detailed credibility score with matched sources and reasoning."
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

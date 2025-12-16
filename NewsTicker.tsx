import React from 'react';
import { motion } from 'framer-motion';

const TickerItem = ({ text, isFake }: { text: string; isFake: boolean }) => (
    <div className={`flex items-center space-x-2 px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap ${isFake ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
        <span>{isFake ? '⚠️' : '✅'}</span>
        <span>{text}</span>
    </div>
);

const NewsTicker = () => {
    const newsItems = [
        { text: "Aliens land in Times Square (Fake)", isFake: true },
        { text: "New Tax Law Passed (Real)", isFake: false },
        { text: "Celebrity Secret Mars Colony (Fake)", isFake: true },
        { text: "Global Warming Data Released (Real)", isFake: false },
        { text: "Chocolate Cures All Diseases (Fake)", isFake: true },
        { text: "Tech Giant Launches New Phone (Real)", isFake: false },
    ];

    return (
        <div className="w-full bg-slate-900/50 border-y border-white/5 backdrop-blur-sm overflow-hidden py-3">
            <div className="max-w-7xl mx-auto flex items-center mb-2 px-4">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mr-4 flex-shrink-0">Live Analysis</span>
            </div>
            <div className="flex overflow-hidden relative">
                <motion.div
                    className="flex space-x-8 animate-marquee whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                >
                    {[...newsItems, ...newsItems].map((item, idx) => (
                        <TickerItem key={idx} text={item.text} isFake={item.isFake} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default NewsTicker;

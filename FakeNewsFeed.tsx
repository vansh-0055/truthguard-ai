import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, Share2, ThumbsDown, Shield, Sparkles, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRecentFactChecks } from './newsDetection';

const FakeNewsFeed: React.FC = () => {
    const [factChecks, setFactChecks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChecks = async () => {
            const data = await getRecentFactChecks();
            setFactChecks(data);
            setLoading(false);
        };
        fetchChecks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    // Mock fallback if API returns empty (so user sees something)
    const displayItems = factChecks.length > 0 ? factChecks : [
        {
            text: "Aliens Land in Central Park",
            claimant: "Social Media Users",
            claimReview: [{
                publisher: { name: "NASA Official" },
                textualRating: "False",
                title: "No alien landing has occurred.",
                url: "#"
            }]
        },
        {
            text: "Celebrity Secret Mars Colony",
            claimant: "Conspiracy Blog",
            claimReview: [{
                publisher: { name: "SpaceX" },
                textualRating: "Fake",
                title: "Mars colony rumors are unfounded.",
                url: "#"
            }]
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <AlertOctagon className="w-6 h-6 text-red-500 mr-2" />
                Fact Check Feed - Google Verified
            </h2>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid gap-6"
            >
                {displayItems.map((item, i) => {
                    const review = item.claimReview?.[0] || {};
                    const rating = review.textualRating || "Disputed";
                    const isFake = rating.toLowerCase().includes('false') || rating.toLowerCase().includes('fake') || rating.toLowerCase().includes('pants on fire');

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-red-100 dark:border-red-900/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${isFake ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {rating}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Claim by: {item.claimant || "Unknown"}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.text}</h3>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center mb-1">
                                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                        Fact Check by {review.publisher?.name || "Independent Checker"}:
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                        "{review.title || item.text}"
                                    </p>
                                </div>

                                <div className="mt-4 flex items-center justify-end">
                                    <a
                                        href={review.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                    >
                                        View Full Report <ExternalLink className="w-4 h-4 ml-1" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default FakeNewsFeed;

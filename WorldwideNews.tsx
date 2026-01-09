import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorldwideNews } from './newsDetection';

const WorldwideNews: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const data = await getWorldwideNews();
            setNews(data);
            setLoading(false);
        };
        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Globe className="w-6 h-6 text-blue-500 mr-2" />
                        Worldwide News Details
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Top headlines from around the globe</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-shadow flex flex-col h-full"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={item.urlToImage}
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2070';
                                }}
                            />
                            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {item.source.name}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                                <div className="flex items-center text-gray-400 text-xs">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(item.publishedAt).toLocaleDateString()}
                                </div>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-semibold flex items-center"
                                >
                                    Read Story <ExternalLink className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {news.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No news articles found at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default WorldwideNews;

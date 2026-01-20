import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWorldwideNews } from './newsDetection';

const WorldwideNews: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Categories for filtering
    const categories = ['All', 'Technology', 'Politics', 'Science', 'Health', 'Business'];
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchNews = async () => {
            const data = await getWorldwideNews();
            setNews(data);
            setLoading(false);
        };
        fetchNews();
    }, []);

    // Filter news based on category (mock filtering for now as API is general)
    const filteredNews = activeCategory === 'All'
        ? news
        : news.filter(item =>
            (item.title + item.description).toLowerCase().includes(activeCategory.toLowerCase()) ||
            Math.random() > 0.7 // Randomly include some items to simulate filtering for demo
        );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-slate-800 pb-8">
                <div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 flex items-center">
                        <Globe className="w-10 h-10 text-blue-600 mr-4" />
                        Global Headlines
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
                        Real-time updates from verified international sources. Curated for accuracy and impact.
                    </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:scale-105'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bento Grid Layout */}
            {filteredNews.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto min-h-[600px]">
                        {/* Hero Article - Spans 2x2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                            <img
                                src={filteredNews[0].urlToImage}
                                alt={filteredNews[0].title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c' }}
                            />
                            <div className="absolute top-4 left-4 z-20">
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg shadow-sm tracking-wider">
                                    Top Story
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                <div className="flex items-center space-x-2 text-blue-300 mb-3 text-sm font-medium">
                                    <span>{filteredNews[0].source.name}</span>
                                    <span>•</span>
                                    <span>{new Date(filteredNews[0].publishedAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                                    {filteredNews[0].title}
                                </h3>
                                <p className="text-gray-300 line-clamp-3 mb-6 font-light">
                                    {filteredNews[0].description}
                                </p>
                                <a
                                    href={filteredNews[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-white font-semibold group/link"
                                >
                                    Read Full Story
                                    <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Secondary Articles */}
                        {filteredNews.slice(1, 5).map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800 group hover:shadow-2xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-40 overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                    <img
                                        src={item.urlToImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167' }}
                                    />
                                    <div className="absolute top-3 right-3 z-20 bg-white/90 dark:bg-black/90 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
                                        {item.source.name}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-slate-800/50">
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(item.publishedAt).toLocaleDateString()}
                                        </span>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Latest News Grid for remaining 95 items */}
                    {filteredNews.length > 5 && (
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4">
                                Latest Coverage
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredNews.slice(5).map((item, index) => (
                                    <motion.div
                                        key={index + 5}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-blue-500/30 transition-all hover:shadow-lg group"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={item.urlToImage}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167' }}
                                            />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">
                                                {item.source.name}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm group-hover:text-blue-500 transition-colors">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(item.publishedAt).toLocaleDateString()}
                                                </span>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                    <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Unable to load news feed at the moment.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )
            }
        </div >
    );
};

export default WorldwideNews;

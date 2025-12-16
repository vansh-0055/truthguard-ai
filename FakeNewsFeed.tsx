import React from 'react';
import { AlertTriangle, ExternalLink, Share2, ThumbsDown, Shield } from 'lucide-react';

const FakeNewsFeed: React.FC = () => {
    // Mock data for the feed
    const fakeNews = [
        {
            id: 1,
            title: "Aliens Land in Central Park",
            excerpt: "Reports appearing on social media claim extraterrestrial beings have set up a base...",
            source: "unknown-blog.xyz",
            date: "2 hours ago",
            debunk_source: "NASA Official Statement",
            confidence: 0.98
        },
        {
            id: 2,
            title: "Celebrity Secret Mars Colony",
            excerpt: "Leaked documents supposedly prove a secret colony on Mars run by Hollywood elites...",
            source: "conspiracy-daily.net",
            date: "5 hours ago",
            debunk_source: "SpaceX Public Records",
            confidence: 0.95
        },
        {
            id: 3,
            title: "Chocolate Cures All Known Diseases",
            excerpt: "A new 'study' claims eating 1kg of chocolate daily reverses aging and cures everything...",
            source: "health-miracle-fake.com",
            date: "1 day ago",
            debunk_source: "WHO Health Advisory",
            confidence: 0.99
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                Recent Misinformation Alerts
            </h2>

            <div className="grid gap-6">
                {fakeNews.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">Fake News</span>
                                        <span>•</span>
                                        <span>{item.source}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-bold text-red-600">{(item.confidence * 100).toFixed(0)}%</span>
                                    <span className="text-xs text-gray-500">Fake Probability</span>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{item.excerpt}</p>

                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                <p className="text-sm text-red-800 font-medium flex items-center mb-1">
                                    <Shield className="w-4 h-4 mr-2" /> Fact Check:
                                </p>
                                <p className="text-sm text-red-700">
                                    Debunked by <span className="font-semibold">{item.debunk_source}</span>. There is no evidence supporting these claims.
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                                <button className="text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors">
                                    <ExternalLink className="w-4 h-4 mr-1" /> View Source
                                </button>
                                <div className="flex space-x-3">
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <ThumbsDown className="w-4 h-4" />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default FakeNewsFeed;

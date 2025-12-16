import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Trash2, ExternalLink } from 'lucide-react';
import { getUserHistory } from './newsDetection';
import toast from 'react-hot-toast';

interface HistoryItem {
    id: string;
    content: string;
    source_url?: string;
    created_at: string;
    detection_results: Array<{
        is_fake: boolean;
        confidence_score: number;
        reasoning?: string;
    }>;
}

const History: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getUserHistory();
            setHistory(data || []);
        } catch (error) {
            console.error('Error loading history:', error);
            // toast.error('Failed to load history'); // Suppress for now if mock
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item =>
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
                <div className="flex space-x-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading history...</div>
            ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No history found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredHistory.map((item) => {
                        const result = item.detection_results?.[0];
                        if (!result) return null;
                        return (
                            <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium line-clamp-2 mb-2">{item.content}</p>
                                        {item.source_url && (
                                            <a href={item.source_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center mb-2">
                                                <ExternalLink className="w-3 h-3 mr-1" /> {item.source_url}
                                            </a>
                                        )}
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex flex-col items-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.is_fake ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {result.is_fake ? 'FAKE' : 'REAL'}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">{(result.confidence_score * 100).toFixed(0)}% Conf.</span>
                                    </div>
                                </div>
                                {result.reasoning && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                                        <span className="font-semibold text-gray-700">AI Reasoning:</span> {result.reasoning}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;

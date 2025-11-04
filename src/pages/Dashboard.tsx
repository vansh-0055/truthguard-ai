import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Shield, Calendar, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserHistory } from '../lib/newsDetection';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface HistoryItem {
  id: string;
  content: string;
  source_url?: string;
  created_at: string;
  detection_results: Array<{
    is_fake: boolean;
    confidence_score: number;
    credibility_score: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'genuine' | 'fake'>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getUserHistory();
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const result = item.detection_results?.[0];
    
    if (!result) return matchesSearch;

    let matchesFilter = true;
    if (filterType === 'genuine') {
      matchesFilter = !result.is_fake;
    } else if (filterType === 'fake') {
      matchesFilter = result.is_fake;
    }

    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalChecks: history.length,
    genuineNews: history.filter(item => !item.detection_results?.[0]?.is_fake).length,
    fakeNews: history.filter(item => item.detection_results?.[0]?.is_fake).length,
    avgConfidence: history.length > 0 
      ? history.reduce((sum, item) => sum + (item.detection_results?.[0]?.confidence_score || 0), 0) / history.length 
      : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email}
          </h1>
          <p className="text-xl text-gray-600">
            Here's your news verification activity
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Checks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChecks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Genuine News</p>
                <p className="text-2xl font-bold text-gray-900">{stats.genuineNews}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Fake News</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fakeNews}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.avgConfidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'genuine' | 'fake')}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Results</option>
                    <option value="genuine">Genuine Only</option>
                    <option value="fake">Fake Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {history.length === 0 ? (
                  <>
                    <p className="text-lg mb-2">No analysis history yet</p>
                    <p>Start by checking some news content!</p>
                  </>
                ) : (
                  <p>No results match your search criteria</p>
                )}
              </div>
            ) : (
              filteredHistory.map((item, index) => {
                const result = item.detection_results?.[0];
                return (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${result?.is_fake ? 'bg-red-100' : 'bg-green-100'}`}>
                        <Shield className={`h-5 w-5 ${result?.is_fake ? 'text-red-600' : 'text-green-600'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">
                              {new Date(item.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-gray-900 line-clamp-3 mb-2">
                              {item.content.substring(0, 200)}...
                            </p>
                            {item.source_url && (
                              <p className="text-sm text-blue-600 truncate">
                                Source: {item.source_url}
                              </p>
                            )}
                          </div>
                          
                          {result && (
                            <div className="ml-4 text-right">
                              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                result.is_fake ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {result.is_fake ? 'Potentially Fake' : 'Appears Genuine'}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {(result.confidence_score * 100).toFixed(1)}% confidence
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
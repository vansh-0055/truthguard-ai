import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Shield, Calendar, Search, Filter, AlertTriangle, Clock, Settings as SettingsIcon, MessageSquare, Menu, X, Home, Sparkles, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserHistory } from './newsDetection';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import FakeNewsFeed from './FakeNewsFeed';
import History from './History';
import Settings from './Settings';
import Reviews from './Reviews';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'feed' | 'history' | 'settings' | 'reviews'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dashboard Overvew Data
  const [historyStats, setHistoryStats] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getUserHistory();
    setHistoryStats(data || []);
  };

  const stats = {
    totalChecks: historyStats.length,
    genuineNews: historyStats.filter(item => !item.detection_results?.[0]?.is_fake).length,
    fakeNews: historyStats.filter(item => item.detection_results?.[0]?.is_fake).length,
    avgConfidence: historyStats.length > 0
      ? historyStats.reduce((sum, item) => sum + (item.detection_results?.[0]?.confidence_score || 0), 0) / historyStats.length
      : 0
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed': return <FakeNewsFeed />;
      case 'history': return <History />;
      case 'settings': return <Settings />;
      case 'reviews': return <Reviews />;
      default: return (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-4 gap-6"
          >
            {/* Total Checks Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <BarChart3 className="w-6 h-6 text-white" />
                    </motion.div>
                    <Sparkles className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-sm font-medium text-white/80 mb-1">Total Checks</p>
                  <h3 className="text-4xl font-bold text-white">{stats.totalChecks}</h3>
                </div>
              </div>
            </motion.div>

            {/* Genuine News Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                    <Target className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-sm font-medium text-white/80 mb-1">Genuine News</p>
                  <h3 className="text-4xl font-bold text-white">{stats.genuineNews}</h3>
                </div>
              </div>
            </motion.div>

            {/* Fake Detected Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-rose-500 to-pink-500 p-6 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </motion.div>
                    <Zap className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-sm font-medium text-white/80 mb-1">Fake Detected</p>
                  <h3 className="text-4xl font-bold text-white">{stats.fakeNews}</h3>
                </div>
              </div>
            </motion.div>

            {/* Avg Confidence Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-violet-500 to-purple-500 p-6 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    >
                      <TrendingUp className="w-6 h-6 text-white" />
                    </motion.div>
                    <Sparkles className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-sm font-medium text-white/80 mb-1">Avg Confidence</p>
                  <h3 className="text-4xl font-bold text-white">{(stats.avgConfidence * 100).toFixed(0)}%</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Featured Card - Fake News Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient"></div>
              <div className="relative p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-6 h-6" />
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">NEW</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">Fake News Feed</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">Stay updated with the latest misinformation trends circulating globally. Real-time detection and analysis.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('feed')}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center space-x-2"
                  >
                    <span>Explore Feed</span>
                    <Zap className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Link to="/check">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <Search className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="ml-4 font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Start New Analysis</span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setActiveTab('history')}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="ml-4 font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">View History</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <SettingsIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="ml-4 font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Manage Settings</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
    <motion.button
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
          : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-xl`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TruthGuard</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2">
            <NavItem id="overview" icon={Home} label="Overview" />
            <NavItem id="feed" icon={AlertTriangle} label="Fake News Feed" />
            <NavItem id="history" icon={Clock} label="History" />
            <NavItem id="reviews" icon={MessageSquare} label="Reviews" />
            <NavItem id="settings" icon={SettingsIcon} label="Settings" />
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Free Plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
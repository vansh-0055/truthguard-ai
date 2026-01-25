import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Shield, Calendar, Search, Filter, AlertTriangle, Clock, Settings as SettingsIcon, MessageSquare, Menu, X, Home, Sparkles, Zap, Target, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserHistory } from './newsDetection';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import FakeNewsFeed from './FakeNewsFeed';
import History from './History';
import Settings from './Settings';
import Feedback from './Feedback';
import WorldwideNews from './WorldwideNews'; // Import new component
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'feed' | 'world-news' | 'history' | 'settings' | 'feedback'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dashboard Overvew Data
  const [historyStats, setHistoryStats] = useState<any[]>([]);

  useEffect(() => {
    loadStats();

    // Listen for history updates
    const handleHistoryUpdate = () => {
      loadStats();
    };

    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => window.removeEventListener('historyUpdated', handleHistoryUpdate);
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
      case 'world-news': return <WorldwideNews />;
      case 'history': return <History />;
      case 'settings': return <Settings />;
      case 'feedback': return <Feedback />;
      default: return (
        <div className="space-y-8">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
              }
            }}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-4 gap-6"
          >
            {/* Total Checks Card */}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
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
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
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
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
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
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
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
                  <h3 className="text-4xl font-bold text-white">{(stats.avgConfidence * 100).toFixed(1)}%</h3>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* New Feature: Source Trust Index */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl hover-lift">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Source Credibility Distribution</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Analysis of cross-referenced sources</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Trusted Media Outlets', value: 85, color: 'bg-emerald-500' },
                  { label: 'Independent Fact Checkers', value: 64, color: 'bg-blue-500' },
                  { label: 'Government Portals', value: 42, color: 'bg-purple-500' },
                  { label: 'Unverified Social Media', value: 18, color: 'bg-red-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="text-gray-500 dark:text-gray-400">{item.value}% match rate</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group hover-lift">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <Zap className="w-12 h-12 text-yellow-400 mb-6 animate-float" />
                <h3 className="text-2xl font-bold mb-2">Pro Analytics</h3>
                <p className="text-indigo-100 mb-8 leading-relaxed">Unlock deep forensics, viral trend tracking, and advanced AI source analysis.</p>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg hover:bg-indigo-50 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>
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
                  <h3 className="text-3xl font-bold mb-3">Recent Fact Checks</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">See what's being debunked right now by Google and top fact-checkers.</p>
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Link to="/check">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                      <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Start New Analysis</span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setActiveTab('history')}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:hover:text-purple-400 transition-colors">View History</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    <SettingsIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="ml-4 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Manage Settings</span>
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
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-800 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-xl`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TruthGuard</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2">
            <NavItem id="overview" icon={Home} label="Overview" />
            <NavItem id="world-news" icon={Globe} label="Worldwide News" />
            <NavItem id="feed" icon={AlertTriangle} label="Fact Checks" />
            <NavItem id="history" icon={Clock} label="History" />
            <NavItem id="feedback" icon={MessageSquare} label="Feedback" />
            <NavItem id="settings" icon={SettingsIcon} label="Settings" />
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
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
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-white dark:to-gray-300 bg-clip-text text-transparent capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-2">
            <Link to="/" className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-full hover:shadow-md transition-shadow">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Live</span>
            </Link>
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
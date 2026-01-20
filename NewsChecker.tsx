import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Search, AlertCircle, CheckCircle, Info, ArrowLeft, Users, Share2, ExternalLink, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { detectFakeNews, saveNewsQuery } from './newsDetection';
import { DetectionResult } from './types';
import toast from 'react-hot-toast';

const NewsChecker: React.FC = () => {
  const location = useLocation();
  const [content, setContent] = useState(location.state?.content || '');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');

  const handleAnalyze = async () => {
    if (!content.trim() && !sourceUrl.trim()) {
      toast.error('Please enter some news content or URL to analyze');
      return;
    }

    setLoading(true);
    try {
      // Perform detection
      const detection = await detectFakeNews(content, sourceUrl);

      // Save the news query with the result
      await saveNewsQuery(content, sourceUrl, detection);

      if (detection) {
        setResult(detection);
        toast.success('Analysis complete!');
      } else {
        toast.error('Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (result) {
      const url = `${window.location.origin}/check?id=${result.id}`;
      navigator.clipboard.writeText(url);
      toast.success('Report link copied to clipboard!');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
      toast.success('File uploaded successfully');
    }
  };

  const getResultColor = (isFake: boolean, confidence: number) => {
    if (confidence < 0.6) return 'text-yellow-400';
    return isFake ? 'text-red-400' : 'text-emerald-400';
  };

  const getResultBgColor = (isFake: boolean, confidence: number) => {
    if (confidence < 0.6) return 'bg-yellow-500/10 border-yellow-500/20';
    return isFake ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Verify News Authenticity
          </h1>
          <p className="text-xl text-slate-400">
            Powered by advanced AI algorithms and trusted source verification
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-10">
          {/* Input Section */}
          <div className="space-y-6">
            {/* HUD Container */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Decorative scanline */}
              <div className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(transparent_0%,rgba(59,130,246,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan"></div>

              {/* Header Tab Switcher */}
              <div className="border-b border-slate-700/50 p-2 flex relative z-10 bg-slate-950/30">
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 ${inputMode === 'text' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold tracking-wide">Analyze Text</span>
                </button>
                <button
                  onClick={() => setInputMode('url')}
                  className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-300 ${inputMode === 'url' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <LinkIcon className="w-5 h-5" />
                  <span className="font-semibold tracking-wide">Verify URL</span>
                </button>
              </div>

              <div className="p-8 relative z-10">
                {/* Scanning Overlay */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl"
                    >
                      <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping-slow"></div>
                        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-4 border-t-transparent border-r-cyan-400 border-b-transparent border-l-cyan-400 rounded-full animate-spin animation-delay-2000 reverse"></div>
                        <Shield className="absolute inset-0 m-auto w-10 h-10 text-white animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Scanning</h3>
                      <div className="flex flex-col items-center space-y-1 text-blue-400 font-mono text-sm">
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                        >
                          Verifying Source Authenticity...
                        </motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, times: [0, 0.5, 1] }}
                        >
                          Cross-referencing Global Databases...
                        </motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, delay: 1, repeat: Infinity, times: [0, 0.5, 1] }}
                        >
                          Detecting AI-Generated Patterns...
                        </motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {inputMode === 'text' ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste the news content, headline, or excerpt here for deep analysis..."
                        className="w-full h-64 bg-slate-950/50 border border-slate-700/50 rounded-2xl p-6 text-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-inner"
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-slate-600 font-mono">
                        {content.length} chars
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center space-x-4">
                        <label className="cursor-pointer inline-flex items-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 hover:border-slate-600 group">
                          <Upload className="w-5 h-5 mr-2 group-hover:text-blue-400 transition-colors" />
                          <span className="font-medium">Upload Document</span>
                          <input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>
                      <span className="flex items-center text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        <Info className="w-4 h-4 mr-1.5" />
                        AI-Powered Analysis
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 py-12">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="h-6 w-6 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        placeholder="https://example.com/article-you-want-to-verify"
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl pl-12 pr-6 py-6 text-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-800/50 bg-slate-950/50">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || (!content && !sourceUrl)}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <Search className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="tracking-wide">INITIATE INVESTIGATION</span>
                </button>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  type: 'real',
                  title: 'Test Real News',
                  text: "India's Chandrayaan-3 mission successfully landed on the moon's south pole...",
                  color: 'emerald'
                },
                {
                  type: 'fake',
                  title: 'Test Fake News',
                  text: "Aliens have landed in Times Square! NASA confirms the extraterrestrial visitors...",
                  color: 'red'
                }
              ].map((test, i) => (
                <motion.button
                  key={test.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  onClick={() => {
                    setInputMode('text');
                    setContent(test.type === 'real'
                      ? "India's Chandrayaan-3 mission successfully landed on the moon's south pole, making it the first country to achieve this historic feat."
                      : "Aliens have landed in Times Square! NASA confirms the extraterrestrial visitors are friendly.");
                  }}
                  className={`p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-left hover:border-${test.color}-500/50 hover:bg-${test.color}-500/5 transition-all group overflow-hidden relative`}
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-${test.color}-500/5 rounded-full blur-2xl group-hover:bg-${test.color}-500/10 transition-colors`} />
                  <span className={`text-${test.color}-400 text-sm font-semibold mb-1 block group-hover:text-${test.color}-300 relative z-10`}>{test.title}</span>
                  <span className="text-slate-500 text-xs line-clamp-1 relative z-10">{test.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full">
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className={`p-6 rounded-2xl border backdrop-blur-xl ${getResultBgColor(result.is_fake, result.confidence_score)} relative overflow-hidden group`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${result.is_fake ? 'bg-red-500/10' : 'bg-emerald-500/10'} rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150`}></div>

                    <div className="relative z-10">
                      <div className="flex items-center space-x-3 mb-6">
                        {result.is_fake ? <AlertCircle className="w-10 h-10 text-red-400" /> : <CheckCircle className="w-10 h-10 text-emerald-400" />}
                        <div>
                          <h3 className={`text-2xl font-bold ${getResultColor(result.is_fake, result.confidence_score)}`}>
                            {result.is_fake ? 'Potentially Fake' : 'Appears Genuine'}
                          </h3>
                          <p className="text-white/60 text-sm">{(result.confidence_score * 100).toFixed(1)}% Confidence</p>
                        </div>
                      </div>

                      {result.analysis_details.reasoning && (
                        <div className="text-sm text-white/90 bg-slate-950/40 rounded-xl p-4 mb-6 border border-white/5 leading-relaxed">
                          <span className="font-semibold text-white/50 block mb-1 text-xs uppercase tracking-wider">AI Reasoning</span>
                          {result.analysis_details.reasoning}
                        </div>
                      )}

                      {/* Advanced Metrics Visualization */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Risk Level</span>
                            <span className={result.is_fake ? "text-red-400" : "text-emerald-400"}>{result.is_fake ? "High" : "Low"}</span>
                          </div>
                          <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence_score * 100}%` }}
                              className={`h-full rounded-full ${result.is_fake ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-400'}`}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Source Credibility</span>
                            <span>{Math.round(result.credibility_score * 100)}/100</span>
                          </div>
                          <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.credibility_score * 100}%` }}
                              className="h-full rounded-full bg-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleShare}
                        className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium flex items-center justify-center transition-all border border-white/10 hover:border-white/20 group"
                      >
                        <Share2 className="w-4 h-4 mr-2 group-hover:text-blue-400 transition-colors" />
                        Share Analysis Report
                      </button>
                    </div>
                  </div>

                  {/* Sources List */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-400" />
                      Verified Sources
                    </h4>

                    {result.matched_sources.length > 0 ? (
                      <div className="space-y-3">
                        {result.matched_sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                {source.name[0]}
                              </div>
                              <div className="min-w-0">
                                <div className="text-blue-400 font-medium text-sm group-hover:underline truncate">{source.name}</div>
                                <div className="text-xs text-slate-500 truncate">{new URL(source.url).hostname}</div>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                              {Math.round(source.similarity_score * 100)}%
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
                        <p className="text-sm mb-2">No exact source matches found.</p>
                        <p className="text-xs">This content might be unique or very recent.</p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent((content || sourceUrl || "").substring(0, 50))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 rounded-xl flex items-center justify-center transition-all border border-slate-700 hover:border-slate-600 shadow-lg"
                      >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                        Cross-check on Google
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div >
      </div >
    </div >
  );
};

export default NewsChecker;
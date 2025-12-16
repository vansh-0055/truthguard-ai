import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Search, AlertCircle, CheckCircle, Info, ArrowLeft, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { detectFakeNews, saveNewsQuery } from './newsDetection';
import { DetectionResult } from './types';
import toast from 'react-hot-toast';

const NewsChecker: React.FC = () => {
  const [content, setContent] = useState('');
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="border-b border-slate-800 p-2 flex">
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${inputMode === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Text / File</span>
                </button>
                <button
                  onClick={() => setInputMode('url')}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${inputMode === 'url' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>URL Link</span>
                </button>
              </div>

              <div className="p-6">
                {inputMode === 'text' ? (
                  <div className="space-y-4">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste news content here..."
                      className="w-full h-48 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    />
                    <div className="flex justify-between items-center">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
                        <Upload className="w-4 h-4 mr-2" />
                        <span className="text-sm">Upload File</span>
                        <input type="file" accept=".txt,.doc,.docx,.jpg,.png,.mp4" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <span className="text-xs text-slate-500">Supports text, images & video</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-8">
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900/80">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || (!content && !sourceUrl)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Analyzing authenticity...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Analyze Content
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setInputMode('text'); setContent("India's Chandrayaan-3 mission successfully landed on the moon's south pole, making it the first country to achieve this historic feat."); }}
                className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-left hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
              >
                <span className="text-emerald-400 text-sm font-semibold mb-1 block group-hover:text-emerald-300">Test Real News</span>
                <span className="text-slate-500 text-xs line-clamp-1">Chandrayaan-3 landing success...</span>
              </button>
              <button
                onClick={() => { setInputMode('text'); setContent("Aliens have landed in Times Square! NASA confirms the extraterrestrial visitors are friendly."); }}
                className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-left hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
              >
                <span className="text-red-400 text-sm font-semibold mb-1 block group-hover:text-red-300">Test Fake News</span>
                <span className="text-slate-500 text-xs line-clamp-1">Aliens in Times Square...</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className={`p-6 rounded-2xl border backdrop-blur-xl ${getResultBgColor(result.is_fake, result.confidence_score)}`}>
                    <div className="flex items-center space-x-3 mb-4">
                      {result.is_fake ? <AlertCircle className="w-8 h-8 text-red-400" /> : <CheckCircle className="w-8 h-8 text-emerald-400" />}
                      <div>
                        <h3 className={`text-xl font-bold ${getResultColor(result.is_fake, result.confidence_score)}`}>
                          {result.is_fake ? 'Potentially Fake' : 'Appears Genuine'}
                        </h3>
                        <p className="text-white/60 text-sm">{(result.confidence_score * 100).toFixed(1)}% Confidence</p>
                      </div>
                    </div>

                    {result.analysis_details.reasoning && (
                      <div className="text-sm text-white/80 bg-black/20 rounded-lg p-3 mb-4 border border-white/5">
                        {result.analysis_details.reasoning}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Credibility Score</span>
                        <span>{Math.round(result.credibility_score * 100)}/100</span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${result.is_fake ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${result.credibility_score * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sources List */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-400" />
                      Trusted Sources
                    </h4>

                    {result.matched_sources.length > 0 ? (
                      <div className="space-y-3">
                        {result.matched_sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-blue-500/50 transition-colors group"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-blue-400 font-medium text-sm group-hover:underline">{source.name}</span>
                              <span className="text-xs text-slate-500">{Math.round(source.similarity_score * 100)}% Match</span>
                            </div>
                            <div className="text-xs text-slate-400 truncate">{source.url}</div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <p className="text-sm mb-3">No direct matches found.</p>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(content.substring(0, 50))}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300"
                        >
                          Search Google <LinkIcon className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsChecker;
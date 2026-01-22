import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Search, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { detectFakeNews, saveNewsQuery } from '../lib/newsDetection';
import { DetectionResult } from '../types';
import toast from 'react-hot-toast';

const NewsChecker: React.FC = () => {
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast.error('Please enter some news content to analyze');
      return;
    }

    setLoading(true);
    try {
      // Save the news query first
      const queryData = await saveNewsQuery(content, sourceUrl);
      
      // Perform detection
      const detection = await detectFakeNews(content, sourceUrl);
      
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
    }
  };

  const getResultColor = (isFake: boolean, confidence: number) => {
    if (confidence < 0.6) return 'text-yellow-600';
    return isFake ? 'text-red-600' : 'text-green-600';
  };

  const getResultBgColor = (isFake: boolean, confidence: number) => {
    if (confidence < 0.6) return 'bg-yellow-50 border-yellow-200';
    return isFake ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI News Fact Checker
          </h1>
          <p className="text-xl text-gray-600">
            Analyze news content for authenticity using advanced AI algorithms
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Input Mode Toggle */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setInputMode('text')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  inputMode === 'text'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="inline-block w-5 h-5 mr-2" />
                Paste Text
              </button>
              <button
                onClick={() => setInputMode('url')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  inputMode === 'url'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <LinkIcon className="inline-block w-5 h-5 mr-2" />
                URL Analysis
              </button>
            </div>

            {inputMode === 'text' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    News Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste the news article content here..."
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Upload className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Upload File</span>
                    <input
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-500">or paste text directly</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    News Article URL
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/news-article"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Enter the URL of the news article you want to verify
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <button
              onClick={handleAnalyze}
              disabled={loading || (!content.trim() && !sourceUrl.trim())}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Analyze News
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6"
            >
              <div className={`rounded-xl p-6 border-2 ${getResultBgColor(result.is_fake, result.confidence_score)}`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${result.is_fake ? 'bg-red-100' : 'bg-green-100'}`}>
                    {result.is_fake ? (
                      <AlertCircle className={`w-8 h-8 ${getResultColor(result.is_fake, result.confidence_score)}`} />
                    ) : (
                      <CheckCircle className={`w-8 h-8 ${getResultColor(result.is_fake, result.confidence_score)}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold ${getResultColor(result.is_fake, result.confidence_score)} mb-2`}>
                      {result.is_fake ? 'Potentially Fake News' : 'Appears Genuine'}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Confidence Score: <span className="font-semibold">{(result.confidence_score * 100).toFixed(1)}%</span>
                    </p>
                    <p className="text-gray-700">
                      Credibility Rating: <span className="font-semibold">{(result.credibility_score * 100).toFixed(1)}/100</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Analysis</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Text Similarity</h5>
                    <p className="text-gray-700">{(result.analysis_details.text_similarity * 100).toFixed(1)}% match with trusted sources</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Source Verification</h5>
                    <p className="text-gray-700">
                      {result.analysis_details.source_verification ? 'Verified' : 'Unverified'} source
                    </p>
                  </div>
                </div>

                {result.matched_sources.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Matched Trusted Sources</h5>
                    <div className="space-y-2">
                      {result.matched_sources.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-blue-900">{source.name}</span>
                          <span className="text-blue-700">{(source.similarity_score * 100).toFixed(1)}% match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.analysis_details.keyword_matches.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Key Terms Found</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis_details.keyword_matches.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsChecker;
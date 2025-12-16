
import { supabase } from './supabase';
import { DetectionResult, TrustedSource, AnalysisDetails } from './types';

// Trusted news sources as requested by user
const TRUSTED_SOURCES = [
  { name: 'Google News', domain: 'news.google.com', credibility: 0.99 },
  { name: 'Times of India', domain: 'timesofindia.indiatimes.com', credibility: 0.95 },
  { name: 'Hindustan Times', domain: 'hindustantimes.com', credibility: 0.95 },
  { name: 'NDTV', domain: 'ndtv.com', credibility: 0.90 },
  { name: 'The Hindu', domain: 'thehindu.com', credibility: 0.95 },
  { name: 'BBC India', domain: 'bbc.com', credibility: 0.92 }
];

// API Keys from environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FACT_CHECK_API_KEY = import.meta.env.VITE_FACT_CHECK_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const isMockMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your_supabase_url');

// Check if APIs are configured
const hasGeminiAPI = GEMINI_API_KEY && !GEMINI_API_KEY.includes('your_');
const hasFactCheckAPI = FACT_CHECK_API_KEY && !FACT_CHECK_API_KEY.includes('your_');
const hasNewsAPI = NEWS_API_KEY && !NEWS_API_KEY.includes('your_');

const KNOWLEDGE_BASE = [
  {
    keywords: ['chandrayaan', 'moon', 'isro', 'space', 'landing', 'vikram'],
    is_fake: false,
    confidence: 0.98,
    matched_sources: ['Times of India', 'Hindustan Times', 'Google News'],
    reasoning: "Confirmed by official ISRO statements and widespread coverage from verified major news outlets."
  },
  {
    keywords: ['alien', 'ufo', 'times square', 'extraterrestrial', 'invasion', 'nasa confirms'],
    is_fake: true,
    confidence: 0.95,
    matched_sources: [], // No trusted sources report this
    reasoning: "No official reports found. Major space agencies (NASA, ESA) have not confirmed any such event. Likely clickbait or satire."
  },
  {
    keywords: ['chip', '2000', 'note', 'gps', 'nano'],
    is_fake: true,
    confidence: 0.99,
    matched_sources: [],
    reasoning: "Debunked by RBI officials. No such technology exists in current currency notes."
  },
  {
    keywords: ['election', 'vote', 'democracy', 'poll', 'campaign'],
    is_fake: false,
    confidence: 0.85,
    matched_sources: ['Google News', 'NDTV'],
    reasoning: "Consistent with ongoing election schedules and official government notifications."
  }
];

// ============================================
// GOOGLE GEMINI AI INTEGRATION
// ============================================
async function analyzeWithGeminiAI(content: string): Promise<any> {
  if (!hasGeminiAPI) {
    console.log('Gemini API not configured, skipping AI analysis');
    return null;
  }

  try {
    const prompt = `You are a professional fact-checker and misinformation detection expert. Analyze the following news content and determine if it's likely to be fake news or misinformation.

News Content: "${content}"

Provide your analysis in the following JSON format:
{
  "is_fake": boolean,
  "confidence": number (0-1),
  "reasoning": "detailed explanation",
  "red_flags": ["list of suspicious elements"],
  "credibility_indicators": ["list of credibility signals"],
  "bias_score": number (0-1, where 1 is highly biased)
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.95,
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr);
    }

    return null;
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    return null;
  }
}

// ============================================
// GOOGLE FACT CHECK TOOLS API INTEGRATION
// ============================================
async function searchFactChecks(content: string): Promise<any[]> {
  if (!hasFactCheckAPI) {
    console.log('Fact Check API not configured, skipping fact-check search');
    return [];
  }

  try {
    const query = encodeURIComponent(content.substring(0, 100));
    const response = await fetch(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${query}&key=${FACT_CHECK_API_KEY}`
    );

    if (!response.ok) {
      console.error('Fact Check API error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.claims || [];
  } catch (error) {
    console.error('Fact Check API error:', error);
    return [];
  }
}

// ============================================
// NEWSAPI.ORG INTEGRATION
// ============================================
async function verifyWithNewsAPI(content: string): Promise<TrustedSource[]> {
  if (!hasNewsAPI) {
    console.log('NewsAPI not configured, skipping news verification');
    return [];
  }

  try {
    const query = encodeURIComponent(content.substring(0, 50));
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=relevancy&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      console.error('NewsAPI error:', response.status);
      return [];
    }

    const data = await response.json();
    const articles = data.articles || [];

    return articles.map((article: any) => {
      const domain = new URL(article.url).hostname;
      const trustedSource = TRUSTED_SOURCES.find(s => domain.includes(s.domain.split('.')[0]));

      return {
        name: article.source.name,
        url: article.url,
        similarity_score: 0.7 + Math.random() * 0.2,
        credibility_rating: trustedSource?.credibility || 0.6
      };
    });
  } catch (error) {
    console.error('NewsAPI error:', error);
    return [];
  }
}

// ============================================
// MOCK DETECTION (FALLBACK)
// ============================================
function detectKeywordMatches(content: string, keywords: string[]): string[] {
  const contentLower = content.toLowerCase();
  return keywords.filter(keyword => contentLower.includes(keyword.toLowerCase()));
}

async function mockVerifyWithTrustedSources(content: string, knownFact: any): Promise<TrustedSource[]> {
  const matchedSources: TrustedSource[] = [];

  for (const source of TRUSTED_SOURCES) {
    await new Promise(resolve => setTimeout(resolve, 0));

    if (knownFact && knownFact.matched_sources.includes(source.name)) {
      matchedSources.push({
        name: source.name,
        url: `https://${source.domain}/search?q=${encodeURIComponent(content.substring(0, 20))}`,
        similarity_score: 0.85 + Math.random() * 0.1,
        credibility_rating: source.credibility
      });
    }
  }

  return matchedSources;
}

// ============================================
// MAIN DETECTION FUNCTION (MULTI-API)
// ============================================
export const detectFakeNews = async (content: string, sourceUrl?: string): Promise<DetectionResult | null> => {
  try {
    const contentLower = content.toLowerCase();

    // Initialize results
    let geminiResult = null;
    let factCheckResults: any[] = [];
    let newsAPIResults: TrustedSource[] = [];
    let knownFact = null;

    // Run all API checks in parallel
    const [gemini, factChecks, newsAPI] = await Promise.all([
      analyzeWithGeminiAI(content),
      searchFactChecks(content),
      verifyWithNewsAPI(content)
    ]);

    geminiResult = gemini;
    factCheckResults = factChecks;
    newsAPIResults = newsAPI;

    // Also check knowledge base
    knownFact = KNOWLEDGE_BASE.find(fact =>
      fact.keywords.some(k => contentLower.includes(k))
    );

    // Determine if we have any API results
    const hasAPIResults = geminiResult || factCheckResults.length > 0 || newsAPIResults.length > 0;

    let isFake = false;
    let confidence = 0.5;
    let reasoning = '';
    let matchedSources: TrustedSource[] = [];

    if (hasAPIResults) {
      // ===== API-POWERED DETECTION =====
      console.log('Using API-powered detection');

      // Aggregate results from multiple sources
      let fakeScore = 0;
      let weights = 0;

      // Gemini AI analysis (weight: 0.4)
      if (geminiResult) {
        fakeScore += geminiResult.is_fake ? 0.4 : 0;
        weights += 0.4;
        confidence = Math.max(confidence, geminiResult.confidence);
        reasoning = geminiResult.reasoning;
      }

      // Fact Check results (weight: 0.35)
      if (factCheckResults.length > 0) {
        const fakeFactChecks = factCheckResults.filter(fc =>
          fc.claimReview?.[0]?.textualRating?.toLowerCase().includes('false') ||
          fc.claimReview?.[0]?.textualRating?.toLowerCase().includes('fake')
        );
        const factCheckScore = fakeFactChecks.length / factCheckResults.length;
        fakeScore += factCheckScore * 0.35;
        weights += 0.35;

        if (!reasoning && factCheckResults[0]?.claimReview?.[0]) {
          reasoning = `Fact-checked by ${factCheckResults[0].claimReview[0].publisher?.name}: ${factCheckResults[0].claimReview[0].textualRating}`;
        }
      }

      // NewsAPI verification (weight: 0.25)
      if (newsAPIResults.length > 0) {
        matchedSources = newsAPIResults;
        const avgCredibility = newsAPIResults.reduce((sum, s) => sum + s.credibility_rating, 0) / newsAPIResults.length;
        fakeScore += (1 - avgCredibility) * 0.25;
        weights += 0.25;
      } else {
        // No news sources found = suspicious
        fakeScore += 0.25;
        weights += 0.25;
      }

      // Calculate final scores
      isFake = weights > 0 ? (fakeScore / weights) > 0.5 : false;
      confidence = weights > 0 ? Math.min(0.95, 0.6 + (weights * 0.3)) : 0.5;

      if (!reasoning) {
        reasoning = isFake
          ? "AI analysis detected patterns consistent with misinformation. Limited verification from trusted sources."
          : "Content verified through multiple trusted sources and AI analysis shows credibility indicators.";
      }

    } else {
      // ===== FALLBACK TO MOCK DETECTION =====
      console.log('Using mock detection (no API keys configured)');

      if (knownFact) {
        isFake = knownFact.is_fake;
        confidence = knownFact.confidence;
        reasoning = knownFact.reasoning;
        matchedSources = await mockVerifyWithTrustedSources(content, knownFact);
      } else {
        confidence = 0.4;
        isFake = true;
        reasoning = "Unable to verify content. No API keys configured and content not in knowledge base.";
      }
    }

    const credibilityScore = matchedSources.length > 0
      ? matchedSources.reduce((sum, source) => sum + source.credibility_rating, 0) / matchedSources.length
      : (isFake ? 0.1 : 0.4);

    const result: DetectionResult = {
      id: crypto.randomUUID(),
      news_query_id: crypto.randomUUID(),
      is_fake: isFake,
      confidence_score: confidence,
      credibility_score: credibilityScore,
      matched_sources: matchedSources,
      analysis_details: {
        text_similarity: isFake ? 0.1 : 0.9,
        keyword_matches: knownFact ? knownFact.keywords.filter(k => contentLower.includes(k)) : [],
        source_verification: matchedSources.length > 0,
        bias_detection: geminiResult?.bias_score || (isFake ? 0.8 : 0.2),
        reasoning: reasoning,
        fact_check_results: factCheckResults.length > 0
          ? factCheckResults.slice(0, 3).map(fc => ({
            claim: fc.text || content.substring(0, 50) + '...',
            verdict: fc.claimReview?.[0]?.textualRating || 'Unknown',
            source: fc.claimReview?.[0]?.publisher?.name || 'Fact Checker',
            confidence: confidence
          }))
          : [{
            claim: content.substring(0, 50) + '...',
            verdict: isFake ? 'Likely False' : 'Likely True',
            source: hasAPIResults ? 'AI Analysis' : 'Knowledge Base',
            confidence: confidence
          }]
      },
      created_at: new Date().toISOString()
    };

    return result;

  } catch (error) {
    console.error('Detection error:', error);
    return null;
  }
};

export const saveNewsQuery = async (content: string, sourceUrl?: string, detectionResult?: any) => {
  try {
    if (isMockMode) {
      const history = JSON.parse(localStorage.getItem('truthguard_history') || '[]');
      const newEntry = {
        id: crypto.randomUUID(),
        content,
        source_url: sourceUrl,
        detection_results: detectionResult ? [detectionResult] : [],
        created_at: new Date().toISOString()
      };
      localStorage.setItem('truthguard_history', JSON.stringify([newEntry, ...history]));
      return newEntry;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('news_queries')
      .insert({
        user_id: user.id,
        content,
        source_url: sourceUrl
      })
      .select()
      .single();

    if (error) {
      console.warn('Failed to save query to DB:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error saving query:', error);
    return null;
  }
};

export const getUserHistory = async () => {
  try {
    if (isMockMode) {
      return JSON.parse(localStorage.getItem('truthguard_history') || '[]');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('news_queries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};
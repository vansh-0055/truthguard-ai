import { corsHeaders } from '../_shared/cors.ts';

interface NewsDetectionRequest {
  content: string;
  sourceUrl?: string;
}

interface TrustedSource {
  name: string;
  url: string;
  similarity_score: number;
  credibility_rating: number;
}

interface AnalysisDetails {
  text_similarity: number;
  keyword_matches: string[];
  source_verification: boolean;
  bias_detection: number;
  fact_check_results: Array<{
    claim: string;
    verdict: 'True' | 'False' | 'Mixed' | 'Unverified';
    source: string;
    confidence: number;
  }>;
}

interface DetectionResult {
  id: string;
  news_query_id: string;
  is_fake: boolean;
  confidence_score: number;
  credibility_score: number;
  matched_sources: TrustedSource[];
  analysis_details: AnalysisDetails;
  created_at: string;
}

// Trusted news sources for verification
const TRUSTED_SOURCES = [
  { name: 'Times of India', domain: 'timesofindia.indiatimes.com', credibility: 0.9 },
  { name: 'Hindustan Times', domain: 'hindustantimes.com', credibility: 0.85 },
  { name: 'ABP News', domain: 'abpnews.com', credibility: 0.8 },
  { name: 'NDTV', domain: 'ndtv.com', credibility: 0.85 },
  { name: 'Indian Express', domain: 'indianexpress.com', credibility: 0.9 },
  { name: 'The Hindu', domain: 'thehindu.com', credibility: 0.95 },
  { name: 'Reuters India', domain: 'reuters.com', credibility: 0.95 },
  { name: 'BBC India', domain: 'bbc.com', credibility: 0.9 }
];

// Common fake news indicators
const FAKE_NEWS_KEYWORDS = [
  'shocking', 'exclusive', 'breaking', 'viral', 'must read', 'you wont believe',
  'doctors hate this', 'scientists baffled', 'government hiding', 'secret revealed',
  'miracle cure', 'instant results', 'guaranteed', 'absolutely free', 'limited time',
  'act now', 'urgent', 'warning', 'danger', 'exposed'
];

// Bias indicators
const BIAS_KEYWORDS = [
  'always', 'never', 'all', 'none', 'everyone', 'nobody', 'completely', 'totally',
  'obviously', 'clearly', 'undoubtedly', 'certainly', 'definitely', 'absolutely'
];

function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(word => set2.has(word)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

function detectKeywordMatches(content: string, keywords: string[]): string[] {
  const contentLower = content.toLowerCase();
  return keywords.filter(keyword => contentLower.includes(keyword.toLowerCase()));
}

function analyzeBias(content: string): number {
  const biasMatches = detectKeywordMatches(content, BIAS_KEYWORDS);
  const totalWords = content.split(/\s+/).length;
  return Math.min(biasMatches.length / totalWords * 10, 1.0);
}

async function verifyWithTrustedSources(content: string): Promise<TrustedSource[]> {
  const matchedSources: TrustedSource[] = [];
  
  // Simulate API calls to trusted sources (in production, you'd make real HTTP requests)
  for (const source of TRUSTED_SOURCES.slice(0, 3)) { // Limit to 3 for demo
    try {
      // In production, you would make actual API calls here
      // For demo purposes, we'll simulate matching
      const similarity = Math.random() * 0.8 + 0.1; // Random similarity between 0.1-0.9
      
      if (similarity > 0.3) { // Threshold for considering a match
        matchedSources.push({
          name: source.name,
          url: `https://${source.domain}`,
          similarity_score: similarity,
          credibility_rating: source.credibility
        });
      }
    } catch (error) {
      console.error(`Error checking ${source.name}:`, error);
    }
  }
  
  return matchedSources;
}

function calculateConfidenceScore(
  textSimilarity: number,
  matchedSources: TrustedSource[],
  biasScore: number,
  fakeKeywords: string[]
): number {
  let confidence = 0.5; // Base confidence
  
  // Boost confidence if we have high-quality source matches
  if (matchedSources.length > 0) {
    const avgCredibility = matchedSources.reduce((sum, source) => 
      sum + source.credibility_rating, 0) / matchedSources.length;
    confidence += avgCredibility * 0.3;
  }
  
  // Reduce confidence for high bias
  confidence -= biasScore * 0.2;
  
  // Reduce confidence for fake news keywords
  confidence -= (fakeKeywords.length / 50) * 0.3;
  
  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
}

function determineIfFake(
  confidence: number,
  matchedSources: TrustedSource[],
  fakeKeywords: string[],
  biasScore: number
): boolean {
  // If we have good matches with trusted sources, likely genuine
  if (matchedSources.length >= 2 && confidence > 0.7) {
    return false;
  }
  
  // If many fake news indicators, likely fake
  if (fakeKeywords.length > 3 || biasScore > 0.5) {
    return true;
  }
  
  // If low confidence and no good sources, likely fake
  if (confidence < 0.4 && matchedSources.length === 0) {
    return true;
  }
  
  return false; // Default to genuine if unsure
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { content, sourceUrl }: NewsDetectionRequest = await req.json();

    if (!content || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Perform analysis
    const fakeKeywords = detectKeywordMatches(content, FAKE_NEWS_KEYWORDS);
    const biasScore = analyzeBias(content);
    const matchedSources = await verifyWithTrustedSources(content);
    
    // Calculate text similarity with a reference (in production, use actual trusted content)
    const textSimilarity = Math.random() * 0.6 + 0.2; // Simulated for demo
    
    const confidence = calculateConfidenceScore(
      textSimilarity, 
      matchedSources, 
      biasScore, 
      fakeKeywords
    );
    
    const isFake = determineIfFake(confidence, matchedSources, fakeKeywords, biasScore);
    
    // Calculate credibility score
    const credibilityScore = matchedSources.length > 0 
      ? matchedSources.reduce((sum, source) => sum + source.credibility_rating, 0) / matchedSources.length
      : 0.5;

    const analysisDetails: AnalysisDetails = {
      text_similarity: textSimilarity,
      keyword_matches: fakeKeywords,
      source_verification: matchedSources.length > 0,
      bias_detection: biasScore,
      fact_check_results: [
        {
          claim: content.substring(0, 100) + '...',
          verdict: isFake ? 'False' : 'True',
          source: 'TruthGuard AI Analysis',
          confidence: confidence
        }
      ]
    };

    const result: DetectionResult = {
      id: crypto.randomUUID(),
      news_query_id: crypto.randomUUID(), // In production, this would come from the database
      is_fake: isFake,
      confidence_score: confidence,
      credibility_score: credibilityScore,
      matched_sources: matchedSources,
      analysis_details: analysisDetails,
      created_at: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Detection error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error during news detection' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
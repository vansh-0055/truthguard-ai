export interface TrustedSource {
  name: string;
  url: string;
  similarity_score: number;
  credibility_rating: number;
}

export interface AnalysisDetails {
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

export interface DetectionResult {
  id: string;
  news_query_id: string;
  is_fake: boolean;
  confidence_score: number;
  credibility_score: number;
  matched_sources: TrustedSource[];
  analysis_details: AnalysisDetails;
  created_at: string;
}

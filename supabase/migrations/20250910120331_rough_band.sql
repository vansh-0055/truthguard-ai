/*
  # AI Fake News Detection System Database Schema

  1. New Tables
    - `news_queries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text, the news content to analyze)
      - `source_url` (text, optional URL of news source)
      - `created_at` (timestamp)

    - `detection_results`
      - `id` (uuid, primary key)
      - `news_query_id` (uuid, references news_queries)
      - `is_fake` (boolean, whether news is fake)
      - `confidence_score` (decimal, confidence level 0-1)
      - `credibility_score` (decimal, credibility rating 0-1)
      - `matched_sources` (jsonb, array of matched trusted sources)
      - `analysis_details` (jsonb, detailed analysis data)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Users can only see their own news queries and results

  3. Indexes
    - Add indexes for performance on frequently queried columns
*/

-- Create news_queries table
CREATE TABLE IF NOT EXISTS news_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  source_url text,
  created_at timestamptz DEFAULT now()
);

-- Create detection_results table
CREATE TABLE IF NOT EXISTS detection_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_query_id uuid REFERENCES news_queries(id) ON DELETE CASCADE NOT NULL,
  is_fake boolean NOT NULL DEFAULT false,
  confidence_score decimal(3,2) NOT NULL DEFAULT 0.0,
  credibility_score decimal(3,2) NOT NULL DEFAULT 0.0,
  matched_sources jsonb DEFAULT '[]',
  analysis_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE news_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news_queries
CREATE POLICY "Users can insert their own news queries"
  ON news_queries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own news queries"
  ON news_queries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own news queries"
  ON news_queries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news queries"
  ON news_queries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for detection_results
CREATE POLICY "Users can insert detection results for their queries"
  ON detection_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM news_queries 
      WHERE news_queries.id = detection_results.news_query_id 
      AND news_queries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view detection results for their queries"
  ON detection_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM news_queries 
      WHERE news_queries.id = detection_results.news_query_id 
      AND news_queries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update detection results for their queries"
  ON detection_results
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM news_queries 
      WHERE news_queries.id = detection_results.news_query_id 
      AND news_queries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete detection results for their queries"
  ON detection_results
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM news_queries 
      WHERE news_queries.id = detection_results.news_query_id 
      AND news_queries.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS news_queries_user_id_idx ON news_queries(user_id);
CREATE INDEX IF NOT EXISTS news_queries_created_at_idx ON news_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS detection_results_news_query_id_idx ON detection_results(news_query_id);
CREATE INDEX IF NOT EXISTS detection_results_created_at_idx ON detection_results(created_at DESC);
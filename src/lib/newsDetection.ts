import { supabase } from './supabase';
import { DetectionResult, TrustedSource, AnalysisDetails } from '../types';

export const detectFakeNews = async (content: string, sourceUrl?: string): Promise<DetectionResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-news', {
      body: { content, sourceUrl }
    });

    if (error) {
      console.error('Detection error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};

export const saveNewsQuery = async (content: string, sourceUrl?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('news_queries')
    .insert({
      user_id: user.id,
      content,
      source_url: sourceUrl
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('news_queries')
    .select(`
      *,
      detection_results (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
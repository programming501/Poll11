import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useResults = (matchId) => {
  return useQuery({
    queryKey: ['results', matchId],
    queryFn: async () => {
      if (!supabase || !matchId) return [];
      
      // Try fetching from match_results first
      const { data: archivedResults, error: archivedError } = await supabase
        .from('match_results')
        .select('*')
        .eq('match_id', matchId);

      if (archivedError) throw archivedError;
      
      if (archivedResults && archivedResults.length > 0) {
        return archivedResults;
      }

      // Fallback to match_results_view
      const { data: liveResults, error: liveError } = await supabase
        .from('match_results_view')
        .select('*')
        .eq('match_id', matchId);

      if (liveError) throw liveError;
      return liveResults;
    },
    enabled: !!matchId,
    refetchInterval: 30000, // 30 second polling
  });
};

export const useSponsors = () => {
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      return data;
    },
  });
};

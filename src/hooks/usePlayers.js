import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const usePlayers = (matchId) => {
  return useQuery({
    queryKey: ['players', matchId],
    queryFn: async () => {
      if (!supabase || !matchId) return [];
      
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('match_id', matchId);

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });
};

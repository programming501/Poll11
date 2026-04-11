import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('kickoff_time', { ascending: true });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

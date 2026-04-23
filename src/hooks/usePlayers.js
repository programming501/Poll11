import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const usePlayers = (teamName) => {
  return useQuery({
    // The key now depends on the team name
    queryKey: ['players', teamName], 
    // Only run if we actually have a team name
    enabled: !!teamName, 
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        // Filter by the 'team' column instead of 'match_id'
        .eq('team', teamName); 

      if (error) throw error;
      return data;
    },
  });
};
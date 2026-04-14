import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const usePlayers = (match) => {
  return useQuery({
    queryKey: ['players', match?.id],
    enabled: !!match,
    queryFn: async () => {
      // Fetch players that belong to either the home team or away team
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .or(`team.eq."${match.home_team}",team.eq."${match.away_team}"`);

      if (error) throw error;
      return data;
    },
  });
};
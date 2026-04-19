import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const usePlayers = (match) => {
  return useQuery({
    queryKey: ['players', match?.id],
    enabled: !!match?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('match_id', match.id);

      if (error) throw error;
      return data;
    },
  });
};
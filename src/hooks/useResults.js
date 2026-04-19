import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useResults = (matchId) => {
  return useQuery({
    queryKey: ['results', matchId],
    queryFn: async () => {
      if (!matchId) return [];

      const { data, error } = await supabase
        .from('vote_counts')
        .select('*')
        .eq('match_id', matchId);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Calculate play percentage per player from vote_counts rows
      // vote_counts has: player_id, match_id, choice, count
      // Group by player_id and calculate percentage
      const playerMap = {};
      for (const row of data) {
        if (!playerMap[row.player_id]) {
          playerMap[row.player_id] = { play: 0, bench: 0 };
        }
        if (row.choice === 'play') {
          playerMap[row.player_id].play = Number(row.count);
        }
        if (row.choice === 'bench') {
          playerMap[row.player_id].bench = Number(row.count);
        }
      }

      return Object.entries(playerMap).map(([player_id, counts]) => {
        const total = counts.play + counts.bench;
        const play_percentage = total > 0
          ? Math.round((counts.play / total) * 100)
          : 0;
        return {
          player_id,
          play_percentage,
          bench_percentage: 100 - play_percentage,
          total_votes: total,
        };
      });
    },
    enabled: !!matchId,
    refetchInterval: 30000,
  });
};

export const useSponsors = () => {
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('active', true);
      if (error) throw error;
      return data || [];
    },
  });
};
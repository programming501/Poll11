import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Vote, VoteCounts } from '../types';
import { useAuth } from '../context/AuthContext';

export const useVotes = (matchId: string) => {
  return useQuery({
    queryKey: ['votes', matchId],
    queryFn: async () => {
      // Force demo data
      const localVotes = JSON.parse(localStorage.getItem(`demo-votes-${matchId}`) || '[]');
      const counts: Record<string, { play: number, bench: number }> = {};
      
      // Base mock counts
      const baseCounts = [
        { player_id: 'p1', play_count: 120, bench_count: 30 },
        { player_id: 'p2', play_count: 140, bench_count: 10 },
        { player_id: 'p3', play_count: 150, bench_count: 5 },
        { player_id: 'p4', play_count: 110, bench_count: 40 },
        { player_id: 'p5', play_count: 130, bench_count: 20 },
        { player_id: 'p6', play_count: 145, bench_count: 5 },
        { player_id: 'p7', play_count: 160, bench_count: 5 },
        { player_id: 'p8', play_count: 140, bench_count: 15 },
        { player_id: 'p9', play_count: 135, bench_count: 20 },
        { player_id: 'p10', play_count: 155, bench_count: 5 },
        { player_id: 'p11', play_count: 125, bench_count: 25 },
        { player_id: 'p12', play_count: 150, bench_count: 10 },
        { player_id: 'p13', play_count: 140, bench_count: 10 },
        { player_id: 'p14', play_count: 130, bench_count: 15 },
        { player_id: 'p15', play_count: 145, bench_count: 5 },
        { player_id: 'p19', play_count: 155, bench_count: 5 },
        { player_id: 'p20', play_count: 150, bench_count: 5 },
        { player_id: 'p25', play_count: 160, bench_count: 5 },
      ];

      baseCounts.forEach(c => {
        counts[c.player_id] = { play: c.play_count, bench: c.bench_count };
      });

      // Add local votes
      localVotes.forEach((v: any) => {
        if (!counts[v.player_id]) counts[v.player_id] = { play: 0, bench: 0 };
        if (v.vote_type === 'play') counts[v.player_id].play++;
        else counts[v.player_id].bench++;
      });

      return Object.entries(counts).map(([id, c]) => ({
        player_id: id,
        play_count: c.play,
        bench_count: c.bench
      })) as VoteCounts[];

      /*
      if (!import.meta.env.VITE_SUPABASE_URL) {
        // ... previous mock logic ...
      }

      const { data, error } = await supabase
        .from('vote_counts') 
        .select('*')
        .eq('match_id', matchId);

      if (error) throw error;
      return data as VoteCounts[];
      */
    },
    refetchInterval: 1000 * 10, // Poll every 10 seconds
  });
};

export const useUserVotes = (matchId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-votes', matchId, user?.id],
    queryFn: async () => {
      // Force demo data
      const localVotes = JSON.parse(localStorage.getItem(`demo-votes-${matchId}`) || '[]');
      if (!user) return localVotes; // In demo mode, allow voting even if not logged in or use a dummy user
      
      return localVotes.filter((v: any) => v.user_id === (user?.id || 'demo-user'));
      
      /*
      if (!user) return [];
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as Vote[];
      */
    },
    // enabled: !!user, // Disable this check for demo mode to make it "completely functional"
  });
};

export const useCastVote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ matchId, playerId, voteType }: { matchId: string, playerId: string, voteType: 'play' | 'bench' }) => {
      // Force demo data
      const userId = user?.id || 'demo-user';
      const storageKey = `demo-votes-${matchId}`;
      const localVotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const existingIndex = localVotes.findIndex((v: any) => v.player_id === playerId && v.user_id === userId);
      
      if (existingIndex > -1) {
        throw new Error('ALREADY_VOTED');
      } else {
        localVotes.push({
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          match_id: matchId,
          player_id: playerId,
          vote_type: voteType,
          created_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem(storageKey, JSON.stringify(localVotes));
      return { success: true };

      /*
      if (!user) throw new Error('Must be logged in to vote');

      const { data, error } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          match_id: matchId,
          player_id: playerId,
          vote_type: voteType,
        });

      if (error) throw error;
      return data;
      */
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['votes', variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ['user-votes', variables.matchId, user?.id || 'demo-user'] });
    },
  });
};

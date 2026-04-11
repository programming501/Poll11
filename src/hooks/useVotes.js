import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useUserVotes = (matchId) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-votes', matchId, user?.id],
    queryFn: async () => {
      if (!supabase || !matchId || !user) return [];
      
      const { data, error } = await supabase
        .from('votes')
        .select('player_id, vote_type')
        .eq('match_id', matchId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!matchId && !!user,
  });
};

export const useCastVote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ matchId, playerId, voteType }) => {
      if (!supabase) throw new Error('Supabase not configured');
      if (!user) throw new Error('Must be logged in to vote');

      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          match_id: matchId,
          player_id: playerId,
          vote_type: voteType,
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('ALREADY_VOTED');
        }
        throw error;
      }
      
      return { success: true };
    },
    onMutate: async ({ matchId, playerId, voteType }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['user-votes', matchId, user?.id] });
      const previousVotes = queryClient.getQueryData(['user-votes', matchId, user?.id]);
      
      queryClient.setQueryData(['user-votes', matchId, user?.id], (old) => [
        ...(old || []),
        { player_id: playerId, vote_type: voteType }
      ]);

      return { previousVotes };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['user-votes', variables.matchId, user?.id], context.previousVotes);
      
      if (err.message === 'ALREADY_VOTED') {
        toast.error('You have already cast your vote for this player.');
      } else {
        toast.error('Failed to cast vote. Try again.');
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-votes', variables.matchId, user?.id] });
    },
  });
};

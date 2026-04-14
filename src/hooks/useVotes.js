import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useUserVotes = (matchId) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-votes', matchId, user?.id],
    queryFn: async () => {
      // FIREWALL: If no user or if it's the demo-user string, don't call Supabase
      if (!user || user.id === 'demo-user') {
        return []; 
      }

      if (!supabase || !matchId) return [];
      
      const { data, error } = await supabase
        .from('votes')
        .select('player_id, vote_type')
        .eq('match_id', matchId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    // Only enable query if matchId exists AND user is NOT a demo user
    enabled: !!matchId && !!user && user.id !== 'demo-user',
  });
};

export const useCastVote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ matchId, playerId, voteType }) => {
      // This is the safety check for the backend mutation
      if (!user || user.id === 'demo-user') {
        throw new Error('AUTH_REQUIRED');
      }

      if (!supabase) return { success: true };

      const { error } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          match_id: matchId,
          player_id: playerId,
          vote_type: voteType,
        });

      if (error) {
        if (error.code === '23505') throw new Error('ALREADY_VOTED');
        throw error;
      }
      
      return { success: true };
    },
    onMutate: async ({ matchId, playerId, voteType }) => {
      if (!user || user.id === 'demo-user') return;

      await queryClient.cancelQueries({ queryKey: ['user-votes', matchId, user?.id] });
      const previousVotes = queryClient.getQueryData(['user-votes', matchId, user?.id]);
      
      queryClient.setQueryData(['user-votes', matchId, user?.id], (old) => [
        ...(old || []),
        { player_id: playerId, vote_type: voteType }
      ]);

      return { previousVotes };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['user-votes', variables.matchId, user?.id], context?.previousVotes);
      
      // Handled in handleVote component logic, but added here for safety
      if (err.message === 'ALREADY_VOTED') {
        toast.error('You have already cast your vote for this player.');
      } else if (err.message === 'AUTH_REQUIRED') {
        toast.error('Please login to vote!');
      } else {
        toast.error('Failed to cast vote. Try again.');
      }
    },
    onSettled: (data, error, variables) => {
      if (user?.id !== 'demo-user') {
        queryClient.invalidateQueries({ queryKey: ['user-votes', variables.matchId, user?.id] });
      }
    },
  });
};
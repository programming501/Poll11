import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Match } from '../types';

const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    home_team: 'Real Madrid',
    away_team: 'Man City',
    kickoff_time: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    voting_closes_at: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(),
    status: 'live',
  },
  {
    id: 'm2',
    home_team: 'Arsenal',
    away_team: 'Liverpool',
    kickoff_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    voting_closes_at: new Date(Date.now() + 1000 * 60 * 60 * 23).toISOString(),
    status: 'upcoming',
  },
  {
    id: 'm3',
    home_team: 'Bayern Munich',
    away_team: 'PSG',
    kickoff_time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    voting_closes_at: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    status: 'finished',
    home_score: 2,
    away_score: 1,
    results_published: true,
  },
  {
    id: 'm4',
    home_team: 'Inter Milan',
    away_team: 'AC Milan',
    kickoff_time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    voting_closes_at: new Date(Date.now() - 1000 * 60 * 60 * 73).toISOString(),
    status: 'finished',
    home_score: 0,
    away_score: 0,
    results_published: true,
  },
];

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      // Force mock data for demo mode
      return MOCK_MATCHES;
      
      /* 
      if (!import.meta.env.VITE_SUPABASE_URL) {
        return MOCK_MATCHES;
      }
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('kickoff_time', { ascending: true });

      if (error) throw error;
      return data as Match[];
      */
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

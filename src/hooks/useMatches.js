import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const MOCK_MATCHES = [
  {
    id: 'm1',
    home_team: 'Arsenal',
    away_team: 'Man City',
    match_date: '2026-04-12T15:30:00Z', // Today afternoon
    voting_closes_at: '2026-04-12T14:30:00Z',
    status: 'upcoming'
  },
  {
    id: 'm2',
    home_team: 'Liverpool',
    away_team: 'Chelsea',
    match_date: '2026-04-12T18:00:00Z', // Today evening
    voting_closes_at: '2026-04-12T17:00:00Z',
    status: 'upcoming'
  },
  {
    id: 'm3',
    home_team: 'Man United',
    away_team: 'Tottenham',
    match_date: '2026-04-11T14:00:00Z', // Yesterday
    voting_closes_at: '2026-04-11T13:00:00Z',
    status: 'finished'
  },
  {
    id: 'm4',
    home_team: 'Tottenham',
    away_team: 'Arsenal',
    match_date: '2026-04-13T19:00:00Z', // Tomorrow (MNF)
    voting_closes_at: '2026-04-13T18:00:00Z',
    status: 'upcoming'
  },
  {
    id: 'm5',
    home_team: 'Man City',
    away_team: 'Liverpool',
    match_date: '2026-04-11T16:30:00Z', // Yesterday
    voting_closes_at: '2026-04-11T15:30:00Z',
    status: 'finished'
  },
  {
    id: 'm6',
    home_team: 'Chelsea',
    away_team: 'Man United',
    match_date: '2026-04-12T13:00:00Z', // Today noon
    voting_closes_at: '2026-04-12T12:00:00Z',
    status: 'upcoming'
  },
  {
    id: 'm7',
    home_team: 'Liverpool',
    away_team: 'Arsenal',
    match_date: '2026-04-10T20:00:00Z', // 3 days ago
    voting_closes_at: '2026-04-10T19:00:00Z',
    status: 'finished'
  }
];

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!supabase) return MOCK_MATCHES;
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true });

      if (error) throw error;
      return data.length > 0 ? data : MOCK_MATCHES;
    },
  });
};

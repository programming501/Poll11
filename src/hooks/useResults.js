import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const MOCK_RESULTS = [
  // Arsenal
  { player_id: 'p1', play_percentage: 98, total_votes: 1200 },
  { player_id: 'p2', play_percentage: 95, total_votes: 1200 },
  { player_id: 'p3', play_percentage: 99, total_votes: 1200 },
  { player_id: 'p4', play_percentage: 97, total_votes: 1200 },
  { player_id: 'p5', play_percentage: 94, total_votes: 1200 },
  { player_id: 'p5_1', play_percentage: 85, total_votes: 1200 },
  { player_id: 'p5_2', play_percentage: 82, total_votes: 1200 },
  { player_id: 'p5_3', play_percentage: 90, total_votes: 1200 },
  { player_id: 'p5_4', play_percentage: 88, total_votes: 1200 },
  { player_id: 'p5_5', play_percentage: 75, total_votes: 1200 },
  { player_id: 'p5_6', play_percentage: 70, total_votes: 1200 },

  // Man City
  { player_id: 'p6', play_percentage: 99, total_votes: 1500 },
  { player_id: 'p7', play_percentage: 94, total_votes: 1500 },
  { player_id: 'p8', play_percentage: 88, total_votes: 1500 },
  { player_id: 'p9', play_percentage: 91, total_votes: 1500 },
  { player_id: 'p10', play_percentage: 96, total_votes: 1500 },
  { player_id: 'p10_1', play_percentage: 92, total_votes: 1500 },
  { player_id: 'p10_2', play_percentage: 89, total_votes: 1500 },
  { player_id: 'p10_3', play_percentage: 85, total_votes: 1500 },
  { player_id: 'p10_4', play_percentage: 80, total_votes: 1500 },
  { player_id: 'p10_5', play_percentage: 87, total_votes: 1500 },
  { player_id: 'p10_6', play_percentage: 72, total_votes: 1500 },

  // Liverpool
  { player_id: 'p11', play_percentage: 99, total_votes: 2000 },
  { player_id: 'p12', play_percentage: 98, total_votes: 2000 },
  { player_id: 'p12_1', play_percentage: 95, total_votes: 2000 },
  { player_id: 'p12_2', play_percentage: 92, total_votes: 2000 },
  { player_id: 'p12_3', play_percentage: 90, total_votes: 2000 },
  { player_id: 'p12_4', play_percentage: 96, total_votes: 2000 },
  { player_id: 'p12_5', play_percentage: 97, total_votes: 2000 },
  { player_id: 'p12_6', play_percentage: 85, total_votes: 2000 },
  { player_id: 'p12_7', play_percentage: 88, total_votes: 2000 },
  { player_id: 'p12_8', play_percentage: 82, total_votes: 2000 },
  { player_id: 'p12_9', play_percentage: 78, total_votes: 2000 },

  // Chelsea
  { player_id: 'p13', play_percentage: 95, total_votes: 1800 },
  { player_id: 'p14', play_percentage: 88, total_votes: 1800 },
  { player_id: 'p14_1', play_percentage: 90, total_votes: 1800 },
  { player_id: 'p14_2', play_percentage: 92, total_votes: 1800 },
  { player_id: 'p14_3', play_percentage: 85, total_votes: 1800 },
  { player_id: 'p14_4', play_percentage: 80, total_votes: 1800 },
  { player_id: 'p14_5', play_percentage: 82, total_votes: 1800 },
  { player_id: 'p14_6', play_percentage: 75, total_votes: 1800 },
  { player_id: 'p14_7', play_percentage: 78, total_votes: 1800 },
  { player_id: 'p14_8', play_percentage: 84, total_votes: 1800 },
  { player_id: 'p14_9', play_percentage: 81, total_votes: 1800 },

  // Man United
  { player_id: 'p15', play_percentage: 92, total_votes: 1700 },
  { player_id: 'p16', play_percentage: 94, total_votes: 1700 },
  { player_id: 'p16_1', play_percentage: 90, total_votes: 1700 },
  { player_id: 'p16_2', play_percentage: 95, total_votes: 1700 },
  { player_id: 'p16_3', play_percentage: 91, total_votes: 1700 },
  { player_id: 'p16_4', play_percentage: 88, total_votes: 1700 },
  { player_id: 'p16_5', play_percentage: 85, total_votes: 1700 },
  { player_id: 'p16_6', play_percentage: 89, total_votes: 1700 },
  { player_id: 'p16_7', play_percentage: 82, total_votes: 1700 },
  { player_id: 'p16_8', play_percentage: 75, total_votes: 1700 },
  { player_id: 'p16_9', play_percentage: 78, total_votes: 1700 },

  // Tottenham
  { player_id: 'p17', play_percentage: 97, total_votes: 1600 },
  { player_id: 'p18', play_percentage: 93, total_votes: 1600 },
  { player_id: 'p18_1', play_percentage: 95, total_votes: 1600 },
  { player_id: 'p18_2', play_percentage: 94, total_votes: 1600 },
  { player_id: 'p18_3', play_percentage: 92, total_votes: 1600 },
  { player_id: 'p18_4', play_percentage: 88, total_votes: 1600 },
  { player_id: 'p18_5', play_percentage: 85, total_votes: 1600 },
  { player_id: 'p18_6', play_percentage: 90, total_votes: 1600 },
  { player_id: 'p18_7', play_percentage: 89, total_votes: 1600 },
  { player_id: 'p18_8', play_percentage: 87, total_votes: 1600 },
  { player_id: 'p18_9', play_percentage: 82, total_votes: 1600 },
];

const MOCK_SPONSORS = [
  { id: 1, name: 'Nike', image_url: 'https://picsum.photos/seed/nike/200/100', link_url: '#' },
  { id: 2, name: 'Adidas', image_url: 'https://picsum.photos/seed/adidas/200/100', link_url: '#' },
];

export const useResults = (matchId) => {
  return useQuery({
    queryKey: ['results', matchId],
    queryFn: async () => {
      if (!supabase || !matchId) return MOCK_RESULTS;
      
      // Try fetching from match_results first
      const { data: archivedResults, error: archivedError } = await supabase
        .from('match_results')
        .select('*')
        .eq('match_id', matchId);

      if (archivedError) throw archivedError;
      
      if (archivedResults && archivedResults.length > 0) {
        return archivedResults;
      }

      // Fallback to match_results_view
      const { data: liveResults, error: liveError } = await supabase
        .from('match_results_view')
        .select('*')
        .eq('match_id', matchId);

      if (liveError) throw liveError;
      return liveResults.length > 0 ? liveResults : MOCK_RESULTS;
    },
    enabled: !!matchId,
  });
};

export const useSponsors = () => {
  return useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      if (!supabase) return MOCK_SPONSORS;
      
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      return data;
    },
  });
};

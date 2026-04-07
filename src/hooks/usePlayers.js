import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const MOCK_PLAYERS = {
  'Real Madrid': [
    { id: 'p1', name: 'Vinícius Júnior', position: 'FWD', team_id: 'Real Madrid', team_name: 'Real Madrid' },
    { id: 'p2', name: 'Jude Bellingham', position: 'MID', team_id: 'Real Madrid', team_name: 'Real Madrid' },
    { id: 'p3', name: 'Kylian Mbappé', position: 'FWD', team_id: 'Real Madrid', team_name: 'Real Madrid' },
    { id: 'p4', name: 'Federico Valverde', position: 'MID', team_id: 'Real Madrid', team_name: 'Real Madrid' },
    { id: 'p5', name: 'Antonio Rüdiger', position: 'DEF', team_id: 'Real Madrid', team_name: 'Real Madrid' },
    { id: 'p6', name: 'Thibaut Courtois', position: 'GK', team_id: 'Real Madrid', team_name: 'Real Madrid' },
  ],
  'Man City': [
    { id: 'p7', name: 'Erling Haaland', position: 'FWD', team_id: 'Man City', team_name: 'Man City' },
    { id: 'p8', name: 'Kevin De Bruyne', position: 'MID', team_id: 'Man City', team_name: 'Man City' },
    { id: 'p9', name: 'Phil Foden', position: 'MID', team_id: 'Man City', team_name: 'Man City' },
    { id: 'p10', name: 'Rodri', position: 'MID', team_id: 'Man City', team_name: 'Man City' },
    { id: 'p11', name: 'Bernardo Silva', position: 'MID', team_id: 'Man City', team_name: 'Man City' },
    { id: 'p12', name: 'Ederson', position: 'GK', team_id: 'Man City', team_name: 'Man City' },
  ],
  'Arsenal': [
    { id: 'p13', name: 'Bukayo Saka', position: 'FWD', team_id: 'Arsenal', team_name: 'Arsenal' },
    { id: 'p14', name: 'Martin Ødegaard', position: 'MID', team_id: 'Arsenal', team_name: 'Arsenal' },
    { id: 'p15', name: 'Declan Rice', position: 'MID', team_id: 'Arsenal', team_name: 'Arsenal' },
    { id: 'p16', name: 'William Saliba', position: 'DEF', team_id: 'Arsenal', team_name: 'Arsenal' },
    { id: 'p17', name: 'Kai Havertz', position: 'FWD', team_id: 'Arsenal', team_name: 'Arsenal' },
    { id: 'p18', name: 'David Raya', position: 'GK', team_id: 'Arsenal', team_name: 'Arsenal' },
  ],
  'Liverpool': [
    { id: 'p19', name: 'Mohamed Salah', position: 'FWD', team_id: 'Liverpool', team_name: 'Liverpool' },
    { id: 'p20', name: 'Virgil van Dijk', position: 'DEF', team_id: 'Liverpool', team_name: 'Liverpool' },
    { id: 'p21', name: 'Luis Díaz', position: 'FWD', team_id: 'Liverpool', team_name: 'Liverpool' },
    { id: 'p22', name: 'Alexis Mac Allister', position: 'MID', team_id: 'Liverpool', team_name: 'Liverpool' },
    { id: 'p23', name: 'Trent Alexander-Arnold', position: 'DEF', team_id: 'Liverpool', team_name: 'Liverpool' },
    { id: 'p24', name: 'Alisson Becker', position: 'GK', team_id: 'Liverpool', team_name: 'Liverpool' },
  ],
  'Bayern Munich': [
    { id: 'p25', name: 'Harry Kane', position: 'FWD', team_id: 'Bayern Munich', team_name: 'Bayern Munich' },
    { id: 'p26', name: 'Jamal Musiala', position: 'MID', team_id: 'Bayern Munich', team_name: 'Bayern Munich' },
    { id: 'p27', name: 'Leroy Sané', position: 'FWD', team_id: 'Bayern Munich', team_name: 'Bayern Munich' },
    { id: 'p28', name: 'Joshua Kimmich', position: 'MID', team_id: 'Bayern Munich', team_name: 'Bayern Munich' },
    { id: 'p29', name: 'Manuel Neuer', position: 'GK', team_id: 'Bayern Munich', team_name: 'Bayern Munich' },
  ],
  'PSG': [
    { id: 'p30', name: 'Ousmane Dembélé', position: 'FWD', team_id: 'PSG', team_name: 'PSG' },
    { id: 'p31', name: 'Vitinha', position: 'MID', team_id: 'PSG', team_name: 'PSG' },
    { id: 'p32', name: 'Bradley Barcola', position: 'FWD', team_id: 'PSG', team_name: 'PSG' },
    { id: 'p33', name: 'Gianluigi Donnarumma', position: 'GK', team_id: 'PSG', team_name: 'PSG' },
  ],
  'Inter Milan': [
    { id: 'p34', name: 'Lautaro Martínez', position: 'FWD', team_id: 'Inter Milan', team_name: 'Inter Milan' },
    { id: 'p35', name: 'Nicolò Barella', position: 'MID', team_id: 'Inter Milan', team_name: 'Inter Milan' },
    { id: 'p36', name: 'Hakan Çalhanoğlu', position: 'MID', team_id: 'Inter Milan', team_name: 'Inter Milan' },
  ],
  'AC Milan': [
    { id: 'p37', name: 'Rafael Leão', position: 'FWD', team_id: 'AC Milan', team_name: 'AC Milan' },
    { id: 'p38', name: 'Theo Hernández', position: 'DEF', team_id: 'AC Milan', team_name: 'AC Milan' },
    { id: 'p39', name: 'Christian Pulisic', position: 'MID', team_id: 'AC Milan', team_name: 'AC Milan' },
  ],
};

export const usePlayers = (teamName) => {
  return useQuery({
    queryKey: ['players', teamName],
    queryFn: async () => {
      if (!teamName) return [];
      
      // Force mock data for demo mode
      return MOCK_PLAYERS[teamName] || [];

      /*
      if (!import.meta.env.VITE_SUPABASE_URL) {
        return MOCK_PLAYERS[teamName] || [];
      }

      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_name', teamName);

      if (error) throw error;
      return data;
      */
    },
    enabled: !!teamName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const MOCK_PLAYERS = [
  // Arsenal (p1-p11)
  { id: 'p1', name: 'Bukayo Saka', position: 'Forward', team: 'Arsenal' },
  { id: 'p2', name: 'Martin Odegaard', position: 'Midfielder', team: 'Arsenal' },
  { id: 'p3', name: 'Declan Rice', position: 'Midfielder', team: 'Arsenal' },
  { id: 'p4', name: 'William Saliba', position: 'Defender', team: 'Arsenal' },
  { id: 'p5', name: 'David Raya', position: 'Goalkeeper', team: 'Arsenal' },
  { id: 'p5_1', name: 'Gabriel Martinelli', position: 'Forward', team: 'Arsenal' },
  { id: 'p5_2', name: 'Kai Havertz', position: 'Forward', team: 'Arsenal' },
  { id: 'p5_3', name: 'Gabriel Magalhães', position: 'Defender', team: 'Arsenal' },
  { id: 'p5_4', name: 'Ben White', position: 'Defender', team: 'Arsenal' },
  { id: 'p5_5', name: 'Jurrien Timber', position: 'Defender', team: 'Arsenal' },
  { id: 'p5_6', name: 'Thomas Partey', position: 'Midfielder', team: 'Arsenal' },

  // Man City (p6-p16)
  { id: 'p6', name: 'Erling Haaland', position: 'Forward', team: 'Man City' },
  { id: 'p7', name: 'Kevin De Bruyne', position: 'Midfielder', team: 'Man City' },
  { id: 'p8', name: 'Rodri', position: 'Midfielder', team: 'Man City' },
  { id: 'p9', name: 'Ruben Dias', position: 'Defender', team: 'Man City' },
  { id: 'p10', name: 'Ederson', position: 'Goalkeeper', team: 'Man City' },
  { id: 'p10_1', name: 'Phil Foden', position: 'Forward', team: 'Man City' },
  { id: 'p10_2', name: 'Bernardo Silva', position: 'Midfielder', team: 'Man City' },
  { id: 'p10_3', name: 'John Stones', position: 'Defender', team: 'Man City' },
  { id: 'p10_4', name: 'Kyle Walker', position: 'Defender', team: 'Man City' },
  { id: 'p10_5', name: 'Josko Gvardiol', position: 'Defender', team: 'Man City' },
  { id: 'p10_6', name: 'Jeremy Doku', position: 'Forward', team: 'Man City' },

  // Liverpool (p11-p21)
  { id: 'p11', name: 'Mo Salah', position: 'Forward', team: 'Liverpool' },
  { id: 'p12', name: 'Virgil van Dijk', position: 'Defender', team: 'Liverpool' },
  { id: 'p12_1', name: 'Luis Diaz', position: 'Forward', team: 'Liverpool' },
  { id: 'p12_2', name: 'Alexis Mac Allister', position: 'Midfielder', team: 'Liverpool' },
  { id: 'p12_3', name: 'Dominik Szoboszlai', position: 'Midfielder', team: 'Liverpool' },
  { id: 'p12_4', name: 'Trent Alexander-Arnold', position: 'Defender', team: 'Liverpool' },
  { id: 'p12_5', name: 'Alisson Becker', position: 'Goalkeeper', team: 'Liverpool' },
  { id: 'p12_6', name: 'Darwin Nunez', position: 'Forward', team: 'Liverpool' },
  { id: 'p12_7', name: 'Ibrahima Konate', position: 'Defender', team: 'Liverpool' },
  { id: 'p12_8', name: 'Andrew Robertson', position: 'Defender', team: 'Liverpool' },
  { id: 'p12_9', name: 'Ryan Gravenberch', position: 'Midfielder', team: 'Liverpool' },

  // Chelsea (p13-p23)
  { id: 'p13', name: 'Cole Palmer', position: 'Midfielder', team: 'Chelsea' },
  { id: 'p14', name: 'Enzo Fernandez', position: 'Midfielder', team: 'Chelsea' },
  { id: 'p14_1', name: 'Nicolas Jackson', position: 'Forward', team: 'Chelsea' },
  { id: 'p14_2', name: 'Moises Caicedo', position: 'Midfielder', team: 'Chelsea' },
  { id: 'p14_3', name: 'Levi Colwill', position: 'Defender', team: 'Chelsea' },
  { id: 'p14_4', name: 'Reece James', position: 'Defender', team: 'Chelsea' },
  { id: 'p14_5', name: 'Robert Sanchez', position: 'Goalkeeper', team: 'Chelsea' },
  { id: 'p14_6', name: 'Christopher Nkunku', position: 'Forward', team: 'Chelsea' },
  { id: 'p14_7', name: 'Jadon Sancho', position: 'Forward', team: 'Chelsea' },
  { id: 'p14_8', name: 'Marc Cucurella', position: 'Defender', team: 'Chelsea' },
  { id: 'p14_9', name: 'Wesley Fofana', position: 'Defender', team: 'Chelsea' },

  // Man United (p15-p25)
  { id: 'p15', name: 'Bruno Fernandes', position: 'Midfielder', team: 'Man United' },
  { id: 'p16', name: 'Marcus Rashford', position: 'Forward', team: 'Man United' },
  { id: 'p16_1', name: 'Kobbie Mainoo', position: 'Midfielder', team: 'Man United' },
  { id: 'p16_2', name: 'Lisandro Martinez', position: 'Defender', team: 'Man United' },
  { id: 'p16_3', name: 'Andre Onana', position: 'Goalkeeper', team: 'Man United' },
  { id: 'p16_4', name: 'Rasmus Hojlund', position: 'Forward', team: 'Man United' },
  { id: 'p16_5', name: 'Alejandro Garnacho', position: 'Forward', team: 'Man United' },
  { id: 'p16_6', name: 'Matthijs de Ligt', position: 'Defender', team: 'Man United' },
  { id: 'p16_7', name: 'Diogo Dalot', position: 'Defender', team: 'Man United' },
  { id: 'p16_8', name: 'Manuel Ugarte', position: 'Midfielder', team: 'Man United' },
  { id: 'p16_9', name: 'Noussair Mazraoui', position: 'Defender', team: 'Man United' },

  // Tottenham (p17-p27)
  { id: 'p17', name: 'Son Heung-min', position: 'Forward', team: 'Tottenham' },
  { id: 'p18', name: 'James Maddison', position: 'Midfielder', team: 'Tottenham' },
  { id: 'p18_1', name: 'Cristian Romero', position: 'Defender', team: 'Tottenham' },
  { id: 'p18_2', name: 'Micky van de Ven', position: 'Defender', team: 'Tottenham' },
  { id: 'p18_3', name: 'Guglielmo Vicario', position: 'Goalkeeper', team: 'Tottenham' },
  { id: 'p18_4', name: 'Dejan Kulusevski', position: 'Midfielder', team: 'Tottenham' },
  { id: 'p18_5', name: 'Brennan Johnson', position: 'Forward', team: 'Tottenham' },
  { id: 'p18_6', name: 'Dominic Solanke', position: 'Forward', team: 'Tottenham' },
  { id: 'p18_7', name: 'Pedro Porro', position: 'Defender', team: 'Tottenham' },
  { id: 'p18_8', name: 'Destiny Udogie', position: 'Defender', team: 'Tottenham' },
  { id: 'p18_9', name: 'Yves Bissouma', position: 'Midfielder', team: 'Tottenham' },
];

export const usePlayers = (matchId) => {
  return useQuery({
    queryKey: ['players', matchId],
    queryFn: async () => {
      if (!supabase || !matchId) return MOCK_PLAYERS;
      
      const { data, error } = await supabase
        .from('players')
        .select('*');

      if (error) throw error;
      return data.length > 0 ? data : MOCK_PLAYERS;
    },
    enabled: !!matchId,
  });
};

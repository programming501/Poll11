import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env
dotenv.config({ path: resolve(process.cwd(), '.env') });

export async function syncMatches() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const footballDataApiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || !footballDataApiKey) {
    throw new Error('Missing environment variables. Please check your .env file.');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  
  console.log('Fetching matches from football-data.org...');
  
  // Fetch upcoming Premier League matches (PL)
  const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED', {
    headers: { 'X-Auth-Token': footballDataApiKey },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch matches: ${error}`);
  }

  const data = await response.json();
  const matches = data.matches;

  console.log(`Found ${matches.length} scheduled matches.`);

  const mappedMatches = matches.map((m) => {
    const kickoffTime = new Date(m.utcDate);
    const votingClosesAt = new Date(kickoffTime.getTime() - 60 * 60 * 1000); // 1 hour before kickoff
    
    return {
      id: m.id.toString(),
      home_team: m.homeTeam.name,
      away_team: m.awayTeam.name,
      kickoff_time: m.utcDate,
      voting_closes_at: votingClosesAt.toISOString(),
      status: 'upcoming',
    };
  });

  const { error: matchError } = await supabase
    .from('matches')
    .upsert(mappedMatches, { onConflict: 'id' });

  if (matchError) {
    console.error('Error upserting matches:', matchError);
    throw matchError;
  } else {
    console.log('Successfully synced matches.');
  }

  // Sync players for these teams
  const teamIds = new Set();
  matches.forEach((m) => {
    teamIds.add(m.homeTeam.id);
    teamIds.add(m.awayTeam.id);
  });

  console.log(`Syncing rosters for ${teamIds.size} teams...`);

  for (const teamId of teamIds) {
    try {
      console.log(`Fetching roster for team ID: ${teamId}`);
      const teamResponse = await fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
        headers: { 'X-Auth-Token': footballDataApiKey },
      });

      if (!teamResponse.ok) {
        console.warn(`Failed to fetch roster for team ${teamId}`);
        continue;
      }

      const teamData = await teamResponse.json();
      const players = teamData.squad.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        position: p.position || 'N/A',
        team_id: teamId.toString(),
        team_name: teamData.name,
      }));

      const { error: playerError } = await supabase
        .from('players')
        .upsert(players, { onConflict: 'id' });

      if (playerError) {
        console.error(`Error upserting players for team ${teamId}:`, playerError);
      } else {
        console.log(`Synced ${players.length} players for ${teamData.name}.`);
      }

      // Respect rate limits (Free tier: 10 requests per minute)
      await new Promise(resolve => setTimeout(resolve, 6000)); 
    } catch (err) {
      console.error(`Error syncing team ${teamId}:`, err);
    }
  }
}

// Only run if called directly
if (import.meta.url === `file://${resolve(process.argv[1])}`) {
  syncMatches()
    .then(() => console.log('Sync completed!'))
    .catch(err => console.error('Sync failed:', err));
}

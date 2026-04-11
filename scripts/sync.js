import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const footballApiKey = process.env.FOOTBALL_DATA_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !footballApiKey) {
  console.error('Missing environment variables. Check .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function syncMatches() {
  console.log('Fetching matches for Premier League...');
  
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED', {
      headers: { 'X-Auth-Token': footballApiKey },
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const data = await response.json();
    const matches = data.matches;

    console.log(`Found ${matches.length} scheduled matches.`);

    const mappedMatches = matches.map(m => {
      const kickoffTime = new Date(m.utcDate);
      const votingClosesAt = new Date(kickoffTime.getTime() - 60 * 60 * 1000); // 1 hour before
      
      return {
        id: m.id.toString(),
        home_team: m.homeTeam.name,
        away_team: m.awayTeam.name,
        kickoff_time: m.utcDate,
        voting_closes_at: votingClosesAt.toISOString(),
        status: 'upcoming'
      };
    });

    const { error: matchError } = await supabase
      .from('matches')
      .upsert(mappedMatches);

    if (matchError) throw matchError;
    console.log('Matches synced successfully.');

    // Sync Players for each team
    const teamIds = new Set();
    matches.forEach(m => {
      teamIds.add(m.homeTeam.id);
      teamIds.add(m.awayTeam.id);
    });

    console.log(`Syncing rosters for ${teamIds.size} teams...`);

    for (const teamId of teamIds) {
      console.log(`Fetching roster for team ${teamId}...`);
      
      const teamResponse = await fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
        headers: { 'X-Auth-Token': footballApiKey },
      });

      if (!teamResponse.ok) {
        console.warn(`Failed to fetch team ${teamId}`);
        continue;
      }

      const teamData = await teamResponse.json();
      const players = teamData.squad.map(p => ({
        id: `${teamId}-${p.id}`, // Unique per team/player combo
        name: p.name,
        position: p.position || 'N/A',
        team_name: teamData.name
      }));

      const { error: playerError } = await supabase
        .from('players')
        .upsert(players);

      if (playerError) console.error(`Error syncing players for ${teamData.name}:`, playerError);
      else console.log(`Synced ${players.length} players for ${teamData.name}`);

      // Respect rate limits: 10 req/min -> 6s minimum, user requested 7s
      await sleep(7000);
    }

    console.log('Full sync completed.');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

syncMatches();

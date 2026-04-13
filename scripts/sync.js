import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ override: true });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const footballApiKey = process.env.FOOTBALL_DATA_API_KEY?.replace(/^"|"$/g, '').trim();
console.log('Loaded API Key (first 5):', footballApiKey?.substring(0, 5));

if (!supabaseUrl || !supabaseServiceKey || !footballApiKey) {
  console.error('Missing environment variables. Check .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to create a deterministic UUID from an integer ID
function toUUID(id, prefix = '0') {
  const hex = id.toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex}`;
}

async function syncMatches() {
  console.log('Fetching matches for Premier League...');
  
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED', {
      headers: { 'X-Auth-Token': footballApiKey },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const matches = data.matches;

    console.log(`Found ${matches.length} scheduled matches.`);

    const mappedMatches = matches.map(m => {
      const kickoffTime = new Date(m.utcDate);
      const votingClosesAt = new Date(kickoffTime.getTime() - 60 * 60 * 1000); // 1 hour before
      
      return {
        id: toUUID(m.id),
        home_team: m.homeTeam.name,
        away_team: m.awayTeam.name,
        match_date: m.utcDate,
        voting_closes_at: votingClosesAt.toISOString(),
        status: 'upcoming',
        competition: 'Premier League'
      };
    });

    const { error: matchError } = await supabase
      .from('matches')
      .upsert(mappedMatches);

    if (matchError) throw matchError;
    console.log('Matches synced successfully.');

    // Sync Players for each team
    const teams = new Map();
    matches.forEach(m => {
      teams.set(m.homeTeam.id, m.homeTeam.name);
      teams.set(m.awayTeam.id, m.awayTeam.name);
    });

    console.log(`Syncing rosters for ${teams.size} teams...`);

    for (const [teamId, teamName] of teams) {
      console.log(`Fetching roster for ${teamName} (ID: ${teamId})...`);
      
      const teamResponse = await fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
        headers: { 'X-Auth-Token': footballApiKey },
      });

      if (!teamResponse.ok) {
        console.warn(`Failed to fetch team ${teamId}`);
        continue;
      }

      const teamData = await teamResponse.json();
      const players = teamData.squad.map(p => ({
        id: toUUID(p.id),
        name: p.name,
        position: p.position || 'N/A',
        team: teamData.name
      }));

      const { error: playerError } = await supabase
        .from('players')
        .upsert(players);

      if (playerError) console.error(`Error syncing players for ${teamData.name}:`, playerError);
      else console.log(`Synced ${players.length} players for ${teamData.name}`);

      await sleep(7000);
    }

    console.log('Full sync completed.');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

syncMatches();

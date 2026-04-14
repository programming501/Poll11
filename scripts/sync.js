import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// 1. Load environment variables specifically from .env.scripts
// We use path.resolve to ensure it finds the file regardless of where you run the command from
dotenv.config({ path: path.resolve(process.cwd(), '.env.scripts') });

const supabaseUrl = process.env.SUPABASE_URL; // Removed VITE_ prefix to match .env.scripts
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const footballApiKey = process.env.FOOTBALL_DATA_API_KEY?.replace(/^"|"$/g, '').trim();

// 2. Safety Check
if (!supabaseUrl || !supabaseServiceKey || !footballApiKey) {
  console.error('❌ Missing environment variables in .env.scripts!');
  console.log({ 
    hasUrl: !!supabaseUrl, 
    hasServiceKey: !!supabaseServiceKey, 
    hasApiKey: !!footballApiKey 
  });
  process.exit(1);
}

// 3. Initialize Supabase with the Service Role Key (Bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for deterministic UUIDs
function toUUID(id) {
  const hex = id.toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex}`;
}

async function syncMatches() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const dateFrom = now.toISOString().split('T')[0];
  const dateTo = nextWeek.toISOString().split('T')[0];

  console.log(`🚀 Starting Poll 11 Sync: ${dateFrom} to ${dateTo}`);
  
  try {
    const url = `https://api.football-data.org/v4/competitions/PL/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    
    const response = await fetch(url, {
      headers: { 'X-Auth-Token': footballApiKey },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API returned ${response.status}: ${err}`);
    }

    const data = await response.json();
    const matches = data.matches || [];

    console.log(`🏟️ Found ${matches.length} matches.`);

    if (matches.length === 0) return;

    // Map and Upsert Matches
    const mappedMatches = matches.map(m => ({
      id: toUUID(m.id),
      home_team: m.homeTeam.name,
      away_team: m.awayTeam.name,
      match_date: m.utcDate,
      voting_closes_at: new Date(new Date(m.utcDate).getTime() - 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      competition: 'Premier League'
    }));

    const { error: matchError } = await supabase.from('matches').upsert(mappedMatches);
    if (matchError) throw matchError;

    // Collect Unique Teams
    const teams = new Map();
    matches.forEach(m => {
      teams.set(m.homeTeam.id, m.homeTeam.name);
      teams.set(m.awayTeam.id, m.awayTeam.name);
    });

    // Sync Players
    for (const [teamId, teamName] of teams) {
      console.log(`⏳ Fetching ${teamName}...`);
      
      const teamResponse = await fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
        headers: { 'X-Auth-Token': footballApiKey },
      });

      if (!teamResponse.ok) {
        console.warn(`⚠️ Skipped ${teamName} due to API error.`);
        continue;
      }

      const teamData = await teamResponse.json();
      const players = teamData.squad.map(p => ({
        id: toUUID(p.id),
        name: p.name,
        team: teamData.name
      }));

      const { error: playerError } = await supabase.from('players').upsert(players);
      if (playerError) console.error(`❌ Error for ${teamName}:`, playerError);
      
      console.log(`✅ Synced ${players.length} players. Waiting 7s (API Limit)...`);
      await sleep(7000); 
    }

    console.log('✨ Poll 11 Sync Complete!');
  } catch (error) {
    console.error('💥 Sync failed:', error.message);
  }
}

syncMatches();
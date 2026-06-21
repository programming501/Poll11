import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.scripts') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const footballApiKey = process.env.FOOTBALL_DATA_API_KEY?.replace(/^"|"$/g, '').trim();

if (!supabaseUrl || !supabaseServiceKey || !footballApiKey) {
  console.error('Missing environment variables in .env.scripts');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const syncCompetitions = (process.env.SYNC_COMPETITIONS || 'PL,WC')
  .split(',')
  .map((code) => code.trim().toUpperCase())
  .filter(Boolean);

const competitionLabels = {
  PL: 'Premier League',
  WC: 'FIFA World Cup',
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function toUUID(id) {
  const hex = id.toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex}`;
}

// Generates a unique player ID per match
// Same player in two different matches gets two different rows
function playerMatchId(playerId, matchUUID) {
  const p = parseInt(playerId, 10);
  const matchHex = matchUUID.replace(/-/g, '').slice(-12);
  const m = parseInt(matchHex, 16);
  
  // Create deterministic seed - use both IDs to create 32-char hex
  const pHex = p.toString(16).padStart(8, '0');
  const mHex = m.toString(16).padStart(24, '0').slice(0, 24);
  const hex = pHex + mHex;
  
  // UUID v4: 8-4-4-12 chars
  const seg1 = hex.slice(0, 8);
  const seg2 = hex.slice(8, 12);
  const seg3 = '4' + hex.slice(9, 12);
  const seg4 = '8' + hex.slice(12, 15);
  const seg5 = (hex.slice(15) + '000000000000').slice(0, 12);
  
  return `${seg1}-${seg2}-${seg3}-${seg4}-${seg5}`;
}

async function syncMatches() {
  const now = new Date();
const nextWeek = new Date();
nextWeek.setDate(now.getDate() + 7);

const dateFrom = now.toISOString().split('T')[0];
const dateTo = nextWeek.toISOString().split('T')[0];

  console.log(`Syncing competitions: ${syncCompetitions.join(', ')} from ${dateFrom} to ${dateTo}`);

  for (const code of syncCompetitions) {
    const label = competitionLabels[code] || code;

    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      { headers: { 'X-Auth-Token': footballApiKey } }
    );

    if (!response.ok) {
      console.warn(`Skipped ${label}: ${response.status} ${await response.text()}`);
      continue;
    }

    const { matches = [] } = await response.json();
    console.log(`Found ${matches.length} ${label} matches`);

    if (matches.length === 0) {
      continue;
    }

    // Filter out matches with missing team data
    const validMatches = matches.filter(m => m.homeTeam?.name && m.awayTeam?.name);
    
    if (validMatches.length === 0) {
      console.log(`No valid matches (missing team data) for ${label}`);
      continue;
    }

    const { error: matchError } = await supabase
      .from('matches')
      .upsert(validMatches.map((m) => ({
        id: toUUID(m.id),
        home_team: m.homeTeam.name,
        away_team: m.awayTeam.name,
        match_date: m.utcDate,
        voting_closes_at: new Date(new Date(m.utcDate).getTime() - 60 * 60 * 1000).toISOString(),
        status: 'upcoming',
        competition: label,
      })));

    if (matchError) {
      throw matchError;
    }

    console.log(`Upserted ${validMatches.length} ${label} matches`);

    for (const match of validMatches) {
      const matchUUID = toUUID(match.id);
      const teams = [
        { id: match.homeTeam.id, name: match.homeTeam.name },
        { id: match.awayTeam.id, name: match.awayTeam.name },
      ];

      for (const team of teams) {
        const { data: existing } = await supabase
          .from('players')
          .select('id')
          .eq('match_id', matchUUID)
          .eq('team', team.name)
          .limit(1);

        if (existing && existing.length > 0) {
          console.log(`Already have players for ${team.name} (${label}) — skipping`);
          continue;
        }

        console.log(`Waiting 7s... then fetching ${team.name} (${label})`);
        await sleep(7000);

        const res = await fetch(
          `https://api.football-data.org/v4/teams/${team.id}`,
          { headers: { 'X-Auth-Token': footballApiKey } }
        );

        if (!res.ok) {
          console.warn(`Skipped ${team.name} (${label})`);
          continue;
        }

        const teamData = await res.json();
        if (!teamData.squad?.length) {
          console.warn(`No squad for ${team.name} (${label})`);
          continue;
        }

        const players = teamData.squad.map((p) => ({
          id: playerMatchId(p.id, matchUUID),
          match_id: matchUUID,
          name: p.name,
          team: team.name,
        }));

        const { error } = await supabase.from('players').upsert(players);
        if (error) {
          console.error(`Player error for ${team.name} (${label}):`, error.message);
        } else {
          console.log(`Inserted ${players.length} players for ${team.name} (${label})`);
        }
      }
    }
  }

  console.log('Sync complete');
}

syncMatches().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
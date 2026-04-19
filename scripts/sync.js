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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function toUUID(id) {
  const hex = id.toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex}`;
}

// Generates a unique player ID per match
// Same player in two different matches gets two different rows
function playerMatchId(playerId, matchId) {
  const playerHex = playerId.toString(16).padStart(8, '0');
  const matchHex = matchId.toString(16).padStart(8, '0');
  return `${playerHex}-${matchHex}-0000-0000-000000000000`;
}

async function syncMatches() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const dateFrom = now.toISOString().split('T')[0];
  const dateTo = nextWeek.toISOString().split('T')[0];

  console.log(`Syncing: ${dateFrom} to ${dateTo}`);

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/PL/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    { headers: { 'X-Auth-Token': footballApiKey } }
  );

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }

  const { matches = [] } = await response.json();
  console.log(`Found ${matches.length} matches`);
  if (matches.length === 0) return;

  // Upsert matches
  const { error: matchError } = await supabase
    .from('matches')
    .upsert(matches.map(m => ({
      id: toUUID(m.id),
      home_team: m.homeTeam.name,
      away_team: m.awayTeam.name,
      match_date: m.utcDate,
      voting_closes_at: new Date(
        new Date(m.utcDate).getTime() - 60 * 60 * 1000
      ).toISOString(),
      status: 'upcoming',
      competition: 'Premier League',
    })));

  if (matchError) throw matchError;
  console.log(`Upserted ${matches.length} matches`);

  // For each match insert players for both teams WITH match_id
  for (const match of matches) {
    const matchUUID = toUUID(match.id);
    const teams = [
      { id: match.homeTeam.id, name: match.homeTeam.name },
      { id: match.awayTeam.id, name: match.awayTeam.name },
    ];

    for (const team of teams) {
      // Skip if players already exist for this match + team
      const { data: existing } = await supabase
        .from('players')
        .select('id')
        .eq('match_id', matchUUID)
        .eq('team', team.name)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`Already have players for ${team.name} — skipping`);
        continue;
      }

      console.log(`Waiting 7s... then fetching ${team.name}`);
      await sleep(7000);

      const res = await fetch(
        `https://api.football-data.org/v4/teams/${team.id}`,
        { headers: { 'X-Auth-Token': footballApiKey } }
      );

      if (!res.ok) {
        console.warn(`Skipped ${team.name}`);
        continue;
      }

      const teamData = await res.json();
      if (!teamData.squad?.length) {
        console.warn(`No squad for ${team.name}`);
        continue;
      }

      const players = teamData.squad.map(p => ({
        id: playerMatchId(p.id, match.id),
        match_id: matchUUID,
        name: p.name,
        team: team.name,
      }));

      const { error } = await supabase.from('players').upsert(players);
      if (error) {
        console.error(`Player error for ${team.name}:`, error.message);
      } else {
        console.log(`Inserted ${players.length} players for ${team.name}`);
      }
    }
  }

  console.log('Sync complete');
}

syncMatches().catch(err => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
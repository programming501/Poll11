export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  kickoff_time: string;
  voting_closes_at: string;
  status: 'upcoming' | 'live' | 'finished';
  home_score?: number;
  away_score?: number;
  results_published?: boolean;
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  team_id: string;
  team_name: string;
  image_url?: string;
}

export interface Vote {
  id: string;
  user_id: string;
  match_id: string;
  player_id: string;
  vote_type: 'play' | 'bench';
  created_at: string;
}

export interface VoteCounts {
  player_id: string;
  play_count: number;
  bench_count: number;
}

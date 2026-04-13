# Supabase Setup Guide for Poll 11

To make Poll 11 fully functional with real-time voting and authentication, follow these steps to set up your Supabase project.

## 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) and create a new project.

## 2. Run the SQL Schema
Copy and paste the following SQL into the **SQL Editor** in your Supabase dashboard and run it. This will create the necessary tables, views, and security policies.

```sql
-- 1. Create Matches Table
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  kickoff_time TIMESTAMPTZ NOT NULL,
  voting_closes_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Players Table
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  team_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Votes Table
CREATE TABLE votes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
  player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('play', 'bench')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id, player_id)
);

-- 4. Create Match Results Table (for snapshots)
CREATE TABLE match_results (
  id BIGSERIAL PRIMARY KEY,
  match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
  player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
  play_percentage FLOAT NOT NULL,
  total_votes INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Sponsors Table
CREATE TABLE sponsors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Live Results View
CREATE OR REPLACE VIEW match_results_view AS
SELECT 
  v.match_id,
  v.player_id,
  COUNT(*) FILTER (WHERE v.vote_type = 'play')::FLOAT / NULLIF(COUNT(*), 0)::FLOAT * 100 as play_percentage,
  COUNT(*) as total_votes
FROM votes v
GROUP BY v.match_id, v.player_id;

-- 7. Enable Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- 8. Define Policies
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read results" ON match_results FOR SELECT USING (true);
CREATE POLICY "Public read sponsors" ON sponsors FOR SELECT USING (active = true);

CREATE POLICY "Users can read own votes" ON votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 3. Configure Environment Variables
In your AI Studio project, go to the **Secrets** panel and add the following variables:

1. `VITE_SUPABASE_URL`: Your Supabase Project URL (found in Project Settings > API).
2. `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key (found in Project Settings > API).
3. `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (found in Project Settings > API). **Required for the sync script.**
4. `FOOTBALL_DATA_API_KEY`: Your API key from [football-data.org](https://www.football-data.org/).
5. `SYNC_SECRET`: A secret string of your choice to protect the sync endpoint.

## 4. Syncing Data
To prevent API exhaustion, the sync button has been removed from the UI. You can trigger a sync in two ways:

### Option A: Terminal (Recommended)
Run this command in the AI Studio terminal:
```bash
npm run sync
```

### Option B: Secure API Call
Send a POST request to your app's sync endpoint with your `SYNC_SECRET`:
```bash
curl -X POST https://your-app-url.com/api/sync \
  -H "x-sync-secret: YOUR_SYNC_SECRET"
```

## 5. Authentication
FootPoll uses Supabase Auth. By default, Email/Password is enabled. To enable Google Login:
1. Go to **Authentication > Providers** in Supabase.
2. Enable **Google**.
3. Follow the instructions to provide your Google Client ID and Secret.
4. Add the **Redirect URI** provided by Supabase to your Google Cloud Console.

## 6. Deployment
Once the secrets are added, the app will automatically switch from "Demo Mode" to "Live Mode". You can then deploy the app to Cloud Run or share it using the **Share** button.

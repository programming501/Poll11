import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
  const { count: playerCount } = await supabase.from('players').select('*', { count: 'exact', head: true });
  console.log(`Matches in DB: ${matchCount}`);
  console.log(`Players in DB: ${playerCount}`);
}
checkData();

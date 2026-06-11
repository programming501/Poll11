import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { Lock, Globe2, CalendarDays } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { data: matches } = useMatches();

  const worldCupMatches = matches
    ?.filter((m) => /world cup/i.test(m.competition || ''))
    .filter((m) => new Date(m.voting_closes_at) > new Date())
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
    .slice(0, 4) || [];

  const upcomingCount = worldCupMatches.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-16 pb-12 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/image.png" alt="Poll 11 Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
            <h1 className="text-3xl font-display font-black tracking-tighter neon-text">Poll 11</h1>
          </div>
         
        </div>
        
        <div className="space-y-2 animate-in slide-in-from-left duration-700">
          <h2 className="text-5xl font-display font-black tracking-tighter leading-[0.9] lg:text-7xl">
            DECIDE THE <br />
            <span className="text-primary">STARTING 11.</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Premier League Matchweek
          </p>
        </div>
      </header>

      <main className="px-6 space-y-8 pb-10">
        <section className="grid gap-6 animate-in fade-in slide-in-from-bottom duration-1000">
          <article className="vibe-card p-8 space-y-5 border-white/10 opacity-80">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[10px] font-display font-black uppercase tracking-[0.22em] text-slate-200">
                  Locked
                </span>
                <div>
                  <h3 className="text-3xl font-display font-black tracking-tighter">PREMIER LEAGUE</h3>
                  <p className="text-slate-400 text-sm font-medium">The season is over, so this card is now locked.</p>
                </div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-3xl border border-white/10">
                <Lock className="w-7 h-7 text-slate-300" />
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              No Fixtures Available
            </div>
          </article>

          <article className="vibe-card p-8 space-y-6 border-primary/30 shadow-[0_25px_60px_rgba(57,255,20,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-[10px] font-display font-black uppercase tracking-[0.22em] text-primary">
                  New • FIFA World Cup 26
                </span>
                <div>
                  <h3 className="text-3xl font-display font-black tracking-tighter">WORLD CUP 2026</h3>
                  <p className="text-slate-400 text-sm font-medium">Fresh fixtures, big matchups, and global football energy.</p>
                </div>
              </div>
              <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20">
                <Globe2 className="w-7 h-7 text-primary" />
              </div>
            </div>
            

            <button
              type="button"
              onClick={() => navigate('/league')}
              className="w-full rounded-[1.75rem] border border-primary/20 bg-gradient-to-r from-primary/15 via-primary/10 to-emerald-400/10 p-5 text-left text-slate-100 shadow-[0_18px_40px_rgba(57,255,20,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/20 hover:via-primary/10 hover:to-emerald-400/15 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  
                  <p className="text-[10px] font-display font-black uppercase tracking-[0.22em] text-primary">Open fixtures</p>
                  <p className="text-sm text-slate-200">Click to view the full World Cup match cards.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-2 text-[10px] font-display font-black uppercase tracking-[0.22em] text-primary shadow-[0_10px_30px_rgba(57,255,20,0.12)]">
                  Vote now
                  <CalendarDays className="h-4 w-4" />
                </span>
              </div>
            </button>

            
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;    
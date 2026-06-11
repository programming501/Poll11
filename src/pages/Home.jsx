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
              Results and old fixtures are archived. This section is intentionally closed for now.
            </div>
          </article>

          <article className="vibe-card p-8 space-y-6 border-primary/30 shadow-[0_25px_60px_rgba(57,255,20,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-[10px] font-display font-black uppercase tracking-[0.22em] text-primary">
                  New • FIFA World Cup 26
                </span>
                <div>
                  <h3 className="text-3xl font-display font-black tracking-tighter">WORLD CUP MODE</h3>
                  <p className="text-slate-400 text-sm font-medium">Fresh fixtures, big matchups, and global football energy.</p>
                </div>
              </div>
              <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20">
                <Globe2 className="w-7 h-7 text-primary" />
              </div>
            </div>

            <div className="grid gap-3">
              {worldCupMatches.length > 0 ? (
                worldCupMatches.map((fixture) => (
                  <button
                    key={fixture.id}
                    type="button"
                    className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 text-left transition duration-300 hover:border-primary/30 hover:bg-slate-900"
                    onClick={() => navigate('/league')}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-display font-black uppercase tracking-[0.22em] text-slate-400">
                      <span>World Cup</span>
                      <span className="text-primary">{new Date(fixture.match_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-black text-white">{fixture.home_team}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">vs</p>
                        <p className="text-base font-black text-white">{fixture.away_team}</p>
                      </div>
                      <div className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-right text-[10px] uppercase tracking-[0.18em] text-primary">
                        <CalendarDays className="mb-1 h-4 w-4" />
                        {new Date(fixture.match_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
                  No World Cup fixtures are available yet. Run the sync script to populate the competition data.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-300">
              <span>{upcomingCount} upcoming fixture(s) available</span>
              <span className="text-primary">World Cup 26</span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;    
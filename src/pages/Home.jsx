import React from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, LayoutGrid, LogOut } from 'lucide-react';

const Home = () => {
  const { data: matches, isLoading, error } = useMatches();
  const { signOut } = useAuth();

  // Filter for upcoming matches and show the full Matchweek (up to 12)
  const upcomingMatches = matches
    ?.filter(m => {
      const votingCloses = new Date(m.voting_closes_at);
      return new Date() < votingCloses;
    })
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
    .slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-16 pb-12 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30 animate-in fade-in zoom-in duration-700">
              <Trophy className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tighter neon-text">Poll 11</h1>
          </div>
         
        </div>
        
        <div className="space-y-2 animate-in slide-in-from-left duration-700">
          <h2 className="text-5xl font-display font-black tracking-tighter leading-[0.9] lg:text-7xl">
            DECIDE THE <br />
            <span className="text-primary">STARTING 11</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Premier League Matchweek
          </p>
        </div>
      </header>

      <main className="px-6 space-y-12">
        <section className="animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="vibe-card p-8 group cursor-default space-y-10">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-6">
                  <Badge className="bg-primary/20 text-primary border-none px-3 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-widest">
                    Active League
                  </Badge>
                  <div className="space-y-1">
                    <h3 className="text-4xl font-display font-black tracking-tighter">PREMIER LEAGUE</h3>
                    <p className="text-slate-400 text-sm font-medium">Vote for the upcoming fixtures</p>
                  </div>
                </div>
                <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-display font-black uppercase tracking-widest text-primary">
                <span>{upcomingMatches.length} Matches Open</span>
                <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary opacity-50" />
                <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] opacity-40">Upcoming Fixtures</span>
              </div>

              {/* Grid layout for more matches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[280px] w-full rounded-[2.5rem] bg-slate-800/30" />
                  ))
                ) : error ? (
                  <div className="col-span-full py-12 text-center glass rounded-[2.5rem]">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Failed to load matches</p>
                  </div>
                ) : upcomingMatches.length === 0 ? (
                  <div className="col-span-full py-12 text-center glass rounded-[2.5rem]">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No matches scheduled</p>
                  </div>
                ) : (
                  upcomingMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;    
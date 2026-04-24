import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import MatchCard from '../components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, LayoutGrid, ArrowLeft } from 'lucide-react';

const LeagueMatches = () => {
  const navigate = useNavigate();
  const { data: matches, isLoading, error } = useMatches();

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
          <Button variant="ghost" size="icon" asChild className="rounded-2xl glass hover:bg-white/10">
            <button onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Button>
        </div>
        
        <div className="space-y-2 animate-in slide-in-from-left duration-700">
          <Badge className="bg-primary/20 text-primary border-none px-3 py-1 rounded-full text-[10px] font-display font-black uppercase tracking-widest">
            Active League
          </Badge>
          <h2 className="text-5xl font-display font-black tracking-tighter leading-[0.9] lg:text-7xl">
            PREMIER <br />
            <span className="text-primary">LEAGUE</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Vote for the upcoming fixtures
          </p>
        </div>
      </header>

      <main className="px-6 space-y-12">
        <section className="animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary opacity-50" />
              <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] opacity-40">Upcoming Fixtures</span>
            </div>

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
        </section>
      </main>
    </div>
  );
};

export default LeagueMatches;
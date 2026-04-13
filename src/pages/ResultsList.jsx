import React from 'react';
import { useMatches } from '../hooks/useMatches';
import MatchCard from '../components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, LayoutGrid, CheckCircle2 } from 'lucide-react';

const ResultsList = () => {
  const { data: matches, isLoading, error } = useMatches();

  // Filter for matches that are closed or finished
  const finishedMatches = matches?.filter(m => {
    const votingCloses = new Date(m.voting_closes_at);
    return new Date() >= votingCloses;
  }) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-16 pb-12 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30 animate-in fade-in zoom-in duration-700">
            <CheckCircle2 className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tighter neon-text">Results</h1>
        </div>
        
        <div className="space-y-2 animate-in slide-in-from-left duration-700">
          <h2 className="text-5xl font-display font-black tracking-tighter leading-[0.9] lg:text-7xl">
            FINAL <br />
            <span className="text-primary">LINEUPS</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Archived Match Results
          </p>
        </div>
      </header>

      <main className="px-6 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary opacity-50" />
              <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] opacity-40">Completed Polls</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[320px] w-full rounded-[2.5rem] bg-slate-800/30" />
              ))
            ) : error ? (
              <div className="col-span-full py-20 text-center space-y-4 glass rounded-[3rem]">
                <p className="text-slate-500 font-medium">Failed to load results.</p>
              </div>
            ) : finishedMatches.length === 0 ? (
              <div className="col-span-full py-24 text-center space-y-6 glass rounded-[3rem]">
                <div className="flex justify-center">
                  <div className="bg-slate-800/50 p-8 rounded-[2.5rem]">
                    <Trophy className="w-12 h-12 text-slate-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black tracking-tight">NO RESULTS YET</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Results appear once voting closes
                  </p>
                </div>
              </div>
            ) : (
              finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsList;

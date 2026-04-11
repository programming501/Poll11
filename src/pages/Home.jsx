import React from 'react';
import { useMatches } from '../hooks/useMatches';
import MatchCard from '../components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, LayoutGrid } from 'lucide-react';

const Home = () => {
  const { data: matches, isLoading, error } = useMatches();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-8 space-y-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Trophy className="text-primary-foreground w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">Poll 11</h1>
        </div>
        <h2 className="text-4xl font-black tracking-tighter leading-none">
          Decide the <span className="text-primary">Starting 11</span>
        </h2>
        <p className="text-muted-foreground font-medium">Premier League Matchweek</p>
      </header>

      <main className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 opacity-30" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Upcoming Fixtures</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[320px] w-full rounded-[2.5rem] bg-secondary/30" />
            ))
          ) : error ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <p className="text-muted-foreground font-medium">Failed to load matches.</p>
            </div>
          ) : matches?.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <p className="text-muted-foreground font-medium">No matches scheduled.</p>
            </div>
          ) : (
            matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;

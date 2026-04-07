import React from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const Results = () => {
  const { data: matches, isLoading } = useMatches();
  const finishedMatches = matches?.filter(m => m.status === 'finished' || m.results_published);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <header className="flex items-center justify-between mb-12 pt-8 sticky top-0 z-50 glass rounded-2xl px-6 py-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl neon-glow">
              <CheckCircle2 className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Fan Results</h1>
          </div>
        </header>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-3 font-display">
              <Trophy className="w-5 h-5 text-primary" />
              Published Voting
            </h2>
          </div>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-3xl bg-card/50" />
            ))
          ) : !finishedMatches || finishedMatches.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
              <p className="text-muted-foreground font-medium">No published results yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {finishedMatches.map((match) => (
                <Link key={match.id} to={`/match/${match.id}`} className="block group">
                  <div className="match-moment-gradient p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                        Results Ready
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:gap-8 mt-4">
                      <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xl sm:text-2xl border border-white/10 group-hover:border-primary/20 transition-colors">
                          {match.home_team.charAt(0)}
                        </div>
                        <span className="text-sm sm:text-base font-bold text-center font-display group-hover:text-primary transition-colors line-clamp-1">{match.home_team}</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-px w-6 sm:w-8 bg-white/10" />
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">VS</span>
                        <div className="h-px w-6 sm:w-8 bg-white/10" />
                      </div>

                      <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xl sm:text-2xl border border-white/10 group-hover:border-primary/20 transition-colors">
                          {match.away_team.charAt(0)}
                        </div>
                        <span className="text-sm sm:text-base font-bold text-center font-display group-hover:text-primary transition-colors line-clamp-1">{match.away_team}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-white/40 group-hover:text-primary/60 transition-colors">
                      <span>View fan lineup results</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;

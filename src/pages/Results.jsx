import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { usePlayers } from '../hooks/usePlayers';
import { useResults } from '../hooks/useResults';
import { useCountdown } from '../hooks/useCountdown';
import SponsorSection from '../components/SponsorSection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Lock, Timer, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Results = () => {
  const { id } = useParams();
  const { data: matches } = useMatches();
  const match = matches?.find(m => m.id === id);
  
  const { data: players, isLoading: loadingPlayers } = usePlayers(id);
  const { data: results, isLoading: loadingResults } = useResults(id);
  
  const votingCloses = match ? new Date(match.voting_closes_at) : null;
  const countdown = useCountdown(votingCloses);
  const now = new Date();
  
  const isLocked = votingCloses && now < votingCloses;

  if (!match && matches) return <div className="p-8 text-center">Match not found.</div>;
  if (!match) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="rounded-xl bg-secondary/50">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5 opacity-40" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Fan Lineup</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter leading-none">
            {match.home_team} <span className="opacity-20 italic">vs</span> {match.away_team}
          </h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            {format(new Date(match.kickoff_time), 'EEEE, dd MMMM')}
          </p>
        </div>
      </header>

      <main className="px-6 space-y-12">
        {isLocked ? (
          <div className="py-20 text-center space-y-8">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-8 rounded-[2.5rem] relative">
                <Lock className="w-16 h-16 text-primary" />
                <div className="absolute -top-2 -right-2 bg-primary w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                  <Timer className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Results Locked</h3>
              <p className="text-muted-foreground text-sm font-medium max-w-[240px] mx-auto">
                Lineup percentages are revealed 1 hour before kickoff.
              </p>
            </div>
            {countdown && (
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-secondary/30 rounded-2xl border border-white/5">
                <div className="text-center">
                  <span className="block text-xl font-black tracking-tighter">{countdown.hours}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">Hrs</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="text-center">
                  <span className="block text-xl font-black tracking-tighter">{countdown.minutes}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">Min</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="text-center">
                  <span className="block text-xl font-black tracking-tighter">{countdown.seconds}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-30">Sec</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            <TeamResults 
              teamName={match.home_team} 
              players={players?.filter(p => p.team_name === match.home_team)} 
              results={results} 
              isLoading={loadingPlayers || loadingResults}
            />
            <TeamResults 
              teamName={match.away_team} 
              players={players?.filter(p => p.team_name === match.away_team)} 
              results={results} 
              isLoading={loadingPlayers || loadingResults}
            />
          </div>
        )}

        <SponsorSection />
      </main>
    </div>
  );
};

const TeamResults = ({ teamName, players, results, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
          {teamName.charAt(0)}
        </div>
        <h3 className="text-xl font-black tracking-tight">{teamName}</h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl bg-secondary/30" />
          ))
        ) : (
          players?.map(player => {
            const result = results?.find(r => r.player_id === player.id);
            const percentage = result ? Math.round(result.play_percentage) : 0;
            
            return (
              <div key={player.id} className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">{player.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{player.position}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-primary">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2 bg-secondary/50" indicatorClassName="bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Results;

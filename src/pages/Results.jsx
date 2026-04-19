import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { usePlayers } from '../hooks/usePlayers';
import { useResults } from '../hooks/useResults';
import { useCountdown } from '../hooks/useCountdown';
import MatchCard from '../components/MatchCard';
import SponsorSection from '../components/SponsorSection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Lock, Timer, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Results = () => {
  const { id } = useParams();
  const [showAway, setShowAway] = useState(false);
  const { data: matches } = useMatches();
  const match = matches?.find(m => m.id === id);
  
  const { data: players, isLoading: loadingPlayers } = usePlayers(match);
  const { data: results, isLoading: loadingResults } = useResults(id);
  
  const votingCloses = match ? new Date(match.voting_closes_at) : null;
  const countdown = useCountdown(match?.voting_closes_at);
  const now = new Date();
  
  // Results are locked until voting_closes_at (1hr before kickoff)
  const isLocked = votingCloses && now < votingCloses;

  if (!match && matches) return <div className="p-8 text-center glass m-6 rounded-3xl">Match not found.</div>;
  if (!match) return null;

  const currentTeam = showAway ? match.away_team : match.home_team;
  const filteredPlayers = players?.filter(p => p.team === currentTeam);

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-6 pt-16 pb-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl glass hover:bg-white/10">
            <Link to="/results">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
            <TrendingUp className="w-3.5 h-3.5 text-primary opacity-40" />
            <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] opacity-40">Final Lineup</span>
          </div>
        </div>

        <MatchCard match={match} hideButton={true} />

        {!isLocked && (
          <div className="flex items-center justify-between p-1 bg-slate-900/50 rounded-[2rem] border border-white/5">
            <button 
              onClick={() => setShowAway(false)}
              className={cn(
                "flex-1 py-3 px-4 rounded-[1.8rem] text-[10px] font-display font-black uppercase tracking-widest transition-all duration-500",
                !showAway ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-slate-500 hover:text-foreground"
              )}
            >
              {match.home_team}
            </button>
            <button 
              onClick={() => setShowAway(true)}
              className={cn(
                "flex-1 py-3 px-4 rounded-[1.8rem] text-[10px] font-display font-black uppercase tracking-widest transition-all duration-500",
                showAway ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-slate-500 hover:text-foreground"
              )}
            >
              {match.away_team}
            </button>
          </div>
        )}
      </header>

      <main className="px-6 space-y-16">
        {isLocked ? (
          <div className="py-24 text-center space-y-10 glass rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
            
            <div className="flex justify-center">
              <div className="bg-primary/10 p-10 rounded-[3rem] relative">
                <Lock className="w-16 h-16 text-primary" />
                <div className="absolute -top-2 -right-2 bg-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                  <Timer className="w-4 h-4 text-primary-foreground animate-spin-slow" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-3xl font-display font-black tracking-tight">RESULTS LOCKED</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-[240px] mx-auto leading-relaxed">
                Lineup percentages revealed <br /> 1 hour before kickoff
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            <TeamResults 
              teamName={currentTeam} 
              players={filteredPlayers} 
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
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-display font-black text-primary text-sm border border-primary/20">
          {teamName.charAt(0)}
        </div>
        <h3 className="text-2xl font-display font-black tracking-tight">{teamName.toUpperCase()}</h3>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-3xl bg-slate-800/30" />
          ))
        ) : (
          players?.map(player => {
            const result = results?.find(r => r.player_id === player.id);
            const percentage = result ? Math.round(result.play_percentage) : 0;
            
            return (
              <div key={player.id} className="glass p-6 rounded-[2.5rem] space-y-4 group hover:border-primary/30 transition-all duration-500">
                <div className="flex justify-between items-end px-2">
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight group-hover:text-primary transition-colors">{player.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{player.position}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-display font-black text-primary neon-text">{percentage}%</span>
                    <span className="text-[8px] font-display font-black uppercase tracking-widest text-primary/40">Play Vote</span>
                  </div>
                </div>
                <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                  <Progress value={percentage} className="h-full bg-primary" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Results;

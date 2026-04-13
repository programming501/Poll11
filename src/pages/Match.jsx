import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { usePlayers } from '../hooks/usePlayers';
import { useUserVotes, useCastVote } from '../hooks/useVotes';
import PlayerCard from '../components/PlayerCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trophy, Timer, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Match = () => {
  const { id } = useParams();
  const [showAway, setShowAway] = useState(false);
  
  const { data: matches } = useMatches();
  const match = matches?.find(m => m.id === id);
  
  const { data: players, isLoading: loadingPlayers } = usePlayers(id);
  const { data: userVotes } = useUserVotes(id);
  const castVote = useCastVote();

  if (!match && matches) return <div className="p-8 text-center glass m-6 rounded-3xl">Match not found.</div>;
  if (!match) return null;

  const kickoff = new Date(match.match_date);
  const votingCloses = new Date(match.voting_closes_at);
  const now = new Date();
  
  // Locked: > 3hrs to kickoff
  const isLocked = now < new Date(kickoff.getTime() - 3 * 60 * 60 * 1000);
  // Closed: < 1hr before kickoff (voting_closes_at is 1hr before)
  const isClosed = now >= votingCloses;

  const currentTeam = showAway ? match.away_team : match.home_team;
  const filteredPlayers = players?.filter(p => p.team === currentTeam);

  const handleVote = (playerId, voteType) => {
    if (isClosed) return;
    castVote.mutate({ matchId: id, playerId, voteType });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-6 pt-12 pb-8 space-y-8 sticky top-0 bg-background/80 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="rounded-2xl glass hover:bg-white/10">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border",
            isClosed 
              ? "bg-destructive/10 border-destructive/20" 
              : "bg-primary/10 border-primary/20"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isClosed ? "bg-destructive" : "bg-primary animate-pulse"
            )} />
            <span className={cn(
              "text-[10px] font-display font-black uppercase tracking-[0.2em]",
              isClosed ? "text-destructive" : "text-primary"
            )}>
              {isClosed ? "Voting Closed" : "Voting Live"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-display font-black tracking-tighter leading-none">
              {match.home_team} <span className="text-primary italic mx-1">v</span> {match.away_team}
            </h1>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            {format(kickoff, 'EEEE, dd MMMM')}
          </p>
        </div>

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
      </header>

      <main className="px-6 mt-8 space-y-6">
        {isLocked ? (
          <div className="py-24 text-center space-y-6 glass rounded-[3rem] mx-2">
            <div className="flex justify-center">
              <div className="bg-slate-800/50 p-8 rounded-[2.5rem] relative">
                <Lock className="w-12 h-12 text-slate-500" />
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-black tracking-tight">VOTING LOCKED</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                Voting starts 3 hours before kickoff
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 px-2">
              <span className="text-[10px] font-display font-black uppercase tracking-[0.3em] opacity-20">SELECT STARTING XI</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid gap-4">
              {isClosed && (
                <div className="p-6 glass rounded-[2rem] border-destructive/20 bg-destructive/5 text-center space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-destructive">Voting has ended for this match</p>
                  <Button asChild className="w-full rounded-2xl bg-primary text-primary-foreground">
                    <Link to={`/results/${id}`}>View Final Results</Link>
                  </Button>
                </div>
              )}
              {loadingPlayers ? (
                Array.from({ length: 11 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-3xl bg-secondary/30" />
                ))
              ) : (
                filteredPlayers?.map(player => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    userVote={userVotes?.find(v => v.player_id === player.id)}
                    onVote={(type) => handleVote(player.id, type)}
                    disabled={isClosed}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Match;

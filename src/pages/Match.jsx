import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { usePlayers } from '../hooks/usePlayers';
import { useUserVotes, useCastVote } from '../hooks/useVotes';
import PlayerCard from '../components/PlayerCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Match = () => {
  const { id } = useParams();
  const [showAway, setShowAway] = useState(false);
  
  // 1. Fetch matches and get loading state
  const { data: matches, isLoading: isLoadingMatches } = useMatches();
  
  // 2. Find the specific match
  const match = matches?.find(m => m.id === id);
  
  // 3. Pass match safely to hooks
  const { data: players, isLoading: loadingPlayers } = usePlayers(match);
  const { data: userVotes } = useUserVotes(id);
  const castVote = useCastVote();

  // --- SAFETY GUARDS ---

  // Handle Initial Loading State
  if (isLoadingMatches) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin opacity-20" />
      </div>
    );
  }

  // Handle Match Not Found (Prevents crash on undefined)
  if (!match) {
    return (
      <div className="min-h-screen bg-background p-8 text-center flex flex-col items-center justify-center space-y-4">
        <div className="glass p-12 rounded-[3rem] border border-white/5">
          <h2 className="text-white font-display font-black text-2xl tracking-tighter">MATCH NOT FOUND</h2>
          <Button asChild variant="link" className="text-primary uppercase tracking-widest text-[10px] mt-4">
            <Link to="/">Back to Fixtures</Link>
          </Button>
        </div>
      </div>
    );
  }

  // --- DATA IS SAFE NOW ---

  const kickoff = new Date(match.match_date);
  const votingCloses = new Date(match.voting_closes_at);
  const now = new Date();
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
          <Button variant="ghost" size="icon" asChild className="rounded-2xl glass hover:bg-white/10 text-white">
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
          <h1 className="text-4xl font-display font-black tracking-tighter leading-none text-white uppercase">
            {match.home_team} <span className="text-primary italic mx-1">v</span> {match.away_team}
          </h1>
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
        <div className="flex items-center gap-4 px-2">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.3em] opacity-20 text-white">
            SELECT STARTING XI
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="grid gap-4">
          {isClosed && (
            <div className="p-6 glass rounded-[2rem] border-destructive/20 bg-destructive/5 text-center space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-destructive">Voting has ended</p>
              <Button asChild className="w-full rounded-2xl bg-primary text-primary-foreground">
                <Link to={`/results/${id}`}>View Final Results</Link>
              </Button>
            </div>
          )}
          
          {loadingPlayers ? (
            Array.from({ length: 8 }).map((_, i) => (
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
      </main>
    </div>
  );
};

export default Match;
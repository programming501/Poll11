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

  if (!match && matches) return <div className="p-8 text-center">Match not found.</div>;
  if (!match) return null;

  const kickoff = new Date(match.kickoff_time);
  const votingCloses = new Date(match.voting_closes_at);
  const now = new Date();
  
  const isLocked = now < new Date(kickoff.getTime() - 3 * 60 * 60 * 1000);
  const isClosed = now >= votingCloses;

  if (isClosed) {
    return <Navigate to={`/results/${id}`} replace />;
  }

  const currentTeam = showAway ? match.away_team : match.home_team;
  const filteredPlayers = players?.filter(p => p.team_name === currentTeam);

  const handleVote = (playerId, voteType) => {
    castVote.mutate({ matchId: id, playerId, voteType });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="rounded-xl bg-secondary/50">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Timer className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Voting Live</span>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter leading-none">
            {match.home_team} <span className="opacity-20 italic">vs</span> {match.away_team}
          </h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            {format(kickoff, 'EEEE, dd MMMM')}
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Viewing Team</span>
            <span className="font-black text-lg tracking-tight">{currentTeam}</span>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="team-toggle" className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              {showAway ? 'Away' : 'Home'}
            </Label>
            <Switch 
              id="team-toggle" 
              checked={showAway} 
              onCheckedChange={setShowAway}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </header>

      <main className="px-6 space-y-4">
        {isLocked ? (
          <div className="py-20 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-secondary/50 p-6 rounded-full">
                <Lock className="w-12 h-12 opacity-20" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight">Voting Locked</h3>
              <p className="text-muted-foreground text-sm font-medium">Voting starts 3 hours before kickoff.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">Squad List</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="space-y-3">
              {loadingPlayers ? (
                Array.from({ length: 11 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl bg-secondary/30" />
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

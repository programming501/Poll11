import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { usePlayers } from '../hooks/usePlayers';
import { useVotes, useUserVotes, useCastVote } from '../hooks/useVotes';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, ArrowLeft, Timer, TrendingUp, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: matches } = useMatches();
  const match = matches?.find((m) => m.id === id);
  
  const [activeTeam, setActiveTeam] = useState('home');
  
  const { data: homePlayers, isLoading: loadingHome } = usePlayers(match?.home_team);
  const { data: awayPlayers, isLoading: loadingAway } = usePlayers(match?.away_team);
  const { data: voteCounts } = useVotes(id);
  const { data: userVotes } = useUserVotes(id);
  const castVote = useCastVote();

  if (!match) return <div className="p-8 text-center">Match not found.</div>;

  const isVotingClosed = match.voting_closes_at ? new Date() > new Date(match.voting_closes_at) : false;
  const isResultsPublished = match.results_published || match.status === 'finished';

  const handleVote = async (playerId, voteType) => {
    if (isVotingClosed) {
      toast.error('Voting is closed for this match');
      return;
    }
    
    try {
      await castVote.mutateAsync({ matchId: id, playerId, voteType });
      toast.success(`Voted ${voteType}!`, {
        className: 'bg-primary text-primary-foreground border-primary/20 neon-glow',
      });
    } catch (error) {
      // Handle both demo error and Supabase unique constraint error (23505)
      if (error.message === 'ALREADY_VOTED' || error.code === '23505') {
        toast.error('You have already voted for this player', {
          className: 'bg-destructive text-white border-destructive/20 shadow-lg font-bold',
        });
      } else {
        toast.error('Failed to cast vote. Try again.', {
          className: 'bg-destructive text-white border-destructive/20 shadow-lg font-bold',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <header className="flex items-center gap-3 mb-8 pt-6">
          <Button variant="ghost" size="icon" asChild className="rounded-xl border border-white/5 hover:bg-white/5 h-10 w-10">
            <Link to="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight font-display">Match Lineup</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary font-mono uppercase tracking-[0.2em]">
                {format(new Date(match.match_date), 'MMM d, HH:mm')}
              </span>
              {isVotingClosed && (
                <Badge variant="destructive" className="text-[8px] uppercase tracking-widest h-4 px-1.5 bg-destructive/20 text-destructive border-destructive/30">
                  Voting Closed
                </Badge>
              )}
            </div>
          </div>
        </header>

        <div className="match-moment-gradient p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 sm:gap-8 relative z-10">
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/5 flex items-center justify-center font-bold text-xl sm:text-3xl border border-white/10 shadow-2xl">
                {match.home_team.charAt(0)}
              </div>
              <span className="text-sm sm:text-lg font-bold text-center font-display line-clamp-1">{match.home_team}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">VS</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/5 flex items-center justify-center font-bold text-xl sm:text-3xl border border-white/10 shadow-2xl">
                {match.away_team.charAt(0)}
              </div>
              <span className="text-sm sm:text-lg font-bold text-center font-display line-clamp-1">{match.away_team}</span>
            </div>
          </div>
          
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-6">
          <button
            onClick={() => setActiveTeam('home')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all font-display",
              activeTeam === 'home' ? "bg-primary text-primary-foreground shadow-lg" : "text-white/40 hover:text-white/60"
            )}
          >
            {match.home_team}
          </button>
          <button
            onClick={() => setActiveTeam('away')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all font-display",
              activeTeam === 'away' ? "bg-primary text-primary-foreground shadow-lg" : "text-white/40 hover:text-white/60"
            )}
          >
            {match.away_team}
          </button>
        </div>

        <PlayerList 
          players={activeTeam === 'home' ? homePlayers : awayPlayers} 
          isLoading={activeTeam === 'home' ? loadingHome : loadingAway} 
          voteCounts={voteCounts} 
          userVotes={userVotes}
          onVote={handleVote}
          isVotingClosed={isVotingClosed}
          isResultsPublished={isResultsPublished}
        />
      </div>
    </div>
  );
};

const PlayerList = ({ players, isLoading, voteCounts, userVotes, onVote, isVotingClosed, isResultsPublished }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-card/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players?.map((player) => {
        const counts = voteCounts?.find((c) => c.player_id === player.id);
        const userVote = userVotes?.find((v) => v.player_id === player.id);

        const total = (counts?.play_count || 0) + (counts?.bench_count || 0);
        const playPercent = total > 0 ? Math.round((counts?.play_count || 0) / total * 100) : 50;

        return (
          <div key={player.id} className={cn(
            "glass p-3 sm:p-4 rounded-2xl border-white/5 transition-all group",
            isVotingClosed ? "opacity-80" : "hover:border-white/10"
          )}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center font-bold text-[10px] border border-white/10 group-hover:border-primary/20 transition-colors">
                  {player.position}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-sm sm:text-base font-display truncate">{player.name}</span>
                  {isResultsPublished && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary neon-glow" 
                          style={{ width: `${playPercent}%` }} 
                        />
                      </div>
                      <span className="text-[9px] text-primary font-bold font-mono whitespace-nowrap">{playPercent}% Play</span>
                    </div>
                  )}
                </div>
              </div>

              {!isResultsPublished && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button 
                    size="sm" 
                    disabled={isVotingClosed}
                    variant={userVote?.vote_type === 'play' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 px-2.5 sm:px-3 gap-1.5 rounded-lg transition-all",
                      userVote?.vote_type === 'play' 
                        ? "bg-primary text-primary-foreground neon-glow" 
                        : "border-white/10 hover:bg-white/5 text-white/60",
                      isVotingClosed && userVote?.vote_type !== 'play' && "opacity-50 grayscale"
                    )}
                    onClick={() => onVote(player.id, 'play')}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Play</span>
                  </Button>
                  <Button 
                    size="sm" 
                    disabled={isVotingClosed}
                    variant={userVote?.vote_type === 'bench' ? 'default' : 'outline'}
                    className={cn(
                      "h-9 px-2.5 sm:px-3 gap-1.5 rounded-lg transition-all",
                      userVote?.vote_type === 'bench' 
                        ? "bg-destructive text-destructive-foreground shadow-[0_0_15px_rgba(255,68,68,0.2)]" 
                        : "border-white/10 hover:bg-white/5 text-white/60",
                      isVotingClosed && userVote?.vote_type !== 'bench' && "opacity-50 grayscale"
                    )}
                    onClick={() => onVote(player.id, 'bench')}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Bench</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchDetails;

import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { useCountdown } from '../hooks/useCountdown';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const MatchCard = ({ match }) => {
  const kickoff = new Date(match.kickoff_time);
  const votingCloses = new Date(match.voting_closes_at);
  const now = new Date();
  
  const countdown = useCountdown(votingCloses);
  
  const isLocked = now < new Date(kickoff.getTime() - 3 * 60 * 60 * 1000);
  const isClosed = now >= votingCloses;
  const isLive = !isLocked && !isClosed;

  return (
    <Card className="overflow-hidden border-none bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 rounded-3xl group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Premier League</span>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono text-[10px]">
            {format(kickoff, 'dd MMM, HH:mm', { locale: enIN })}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center text-2xl font-black shadow-inner">
              {match.home_team.charAt(0)}
            </div>
            <span className="text-sm font-bold text-center line-clamp-1">{match.home_team}</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black opacity-20 italic">VS</span>
          </div>

          <div className="flex flex-col items-center gap-3 flex-1">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center text-2xl font-black shadow-inner">
              {match.away_team.charAt(0)}
            </div>
            <span className="text-sm font-bold text-center line-clamp-1">{match.away_team}</span>
          </div>
        </div>

        <div className="space-y-4">
          {isLive && countdown && (
            <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-bold font-mono">
                {countdown.hours}h {countdown.minutes}m {countdown.seconds}s left
              </span>
            </div>
          )}

          {isLocked && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Starts 3h before kickoff</span>
            </div>
          )}

          <Button 
            asChild 
            className={cn(
              "w-full h-12 rounded-2xl font-bold transition-all active:scale-[0.98]",
              isClosed ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            )}
            disabled={isLocked}
          >
            {isClosed ? (
              <Link to={`/results/${match.id}`}>View Results</Link>
            ) : isLocked ? (
              <span>Locked</span>
            ) : (
              <Link to={`/match/${match.id}`}>Vote Now</Link>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;

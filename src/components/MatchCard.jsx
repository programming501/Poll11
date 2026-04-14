import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { useCountdown } from '../hooks/useCountdown';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const MatchCard = ({ match, hideButton = false }) => {
  const kickoff = new Date(match.match_date);
  const votingCloses = new Date(match.voting_closes_at);
  const now = new Date();
  
  const countdown = useCountdown(match.voting_closes_at);
  
  // Logic simplified: Only check if voting has ended (kickoff approaching)
  const isClosed = now >= votingCloses;

  return (
    <Card className="vibe-card group">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
              
            </div>
            <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] opacity-40">Premier League</span>
          </div>
          <Badge variant="outline" className="border-white/10 text-foreground bg-white/5 font-mono text-[10px] px-3 py-1 rounded-full">
            {format(kickoff, 'dd MMM, HH:mm', { locale: enIN })}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-6 mb-10">
          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-800/50 flex items-center justify-center text-3xl font-display font-black shadow-inner border border-white/5 group-hover:border-primary/30 transition-colors text-white">
              {match.home_team.charAt(0)}
            </div>
            <span className="text-sm font-bold text-center line-clamp-1 tracking-tight text-white">{match.home_team}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-display font-black opacity-20 italic my-2 text-white">VS</span>
            <div className="w-px h-8 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
          </div>

          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-800/50 flex items-center justify-center text-3xl font-display font-black shadow-inner border border-white/5 group-hover:border-primary/30 transition-colors text-white">
              {match.away_team.charAt(0)}
            </div>
            <span className="text-sm font-bold text-center line-clamp-1 tracking-tight text-white">{match.away_team}</span>
          </div>
        </div>

        {!hideButton && (
          <div className="space-y-6">
            {/* Lock UI removed to unlock all future matches */}
            
            <Button 
              asChild 
              className={cn(
                "w-full h-14 rounded-[1.8rem] font-display font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98]",
                isClosed 
                  ? "bg-slate-800 text-foreground hover:bg-white/10 border border-white/5" 
                  : "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/40"
              )}
            >
              {isClosed ? (
                <Link to={`/results/${match.id}`}>View Results</Link>
              ) : (
                <Link to={`/match/${match.id}`}>Vote Now</Link>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
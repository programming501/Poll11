import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

const PlayerCard = ({ player, userVote, onVote, disabled }) => {
  const hasVoted = !!userVote;
  const isPlay = userVote?.vote_type === 'play';
  const isBench = userVote?.vote_type === 'bench';

  return (
    <div className={cn(
      "relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-[2rem] border transition-all duration-500 group gap-4 sm:gap-2",
      hasVoted ? "bg-primary/10 border-primary/20" : "glass hover:bg-white/5 border-white/10"
    )}>
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-background flex items-center justify-center text-[9px] sm:text-[10px] font-display font-black opacity-40 border border-white/5 group-hover:border-primary/30 transition-colors">
            <span>{player.position?.substring(0, 3) || 'N/A'}</span>
          </div>
          {hasVoted && (
            <div className={cn(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-lg",
              isPlay ? "bg-primary" : "bg-destructive"
            )}>
              {isPlay ? <UserCheck className="w-2.5 h-2.5 text-primary-foreground" /> : <UserX className="w-2.5 h-2.5 text-destructive-foreground" />}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className={cn(
            "font-bold text-base sm:text-lg tracking-tight transition-colors truncate",
            hasVoted ? "text-primary/70" : "text-foreground"
          )}>
            {player.name}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 truncate">
            {player.team_name || player.team}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        {!hasVoted ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none h-10 sm:h-11 px-3 sm:px-5 gap-2 rounded-2xl border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-display font-black uppercase tracking-widest text-[9px] sm:text-[10px]"
              onClick={() => onVote('play')}
              disabled={disabled}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Play
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none h-10 sm:h-11 px-3 sm:px-5 gap-2 rounded-2xl border-white/10 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300 font-display font-black uppercase tracking-widest text-[9px] sm:text-[10px]"
              onClick={() => onVote('bench')}
              disabled={disabled}
            >
              <UserX className="w-3.5 h-3.5" />
              Bench
            </Button>
          </>
        ) : (
          <div className="w-full sm:w-auto flex justify-center sm:justify-end px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
            <span className="text-[8px] font-display font-black uppercase tracking-[0.2em] text-primary opacity-70 italic">Vote Finalized</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;

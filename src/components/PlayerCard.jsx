import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

const PlayerCard = ({ player, userVote, onVote, disabled }) => {
  const hasVoted = !!userVote;
  const isPlay = userVote?.vote_type === 'play';
  const isBench = userVote?.vote_type === 'bench';

  return (
    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-white/5 group transition-all duration-300 hover:bg-secondary/40">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-[10px] font-black opacity-40 border border-white/5">
          {player.position}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight">{player.name}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{player.team_name}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isPlay ? "default" : "outline"}
          className={cn(
            "h-9 px-3 gap-2 rounded-xl transition-all duration-300",
            isPlay ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-white/10 opacity-60 hover:opacity-100",
            hasVoted && !isPlay && "opacity-20 grayscale pointer-events-none"
          )}
          onClick={() => onVote('play')}
          disabled={disabled || hasVoted}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Play</span>
        </Button>

        <Button
          size="sm"
          variant={isBench ? "destructive" : "outline"}
          className={cn(
            "h-9 px-3 gap-2 rounded-xl transition-all duration-300",
            isBench ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20" : "border-white/10 opacity-60 hover:opacity-100",
            hasVoted && !isBench && "opacity-20 grayscale pointer-events-none"
          )}
          onClick={() => onVote('bench')}
          disabled={disabled || hasVoted}
        >
          <UserX className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bench</span>
        </Button>
      </div>
    </div>
  );
};

export default PlayerCard;

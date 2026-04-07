import React from 'react';
import { Link } from 'react-router-dom';
import { useMatches } from '../hooks/useMatches';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Home = () => {
  const { data: matches, isLoading } = useMatches();
  const { user, signOut } = useAuth();

  const upcomingMatches = matches?.filter(m => m.status !== 'finished' && !m.results_published);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {!import.meta.env.VITE_SUPABASE_URL && (
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Demo Mode: Connect Supabase in Secrets to enable real-time voting
          </p>
        </div>
      )}
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <header className="flex items-center justify-between mb-12 pt-8 sticky top-0 z-50 glass rounded-2xl px-6 py-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl neon-glow">
              <Trophy className="text-primary-foreground w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display">FootPoll</h1>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback className="bg-accent text-accent-foreground">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10">
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </header>

        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-semibold flex items-center gap-3 font-display">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Matches
            </h2>
          </div>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-3xl bg-card/50" />
            ))
          ) : upcomingMatches?.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
              <p className="text-muted-foreground font-medium">No upcoming matches found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcomingMatches?.map((match) => (
                <Link key={match.id} to={`/match/${match.id}`} className="block group">
                  <div className="match-moment-gradient p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      {match.status === 'live' ? (
                        <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-destructive/20">
                          <span className="pulse-live" />
                          Live
                        </div>
                      ) : (
                        <Badge variant="secondary" className="bg-white/5 text-white/60 border-white/10 text-[10px] font-mono">
                          {format(new Date(match.kickoff_time), 'MMM d, HH:mm')}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:gap-8 mt-4">
                      <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xl sm:text-2xl border border-white/10 group-hover:border-primary/20 transition-colors">
                          {match.home_team.charAt(0)}
                        </div>
                        <span className="text-sm sm:text-base font-bold text-center font-display group-hover:text-primary transition-colors line-clamp-1">{match.home_team}</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-px w-6 sm:w-8 bg-white/10" />
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">VS</span>
                        <div className="h-px w-6 sm:w-8 bg-white/10" />
                      </div>

                      <div className="flex flex-col items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xl sm:text-2xl border border-white/10 group-hover:border-primary/20 transition-colors">
                          {match.away_team.charAt(0)}
                        </div>
                        <span className="text-sm sm:text-base font-bold text-center font-display group-hover:text-primary transition-colors line-clamp-1">{match.away_team}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-white/40 group-hover:text-primary/60 transition-colors">
                      <span>Decide the lineup</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

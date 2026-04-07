import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Trophy, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '../lib/utils';

const Profile = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <Trophy className="w-16 h-16 text-primary mb-6 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2 font-display">Sign in to see your profile</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-xs">
          Join the community to track your votes and see how your lineups perform.
        </p>
        <Button asChild className="bg-primary text-primary-foreground neon-glow px-8 rounded-xl">
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        <header className="flex items-center gap-4 mb-12 pt-8">
          <Button variant="ghost" size="icon" asChild className="rounded-xl border border-white/5 hover:bg-white/5">
            <Link to="/">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight font-display">My Profile</h1>
        </header>

        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <Avatar className="h-24 w-24 border-2 border-primary/50 relative z-10">
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl font-bold font-display mb-1">{user.user_metadata.full_name || 'Football Fan'}</h2>
          <p className="text-muted-foreground text-sm font-mono">{user.email}</p>
        </div>

        <div className="grid gap-4 mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <span className="text-2xl font-bold text-primary block mb-1">24</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Votes Cast</span>
            </div>
            <div className="glass p-6 rounded-3xl border-white/5 text-center">
              <span className="text-2xl font-bold text-secondary block mb-1">85%</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Accuracy</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 ml-4 mb-4">Account Settings</h3>
          
          <Button variant="ghost" className="w-full justify-between h-16 px-6 rounded-2xl glass border-white/5 hover:bg-white/5 group">
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                <User className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <span className="font-bold font-display">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
          </Button>

          <Button variant="ghost" className="w-full justify-between h-16 px-6 rounded-2xl glass border-white/5 hover:bg-white/5 group">
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                <Settings className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <span className="font-bold font-display">Preferences</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
          </Button>

          <Button 
            variant="ghost" 
            onClick={signOut}
            className="w-full justify-between h-16 px-6 rounded-2xl glass border-white/5 hover:bg-destructive/10 group mt-8"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-2 rounded-xl group-hover:bg-destructive/20 transition-colors">
                <LogOut className="w-5 h-5 text-white/40 group-hover:text-destructive transition-colors" />
              </div>
              <span className="font-bold font-display group-hover:text-destructive transition-colors">Sign Out</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

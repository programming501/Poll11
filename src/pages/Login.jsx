import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithMagicLink, signInAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithMagicLink(email);
      if (error) throw error;
      toast.success('Magic link sent! Check your email.');
    } catch (error) {
      toast.error(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    signInAsGuest();
    navigate('/');
    toast.success('Logged in as Guest');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-12">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="bg-primary p-4 rounded-[2rem] shadow-2xl shadow-primary/40 animate-in zoom-in duration-1000">
            <Trophy className="text-primary-foreground w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-black tracking-tighter leading-none neon-text">
              POLL 11
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              The Voice of the Game
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="vibe-card p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-black tracking-tight">WELCOME BACK</h2>
            <p className="text-slate-400 text-sm font-medium">Enter your email to receive a magic link</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 rounded-2xl bg-slate-900/50 border-white/5 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-display font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
              <span className="bg-slate-900 px-4 text-slate-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGuestLogin}
            className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-display font-black uppercase tracking-widest text-xs transition-all"
          >
            Guest Access
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;

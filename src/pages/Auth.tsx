import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trophy, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase is not configured.');
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success('Check your email for the login link!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground selection:bg-primary/30">
        <div className="w-full max-w-md">
          <Card className="border-white/5 glass shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="space-y-4 text-center pt-12 pb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/20 p-4 rounded-2xl neon-glow border border-primary/30">
                  <CheckCircle2 className="text-primary w-10 h-10" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight font-display">
                Check your email
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium px-4">
                We sent a login link to <span className="text-white font-bold">{email}</span>. Click the link in the email to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-12">
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold transition-all"
                onClick={() => setSubmitted(false)}
              >
                Try a different email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground selection:bg-primary/30">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" asChild className="mb-8 gap-2 rounded-xl border border-white/5 hover:bg-white/5">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </Link>
        </Button>

        <Card className="border-white/5 glass shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-12 pb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary p-4 rounded-2xl neon-glow">
                <Trophy className="text-primary-foreground w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold tracking-tight font-display">
              FootPoll
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-lg">
              Vote for your team's starting XI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-12">
            <form onSubmit={handleMagicLink} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-white/20" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-11 h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl font-bold text-lg bg-primary text-primary-foreground neon-glow hover:translate-y-[-1px] active:translate-y-[0] transition-all" 
                disabled={loading}
              >
                {loading ? 'Sending link...' : 'Send login link'}
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground px-4">
              By continuing, you agree to receive a one-time login link via email.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

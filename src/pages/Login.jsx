import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trophy, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'sent'

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Supabase is not configured.');
      return;
    }
    
    setStatus('loading');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setStatus('sent');
      toast.success('Check your email for the login link!');
    } catch (error) {
      toast.error(error.message);
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent text-center">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <CheckCircle2 className="text-primary w-12 h-12" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-lg">
              We sent a login link to <span className="font-bold text-foreground">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="link" 
              className="text-muted-foreground"
              onClick={() => setStatus('idle')}
            >
              Try a different email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Trophy className="text-primary-foreground w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Poll 11</h1>
          <p className="text-muted-foreground font-medium">Vote for your team's starting XI</p>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest opacity-50">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 opacity-20" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-12 bg-secondary/50 border-none rounded-xl focus-visible:ring-primary/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={status === 'loading'}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold text-base transition-all active:scale-[0.98]" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send login link'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

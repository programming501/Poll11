import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

const GUEST_USER = { id: 'demo-user', email: 'guest@example.com' };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setUser(GUEST_USER);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? GUEST_USER);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? GUEST_USER);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      setUser(null);
    }
  };

  const signInAsGuest = () => {
    setUser({ id: 'demo-user', email: 'guest@example.com' });
  };

  const signInWithMagicLink = async (email) => {
    if (!supabase) {
      setUser(GUEST_USER);
      return { error: null };
    }
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInAsGuest, signInWithMagicLink, isDemo: !supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import MatchDetails from './pages/MatchDetails';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Results from './pages/Results';
import { Home as HomeIcon, Trophy, User, Search, CheckCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

const BottomNav = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  
  if (!user || pathname === '/auth') return null;

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md glass border-white/10 rounded-[2rem] p-2 flex items-center justify-between z-50 neon-glow">
      <NavLink to="/" className={({ isActive }) => cn(
        "flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all gap-1",
        isActive ? "bg-primary text-primary-foreground" : "text-white/40 hover:text-white/60"
      )}>
        <HomeIcon className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
      </NavLink>
      <NavLink to="/results" className={({ isActive }) => cn(
        "flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all gap-1",
        isActive ? "bg-primary text-primary-foreground" : "text-white/40 hover:text-white/60"
      )}>
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Results</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => cn(
        "flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all gap-1",
        isActive ? "bg-primary text-primary-foreground" : "text-white/40 hover:text-white/60"
      )}>
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
      </NavLink>
    </nav>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground font-sans pb-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/results" element={<Results />} />
            </Routes>
            <BottomNav />
          </div>
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: 'glass border-white/10 text-white rounded-2xl shadow-2xl',
              style: {
                background: 'rgba(23, 23, 23, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

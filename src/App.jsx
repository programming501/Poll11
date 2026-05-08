import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import InstallBanner from './components/InstallBanner';
import Home from './pages/Home';
import Match from './pages/Match';
import Results from './pages/Results';
import ResultsList from './pages/ResultsList';
import LeagueMatches from './pages/LeagueMatches';
import Login from './pages/Login';
import DailyPoll from './pages/DailyPoll';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home as HomeIcon, Trophy, CalendarDays } from 'lucide-react';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

/** @param {{ children: React.ReactNode }} props */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const BottomNav = () => {
  const location = useLocation();
  
  if (location.pathname === '/login') return null;

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: CalendarDays, label: 'Daily Poll', path: '/daily-poll' },
    { icon: Trophy, label: 'Results', path: '/results' },
  ];

  return (



<nav className="fixed inset-x-4 bottom-4 z-50 rounded-[2rem] border-2 border-white/15 bg-slate-950/95 px-4 py-3 shadow-[0_26px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-3xl ring-1 ring-white/10 sm:bottom-5">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[1.75rem] px-3 py-3 transition-all duration-300",
                isActive
                  ? "bg-slate-900/95 text-primary shadow-[0_18px_50px_rgba(57,255,20,0.16)]"
                  : "text-slate-400 hover:text-foreground hover:bg-slate-900/70"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_12px_rgba(57,255,20,0.65)]")} />
              <span className="text-[9px] font-display font-black uppercase tracking-[0.2em] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const GuestSignupBanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  if (!isGuest || location.pathname === '/login') return null;

  return (
    <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-6xl mx-auto flex justify-end px-6 py-3">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="inline-flex items-center justify-center rounded-[1.75rem] border border-primary/20 bg-gradient-to-r from-primary to-cyan-500 px-5 py-3 text-sm font-display font-black uppercase tracking-[0.22em] text-primary-foreground shadow-[0_20px_60px_-30px_rgba(59,185,255,0.8)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_80px_-32px_rgba(59,185,255,0.9)] focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen pb-28 bg-background text-foreground font-sans selection:bg-primary/30">
            <GuestSignupBanner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/league" element={<LeagueMatches />} />
              <Route path="/daily-poll" element={<DailyPoll />} />
              <Route path="/match/:id" element={<ProtectedRoute><Match /></ProtectedRoute>} />
              <Route path="/results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><ResultsList /></ProtectedRoute>} />
            </Routes>
            <footer className="border-t border-white/10 bg-slate-950/70 text-center px-6 py-4 text-[11px] text-slate-400 backdrop-blur-xl">
              © 2026 Poll11. Independent fan platform not affiliated with any football club, league, or governing body. All information is factual public data.
            </footer>
            <BottomNav />
            <Toaster position="top-center" expand={false} richColors closeButton />
            <InstallBanner />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

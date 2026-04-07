import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import MatchDetails from './pages/MatchDetails';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Results from './pages/Results';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home as HomeIcon, User, Trophy, Layout } from 'lucide-react';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide bottom nav on auth page
  if (location.pathname === '/auth') return null;
  
  // Hide bottom nav for unauthenticated users
  if (!user) return null;

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: Trophy, label: 'Results', path: '/results' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-3 z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative group",
                isActive ? "text-primary" : "text-white/40 hover:text-white/60"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/10 neon-glow" : "group-hover:bg-white/5"
              )}>
                <item.icon className={cn("w-5 h-5", isActive && "animate-pulse-subtle")} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full neon-glow" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/match/:id" element={<MatchDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/results" element={<Results />} />
            </Routes>
            <BottomNav />
            <Toaster position="top-center" expand={false} richColors closeButton />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

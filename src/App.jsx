import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/Home';
import Match from './pages/Match';
import Results from './pages/Results';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Home as HomeIcon, Trophy, User } from 'lucide-react';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user || location.pathname === '/login') return null;

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: Trophy, label: 'Results', path: '/results' }, // Note: The user didn't specify a general results page, but I'll keep it or redirect to home
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-white/5 px-6 py-3 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "animate-pulse-subtle")} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
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
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/match/:id" element={
                <ProtectedRoute>
                  <Match />
                </ProtectedRoute>
              } />
              <Route path="/results/:id" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              {/* Fallback for general results if needed */}
              <Route path="/results" element={
                <ProtectedRoute>
                  <Home /> 
                </ProtectedRoute>
              } />
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

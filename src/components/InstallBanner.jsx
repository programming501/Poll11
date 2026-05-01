import { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share } from 'lucide-react';

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export default function InstallBanner() {
  const { isInstallable, isInstalled, triggerInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const ios = isIOS();
  const installed = isInstalled || isInStandaloneMode();

  // Show iOS banner if on iOS, not installed, not dismissed
  useEffect(() => {
    if (ios && !installed && !dismissed) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setShowIOSGuide(true), 3000);
      return () => clearTimeout(t);
    }
  }, [ios, installed, dismissed]);

  if (installed || dismissed) return null;

  // Android / Chrome — native install prompt
  if (isInstallable) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-900 border border-primary/30 rounded-3xl p-4 flex items-center gap-4 shadow-2xl shadow-black/50">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <img src="/image.png" alt="Poll11" className="w-8 h-8 rounded-xl object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold leading-tight">Add Poll11 to Home Screen</p>
            <p className="text-slate-500 text-xs mt-0.5">Get the full app experience</p>
          </div>
          <button
            onClick={triggerInstall}
            className="flex items-center gap-1.5 bg-primary text-black text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-2xl flex-shrink-0 hover:bg-primary/90 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button onClick={() => setDismissed(true)} className="text-slate-600 hover:text-slate-400 -ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari — manual instruction
  if (showIOSGuide) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-900 border border-primary/30 rounded-3xl p-5 shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between mb-3">
            <p className="text-white text-sm font-bold">Add to Home Screen</p>
            <button onClick={() => setDismissed(true)} className="text-slate-600 hover:text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">1</div>
              <p className="text-slate-400 text-xs">Tap the <Share className="w-3 h-3 inline mx-0.5" /> Share button at the bottom of Safari</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">2</div>
              <p className="text-slate-400 text-xs">Scroll down and tap <span className="text-white font-bold">Add to Home Screen</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black flex-shrink-0">3</div>
              <p className="text-slate-400 text-xs">Tap <span className="text-white font-bold">Add</span> — Poll11 will appear on your home screen</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
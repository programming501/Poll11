import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Capture the install prompt before browser shows it
    const handler = (e) => {
      e.preventDefault(); // Stop browser showing its own prompt
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    }
  };

  return { isInstallable, isInstalled, triggerInstall };
}
import React, { useState, useEffect } from 'react';
import { WifiIcon, WifiSlashIcon } from './Icons';

const ConnectivityIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const handleOnline = () => {
      setIsOnline(true);
      setShowSyncPrompt(true);
      // Hide the prompt after a few seconds
      timeoutId = window.setTimeout(() => setShowSyncPrompt(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncPrompt(false); // Ensure prompt is hidden when going offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (showSyncPrompt) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 animate-pulse">
        <WifiIcon className="h-4 w-4" />
        <span className="text-xs font-medium">Back online. Sync data when ready.</span>
      </div>
    );
  }

  if (isOnline) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
        <WifiIcon className="h-4 w-4" />
        <span className="text-xs font-medium">Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300" title="Changes are being saved locally and will sync when you're back online.">
      <WifiSlashIcon className="h-4 w-4" />
      <span className="text-xs font-medium">Offline</span>
    </div>
  );
};

export default ConnectivityIndicator;

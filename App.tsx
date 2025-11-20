
import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import { User } from './types';
import { USERS } from './constants';

type Theme = 'light' | 'dark' | 'system';
type View = 'login' | 'dashboard' | 'forgotPassword';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
    
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
        mapContainer.classList.toggle('dark', isDark);
    }

  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.toggle('dark', mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  const handleLogin = useCallback((email: string, password: string): boolean => {
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      setView('dashboard');
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView('login');
  }, []);

  const navigateToForgotPassword = () => setView('forgotPassword');
  const navigateToLogin = () => setView('login');

  if (view === 'login') {
    return <Login onLogin={handleLogin} onForgotPasswordClick={navigateToForgotPassword} theme={theme} setTheme={setTheme} />;
  }

  if (view === 'forgotPassword') {
    return <ForgotPassword onBackToLogin={navigateToLogin} theme={theme} setTheme={setTheme} />;
  }

  if (view === 'dashboard' && currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} theme={theme} setTheme={setTheme} />;
  }
  
  return <Login onLogin={handleLogin} onForgotPasswordClick={navigateToForgotPassword} theme={theme} setTheme={setTheme} />;
};

export default App;
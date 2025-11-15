
import React, { useState, useCallback } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User } from './types';
import { USERS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = useCallback((email: string, password: string): boolean => {
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
};

export default App;
import React from 'react';
import { User } from '../types';
import { LocationMarkerIcon, MenuIcon } from './Icons';
import ThemeSwitcher from './ThemeSwitcher';

type Theme = 'light' | 'dark' | 'system';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, setTheme, onToggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg p-3 flex justify-between items-center relative z-30 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleSidebar} 
          className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        {/* FIX: Changed icon color to orange theme */}
        <LocationMarkerIcon className="h-8 w-8 text-orange-500 dark:text-orange-400" />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Field Data Monitor</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="text-right">
          <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
          {/* FIX: Changed text color to orange theme */}
          <p className="text-sm text-orange-600 dark:text-orange-400">{user.role}</p>
        </div>
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

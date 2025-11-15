
import React from 'react';
import { User } from '../types';
import { LocationMarkerIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-gray-900 shadow-lg p-3 flex justify-between items-center z-10">
      <div className="flex items-center space-x-3">
        <LocationMarkerIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Field Data Monitor</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-cyan-400">{user.role}</p>
        </div>
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

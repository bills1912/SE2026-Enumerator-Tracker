
import React from 'react';
import { Enumerator } from '../types';
import { UserIcon } from './Icons';

interface EnumeratorListProps {
  enumerators: Enumerator[];
}

const EnumeratorList: React.FC<EnumeratorListProps> = ({ enumerators }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Status Enumerator</h3>
      <ul className="space-y-3">
        {enumerators.map(e => (
          <li key={e.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {e.name.charAt(0)}
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">{e.name}</span>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${e.isMoving ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white animate-pulse shadow' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
              {e.isMoving ? 'Dalam Perjalanan' : 'Di Lokasi'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnumeratorList;
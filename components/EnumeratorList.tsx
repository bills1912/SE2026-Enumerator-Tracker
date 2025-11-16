import React from 'react';
import { Enumerator } from '../types';
import { UserIcon } from './Icons';

interface EnumeratorListProps {
  enumerators: Enumerator[];
}

const EnumeratorList: React.FC<EnumeratorListProps> = ({ enumerators }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Status Enumerator</h3>
      <ul className="space-y-3">
        {enumerators.map(e => (
          <li key={e.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">{e.name}</span>
            </div>
            {/* FIX: Changed status badge color to orange theme */}
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${e.isMoving ? 'bg-orange-500 text-white animate-pulse' : 'bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-300'}`}>
              {e.isMoving ? 'Dalam Perjalanan' : 'Di Lokasi'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EnumeratorList;

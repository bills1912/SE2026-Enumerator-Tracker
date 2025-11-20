import React, { useState } from 'react';
import { Enumerator, Respondent, User, UserRole } from '../types';
import RespondentUploader from './RespondentUploader';
import EnumeratorList from './EnumeratorList';
import { SendIcon } from './Icons';

interface ManagementViewProps {
  user: User;
  enumerators: Enumerator[];
  onUpload: (newRespondents: Omit<Respondent, 'id' | 'status'>[]) => void;
  onBroadcast: (message: string) => void;
}

const ManagementView: React.FC<ManagementViewProps> = ({ user, enumerators, onUpload, onBroadcast }) => {
  // RBAC Guard: Only supervisors can see this component
  if (user.role !== UserRole.Supervisor) {
    return null;
  }
  
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSendBroadcast = () => {
    if (broadcastMessage.trim()) {
      onBroadcast(broadcastMessage);
      setBroadcastMessage('');
      setFeedback('Broadcast sent successfully!');
      setTimeout(() => setFeedback(''), 3000);
    }
  };
    
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Manajemen Tim & Responden</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                 <RespondentUploader enumerators={enumerators} onUpload={onUpload} />
            </div>
            <div className="lg:col-span-2 space-y-6">
                 <EnumeratorList enumerators={enumerators} />
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Broadcast System Update</h3>
                    <div className="space-y-3">
                        <textarea
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            placeholder="Type a message to all enumerators..."
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button 
                          onClick={handleSendBroadcast} 
                          disabled={!broadcastMessage.trim()}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                        >
                            <SendIcon className="h-5 w-5" />
                            <span>Send Broadcast</span>
                        </button>
                        {feedback && <p className="text-sm text-green-600 dark:text-green-400 text-center">{feedback}</p>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ManagementView;
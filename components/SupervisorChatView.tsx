

import React, { useState, useEffect, useRef } from 'react';
import { Enumerator, ChatMessage, User, UserRole } from '../types';
import { SendIcon, UserIcon } from './Icons';

interface SupervisorChatViewProps {
  user: User;
  enumerators: Enumerator[];
  chatHistories: Record<string, ChatMessage[]>;
  onReply: (enumeratorId: string, message: string) => void;
}

const SupervisorChatView: React.FC<SupervisorChatViewProps> = ({ user, enumerators, chatHistories, onReply }) => {
  // RBAC Guard: Only supervisors can see this component
  if (user.role !== UserRole.Supervisor) {
    return null;
  }

  const [selectedEnumeratorId, setSelectedEnumeratorId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = selectedEnumeratorId ? chatHistories[selectedEnumeratorId] || [] : [];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(scrollToBottom, [currentMessages]);
  
  useEffect(() => {
    if (!selectedEnumeratorId && enumerators.length > 0) {
      setSelectedEnumeratorId(enumerators[0].id);
    }
  }, [enumerators, selectedEnumeratorId]);
  
  const handleSend = () => {
    if (message.trim() && selectedEnumeratorId) {
      onReply(selectedEnumeratorId, message);
      setMessage('');
    }
  };
  
  const getMessageBubble = (msg: ChatMessage) => {
    return msg.role === 'supervisor' 
      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none shadow-md' 
      : 'bg-white dark:bg-gray-700 rounded-bl-none shadow-md';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-semibold p-4 text-orange-600 dark:text-orange-400 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">Obrolan Enumerator</h3>
      <div className="flex flex-grow overflow-hidden">
        {/* Enumerator List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
          <ul>
            {enumerators.map(e => (
              <li key={e.id}>
                <button 
                  onClick={() => setSelectedEnumeratorId(e.id)}
                  className={`w-full text-left p-3 flex items-center space-x-3 transition-colors duration-200 border-l-4 ${selectedEnumeratorId === e.id ? 'bg-orange-100 dark:bg-orange-900/50 border-orange-500' : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                        {e.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{e.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat Window */}
        <div className="w-2/3 flex flex-col bg-gray-100 dark:bg-gray-900/50">
          {selectedEnumeratorId ? (
            <>
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                 {currentMessages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'supervisor' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' && (
                             <div className="p-2 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 self-end mb-1 shadow-sm">
                                <UserIcon className="w-5 h-5"/>
                             </div>
                        )}
                        <div className={`p-3 rounded-xl max-w-[80%] text-gray-800 dark:text-gray-100 ${getMessageBubble(msg)}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 flex items-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Balas pesan ${enumerators.find(e => e.id === selectedEnumeratorId)?.name || ''}...`}
                  className="flex-grow bg-gray-100 dark:bg-gray-700 border-transparent rounded-l-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={message.trim() === ''}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-2.5 rounded-r-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  <SendIcon className="h-5 w-5"/>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Pilih enumerator untuk melihat obrolan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorChatView;

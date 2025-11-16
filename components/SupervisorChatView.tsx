import React, { useState, useEffect, useRef } from 'react';
import { Enumerator, ChatMessage } from '../types';
import { SendIcon, UserIcon } from './Icons';

interface SupervisorChatViewProps {
  enumerators: Enumerator[];
  chatHistories: Record<string, ChatMessage[]>;
  onReply: (enumeratorId: string, message: string) => void;
}

const SupervisorChatView: React.FC<SupervisorChatViewProps> = ({ enumerators, chatHistories, onReply }) => {
  const [selectedEnumeratorId, setSelectedEnumeratorId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = selectedEnumeratorId ? chatHistories[selectedEnumeratorId] || [] : [];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(scrollToBottom, [currentMessages]);
  
  useEffect(() => {
    // Auto-select the first enumerator if none is selected
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
    return msg.role === 'supervisor' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold p-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-700">Enumerator Chats</h3>
      <div className="flex flex-grow overflow-hidden">
        {/* Enumerator List */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ul>
            {enumerators.map(e => (
              <li key={e.id}>
                <button 
                  onClick={() => setSelectedEnumeratorId(e.id)}
                  className={`w-full text-left p-3 flex items-center space-x-2 transition-colors duration-200 ${selectedEnumeratorId === e.id ? 'bg-cyan-100 dark:bg-cyan-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                    <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0"/>
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{e.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat Window */}
        <div className="w-2/3 flex flex-col">
          {selectedEnumeratorId ? (
            <>
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                 {currentMessages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'supervisor' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' && (
                             <div className="p-2 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                                <UserIcon className="w-5 h-5"/>
                             </div>
                        )}
                        <div className={`p-3 rounded-lg max-w-[80%] text-gray-800 dark:text-gray-100 ${getMessageBubble(msg)}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 flex items-center border-t border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Reply to ${enumerators.find(e => e.id === selectedEnumeratorId)?.name || ''}...`}
                  className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-r-lg"
                >
                  <SendIcon className="h-6 w-6"/>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Select an enumerator to view chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorChatView;
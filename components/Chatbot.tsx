import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMode } from '../types';
import { SendIcon, UserIcon } from './Icons';

interface ChatbotProps {
    chatMode: ChatMode;
    setChatMode: (mode: ChatMode) => void;
    aiMessages: ChatMessage[];
    supervisorMessages: ChatMessage[];
    onSendAiMessage: (input: string) => void;
    onSendSupervisorMessage: (input: string) => void;
    isLoading: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({
    chatMode,
    setChatMode,
    aiMessages,
    supervisorMessages,
    onSendAiMessage,
    onSendSupervisorMessage,
    isLoading
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = chatMode === 'ai' ? aiMessages : supervisorMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || (chatMode === 'ai' && isLoading)) return;
    
    if (chatMode === 'ai') {
        onSendAiMessage(input);
    } else {
        onSendSupervisorMessage(input);
    }
    setInput('');
  };

  const getTabClasses = (mode: ChatMode) => 
    `w-1/2 py-2 text-sm font-semibold text-center cursor-pointer transition-colors duration-200 ${
        chatMode === mode 
        ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-500' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
  
  const getMessageBubble = (msg: ChatMessage) => {
      switch (msg.role) {
          case 'user':
              return 'bg-blue-500 text-white rounded-br-none';
          case 'model':
              return 'bg-gray-100 dark:bg-gray-700 rounded-bl-none';
          case 'supervisor':
              return 'bg-green-500 text-white rounded-bl-none';
          default:
              return 'bg-gray-100 dark:bg-gray-700';
      }
  };

  const getMessageSenderIcon = (msg: ChatMessage) => {
    if (msg.role === 'model' || msg.role === 'supervisor') {
      const bgColor = msg.role === 'model' ? 'bg-cyan-600' : 'bg-green-600';
      return (
        <div className={`p-2 rounded-full ${bgColor} text-white`}>
          <UserIcon className="w-5 h-5"/>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg flex flex-col h-full">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setChatMode('ai')} className={getTabClasses('ai')}>
                AI Assistant
            </button>
            <button onClick={() => setChatMode('supervisor')} className={getTabClasses('supervisor')}>
                Supervisor
            </button>
        </div>

      <div className="flex-grow overflow-y-auto p-4 pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {getMessageSenderIcon(msg)}
            <div className={`p-3 rounded-lg max-w-xs text-gray-800 dark:text-gray-100 ${getMessageBubble(msg)}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
         {chatMode === 'ai' && isLoading && (
            <div className="flex items-start gap-2.5">
               <div className="p-2 rounded-full bg-cyan-600 text-white"><UserIcon className="w-5 h-5"/></div>
                <div className="p-3 rounded-lg max-w-xs bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-auto p-4 pt-0 flex items-center">
        <input
          type="text"
          value={input}
          // FIX: Corrected typo from `e.e.target.value` to `e.target.value`.
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={chatMode === 'ai' ? 'Ask the AI assistant...' : 'Chat with your supervisor...'}
          className="flex-grow bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={chatMode === 'ai' && isLoading}
        />
        <button
          onClick={handleSend}
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-r-lg disabled:bg-gray-500"
          disabled={chatMode === 'ai' && isLoading}
        >
          <SendIcon className="h-6 w-6"/>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
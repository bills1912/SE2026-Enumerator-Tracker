
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMode } from '../types';
import { SendIcon, UserIcon } from './Icons';
import { SE2026_LOGO_BASE64 } from '../constants';

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
    `w-1/2 py-2.5 text-sm font-semibold text-center cursor-pointer transition-colors duration-200 rounded-t-lg ${
        chatMode === mode 
        ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 bg-orange-50 dark:bg-gray-700/50' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
  
  const getMessageBubble = (msg: ChatMessage) => {
      switch (msg.role) {
          case 'user':
              return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none shadow-md';
          case 'model':
              return 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-md';
          case 'supervisor':
              return 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-bl-none shadow-md';
          default:
              return 'bg-gray-100 dark:bg-gray-600';
      }
  };

  const getMessageSenderIcon = (msg: ChatMessage) => {
    if (msg.role === 'model') {
      return (
        <div className={`p-1.5 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md`}>
          <img src={SE2026_LOGO_BASE64} alt="AI Logo" className="w-6 h-6" />
        </div>
      );
    }
    if (msg.role === 'supervisor') {
         return (
            <div className={`p-2 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md`}>
                <UserIcon className="w-5 h-5"/>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl flex flex-col h-full">
        <div className="flex border-b border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
            <button onClick={() => setChatMode('ai')} className={getTabClasses('ai')}>
                AI Assistant
            </button>
            <button onClick={() => setChatMode('supervisor')} className={getTabClasses('supervisor')}>
                Supervisor
            </button>
        </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {getMessageSenderIcon(msg)}
            <div className={`p-3 rounded-xl max-w-xs ${getMessageBubble(msg)}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
         {chatMode === 'ai' && isLoading && (
            <div className="flex items-end gap-2.5">
               <div className={`p-1.5 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md`}><img src={SE2026_LOGO_BASE64} alt="AI Logo" className="w-6 h-6" /></div>
                <div className="p-3 rounded-xl max-w-xs bg-white dark:bg-gray-700 rounded-bl-none shadow-md">
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
      <div className="mt-auto p-3 flex items-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={chatMode === 'ai' ? 'Tanya asisten AI...' : 'Kirim pesan ke supervisor...'}
          className="flex-grow bg-gray-100 dark:bg-gray-700 border-transparent rounded-l-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          disabled={chatMode === 'ai' && isLoading}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-2.5 rounded-r-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          disabled={(chatMode === 'ai' && isLoading) || input.trim() === ''}
        >
          <SendIcon className="h-5 w-5"/>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
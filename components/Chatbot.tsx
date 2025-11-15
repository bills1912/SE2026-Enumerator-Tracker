
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { SendIcon, UserIcon } from './Icons';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'model', content: 'An error occurred. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-96">
      <h3 className="text-xl font-semibold mb-3 text-cyan-400">AI Assistant</h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="p-2 rounded-full bg-cyan-600"><UserIcon className="w-5 h-5"/></div>}
            <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-2.5">
               <div className="p-2 rounded-full bg-cyan-600"><UserIcon className="w-5 h-5"/></div>
                <div className="p-3 rounded-lg max-w-xs bg-gray-700 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about data collection..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-r-lg disabled:bg-gray-500"
          disabled={isLoading}
        >
          <SendIcon className="h-6 w-6"/>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;


import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Phone } from 'lucide-react';
import { UserRole } from '../types.ts';
import { generateSystemResponse } from '../services/geminiService.ts';

interface AIChatProps {
  role: UserRole;
  contextData: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIChat: React.FC<AIChatProps> = ({ role, contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: `Hello! I am the Grand Stay Assistant. How can I assist you as a ${role.toLowerCase()} today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ sender: 'ai', text: `Hello! I am the Grand Stay Assistant. How can I assist you as a ${role.toLowerCase()} today?` }]);
  }, [role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await generateSystemResponse(userMsg, role, contextData);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble connecting to the mainframe. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center justify-center"
        >
          <Phone className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <h3 className="font-semibold">Grand Stay Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your request..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;

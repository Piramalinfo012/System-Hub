import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { SystemItem } from '../../types';
import { GoogleSheetService } from '../../services/googleSheetService';

interface ChatbotProps {
  darkMode: boolean;
  systems: SystemItem[];
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  isActionable?: boolean;
  systemLink?: SystemItem;
}

export const Chatbot: React.FC<ChatbotProps> = ({ darkMode, systems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hello! I'm your Digital System Hub assistant. You can ask me to find any workflow, dashboard, or system."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Processing & Local Search
    setTimeout(() => {
      const q = userText.toLowerCase();
      let responseText = "I'm not sure about that. Try asking me to find a specific system or department.";
      let matchedSystem: SystemItem | undefined;

      // Simple keyword matching against systems
      if (q.includes('hi') || q.includes('hello')) {
        responseText = "Hello! How can I help you navigate the Hub today?";
      } else {
        const match = systems.find(s => 
          s.systemName.toLowerCase().includes(q) || 
          s.department.toLowerCase().includes(q)
        );

        if (match) {
          responseText = `I found something that might help: **${match.systemName}** in the ${match.department} department.`;
          matchedSystem = match;
        } else if (q.includes('whatsapp')) {
           responseText = "You can access the WhatsApp Automation Hub by clicking the 'WhatsApp Hub' button on the dashboard or in the sidebar.";
        }
      }

      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: responseText,
        systemLink: matchedSystem
      };

      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleOpenSystem = (sys: SystemItem) => {
    if (GoogleSheetService.isValidUrl(sys.url)) {
      GoogleSheetService.openExternalUrl(sys.url, sys.systemName, sys.id, 'system', sys.department);
    } else {
      alert('This system does not have a valid URL connected.');
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center ${
          isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
        } ${darkMode ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/20' : 'bg-blue-600 text-white shadow-blue-500/30'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right border ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        } ${
          darkMode 
            ? 'bg-slate-900/95 backdrop-blur-xl border-slate-800' 
            : 'bg-white/95 backdrop-blur-xl border-slate-200'
        }`}
      >
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                Hub Assistant
                <Sparkles className="w-3 h-3 text-amber-400" />
              </h3>
              <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Always here to help</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-xl transition-colors ${
              darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${
                msg.role === 'bot' 
                  ? (darkMode ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-blue-600')
                  : (darkMode ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white')
              }`}>
                {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div className={`max-w-[75%] rounded-2xl p-3 text-sm ${
                msg.role === 'user'
                  ? (darkMode ? 'bg-cyan-500 text-slate-950 rounded-tr-sm' : 'bg-blue-600 text-white rounded-tr-sm')
                  : (darkMode ? 'bg-slate-800 text-slate-200 rounded-tl-sm' : 'bg-slate-100 text-slate-800 rounded-tl-sm')
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                
                {msg.systemLink && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleOpenSystem(msg.systemLink!)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        darkMode ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-white text-blue-600 shadow-xs hover:shadow-md'
                      }`}
                    >
                      Open {msg.systemLink.systemName}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-blue-600'}`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className={`rounded-2xl p-4 rounded-tl-sm flex items-center gap-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-white'}`}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className={`w-full pl-4 pr-12 py-3 rounded-2xl text-sm focus:outline-hidden transition-colors ${
                darkMode 
                  ? 'bg-slate-900 border border-slate-800 text-slate-200 focus:border-cyan-500' 
                  : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`absolute right-2 p-2 rounded-xl transition-all ${
                !inputValue.trim() || isTyping
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95'
              } ${darkMode ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white'}`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

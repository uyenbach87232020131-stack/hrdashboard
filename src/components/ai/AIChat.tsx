import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { useFilter } from '../../context/FilterContext';
import { calculateKPIs, generateDataSummary } from '../../utils/dataProcessing';
import { ChatMessage } from '../../types/hr';
import AISettings from './AISettings';
import { Send, Bot, User, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const { apiKey, setApiKey, chat, isChatting } = useGemini();
  const { filteredEmployees } = useFilter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dataSummary = useMemo(() => generateDataSummary(filteredEmployees, calculateKPIs(filteredEmployees)), [filteredEmployees]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isChatting]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !apiKey) {
      if (!apiKey) setShowSettings(true);
      return;
    }
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const reply = await chat(text, dataSummary, messages);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-xl overflow-hidden border border-white/20">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between bg-white dark:bg-slate-900">
        <h2 className="font-bold flex items-center gap-2"><Bot /> HR Assistant</h2>
        <button onClick={() => setShowSettings(true)}><Settings size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Bot size={48} className="mb-4 opacity-50" />
            <p>Ask anything about your HR data.</p>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-700 rounded-bl-sm shadow'}`}>
                <ReactMarkdown className={m.role === 'user' ? 'text-white' : ''}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {isChatting && <div className="text-indigo-500 flex items-center gap-2"><Bot size={16} /> <span className="animate-pulse">Thinking...</span></div>}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          className="flex-1 p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent"
          placeholder="Ask a question..."
        />
        <button onClick={() => handleSend(input)} className="bg-indigo-600 text-white p-2 rounded-lg"><Send size={20} /></button>
      </div>

      <AISettings isOpen={showSettings} onClose={() => setShowSettings(false)} apiKey={apiKey} onSaveKey={setApiKey} />
    </div>
  );
}
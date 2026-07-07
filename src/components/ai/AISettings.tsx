import React, { useState } from 'react';
import { Key, Eye, EyeOff, Check, X, Settings } from 'lucide-react';

export default function AISettings({ isOpen, onClose, apiKey, onSaveKey }: { isOpen: boolean, onClose: () => void, apiKey: string, onSaveKey: (k: string) => void }) {
  const [key, setKey] = useState(apiKey);
  const [show, setShow] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2"><Settings size={20} /> AI Settings</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Enter your Gemini API key to enable AI insights and chat.</p>
          <div className="relative mb-6">
            <Key className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type={show ? 'text' : 'password'} 
              value={key} onChange={e => setKey(e.target.value)} 
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" 
              placeholder="AIzaSy..." 
            />
            <button className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button 
            onClick={() => { onSaveKey(key); onClose(); }} 
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            <Check size={18} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import AIChat from '../components/ai/AIChat';

export default function AIChatPage() {
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Chat</h1>
        <p className="text-sm text-slate-500 mt-1">Chat with your HR data.</p>
      </div>
      <div className="h-[calc(100%-4rem)]">
        <AIChat />
      </div>
    </div>
  );
}
import React from 'react';
import AIReport from '../components/ai/AIReport';

export default function AIInsightsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Insights</h1>
        <p className="text-slate-500 mt-2">Generate comprehensive HR analysis reports powered by Gemini.</p>
      </div>
      <AIReport />
    </div>
  );
}
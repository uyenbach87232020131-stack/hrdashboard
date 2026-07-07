import React from 'react';
import DropZone from '../components/upload/DropZone';
import { BarChart3, Brain, Sparkles } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
          HR Analytics Dashboard
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Upload your Excel HR data and instantly generate comprehensive analytics, beautiful charts, and AI-powered insights.
        </p>
      </div>

      <DropZone />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto w-full px-6">
        <FeatureCard icon={<BarChart3 className="text-blue-500" />} title="Auto-Generated Charts" desc="Instantly creates 15+ interactive charts based on your specific data." />
        <FeatureCard icon={<Sparkles className="text-purple-500" />} title="Smart Filters" desc="Slice and dice your data across any dimension instantly." />
        <FeatureCard icon={<Brain className="text-emerald-500" />} title="AI Insights" desc="Chat with your data and generate professional HR reports." />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-center flex flex-col items-center">
      <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  );
}
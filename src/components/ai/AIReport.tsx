import React, { useState, useMemo } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { useFilter } from '../../context/FilterContext';
import { calculateKPIs, generateDataSummary } from '../../utils/dataProcessing';
import AISettings from './AISettings';
import { Sparkles, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIReport() {
  const { apiKey, setApiKey, generateReport, isGenerating, error } = useGemini();
  const { filteredEmployees } = useFilter();
  const [report, setReport] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const dataSummary = useMemo(() => {
    return generateDataSummary(filteredEmployees, calculateKPIs(filteredEmployees));
  }, [filteredEmployees]);

  const handleGenerate = async () => {
    if (!apiKey) return setShowSettings(true);
    try {
      const res = await generateReport(dataSummary);
      setReport(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 p-6 rounded-2xl shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-indigo-500" /> AI Report Generator</h2>
        <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"><Settings size={18} /></button>
      </div>

      {!report && !isGenerating && (
        <div className="text-center py-12">
          <p className="mb-4">Generate a comprehensive analysis report based on the current HR data.</p>
          <button onClick={handleGenerate} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all">
            Generate Report
          </button>
        </div>
      )}

      {isGenerating && <div className="text-center py-12 animate-pulse text-indigo-500">Generating report, please wait...</div>}
      
      {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg mb-4">{error}</div>}

      {report && (
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      )}

      <AISettings isOpen={showSettings} onClose={() => setShowSettings(false)} apiKey={apiKey} onSaveKey={setApiKey} />
    </div>
  );
}
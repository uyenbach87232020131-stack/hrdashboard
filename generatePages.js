const fs = require('fs');
const path = require('path');

const dirs = [
  'src/components/filters',
  'src/components/ai',
  'src/components/export',
  'src/hooks',
  'src/pages'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const files = {
  'src/components/filters/FilterPanel.tsx': `import React, { useState } from 'react';
import { useFilter } from '../../context/FilterContext';
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { filterState, filterOptions, updateFilter, resetFilters, activeFilterCount } = useFilter();

  const handleCheckbox = (key: 'departments' | 'genders' | 'hireYears', value: string | number) => {
    const current = filterState[key] as any[];
    if (current.includes(value)) {
      updateFilter(key, current.filter(v => v !== value) as any);
    } else {
      updateFilter(key, [...current, value] as any);
    }
  };

  const handleRange = (key: 'ageRange' | 'salaryRange' | 'performanceRange' | 'engagementRange', index: 0 | 1, value: number) => {
    const newRange = [...filterState[key]] as [number, number];
    newRange[index] = value;
    updateFilter(key, newRange);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40" onClick={onClose} />}
      <div className={\`fixed top-0 right-0 h-full w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 \${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col\`}>
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors" title="Reset All">
                <RotateCcw size={18} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <FilterSection title="Departments">
            <div className="space-y-2">
              {filterOptions.departments.map(dept => (
                <label key={dept} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterState.departments.includes(dept)} onChange={() => handleCheckbox('departments', dept)} className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Gender">
            <div className="space-y-2">
              {filterOptions.genders.map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filterState.genders.includes(g)} onChange={() => handleCheckbox('genders', g)} className="rounded text-indigo-600 focus:ring-indigo-500 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                  <span className="text-sm">{g}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Age Range">
            <div className="flex items-center gap-2">
              <input type="number" value={filterState.ageRange[0]} min={filterOptions.ageMin} max={filterState.ageRange[1]} onChange={e => handleRange('ageRange', 0, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <span className="text-slate-500">-</span>
              <input type="number" value={filterState.ageRange[1]} min={filterState.ageRange[0]} max={filterOptions.ageMax} onChange={e => handleRange('ageRange', 1, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </FilterSection>
          
          <FilterSection title="Salary Range">
            <div className="flex items-center gap-2">
              <input type="number" value={filterState.salaryRange[0]} min={filterOptions.salaryMin} max={filterState.salaryRange[1]} onChange={e => handleRange('salaryRange', 0, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <span className="text-slate-500">-</span>
              <input type="number" value={filterState.salaryRange[1]} min={filterState.salaryRange[0]} max={filterOptions.salaryMax} onChange={e => handleRange('salaryRange', 1, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </FilterSection>

          <FilterSection title="Performance Score">
            <div className="flex items-center gap-2">
              <input type="number" value={filterState.performanceRange[0]} min={filterOptions.performanceMin} max={filterState.performanceRange[1]} onChange={e => handleRange('performanceRange', 0, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
              <span className="text-slate-500">-</span>
              <input type="number" value={filterState.performanceRange[1]} min={filterState.performanceRange[0]} max={filterOptions.performanceMax} onChange={e => handleRange('performanceRange', 1, Number(e.target.value))} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm" />
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <h3 className="font-semibold text-sm">{title}</h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}`,

  'src/hooks/useGemini.ts': `import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types/hr';

export function useGemini() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('hr-dashboard-gemini-key') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    localStorage.setItem('hr-dashboard-gemini-key', key);
  }, []);

  const generateReport = useCallback(async (dataSummary: string): Promise<string> => {
    if (!apiKey) throw new Error('API key not configured');
    setIsGenerating(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = \`Bạn là chuyên gia phân tích nhân sự. Dựa trên dữ liệu sau:
\${dataSummary}
Hãy viết báo cáo phân tích sâu sắc bằng tiếng Việt gồm: Tóm tắt, Cơ cấu nhân sự, Lương, Hiệu suất, Gắn kết, Nghỉ việc, Rủi ro, Khuyến nghị.\`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey]);

  const chat = useCallback(async (message: string, dataSummary: string, history: ChatMessage[]): Promise<string> => {
    if (!apiKey) throw new Error('API key not configured');
    setIsChatting(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = \`Bạn là trợ lý HR. Dữ liệu HR:\n\${dataSummary}\nCâu hỏi: \${message}\nTrả lời chuyên nghiệp bằng tiếng Việt.\`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsChatting(false);
    }
  }, [apiKey]);

  return { apiKey, setApiKey, generateReport, chat, isGenerating, isChatting, error };
}`,

  'src/components/ai/AISettings.tsx': `import React, { useState } from 'react';
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
}`,

  'src/components/ai/AIReport.tsx': `import React, { useState, useMemo } from 'react';
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
}`,

  'src/components/ai/AIChat.tsx': `import React, { useState, useRef, useEffect, useMemo } from 'react';
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
            <div key={m.id} className={\`flex \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
              <div className={\`max-w-[80%] p-3 rounded-2xl \${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-700 rounded-bl-sm shadow'}\`}>
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
}`,

  'src/components/export/ExportPanel.tsx': `import React from 'react';
import { FileText, Table, Image as ImageIcon, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useFilter } from '../../context/FilterContext';
import { calculateKPIs } from '../../utils/dataProcessing';

export default function ExportPanel() {
  const { filteredEmployees } = useFilter();

  const exportExcel = () => {
    const kpis = calculateKPIs(filteredEmployees);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([kpis]);
    XLSX.utils.book_append_sheet(wb, ws, "KPIs");
    const dataSheet = XLSX.utils.json_to_sheet(filteredEmployees.map(e => e.rawData));
    XLSX.utils.book_append_sheet(wb, dataSheet, "Data");
    XLSX.writeFile(wb, "HR_Report.xlsx");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      <button onClick={() => window.print()} className="p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-slate-700">
        <FileText size={48} className="text-red-500" />
        <h3 className="font-bold">PDF Report</h3>
      </button>
      
      <button onClick={exportExcel} className="p-6 bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 border border-slate-200 dark:border-slate-700">
        <Table size={48} className="text-emerald-500" />
        <h3 className="font-bold">Excel Data</h3>
      </button>
    </div>
  );
}`,

  'src/pages/UploadPage.tsx': `import React from 'react';
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
}`,

  'src/pages/DashboardPage.tsx': `import React, { useState } from 'react';
import KPIGrid from '../components/kpi/KPIGrid';
import DepartmentCharts from '../components/charts/DepartmentCharts';
import GenderChart from '../components/charts/GenderChart';
import AgeHistogram from '../components/charts/AgeHistogram';
import SalaryCharts from '../components/charts/SalaryCharts';
import PerformanceChart from '../components/charts/PerformanceChart';
import EngagementChart from '../components/charts/EngagementChart';
import TrainingChart from '../components/charts/TrainingChart';
import PromotionChart from '../components/charts/PromotionChart';
import AbsenceChart from '../components/charts/AbsenceChart';
import HiringCharts from '../components/charts/HiringCharts';
import TurnoverCharts from '../components/charts/TurnoverCharts';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';
import FilterPanel from '../components/filters/FilterPanel';
import { useFilter } from '../context/FilterContext';
import { Filter } from 'lucide-react';

export default function DashboardPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { activeFilterCount } = useFilter();

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />

      <KPIGrid />
      
      <h2 className="text-xl font-bold mb-4 mt-8">Department Analysis</h2>
      <DepartmentCharts />
      
      <h2 className="text-xl font-bold mb-4 mt-8">Demographics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GenderChart />
        <AgeHistogram />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Compensation</h2>
      <SalaryCharts />

      <h2 className="text-xl font-bold mb-4 mt-8">Performance & Engagement</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceChart />
        <EngagementChart />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Training & Promotions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TrainingChart />
        <PromotionChart />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Absence</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AbsenceChart />
      </div>

      <h2 className="text-xl font-bold mb-4 mt-8">Hiring Trends</h2>
      <HiringCharts />

      <h2 className="text-xl font-bold mb-4 mt-8">Turnover Analysis</h2>
      <TurnoverCharts />

      <h2 className="text-xl font-bold mb-4 mt-8">Correlations</h2>
      <CorrelationHeatmap />
    </div>
  );
}`,

  'src/pages/AIInsightsPage.tsx': `import React from 'react';
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
}`,

  'src/pages/AIChatPage.tsx': `import React from 'react';
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
}`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filename), content);
}
console.log('Other components generated successfully.');

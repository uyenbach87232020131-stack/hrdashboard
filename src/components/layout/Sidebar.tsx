import React from 'react';
import { NavSection } from '../../types/hr';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  Brain, 
  MessageSquare, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ currentSection, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
    { id: 'ai-chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div 
      className={`${collapsed ? 'w-20' : 'w-64'} flex flex-col h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ease-in-out z-20`}
    >
      <div className="h-20 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate px-4">
          {collapsed ? 'HR' : 'HR Analytics'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavSection)}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-5 bg-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
          title={collapsed ? "Toggle Theme" : undefined}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}

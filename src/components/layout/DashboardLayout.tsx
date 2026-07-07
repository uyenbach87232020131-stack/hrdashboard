import React, { useState } from 'react';
import { NavSection } from '../../types/hr';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export default function DashboardLayout({ children, currentSection, onNavigate }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar 
        currentSection={currentSection} 
        onNavigate={onNavigate} 
        collapsed={collapsed} 
        onToggleCollapse={() => setCollapsed(!collapsed)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

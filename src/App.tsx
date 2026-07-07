import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { FilterProvider } from './context/FilterContext';
import { NavSection } from './types/hr';

import DashboardLayout from './components/layout/DashboardLayout';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import AIInsightsPage from './pages/AIInsightsPage';
import AIChatPage from './pages/AIChatPage';
import ExportPanel from './components/export/ExportPanel';

function AppContent() {
  const { isLoaded } = useData();
  const [currentSection, setCurrentSection] = useState<NavSection>('upload');

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <UploadPage />
      </div>
    );
  }

  const handleNavigate = (section: NavSection) => {
    setCurrentSection(section);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
      case 'charts':
        return <DashboardPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'ai-chat':
        return <AIChatPage />;
      case 'export':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Export Options</h2>
            <ExportPanel />
          </div>
        );
      case 'upload':
        return <UploadPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <FilterProvider>
      <DashboardLayout currentSection={currentSection} onNavigate={handleNavigate}>
        {renderContent()}
      </DashboardLayout>
    </FilterProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './sections/Dashboard';
import { DailyChecklist } from './sections/DailyChecklist';
import { StrategicPlan } from './sections/StrategicPlan';
import { Reminders } from './sections/Reminders';
import { PriorityBoard } from './sections/PriorityBoard';
import { SubjectTracker } from './sections/SubjectTracker';
import { PYQLog } from './sections/PYQLog';
import { MockAnalyzer } from './sections/MockAnalyzer';
import { FormulaSheets } from './sections/FormulaSheets';
import { ErrorJournal } from './sections/ErrorJournal';
import { WeeklyReview } from './sections/WeeklyReview';
import { SpacedRepetition } from './sections/SpacedRepetition';
import { Settings } from './sections/Settings';
import { LearningNotes } from './sections/LearningNotes';
import { GlobalSearch } from './components/GlobalSearch';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';

export default function App() {
  const { initializeData, settings } = useStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    if (!settings.firstLaunchDone) {
      setShowWelcome(true);
      initializeData();
    }
  }, [settings.firstLaunchDone, initializeData]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'recall') {
        setActiveSection('spaced-repetition');
        window.history.replaceState(null, '', ' '); // Clear hash
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSearch(prev => !prev);
        return;
      }
      
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowShortcuts(false);
        return;
      }

      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setActiveSection('learning-notes');
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setActiveSection('daily-checklist');
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setActiveSection('pyq-log');
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setActiveSection('error-journal');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setActiveSection('formula-sheets');
      } else if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const sectionMap = [
          'dashboard', 'daily-checklist', 'strategic-plan', 'reminders', 
          'priority-board', 'subject-tracker', 'pyq-log', 'mock-analyzer', 'formula-sheets'
        ];
        const idx = parseInt(e.key) - 1;
        if (sectionMap[idx]) setActiveSection(sectionMap[idx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'daily-checklist': return <DailyChecklist />;
      case 'strategic-plan': return <StrategicPlan />;
      case 'reminders': return <Reminders />;
      case 'priority-board': return <PriorityBoard />;
      case 'subject-tracker': return <SubjectTracker />;
      case 'pyq-log': return <PYQLog />;
      case 'mock-analyzer': return <MockAnalyzer />;
      case 'formula-sheets': return <FormulaSheets />;
      case 'error-journal': return <ErrorJournal />;
      case 'spaced-repetition': return <SpacedRepetition />;
      case 'weekly-review': return <WeeklyReview />;
      case 'learning-notes': return <LearningNotes />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <AppLayout activeSection={activeSection} setActiveSection={setActiveSection}>
        {renderSection()}
      </AppLayout>

      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} setActiveSection={setActiveSection} />
      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-[10px] p-8 max-w-md w-full shadow-2xl text-center">
            <h2 className="text-2xl font-mono text-accent-primary mb-4">SYSTEM INITIALIZED</h2>
            <p className="text-text-secondary mb-6 leading-relaxed">
              GATE EC 2027 Dashboard initialized.<br />
              Target: 90+ Marks.<br />
              Let's begin.
            </p>
            <button 
              onClick={() => setShowWelcome(false)}
              className="w-full bg-accent-primary hover:bg-blue-600 text-white font-medium h-12 rounded-[6px] transition-colors"
            >
              Start Mission
            </button>
          </div>
        </div>
      )}
    </>
  );
}

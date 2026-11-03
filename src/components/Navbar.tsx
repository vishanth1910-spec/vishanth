import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Sparkles, Settings, FileArchive, Cloud, LayoutGrid, Terminal } from 'lucide-react';

export function Navbar() {
  const {
    currentView,
    setCurrentView,
    setWizardOpen,
    setTemplatesModalOpen,
    setSettingsModalOpen,
    activeProject,
  } = useProject();

  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between gap-8 shrink-0 z-40">
      {/* Zone 1: Single text element wordmark in display face */}
      <button
        onClick={() => setCurrentView('landing')}
        className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
      >
        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <span>BuildMint AI</span>
      </button>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setCurrentView('landing')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'landing' ? 'text-white font-semibold' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'dashboard' ? 'text-white font-semibold' : ''
          }`}
        >
          Projects Dashboard
        </button>
        <button
          onClick={() => setCurrentView('studio')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'studio' ? 'text-white font-semibold' : ''
          }`}
        >
          Dev Studio
        </button>
        <button
          onClick={() => setTemplatesModalOpen(true)}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Starter Templates
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
          title="Settings & Integrations"
        >
          <Settings className="h-4 w-4" />
        </button>

        {currentView === 'studio' ? (
          <button
            onClick={() => setWizardOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-emerald-950"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>New App</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (activeProject) setCurrentView('studio');
              else setWizardOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-emerald-950"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open Studio</span>
          </button>
        )}
      </div>
    </header>
  );
}

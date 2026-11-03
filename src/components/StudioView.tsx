import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { AssistantPanel } from './studio/AssistantPanel';
import { PreviewPanel } from './studio/PreviewPanel';
import { CodePanel } from './studio/CodePanel';
import { ConsolePanel } from './studio/ConsolePanel';
import { 
  ArrowLeft, Download, GitBranch, Cloud, Bookmark, 
  History, Eye, Code2, Layers, CheckCircle2, ChevronRight 
} from 'lucide-react';

export function StudioView() {
  const {
    activeProject,
    setCurrentView,
    setDeployModalOpen,
    setExportModalOpen,
    setGitModalOpen,
    createCheckpoint,
  } = useProject();

  const [activeCenterView, setActiveCenterView] = useState<'split' | 'preview-only' | 'code-only'>('split');

  if (!activeProject) return null;

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full flex flex-col bg-slate-950 overflow-hidden font-sans">
      {/* Studio Top Control Strip */}
      <div className="h-11 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between gap-4 shrink-0 text-xs">
        {/* Project Breadcrumb & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-white truncate">{activeProject.name}</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              {activeProject.framework.split('+')[0]}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono hidden md:inline bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Autonomous v2.4
            </span>
          </div>
        </div>

        {/* View Layout Mode (Split / Preview / Code) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveCenterView('split')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeCenterView === 'split' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Split Studio
          </button>
          <button
            onClick={() => setActiveCenterView('preview-only')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeCenterView === 'preview-only' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preview Only
          </button>
          <button
            onClick={() => setActiveCenterView('code-only')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeCenterView === 'code-only' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Editor Only
          </button>
        </div>

        {/* Primary Project Lifecycle Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => createCheckpoint('Manual User Snapshot')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Create Recoverable Snapshot"
          >
            <History className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Snapshot</span>
          </button>

          <button
            onClick={() => setExportModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Export ZIP Source Bundle"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Export ZIP</span>
          </button>

          <button
            onClick={() => setGitModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Push to GitHub"
          >
            <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden md:inline">GitHub</span>
          </button>

          <button
            onClick={() => setDeployModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-950"
            title="Deploy to Global Edge"
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      {/* 4-Panel Grid Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: AI Assistant & Orchestrator */}
        <div className="w-80 md:w-84 xl:w-96 shrink-0 h-full">
          <AssistantPanel />
        </div>

        {/* Center & Right Work Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Center Panel: Live Preview */}
            {(activeCenterView === 'split' || activeCenterView === 'preview-only') && (
              <div className="flex-1 h-full min-w-0">
                <PreviewPanel />
              </div>
            )}

            {/* Right Panel: Code Editor & Explorer */}
            {(activeCenterView === 'split' || activeCenterView === 'code-only') && (
              <div className={activeCenterView === 'split' ? 'w-96 xl:w-[480px] h-full shrink-0' : 'flex-1 h-full'}>
                <CodePanel />
              </div>
            )}
          </div>

          {/* Bottom Panel: Development Console & Diagnostics */}
          <ConsolePanel />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  FileCode, Folder, FolderOpen, Copy, Check, Download, 
  Search, X, Split, Code, FileText, Database, Shield
} from 'lucide-react';

export function CodePanel() {
  const {
    activeProject,
    openFileTab,
    closeFileTab,
    setActiveFile,
    updateFileContent,
  } = useProject();

  const [copied, setCopied] = useState(false);
  const [editorMode, setEditorMode] = useState<'code' | 'diff'>('code');
  const [searchFilter, setSearchFilter] = useState('');

  if (!activeProject) return null;

  const currentFile = activeProject.files[activeProject.activeFile] || Object.values(activeProject.files)[0];

  const handleCopyCode = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!currentFile) return;
    const blob = new Blob([currentFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filesList = Object.entries(activeProject.files).filter(([path]) =>
    path.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-slate-950 border-l border-slate-800 flex flex-col overflow-hidden text-xs">
      {/* Top Bar: Explorer Header & Mode Switcher */}
      <div className="h-10 border-b border-slate-800 bg-slate-900/80 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
          <FileCode className="h-4 w-4 text-emerald-400" />
          <span>Code Explorer</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setEditorMode('code')}
              className={`px-2 py-0.5 rounded transition-colors ${editorMode === 'code' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Code
            </button>
            <button
              onClick={() => setEditorMode('diff')}
              className={`px-2 py-0.5 rounded transition-colors ${editorMode === 'diff' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Diff
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleDownloadFile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Download Active File"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Mini Sidebar: File Tree */}
        <div className="w-48 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
          <div className="p-2 border-b border-slate-900">
            <div className="relative">
              <Search className="h-3 w-3 text-slate-500 absolute left-2 top-2" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-md pl-6 pr-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 font-mono text-[11px]">
            <div className="text-[10px] text-slate-500 px-2 py-1 font-sans uppercase font-bold tracking-wider">
              Workspace Files
            </div>
            {filesList.map(([path, f]) => (
              <button
                key={path}
                onClick={() => openFileTab(path)}
                className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-1.5 transition-colors truncate ${
                  activeProject.activeFile === path
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="truncate">{path}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* File Tabs */}
          <div className="h-9 border-b border-slate-800 bg-slate-900/60 flex items-center overflow-x-auto px-1 shrink-0 font-mono text-[11px]">
            {activeProject.openFiles.map((path) => (
              <div
                key={path}
                className={`flex items-center gap-2 px-3 py-1.5 border-r border-slate-800 cursor-pointer transition-colors ${
                  activeProject.activeFile === path
                    ? 'bg-slate-950 text-white border-t-2 border-t-emerald-500 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                onClick={() => setActiveFile(path)}
              >
                <span>{path.split('/').pop()}</span>
                {activeProject.openFiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFileTab(path);
                    }}
                    className="text-slate-500 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Code Viewer / Editor Area */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed">
            {editorMode === 'code' ? (
              <div className="flex min-h-full">
                {/* Line numbers */}
                <div className="text-slate-600 select-none pr-4 text-right shrink-0 border-r border-slate-900 text-[11px] font-mono">
                  {currentFile?.content.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Code content */}
                <textarea
                  value={currentFile?.content || ''}
                  onChange={(e) => updateFileContent(currentFile.path, e.target.value)}
                  className="flex-1 bg-transparent text-slate-200 pl-4 resize-none focus:outline-none font-mono text-xs leading-relaxed min-h-full overflow-hidden"
                  spellCheck={false}
                />
              </div>
            ) : (
              /* Diff Mode */
              <div className="space-y-1 text-[11px] font-mono">
                <div className="text-slate-400 pb-2 border-b border-slate-900 font-sans text-xs">
                  Showing diff comparison for <code className="text-emerald-400">{currentFile?.path}</code>
                </div>
                {currentFile?.content.split('\n').map((line, i) => {
                  const isAdded = line.includes('// Enhanced') || line.includes('v2.4') || line.includes('theme');
                  return (
                    <div
                      key={i}
                      className={`flex gap-3 px-1 py-0.5 rounded ${
                        isAdded ? 'bg-emerald-950/60 text-emerald-300' : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-600 w-6 select-none">{i + 1}</span>
                      <span className="w-3 select-none">{isAdded ? '+' : ' '}</span>
                      <span>{line}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { STARTER_TEMPLATES } from '../constants/templates';
import { 
  Plus, Search, Grid, List, Sparkles, Star, 
  ExternalLink, MoreVertical, Copy, Trash2, Download, 
  Cloud, ArrowRight, Activity, Clock, ShieldCheck, ChevronRight
} from 'lucide-react';

export function DashboardView() {
  const {
    projects,
    selectProject,
    setWizardOpen,
    setTemplatesModalOpen,
    createProject,
    duplicateProject,
    deleteProject,
    toggleFavoriteProject,
    setDeployModalOpen,
    setExportModalOpen,
  } = useProject();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'productivity' | 'saas'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickPrompt, setQuickPrompt] = useState('');

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    createProject({
      prompt: quickPrompt.trim(),
      mode: 'autonomous',
    });
    setQuickPrompt('');
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'favorites') return p.favorite;
    if (filter === 'productivity') return p.appTemplateType === 'student_productivity';
    if (filter === 'saas') return p.appTemplateType === 'saas_analytics';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section & Key Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Engineering Workspace</h1>
            <p className="text-xs text-slate-400 mt-1">Autonomous full-stack application builder and deployment hub.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTemplatesModalOpen(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Browse Templates
            </button>
            <button
              onClick={() => setWizardOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950"
            >
              <Plus className="h-4 w-4" />
              <span>Create New App</span>
            </button>
          </div>
        </div>

        {/* Quick Prompt Bar on Dashboard */}
        <form onSubmit={handleQuickCreate} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-xl">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 ml-1">
            <Sparkles className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Type any app idea (e.g., 'Build an AI patient portal with appointment booking and EHR notes')..."
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            className="flex-1 bg-transparent px-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!quickPrompt.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <span>Build App</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects by title or prompt..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'favorites', 'productivity', 'saas'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    filter === tab ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Grid / List view toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {p.framework.split('+')[0]}
                    </span>
                    <button
                      onClick={() => toggleFavoriteProject(p.id)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${p.favorite ? 'text-amber-400' : 'text-slate-500'}`}
                      title={p.favorite ? 'Remove Favorite' : 'Mark as Favorite'}
                    >
                      <Star className={`h-4 w-4 ${p.favorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3
                    onClick={() => selectProject(p.id)}
                    className="text-base font-bold text-white group-hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {p.tagline || p.prompt}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{p.database.split('+')[0]}</span>
                    <span>{Object.keys(p.files).length} files</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      onClick={() => duplicateProject(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => selectProject(p.id)}
                    className="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="p-3.5">Application Name</th>
                  <th className="p-3.5">Tech Stack</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Files</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div
                        onClick={() => selectProject(p.id)}
                        className="font-bold text-white hover:text-emerald-400 cursor-pointer"
                      >
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{p.prompt}</div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                      {p.framework.split('+')[0]} · {p.database.split('+')[0]}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                        Production Ready
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{Object.keys(p.files).length} files</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => selectProject(p.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Open Studio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

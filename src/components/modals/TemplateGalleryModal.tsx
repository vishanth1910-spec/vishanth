import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { STARTER_TEMPLATES } from '../../constants/templates';
import { LayoutGrid, Sparkles, ArrowRight, X, Filter } from 'lucide-react';

export function TemplateGalleryModal() {
  const { templatesModalOpen, setTemplatesModalOpen, createProject } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!templatesModalOpen) return null;

  const categories = ['All', 'Productivity', 'SaaS', 'E-Commerce', 'Developer', 'AI & Data'];

  const filtered = selectedCategory === 'All'
    ? STARTER_TEMPLATES
    : STARTER_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (template: typeof STARTER_TEMPLATES[0]) => {
    createProject({
      prompt: template.prompt,
      mode: 'autonomous',
      framework: template.framework,
      backend: template.backend,
      database: template.database,
      templateId: template.id,
    });
    setTemplatesModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Project Starter Gallery</h3>
              <p className="text-xs text-slate-400">Battle-tested full-stack architectures with real code and schemas.</p>
            </div>
          </div>
          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Templates */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{item.framework.split('+')[0]}</span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">1-click autonomous build</span>
                <button
                  onClick={() => handleSelectTemplate(item)}
                  className="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Fork & Build</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

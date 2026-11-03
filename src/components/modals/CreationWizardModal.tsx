import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { AutonomousMode } from '../../types';
import { Sparkles, X, ChevronDown, ChevronUp, Bot, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export function CreationWizardModal() {
  const { wizardOpen, setWizardOpen, createProject, isGenerating } = useProject();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<AutonomousMode>('autonomous');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced settings
  const [framework, setFramework] = useState('React 19 + TypeScript + Vite');
  const [backend, setBackend] = useState('Node.js + Express');
  const [database, setDatabase] = useState('PostgreSQL + Drizzle ORM');
  const [designStyle, setDesignStyle] = useState('Modern SaaS');

  if (!wizardOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    await createProject({
      prompt: prompt.trim(),
      mode,
      framework,
      backend,
      database,
      designStyle,
    });
    setWizardOpen(false);
    setPrompt('');
  };

  const samplePrompts = [
    'Build an AI student productivity platform with study tutor, task kanban, notes, and GPA analytics',
    'Create an enterprise telemetry and SaaS billing analytics platform with ARR charts and API keys',
    'Build a high-performance headless e-commerce store with product filtering, cart drawer, and checkout',
    'Develop a developer API gateway dashboard with webhook testing and real-time endpoint monitors',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Application</h3>
              <p className="text-xs text-slate-400">Transform natural-language ideas into full-stack software.</p>
            </div>
          </div>
          <button
            onClick={() => setWizardOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-slate-200 font-semibold block">
              What do you want to build? <span className="text-emerald-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Build an AI-powered student productivity platform with authentication, task management, an AI study assistant, notes, reminders, analytics, and a database."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {samplePrompts.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPrompt(s)}
                  className="text-[11px] text-slate-400 hover:text-emerald-300 bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 rounded-lg px-2.5 py-1 text-left transition-colors"
                >
                  💡 {s.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Autonomous Mode Selector (Section 6) */}
          <div className="space-y-2">
            <label className="text-slate-200 font-semibold block">Select Autonomous Operation Mode:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'instant', name: 'Instant Build', desc: 'Fast generation using sensible defaults' },
                { id: 'plan_build', name: 'Plan & Build', desc: 'Review architectural plan before code generation' },
                { id: 'autonomous', name: 'Autonomous Engineer', desc: 'Self-planning, testing, and debugging loop' },
                { id: 'expert', name: 'Expert Developer', desc: 'Deep control over dependencies & schemas' },
                { id: 'learning', name: 'Learning Mode', desc: 'Detailed code and architecture walkthroughs' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    mode === m.id
                      ? 'border-emerald-500 bg-emerald-950/30 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs">{m.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Architecture Accordion */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3 flex items-center justify-between text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-2 font-semibold">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Custom Architecture & Design System (Optional)</span>
              </div>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-950">
                <div>
                  <label className="text-slate-400 block mb-1">Frontend Framework:</label>
                  <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="React 19 + TypeScript + Vite">React 19 + TypeScript + Vite</option>
                    <option value="Next.js 15 (App Router)">Next.js 15 (App Router)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Backend Strategy:</label>
                  <select
                    value={backend}
                    onChange={(e) => setBackend(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Node.js + Express">Node.js + Express REST API</option>
                    <option value="Serverless Edge Functions">Serverless Edge Functions</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Database & ORM:</label>
                  <select
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="PostgreSQL + Drizzle ORM">PostgreSQL + Drizzle ORM</option>
                    <option value="PostgreSQL + Prisma">PostgreSQL + Prisma ORM</option>
                    <option value="Supabase Managed PostgreSQL">Supabase Managed PostgreSQL</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Design Style:</label>
                  <select
                    value={designStyle}
                    onChange={(e) => setDesignStyle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Modern SaaS">Modern SaaS (Slate & Emerald)</option>
                    <option value="Minimalist Dark">Minimalist High-Contrast</option>
                    <option value="Glassmorphism">Glassmorphism Translucent</option>
                    <option value="Neobrutalism">Neobrutalism Bold Border</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setWizardOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-950"
            >
              <Bot className="h-4 w-4" />
              <span>{isGenerating ? 'Synthesizing Architecture...' : 'Generate App with AI'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { SPECIALIZED_AGENTS } from '../constants/agents';
import { STARTER_TEMPLATES } from '../constants/templates';
import { 
  Sparkles, ArrowRight, Bot, Code, Database, 
  ShieldCheck, Cpu, Terminal, Cloud, Layers, 
  CheckCircle2, ChevronDown, ChevronUp, Play, Zap, FileCode2,
  Users, Award, Globe
} from 'lucide-react';

export function LandingView() {
  const {
    setCurrentView,
    setWizardOpen,
    setTemplatesModalOpen,
    createProject,
    selectProject,
  } = useProject();

  const [prompt, setPrompt] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    createProject({
      prompt: prompt.trim(),
      mode: 'autonomous',
    });
  };

  const samplePrompts = [
    'AI student productivity platform with study tutor, tasks, and notes',
    'Enterprise SaaS telemetry and revenue dashboard with ARR charts',
    'Headless e-commerce storefront with cart state and Stripe simulator',
    'Developer API gateway console with real-time health monitors',
  ];

  const faqs = [
    {
      q: 'Does BuildMint AI generate real code or static mockups?',
      a: 'BuildMint AI generates real, compilable React 19, TypeScript, Express REST APIs, and PostgreSQL Drizzle ORM schemas. You can inspect every file, run Vitest test suites, execute terminal commands, and export the complete source code as a ZIP archive.',
    },
    {
      q: 'How does the multi-agent architecture work?',
      a: 'BuildMint AI coordinates 10 specialized software engineering agents—including the Product Manager, UI/UX Designer, Software Architect, Frontend Developer, Backend Developer, Database Architect, QA & Testing Agent, Debugging Agent, Security Agent, and Deployment Agent—each executing domain-specific tasks.',
    },
    {
      q: 'Can I export the source code and run it locally?',
      a: 'Yes. With one click, you can export a full ZIP package containing all components, server files, database migrations, package.json, and .env.example, ready to run with `npm install && npm run dev`.',
    },
    {
      q: 'Can I connect my own GitHub repository and deploy?',
      a: 'Yes. BuildMint AI supports two-way GitHub version control synchronization and one-click production deployments to global edge targets with verified URLs and SSL.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-mono">
          <Sparkles className="h-3.5 w-3.5" />
          <span>BuildMint AI v2.4 — Next-Gen Autonomous IDE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
          From Idea to Live App <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            in Minutes.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Your AI-powered software engineering team. Transforms natural-language requirements into production-ready full-stack applications with databases, authentication, and live execution.
        </p>

        {/* Hero Prompt Input Bar */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleHeroSubmit}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build (e.g., 'AI student productivity platform with tutor and notes')..."
              className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950 shrink-0"
            >
              <span>Build App Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Prompt quick ideas */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="text-slate-500 text-[11px]">Try building:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p)}
                className="text-[11px] text-slate-400 hover:text-emerald-300 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-lg transition-colors"
              >
                {p.slice(0, 36)}...
              </button>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => selectProject('proj-student-productivity')}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Play className="h-3.5 w-3.5 text-emerald-400" />
            <span>Explore Live Demo App</span>
          </button>
          <button
            onClick={() => setTemplatesModalOpen(true)}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Browse Starter Gallery
          </button>
        </div>
      </section>

      {/* Interactive Studio Preview Mockup */}
      <section className="px-6 max-w-6xl mx-auto pb-20">
        <div 
          onClick={() => selectProject('proj-student-productivity')}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl cursor-pointer group hover:border-emerald-500/50 transition-all"
        >
          <div className="h-8 bg-slate-950 rounded-t-xl border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-[11px] text-slate-300 ml-2">BuildMint Studio — PulseDesk AI</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono group-hover:underline flex items-center gap-1">
              Click to Launch Studio <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-slate-950 rounded-b-xl min-h-[300px]">
            {/* Left preview teaser */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <Bot className="h-4 w-4 text-emerald-400" />
                AI Software Engineer
              </div>
              <p className="text-slate-400 text-[11px]">
                "I have architected the relational schema in PostgreSQL and generated the interactive study tutor with flashcard rendering."
              </p>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-400">
                ✓ 6/6 Vitest Assertions Passed
              </div>
            </div>

            {/* Center preview teaser */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white">Live Application Sandbox</span>
                  <span className="text-[11px] font-mono text-emerald-400">preview.buildmint.app</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Task: Implement Binary Search Tree</span>
                    <span className="text-rose-400 font-mono text-[10px]">High Priority</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>AI Study Tutor: Calculus & Proofs</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">Desktop 1440px · PostgreSQL Attached</span>
                <span className="text-emerald-400 font-semibold">Ready to test →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 Specialized Engineering Agents */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              An Elite Software Engineering Team on Demand
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Ten autonomous, specialized AI agents working together across product management, architecture, frontend, backend, security, and DevOps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.values(SPECIALIZED_AGENTS).map((agent) => (
              <div
                key={agent.name}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 text-xs"
              >
                <div className={`h-8 w-8 rounded-lg ${agent.avatarColor} border flex items-center justify-center font-bold text-xs`}>
                  <Bot className="h-4 w-4" />
                </div>
                <div className="font-bold text-white">{agent.name}</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{agent.shortDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Explanation (Section 3) */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              End-to-End Autonomous Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              From natural-language idea to live production application in 5 seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Describe Idea', desc: 'State your requirements in everyday human language.' },
              { step: '02', title: 'AI Planning', desc: 'Architect creates database schema and task graph.' },
              { step: '03', title: 'Code Synthesis', desc: 'Frontend and Backend agents generate production code.' },
              { step: '04', title: 'QA & Repair', desc: 'Testing agent validates and self-heals regressions.' },
              { step: '05', title: 'Deploy & Export', desc: 'One-click global hosting and complete ZIP export.' },
            ].map((wf) => (
              <div key={wf.step} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-mono text-emerald-400 text-sm font-bold">{wf.step}</span>
                <h4 className="text-sm font-bold text-white">{wf.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Pricing Section (Section 22) */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Predictable, Developer-Friendly Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Start building for free. Scale to full production workspaces as your applications grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free Developer',
                price: '$0',
                cadence: 'Forever free',
                desc: 'For hobbyists and individual exploration.',
                features: ['3 active applications', '1,000 monthly AI requests', 'Interactive Live Preview', 'ZIP source code export'],
                cta: 'Start Building Free',
                popular: false,
              },
              {
                name: 'Pro Engineer',
                price: '$29',
                cadence: 'per month',
                desc: 'For professional software builders and founders.',
                features: ['Unlimited applications', '10,000 monthly AI requests', 'Autonomous Self-Healing loop', 'Direct GitHub two-way sync', 'Global Edge CDN deployment'],
                cta: 'Upgrade to Pro',
                popular: true,
              },
              {
                name: 'Team & Scale',
                price: '$79',
                cadence: 'per month',
                desc: 'For engineering teams and startup studios.',
                features: ['Unlimited team seats', 'Dedicated PostgreSQL database', 'Priority Gemini 3.8 Flash quota', 'Custom domains & SLA guarantee'],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  plan.popular
                    ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/20'
                    : 'bg-slate-900/50 border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">{plan.name}</h3>
                    {plan.popular && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-mono font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.cadence}</span>
                  </div>
                  <p className="text-xs text-slate-400">{plan.desc}</p>
                  <ul className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => selectProject('proj-student-productivity')}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="px-6 py-20 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about the BuildMint AI platform.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-white hover:text-emerald-400"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>BuildMint AI</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setTemplatesModalOpen(true)} className="hover:text-slate-300">Templates</button>
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-slate-300">Dashboard</button>
            <button onClick={() => selectProject('proj-student-productivity')} className="hover:text-slate-300">Dev Studio</button>
          </div>
          <div>© 2026 BuildMint AI Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

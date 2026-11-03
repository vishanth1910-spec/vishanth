import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Settings, Shield, Cpu, Database, Check, X, Key, Info } from 'lucide-react';

export function SettingsModal() {
  const { settingsModalOpen, setSettingsModalOpen } = useProject();
  const [hasServerKey, setHasServerKey] = useState<boolean>(true);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [dbStatus, setDbStatus] = useState<string>('Connected (PostgreSQL 16)');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.hasGeminiKey !== undefined) setHasServerKey(data.hasGeminiKey);
      })
      .catch(() => {});
  }, []);

  if (!settingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Platform Settings & Integrations</h3>
              <p className="text-slate-400">Manage LLM models, credentials, and database providers.</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Model Configuration */}
        <div className="space-y-3">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span>AI Model & Provider</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Model:</span>
              <span className="font-mono text-emerald-400 font-semibold">gemini-3.8-flash (Latest)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">API Key Storage:</span>
              <span className="font-mono text-slate-300">Server-Side Injected (Encrypted)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Autonomous Self-Healing:</span>
              <span className="text-emerald-400 font-mono">Active (Bounded 3 Retries)</span>
            </div>
          </div>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 text-slate-400 text-[11px]">
            <Info className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Your Gemini API key is configured automatically via Settings &gt; Secrets on the server.</span>
          </div>
        </div>

        {/* Database Provider */}
        <div className="space-y-3">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Database Status</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-mono text-white font-semibold">PostgreSQL Relational DB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Connection Pool:</span>
              <span className="font-mono text-emerald-400">Ready (pgbouncer active)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ORM Schema:</span>
              <span className="font-mono text-slate-300">Drizzle ORM (Type-Safe)</span>
            </div>
          </div>
        </div>

        {/* Usage Analytics */}
        <div className="space-y-2">
          <div className="font-semibold text-slate-200">Subscription & Quota</div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">AI Requests</div>
              <div className="text-sm font-bold font-mono text-white mt-1 tabular-nums">142 / 1,000</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Build Mins</div>
              <div className="text-sm font-bold font-mono text-white mt-1 tabular-nums">48 / 500</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Deployments</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-1 tabular-nums">8 / Unlimited</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}

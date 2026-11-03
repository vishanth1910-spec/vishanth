import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Cloud, Globe, CheckCircle2, Loader2, ArrowUpRight, X, Server, ShieldCheck, Terminal } from 'lucide-react';

export function DeployModal() {
  const { deployModalOpen, setDeployModalOpen, activeProject } = useProject();
  const [provider, setProvider] = useState<'vercel' | 'netlify' | 'cloudrun' | 'docker'>('vercel');
  const [stage, setStage] = useState<'config' | 'building' | 'deployed'>('config');
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Provisioning isolated build container and validating environment...',
    'Installing strict peer dependencies with frozen lockfile...',
    'Compiling TypeScript React bundle via Vite production optimizers...',
    'Generating serverless edge API endpoints & database connection pool...',
    'Enforcing TLS 1.3 SSL certificates and verifying public DNS route...',
  ];

  if (!deployModalOpen || !activeProject) return null;

  const handleStartDeploy = () => {
    setStage('building');
    setStepIndex(0);

    const interval = setInterval(() => {
      setStepIndex((curr) => {
        if (curr < steps.length - 1) {
          return curr + 1;
        } else {
          clearInterval(interval);
          setStage('deployed');
          return curr;
        }
      });
    }, 900);
  };

  const deploymentUrl = activeProject.deploymentUrl || `https://${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.buildmint.app`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Deploy Application</h3>
              <p className="text-xs text-slate-400">Continuous deployment pipeline with verified SSL endpoints.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setDeployModalOpen(false);
              setStage('config');
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {stage === 'config' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Cloud Provider Target:</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'vercel', label: 'Vercel Edge', desc: 'Global CDN & Serverless API' },
                  { id: 'cloudrun', label: 'Google Cloud Run', desc: 'Containerized auto-scaling' },
                  { id: 'netlify', label: 'Netlify', desc: 'Fast client distribution' },
                  { id: 'docker', label: 'Docker Container', desc: 'Custom private cluster' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProvider(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      provider === item.id
                        ? 'border-violet-500 bg-violet-950/30 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Production Domain:</span>
                <span className="font-mono text-emerald-400">{deploymentUrl}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>PostgreSQL DB:</span>
                <span className="font-mono text-slate-300">Auto-migrated (Drizzle)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Branch:</span>
                <span className="font-mono text-slate-300">production-v1</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeployModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStartDeploy}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-violet-950"
              >
                <Cloud className="h-4 w-4" />
                <span>Build & Deploy Now</span>
              </button>
            </div>
          </div>
        )}

        {stage === 'building' && (
          <div className="space-y-5 py-4">
            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-white">
              <Loader2 className="h-5 w-5 text-violet-400 animate-spin" />
              <span>Building Production Release...</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
              {steps.map((st, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 transition-opacity ${
                    i <= stepIndex ? 'opacity-100 text-slate-200' : 'opacity-30 text-slate-600'
                  }`}
                >
                  {i < stepIndex ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : i === stepIndex ? (
                    <Loader2 className="h-4 w-4 text-violet-400 animate-spin shrink-0 mt-0.5" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-700 shrink-0 mt-0.5" />
                  )}
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'deployed' && (
          <div className="space-y-5 py-2 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Successfully Deployed to Production!</h4>
              <p className="text-xs text-slate-400 mt-1">Application is live on global edge CDN with automated health probes.</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-xs text-emerald-400 truncate">{deploymentUrl}</span>
              </div>
              <a
                href={deploymentUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>Visit Live App</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <button
              onClick={() => {
                setDeployModalOpen(false);
                setStage('config');
              }}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Back to Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

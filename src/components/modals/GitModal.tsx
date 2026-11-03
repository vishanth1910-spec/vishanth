import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { GitBranch, GitCommit, GitPullRequest, Check, X, Shield, ArrowUpRight } from 'lucide-react';

export function GitModal() {
  const { gitModalOpen, setGitModalOpen, activeProject } = useProject();
  const [repoName, setRepoName] = useState(activeProject?.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-app');
  const [commitMsg, setCommitMsg] = useState('feat: initial architecture with PostgreSQL schema and React UI');
  const [branch, setBranch] = useState('main');
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  if (!gitModalOpen || !activeProject) return null;

  const handlePush = () => {
    setIsPushing(true);
    setTimeout(() => {
      setIsPushing(false);
      setPushSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">GitHub Synchronization</h3>
              <p className="text-xs text-slate-400">Continuous two-way git version control.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setGitModalOpen(false);
              setPushSuccess(false);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {pushSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Pushed to GitHub Successfully!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Branch <code className="text-emerald-400 font-mono">origin/{branch}</code> is up to date with commit <code className="text-cyan-400 font-mono">f84e29a</code>.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-300 truncate">github.com/buildmint-user/{repoName}</span>
              <a
                href={`https://github.com/buildmint-user/${repoName}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View Repo</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
            <button
              onClick={() => {
                setGitModalOpen(false);
                setPushSuccess(false);
              }}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Repository:</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">github.com/buildmint-user/</span>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Branch:</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="main">main (production)</option>
                  <option value="staging">staging (preview)</option>
                  <option value="feat/ai-enhancements">feat/ai-enhancements</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Visibility:</label>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
                  Private Repository (Encrypted)
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Commit Message:</label>
              <textarea
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono resize-none focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Files to commit:</span>
                <span className="font-mono text-white">{Object.keys(activeProject.files).length} files</span>
              </div>
              <div className="flex justify-between">
                <span>Secret scanner:</span>
                <span className="font-mono text-emerald-400">0 secrets exposed</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setGitModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={isPushing}
                onClick={handlePush}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-cyan-950"
              >
                <GitCommit className="h-4 w-4" />
                <span>{isPushing ? 'Pushing Commit...' : 'Commit & Push'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

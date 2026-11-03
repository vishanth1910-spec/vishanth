import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { 
  Terminal as TerminalIcon, CheckCircle2, AlertTriangle, 
  Database, ShieldCheck, Activity, Play, Wrench, ChevronUp, ChevronDown, X
} from 'lucide-react';

export function ConsolePanel() {
  const {
    activeProject,
    runTerminalCommand,
    runTests,
    repairTestWithAI,
  } = useProject();

  const [activeTab, setActiveTab] = useState<'terminal' | 'tests' | 'database' | 'security' | 'network'>('terminal');
  const [collapsed, setCollapsed] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM tasks WHERE is_completed = false LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);

  if (!activeProject) return null;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    const cmd = cliInput.trim();
    setCliInput('');
    runTerminalCommand(cmd);
  };

  const handleRunSql = () => {
    setSqlResult([
      { id: '1', title: 'Implement Binary Search Tree in C++', course: 'CS 201', priority: 'High', is_completed: false },
      { id: '3', title: 'Draft Research Proposal on Transformer Attention', course: 'AI 405', priority: 'High', is_completed: false },
      { id: '4', title: 'Organic Chemistry Lab Prep', course: 'CHEM 210', priority: 'Low', is_completed: false },
    ]);
  };

  return (
    <div
      className={`border-t border-slate-800 bg-slate-950 flex flex-col transition-all duration-200 shrink-0 text-xs ${
        collapsed ? 'h-9' : 'h-52'
      }`}
    >
      {/* Top Console Tabs & Toggle */}
      <div className="h-9 border-b border-slate-800 bg-slate-900/80 px-3 flex items-center justify-between shrink-0 font-mono text-[11px]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab('terminal');
              if (collapsed) setCollapsed(false);
            }}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'terminal' && !collapsed ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TerminalIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('tests');
              if (collapsed) setCollapsed(false);
            }}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'tests' && !collapsed ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Tests ({activeProject.tests.filter(t => t.status === 'passed').length}/{activeProject.tests.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('database');
              if (collapsed) setCollapsed(false);
            }}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'database' && !collapsed ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span>Database</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('security');
              if (collapsed) setCollapsed(false);
            }}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'security' && !collapsed ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
            <span>Security</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('network');
              if (collapsed) setCollapsed(false);
            }}
            className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'network' && !collapsed ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>API Network</span>
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-white p-1"
          title={collapsed ? 'Expand Console' : 'Collapse Console'}
        >
          {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Console Tab Content */}
      {!collapsed && (
        <div className="flex-1 overflow-auto p-3 font-mono text-xs">
          {activeTab === 'terminal' && (
            <div className="h-full flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 select-text">
                {activeProject.terminalLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      log.type === 'command' ? 'text-white font-bold' :
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'stderr' ? 'text-rose-400' :
                      log.type === 'info' ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                  >
                    {log.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-900 mt-2">
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="npm run build, npm test, git status, deploy, clear..."
                  className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
                />
              </form>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900 font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">Vitest Test Suites</span>
                  <span className="text-emerald-400 font-mono text-[11px]">All Assertions Passed</span>
                </div>
                <button
                  onClick={runTests}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1.5 transition-colors text-xs"
                >
                  <Play className="h-3 w-3" />
                  <span>Run Vitest Suite</span>
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                {activeProject.tests.map((t) => (
                  <div
                    key={t.id}
                    className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-slate-200 font-medium">{t.name}</span>
                        <span className="text-slate-500 block text-[10px]">{t.suite}</span>
                      </div>
                    </div>
                    <span className="text-slate-500 tabular-nums">{t.durationMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleRunSql}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <Play className="h-3 w-3" />
                  <span>Query</span>
                </button>
              </div>

              {sqlResult && (
                <div className="rounded-lg border border-slate-800 overflow-x-auto bg-slate-900/40">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                      <tr>
                        <th className="p-2">id</th>
                        <th className="p-2">title</th>
                        <th className="p-2">course</th>
                        <th className="p-2">priority</th>
                        <th className="p-2">is_completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sqlResult.map((r) => (
                        <tr key={r.id} className="text-slate-300">
                          <td className="p-2 text-indigo-400">{r.id}</td>
                          <td className="p-2 text-white">{r.title}</td>
                          <td className="p-2">{r.course}</td>
                          <td className="p-2 text-amber-400">{r.priority}</td>
                          <td className="p-2">{String(r.is_completed)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-2 font-sans">
              <div className="p-3 rounded-lg bg-teal-950/20 border border-teal-800/40 text-teal-300 text-xs">
                🛡️ AI Security Agent Audit: Zero critical vulnerabilities detected. OWASP Top 10 guidelines verified.
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block">XSS Sanitization</span>
                  <span className="text-emerald-400 font-bold">Passed</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block">Secret Leaks Check</span>
                  <span className="text-emerald-400 font-bold">0 Expose</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block">RBAC Guards</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-1 font-mono text-[11px]">
              {[
                { method: 'GET', path: '/api/v1/tasks', status: 200, time: '24ms' },
                { method: 'POST', path: '/api/v1/tutor/query', status: 200, time: '180ms' },
                { method: 'GET', path: '/api/v1/notes', status: 200, time: '14ms' },
                { method: 'PATCH', path: '/api/v1/tasks/2/toggle', status: 200, time: '19ms' },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{req.method}</span>
                    <span className="text-slate-200">{req.path}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-emerald-400">{req.status} OK</span>
                    <span className="tabular-nums">{req.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

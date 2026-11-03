import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Activity, Key, 
  Search, Shield, Copy, Check, Download, RefreshCw
} from 'lucide-react';

export function SaaSAnalyticsApp() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'transactions' | 'api-keys' | 'team'>('metrics');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const transactions = [
    { id: 'TXN-9021', customer: 'Acme Cloud Corp', plan: 'Enterprise (Annual)', amount: '$14,400', status: 'success', date: 'Today, 14:22' },
    { id: 'TXN-9022', customer: 'Vektor AI Labs', plan: 'Growth Tier', amount: '$1,200', status: 'success', date: 'Today, 11:05' },
    { id: 'TXN-9023', customer: 'HyperScale Media', plan: 'Enterprise Custom', amount: '$24,000', status: 'pending', date: 'Yesterday' },
    { id: 'TXN-9024', customer: 'Synapse Tech', plan: 'Starter Team', amount: '$450', status: 'success', date: 'Nov 1, 2026' },
    { id: 'TXN-9025', customer: 'BioMatrix Systems', plan: 'Growth Tier', amount: '$1,200', status: 'failed', date: 'Oct 31, 2026' },
  ];

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch = t.customer.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div 
      className="h-full w-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden"
      data-component="SaaSAnalyticsApp"
      data-file="src/components/preview-apps/SaaSAnalyticsApp.tsx"
    >
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              NeuroMetrics
              <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-800/40">SaaS Suite</span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'metrics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === 'api-keys' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            API Keys
          </button>
        </nav>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          Live Ingestion Active
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-5">
        {activeTab === 'metrics' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs flex items-center justify-between">
                  <span>Annual Recurring Revenue</span>
                  <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">$284,500</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-mono">↑ 22.4% vs last quarter</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs flex items-center justify-between">
                  <span>Monthly Active Orgs</span>
                  <Users className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">1,429</div>
                <div className="text-[11px] text-emerald-400 mt-1 font-mono">↑ 18 new this month</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs flex items-center justify-between">
                  <span>Net Churn Rate</span>
                  <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">0.82%</div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">Industry benchmark: 2.5%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-xs flex items-center justify-between">
                  <span>API Telemetry Calls</span>
                  <Activity className="h-3.5 w-3.5 text-rose-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white mt-2 tabular-nums">48.2M</div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">Avg Latency: 28ms</div>
              </div>
            </div>

            {/* Synthetic Trend Visualizer */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Growth Trajectory (ARR)</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Historical and projected trajectory with automated forecasting.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/50">2026 Q3 Real</span>
                </div>
              </div>

              <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
                {[
                  { month: 'May', val: 40, label: '$140k' },
                  { month: 'Jun', val: 52, label: '$178k' },
                  { month: 'Jul', val: 64, label: '$210k' },
                  { month: 'Aug', val: 75, label: '$242k' },
                  { month: 'Sep', val: 88, label: '$268k' },
                  { month: 'Oct', val: 96, label: '$284k' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md hover:from-indigo-600 hover:to-indigo-400 transition-all cursor-pointer"
                      style={{ height: `${item.val}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter customer or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {(['all', 'success', 'pending', 'failed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded capitalize transition-colors ${
                      statusFilter === st ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Customer Entity</th>
                    <th className="p-3">Subscription Tier</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTxns.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono text-indigo-400">{t.id}</td>
                      <td className="p-3 font-medium text-white">{t.customer}</td>
                      <td className="p-3 text-slate-300">{t.plan}</td>
                      <td className="p-3 text-right font-mono font-semibold text-white tabular-nums">{t.amount}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                          t.status === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                          t.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
                          'bg-rose-950 text-rose-400 border border-rose-800/40'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-400 font-mono text-[11px]">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="max-w-2xl mx-auto space-y-5 py-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="h-4 w-4 text-indigo-400" />
                  Production Secret API Key
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate your backend services and pipelines with high-throughput bearer tokens.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="flex-1 font-mono text-xs text-slate-300 truncate">
                  nm_live_948f29c017d9e4a3b827e85c18402
                </span>
                <button
                  onClick={() => {
                    setApiKeyCopied(true);
                    setTimeout(() => setApiKeyCopied(false), 2000);
                  }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {apiKeyCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {apiKeyCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
                ⚡ Rate limit: 10,000 requests/minute. TLS 1.3 encrypted endpoints.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

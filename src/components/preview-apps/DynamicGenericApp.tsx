import React, { useState } from 'react';
import { Sparkles, Layers, CheckCircle2, Clock, Plus, Trash2, Filter } from 'lucide-react';

interface GenericItem {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Review' | 'Archived';
  metric: string;
  updated: string;
}

export function DynamicGenericApp({ prompt, title }: { prompt: string; title: string }) {
  const [items, setItems] = useState<GenericItem[]>([
    { id: '1', name: 'Primary Workflow Node A', category: 'Core Service', status: 'Active', metric: '99.8%', updated: '10m ago' },
    { id: '2', name: 'Secondary Ingestion Pipeline', category: 'Data Bridge', status: 'Active', metric: '1,420 rps', updated: '1h ago' },
    { id: '3', name: 'Authentication Handshake Service', category: 'Security', status: 'Review', metric: '42ms', updated: '3h ago' },
    { id: '4', name: 'Automated Event Dispatcher', category: 'Queue', status: 'Active', metric: '0 pending', updated: 'Just now' },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Review'>('All');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: GenericItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: 'User Entry',
      status: 'Active',
      metric: 'Nominal',
      updated: 'Just now',
    };
    setItems([newItem, ...items]);
    setNewItemName('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const filteredItems = filter === 'All' ? items : items.filter((i) => i.status === filter);

  return (
    <div 
      className="h-full w-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden"
      data-component="DynamicGenericApp"
      data-file="src/components/preview-apps/DynamicGenericApp.tsx"
    >
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">{title || 'Generated Application'}</h1>
            <p className="text-[10px] text-slate-400 truncate max-w-sm">{prompt}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            PostgreSQL Attached
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Application State & Records</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time CRUD operations connected to simulated database schema.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              {(['All', 'Active', 'Review'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filter === f ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Add Record Form */}
          <form onSubmit={addItem} className="flex gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="text"
              placeholder="Enter item title or data parameter..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Record
            </button>
          </form>

          {/* Item List */}
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-emerald-400">{item.category}</span>
                    <span>·</span>
                    <span>Metric: {item.metric}</span>
                    <span>·</span>
                    <span>{item.updated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    item.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                  }`}>
                    {item.status}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

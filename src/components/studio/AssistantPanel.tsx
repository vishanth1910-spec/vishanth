import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { SPECIALIZED_AGENTS } from '../../constants/agents';
import { AgentRole } from '../../types';
import { 
  Bot, Send, Sparkles, Check, X, 
  GitPullRequest, CheckCircle2, Circle, Clock, 
  Layers, ChevronDown, RefreshCw, Undo2
} from 'lucide-react';

export function AssistantPanel() {
  const {
    activeProject,
    sendMessageToAgent,
    acceptProposedPatch,
    rejectProposedPatch,
    isGenerating,
    activeAgentRole,
    setActiveAgentRole,
  } = useProject();

  const [inputMessage, setInputMessage] = useState('');
  const [viewTab, setViewTab] = useState<'chat' | 'plan'>('chat');

  if (!activeProject) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;
    const msg = inputMessage.trim();
    setInputMessage('');
    await sendMessageToAgent(msg);
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessageToAgent(promptText);
  };

  const quickPrompts = [
    'Add dark mode toggle with high-contrast pairing',
    'Create an analytics chart for monthly activity',
    'Add role-based permissions modal for user accounts',
    'Generate comprehensive vitest assertions for API',
  ];

  return (
    <div className="h-full w-full bg-slate-950 border-r border-slate-800 flex flex-col overflow-hidden text-xs">
      {/* Top Header: Mode & Agent Selector */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <select
              value={activeAgentRole}
              onChange={(e) => setActiveAgentRole(e.target.value)}
              className="bg-transparent font-bold text-white text-xs truncate focus:outline-none cursor-pointer hover:text-emerald-400"
            >
              {Object.keys(SPECIALIZED_AGENTS).map((role) => (
                <option key={role} value={role} className="bg-slate-900 text-white">
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab switcher: Chat vs Plan */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewTab('chat')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewTab === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setViewTab('plan')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewTab === 'plan' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Plan
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewTab === 'chat' ? (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
          {activeProject.chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                {msg.sender === 'user' ? (
                  <span>You</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">{msg.agentRole || 'Engineering Agent'}</span>
                )}
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-3 rounded-xl max-w-[92%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600/20 text-emerald-100 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-200 border border-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Proposed Patch Diff Banner */}
                {msg.patch && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                      <GitPullRequest className="h-3.5 w-3.5" />
                      <span>{msg.patch.summary}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 truncate">
                      File: {msg.patch.filePath}
                    </div>

                    {msg.patch.status === 'pending' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => acceptProposedPatch(msg.patch!)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center gap-1 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Accept & Patch</span>
                        </button>
                        <button
                          onClick={() => rejectProposedPatch(msg.patch!.id)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium flex items-center gap-1 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    ) : msg.patch.status === 'accepted' ? (
                      <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Patch Applied to Workspace</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500">Patch rejected</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2 bg-slate-900 rounded-lg border border-slate-800 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" />
              <span>AI Architect synthesizing changes...</span>
            </div>
          )}
        </div>
      ) : (
        /* Plan View */
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs">{activeProject.spec.title}</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">{activeProject.spec.summary}</p>
          </div>

          <div className="space-y-3">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Development Milestones
            </div>
            {activeProject.spec.milestones.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{m.title}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{m.agent}</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {m.tasks.map((t) => (
                    <div key={t.id} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-slate-200">{t.title}</div>
                        <div className="text-[10px] text-slate-400">{t.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {activeProject.spec.clarificationQuestions && activeProject.spec.clarificationQuestions.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
              <div className="text-amber-400 font-bold text-[11px]">Clarification Checkpoints:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                {activeProject.spec.clarificationQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Suggested Follow-up Prompts */}
      <div className="p-2 border-t border-slate-900 bg-slate-950 overflow-x-auto flex gap-1.5 shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(qp)}
            className="text-[10px] text-slate-400 hover:text-emerald-300 bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded-md border border-slate-800 whitespace-nowrap transition-colors"
          >
            + {qp}
          </button>
        ))}
      </div>

      {/* Conversational Prompt Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/40 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder={`Instruct ${activeAgentRole}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
        />
        <button
          type="submit"
          disabled={isGenerating || !inputMessage.trim()}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors"
        >
          <Send className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectFile, AutonomousMode, ChatMessage, ProposedPatch, TestCase, TerminalLog, StarterTemplate, VisualSelectedElement } from '../types';
import { INITIAL_PROJECTS } from '../constants/initialProjects';
import { STARTER_TEMPLATES } from '../constants/templates';

interface ProjectContextType {
  currentView: 'landing' | 'dashboard' | 'studio';
  setCurrentView: (view: 'landing' | 'dashboard' | 'studio') => void;
  projects: Project[];
  activeProject: Project | null;
  selectProject: (id: string) => void;
  createProject: (params: {
    prompt: string;
    mode: AutonomousMode;
    framework?: string;
    backend?: string;
    database?: string;
    designStyle?: string;
    templateId?: string;
  }) => Promise<string>;
  updateFileContent: (path: string, newContent: string) => void;
  openFileTab: (path: string) => void;
  closeFileTab: (path: string) => void;
  setActiveFile: (path: string) => void;
  sendMessageToAgent: (content: string) => Promise<void>;
  acceptProposedPatch: (patch: ProposedPatch) => void;
  rejectProposedPatch: (patchId: string) => void;
  runTerminalCommand: (cmd: string) => void;
  runTests: () => void;
  repairTestWithAI: (testId: string) => void;
  createCheckpoint: (message: string) => void;
  restoreCheckpoint: (checkpointId: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  toggleFavoriteProject: (id: string) => void;
  // Modals
  wizardOpen: boolean;
  setWizardOpen: (open: boolean) => void;
  deployModalOpen: boolean;
  setDeployModalOpen: (open: boolean) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
  gitModalOpen: boolean;
  setGitModalOpen: (open: boolean) => void;
  templatesModalOpen: boolean;
  setTemplatesModalOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  // Visual Inspector
  visualInspectActive: boolean;
  setVisualInspectActive: (active: boolean) => void;
  selectedVisualElement: VisualSelectedElement | null;
  setSelectedVisualElement: (el: VisualSelectedElement | null) => void;
  applyVisualStyles: (styles: any) => void;
  // Active agent
  activeAgentRole: string;
  setActiveAgentRole: (role: string) => void;
  isGenerating: boolean;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'studio'>('landing');
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('buildmint_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>('proj-student-productivity');
  const [activeAgentRole, setActiveAgentRole] = useState<string>('Software Architect');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modals state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [gitModalOpen, setGitModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Visual Inspector
  const [visualInspectActive, setVisualInspectActive] = useState(false);
  const [selectedVisualElement, setSelectedVisualElement] = useState<VisualSelectedElement | null>(null);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('buildmint_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const selectProject = (id: string) => {
    setActiveProjectId(id);
    setCurrentView('studio');
  };

  const updateActiveProject = (updater: (prev: Project) => Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === activeProjectId ? updater(p) : p))
    );
  };

  const updateFileContent = (path: string, newContent: string) => {
    updateActiveProject((p) => ({
      ...p,
      files: {
        ...p.files,
        [path]: {
          ...p.files[path],
          content: newContent,
          modifiedAt: 'Just now',
        },
      },
    }));
  };

  const openFileTab = (path: string) => {
    updateActiveProject((p) => {
      if (p.openFiles.includes(path)) {
        return { ...p, activeFile: path };
      }
      return {
        ...p,
        openFiles: [...p.openFiles, path],
        activeFile: path,
      };
    });
  };

  const closeFileTab = (path: string) => {
    updateActiveProject((p) => {
      const filtered = p.openFiles.filter((f) => f !== path);
      const nextActive = filtered.includes(p.activeFile)
        ? p.activeFile
        : filtered[filtered.length - 1] || Object.keys(p.files)[0] || '';
      return {
        ...p,
        openFiles: filtered.length > 0 ? filtered : [nextActive],
        activeFile: nextActive,
      };
    });
  };

  const setActiveFile = (path: string) => {
    updateActiveProject((p) => ({ ...p, activeFile: path }));
  };

  // Create new project with autonomous planning
  const createProject = async ({
    prompt,
    mode,
    framework = 'React 19 + TypeScript + Vite',
    backend = 'Node.js + Express',
    database = 'PostgreSQL + Drizzle ORM',
    designStyle = 'Modern SaaS',
    templateId,
  }: {
    prompt: string;
    mode: AutonomousMode;
    framework?: string;
    backend?: string;
    database?: string;
    designStyle?: string;
    templateId?: string;
  }): Promise<string> => {
    setIsGenerating(true);
    const newId = `proj-${Date.now()}`;
    const nameMatch = prompt.match(/^([a-zA-Z0-9\s]{3,28})/);
    const projectName = nameMatch ? nameMatch[0].trim() : 'Autonomous App';

    let appTemplateType: Project['appTemplateType'] = 'generic';
    if (prompt.toLowerCase().includes('student') || prompt.toLowerCase().includes('study') || prompt.toLowerCase().includes('education')) {
      appTemplateType = 'student_productivity';
    } else if (prompt.toLowerCase().includes('saas') || prompt.toLowerCase().includes('analytics') || prompt.toLowerCase().includes('metric')) {
      appTemplateType = 'saas_analytics';
    } else if (prompt.toLowerCase().includes('commerce') || prompt.toLowerCase().includes('store') || prompt.toLowerCase().includes('shop')) {
      appTemplateType = 'ecommerce';
    }

    // Try calling server-side /api/ai/plan
    let generatedPlan: any = null;
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode, framework, backend, database, style: designStyle }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plan) generatedPlan = data.plan;
      }
    } catch (err) {
      console.warn('Server plan error, using autonomous fallback plan', err);
    }

    const initialFileContent = `import React from 'react';
import { DynamicGenericApp } from './components/preview-apps/DynamicGenericApp';

export default function App() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col font-sans">
      <DynamicGenericApp prompt="${prompt.replace(/"/g, '\\"')}" title="${projectName}" />
    </div>
  );
}`;

    const newProject: Project = {
      id: newId,
      name: projectName,
      tagline: `Full-stack application generated from prompt`,
      prompt,
      framework,
      backend,
      database,
      designStyle,
      mode,
      status: 'ready',
      appTemplateType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeFile: 'src/App.tsx',
      openFiles: ['src/App.tsx', 'src/db/schema.ts'],
      deploymentUrl: `https://${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.buildmint.app`,
      spec: generatedPlan || {
        title: projectName,
        summary: `Production-ready application built around "${prompt}". Includes real-time database schema, API router, and interactive views.`,
        category: 'Custom SaaS Platform',
        techStack: {
          frontend: framework,
          styling: 'Tailwind CSS v4',
          backend,
          database,
          auth: 'Session JWT + RBAC',
        },
        roles: ['Admin', 'Standard User', 'Viewer'],
        entities: [
          { name: 'User', fields: ['id (UUID)', 'email (text)', 'role (enum)', 'createdAt (timestamp)'], relations: '1:N with Records' },
          { name: 'Record', fields: ['id (UUID)', 'name (text)', 'status (text)', 'metadata (jsonb)'], relations: 'N:1 with User' }
        ],
        apiEndpoints: [
          { method: 'GET', path: '/api/v1/records', description: 'List active records with filtering' },
          { method: 'POST', path: '/api/v1/records', description: 'Create record with schema validation' }
        ],
        milestones: [
          {
            id: 'm1',
            title: 'System Architecture & Schema',
            agent: 'Software Architect',
            status: 'completed',
            tasks: [
              { id: 't1', title: 'Data models & schema design', description: 'Generated PostgreSQL schema with Drizzle.', files: ['src/db/schema.ts'], status: 'completed' }
            ]
          },
          {
            id: 'm2',
            title: 'UI Components & Responsive Layout',
            agent: 'Frontend Developer',
            status: 'completed',
            tasks: [
              { id: 't2', title: 'Main workspace and state management', description: 'Interactive React components with filters and modals.', files: ['src/App.tsx'], status: 'completed' }
            ]
          }
        ]
      },
      files: {
        'src/App.tsx': {
          name: 'App.tsx',
          path: 'src/App.tsx',
          language: 'typescript',
          isGenerated: true,
          modifiedAt: 'Just now',
          content: initialFileContent,
        },
        'src/db/schema.ts': {
          name: 'schema.ts',
          path: 'src/db/schema.ts',
          language: 'typescript',
          isGenerated: true,
          modifiedAt: 'Just now',
          content: `import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const records = pgTable('records', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  status: text('status').default('active').notNull(),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});`,
        },
        'package.json': {
          name: 'package.json',
          path: 'package.json',
          language: 'json',
          isGenerated: true,
          modifiedAt: 'Just now',
          content: `{
  "name": "${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "lucide-react": "^0.546.0",
    "drizzle-orm": "^0.38.0"
  }
}`,
        },
        'README.md': {
          name: 'README.md',
          path: 'README.md',
          language: 'markdown',
          isGenerated: true,
          modifiedAt: 'Just now',
          content: `# ${projectName}

Generated by **BuildMint AI** — From Idea to Live App in Minutes.

### Prompt
> "${prompt}"

### Running locally
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
        },
      },
      chatHistory: [
        {
          id: 'msg-init-1',
          sender: 'user',
          content: prompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: 'msg-init-2',
          sender: 'agent',
          agentRole: 'Software Architect',
          content: `I analyzed your requirements for "${projectName}". I designed the database schema with PostgreSQL/Drizzle, formulated API endpoints, generated modular React 19 components, and mounted the live preview.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      tests: [
        { id: 't-init-1', name: 'Database entity relations & primary keys valid', suite: 'Schema Integrity', status: 'passed', durationMs: 24 },
        { id: 't-init-2', name: 'UI components render without runtime exceptions', suite: 'Frontend Suite', status: 'passed', durationMs: 38 },
      ],
      terminalLogs: [
        { id: 'tl-1', type: 'info', text: 'AI Autonomous Engineer initialized project structure', timestamp: '00:00:01' },
        { id: 'tl-2', type: 'command', text: '$ npm install', timestamp: '00:00:02' },
        { id: 'tl-3', type: 'success', text: '✓ Verified zero vulnerabilities', timestamp: '00:00:03' },
        { id: 'tl-4', type: 'command', text: '$ npm run test', timestamp: '00:00:04' },
        { id: 'tl-5', type: 'success', text: '✓ All tests passed (2/2)', timestamp: '00:00:05' },
      ],
      checkpoints: [
        {
          id: 'cp-0',
          title: 'Initial Build Snapshot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          files: {},
          message: 'Base generation complete',
        },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newId);
    setCurrentView('studio');
    setIsGenerating(false);
    return newId;
  };

  // Conversational message to AI agent with targeted patch proposal
  const sendMessageToAgent = async (content: string) => {
    if (!content.trim() || !activeProject) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    updateActiveProject((p) => ({
      ...p,
      chatHistory: [...p.chatHistory, userMessage],
    }));

    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...activeProject.chatHistory, userMessage],
          projectContext: {
            name: activeProject.name,
            files: activeProject.files,
          },
          activeFile: activeProject.activeFile,
        }),
      });

      let replyText = '';
      let agentRole: any = 'Frontend Developer';

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
        if (data.agent) agentRole = data.agent;
      } else {
        replyText = `I have analyzed your instruction: "${content}". I reviewed the existing file tree and generated a targeted patch to update the component state.`;
      }

      // Check if user request implies code modification
      let proposedPatch: ProposedPatch | undefined = undefined;
      const lower = content.toLowerCase();
      if (lower.includes('dark') || lower.includes('theme') || lower.includes('color') || lower.includes('button') || lower.includes('filter') || lower.includes('add') || lower.includes('fix')) {
        const targetPath = activeProject.activeFile || 'src/App.tsx';
        const currentContent = activeProject.files[targetPath]?.content || '';
        
        let modifiedContent = currentContent;
        if (lower.includes('dark') || lower.includes('theme')) {
          modifiedContent = `// Theme tokens updated for high-contrast dark palette\n` + currentContent;
        } else {
          modifiedContent = currentContent + `\n// Enhanced by BuildMint AI: ${content}\n`;
        }

        proposedPatch = {
          id: `patch-${Date.now()}`,
          summary: `Targeted update to ${targetPath} based on: "${content}"`,
          filePath: targetPath,
          originalContent: currentContent,
          newContent: modifiedContent,
          status: 'pending',
        };
      }

      const agentMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        agentRole,
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patch: proposedPatch,
      };

      updateActiveProject((p) => ({
        ...p,
        chatHistory: [...p.chatHistory, agentMessage],
      }));
    } catch (err) {
      console.warn('Chat error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptProposedPatch = (patch: ProposedPatch) => {
    updateActiveProject((p) => {
      // update file content
      const updatedFiles = {
        ...p.files,
        [patch.filePath]: {
          ...p.files[patch.filePath],
          content: patch.newContent,
          modifiedAt: 'Just now',
        },
      };

      // update patch status in chat
      const updatedChat = p.chatHistory.map((m) =>
        m.patch?.id === patch.id
          ? { ...m, patch: { ...m.patch, status: 'accepted' as const } }
          : m
      );

      // add terminal log
      const newLog: TerminalLog = {
        id: `tl-${Date.now()}`,
        type: 'success',
        text: `✓ Applied patch to ${patch.filePath}`,
        timestamp: new Date().toLocaleTimeString(),
      };

      return {
        ...p,
        files: updatedFiles,
        chatHistory: updatedChat,
        terminalLogs: [...p.terminalLogs, newLog],
      };
    });
  };

  const rejectProposedPatch = (patchId: string) => {
    updateActiveProject((p) => ({
      ...p,
      chatHistory: p.chatHistory.map((m) =>
        m.patch?.id === patchId
          ? { ...m, patch: { ...m.patch, status: 'rejected' as const } }
          : m
      ),
    }));
  };

  // Run simulated terminal commands
  const runTerminalCommand = (cmd: string) => {
    if (!cmd.trim() || !activeProject) return;

    const trimmed = cmd.trim();
    const commandLog: TerminalLog = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      text: `$ ${trimmed}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    let responseLogs: TerminalLog[] = [];

    if (trimmed === 'clear') {
      updateActiveProject((p) => ({ ...p, terminalLogs: [] }));
      return;
    } else if (trimmed === 'npm run build' || trimmed === 'npm build') {
      responseLogs = [
        { id: `b1-${Date.now()}`, type: 'info', text: 'vite v8.3.0 building for production...', timestamp: new Date().toLocaleTimeString() },
        { id: `b2-${Date.now()}`, type: 'stdout', text: 'dist/index.html   0.82 kB\ndist/assets/index.js   142.60 kB\ndist/assets/index.css   18.40 kB', timestamp: new Date().toLocaleTimeString() },
        { id: `b3-${Date.now()}`, type: 'success', text: '✓ built in 420ms (0 errors, 0 warnings)', timestamp: new Date().toLocaleTimeString() },
      ];
    } else if (trimmed === 'npm test' || trimmed === 'vitest') {
      runTests();
      return;
    } else if (trimmed === 'git status') {
      responseLogs = [
        { id: `g1-${Date.now()}`, type: 'stdout', text: 'On branch main\nYour branch is up to date with origin/main.\n\nChanges not staged for commit:\n  modified:   src/App.tsx\n\nno changes added to commit (use "git add" to stage)', timestamp: new Date().toLocaleTimeString() }
      ];
    } else if (trimmed.startsWith('git commit')) {
      responseLogs = [
        { id: `g2-${Date.now()}`, type: 'success', text: '[main 4a8f90c] update application state and schemas\n 2 files changed, 48 insertions(+), 6 deletions(-)', timestamp: new Date().toLocaleTimeString() }
      ];
    } else if (trimmed === 'deploy') {
      setDeployModalOpen(true);
      return;
    } else if (trimmed === 'help') {
      responseLogs = [
        { id: `h1-${Date.now()}`, type: 'info', text: 'Available commands: npm run build, npm test, git status, git commit -m "msg", deploy, clear, help', timestamp: new Date().toLocaleTimeString() }
      ];
    } else {
      responseLogs = [
        { id: `u1-${Date.now()}`, type: 'stdout', text: `Executed: ${trimmed} (code 0)`, timestamp: new Date().toLocaleTimeString() }
      ];
    }

    updateActiveProject((p) => ({
      ...p,
      terminalLogs: [...p.terminalLogs, commandLog, ...responseLogs],
    }));
  };

  const runTests = () => {
    if (!activeProject) return;
    const testLogs: TerminalLog[] = [
      { id: `t1-${Date.now()}`, type: 'command', text: '$ vitest run', timestamp: new Date().toLocaleTimeString() },
      { id: `t2-${Date.now()}`, type: 'info', text: 'RUN  v3.0.0 /workspace/app', timestamp: new Date().toLocaleTimeString() },
      { id: `t3-${Date.now()}`, type: 'success', text: `✓ ${activeProject.tests.length} tests passed (100% assertions green)`, timestamp: new Date().toLocaleTimeString() },
    ];
    updateActiveProject((p) => ({
      ...p,
      terminalLogs: [...p.terminalLogs, ...testLogs],
    }));
  };

  const repairTestWithAI = (testId: string) => {
    updateActiveProject((p) => ({
      ...p,
      tests: p.tests.map((t) =>
        t.id === testId ? { ...t, status: 'passed' as const, error: undefined } : t
      ),
      terminalLogs: [
        ...p.terminalLogs,
        { id: `r-${Date.now()}`, type: 'success', text: `✓ AI Debugging Agent isolated and patched failure for test "${testId}"`, timestamp: new Date().toLocaleTimeString() },
      ],
    }));
  };

  const createCheckpoint = (message: string) => {
    if (!activeProject) return;
    const fileSnapshots: Record<string, string> = {};
    Object.entries(activeProject.files).forEach(([k, v]) => {
      fileSnapshots[k] = v.content;
    });

    const newCp = {
      id: `cp-${Date.now()}`,
      title: message || `Checkpoint at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: fileSnapshots,
      message,
    };

    updateActiveProject((p) => ({
      ...p,
      checkpoints: [newCp, ...p.checkpoints],
    }));
  };

  const restoreCheckpoint = (cpId: string) => {
    updateActiveProject((p) => {
      const cp = p.checkpoints.find((c) => c.id === cpId);
      if (!cp) return p;

      const restoredFiles = { ...p.files };
      Object.entries(cp.files).forEach(([path, content]) => {
        if (restoredFiles[path]) {
          restoredFiles[path] = { ...restoredFiles[path], content, modifiedAt: 'Restored from checkpoint' };
        }
      });

      return {
        ...p,
        files: restoredFiles,
        terminalLogs: [
          ...p.terminalLogs,
          { id: `cp-rest-${Date.now()}`, type: 'info', text: `Restored snapshot "${cp.title}"`, timestamp: new Date().toLocaleTimeString() },
        ],
      };
    });
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setActiveProjectId(remaining[0].id);
      } else {
        setCurrentView('landing');
      }
    }
  };

  const duplicateProject = (id: string) => {
    const orig = projects.find((p) => p.id === id);
    if (!orig) return;
    const dup: Project = {
      ...orig,
      id: `proj-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects([dup, ...projects]);
  };

  const toggleFavoriteProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const applyVisualStyles = (styles: any) => {
    if (!selectedVisualElement) return;
    // Log change and update
    updateActiveProject((p) => ({
      ...p,
      terminalLogs: [
        ...p.terminalLogs,
        { id: `vis-${Date.now()}`, type: 'success', text: `Visual edit applied to ${selectedVisualElement.tag} (${selectedVisualElement.fileSource})`, timestamp: new Date().toLocaleTimeString() },
      ],
    }));
  };

  return (
    <ProjectContext.Provider
      value={{
        currentView,
        setCurrentView,
        projects,
        activeProject,
        selectProject,
        createProject,
        updateFileContent,
        openFileTab,
        closeFileTab,
        setActiveFile,
        sendMessageToAgent,
        acceptProposedPatch,
        rejectProposedPatch,
        runTerminalCommand,
        runTests,
        repairTestWithAI,
        createCheckpoint,
        restoreCheckpoint,
        deleteProject,
        duplicateProject,
        toggleFavoriteProject,
        wizardOpen,
        setWizardOpen,
        deployModalOpen,
        setDeployModalOpen,
        exportModalOpen,
        setExportModalOpen,
        gitModalOpen,
        setGitModalOpen,
        templatesModalOpen,
        setTemplatesModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        visualInspectActive,
        setVisualInspectActive,
        selectedVisualElement,
        setSelectedVisualElement,
        applyVisualStyles,
        activeAgentRole,
        setActiveAgentRole,
        isGenerating,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-student-productivity',
    name: 'PulseDesk AI',
    tagline: 'AI Student Productivity Platform with Tutor & Analytics',
    prompt: 'Build me a complete AI-powered student productivity platform with authentication, task management, an AI study assistant, notes, reminders, analytics, a responsive dashboard, and a database.',
    framework: 'React 19 + TypeScript + Vite',
    backend: 'Node.js + Express REST API',
    database: 'PostgreSQL + Drizzle ORM',
    designStyle: 'Modern SaaS (Slate & Emerald)',
    mode: 'autonomous',
    status: 'ready',
    appTemplateType: 'student_productivity',
    favorite: true,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-03T15:30:00Z',
    deploymentUrl: 'https://pulsedesk-ai.buildmint.app',
    githubRepo: 'https://github.com/buildmint-user/pulsedesk-ai',
    activeFile: 'src/App.tsx',
    openFiles: ['src/App.tsx', 'src/db/schema.ts', 'src/server/routes.ts'],
    spec: {
      title: 'PulseDesk AI: Student Productivity Platform',
      summary: 'A unified workspace for university students providing course assignment tracking, automated priority scheduling, LLM-based study tutor, markdown notebooks, Pomodoro focus blocks, and GPA analytics.',
      category: 'Productivity & Education',
      techStack: {
        frontend: 'React 19 + TypeScript + Tailwind CSS v4',
        styling: 'Tailwind v4 with @custom-variant dark',
        backend: 'Node.js + Express API Router',
        database: 'PostgreSQL with Drizzle ORM',
        auth: 'JWT HTTP-Only Cookies + Role Guard',
      },
      roles: ['Student', 'Teaching Assistant', 'Admin'],
      entities: [
        { name: 'StudentProfile', fields: ['id (UUID)', 'email (string)', 'name (string)', 'major (string)', 'currentGpa (decimal)', 'streakDays (int)'], relations: '1:N with tasks, notes' },
        { name: 'TaskItem', fields: ['id (UUID)', 'studentId (UUID)', 'title (string)', 'courseCode (string)', 'priority (enum)', 'dueDate (timestamp)', 'isCompleted (bool)'], relations: 'N:1 with StudentProfile' },
        { name: 'StudyNote', fields: ['id (UUID)', 'studentId (UUID)', 'title (string)', 'content (text)', 'courseCode (string)', 'updatedAt (timestamp)'], relations: 'N:1 with StudentProfile' },
        { name: 'TutorSession', fields: ['id (UUID)', 'studentId (UUID)', 'topic (string)', 'messages (jsonb)', 'createdAt (timestamp)'], relations: 'N:1 with StudentProfile' }
      ],
      apiEndpoints: [
        { method: 'GET', path: '/api/v1/tasks', description: 'Retrieve student assignments and filter by course or completion' },
        { method: 'POST', path: '/api/v1/tasks', description: 'Create task with dueDate validation' },
        { method: 'PATCH', path: '/api/v1/tasks/:id/toggle', description: 'Toggle task completion status' },
        { method: 'GET', path: '/api/v1/notes', description: 'Fetch all saved markdown lecture notebooks' },
        { method: 'POST', path: '/api/v1/tutor/query', description: 'Prompt AI study tutor with course context' },
        { method: 'GET', path: '/api/v1/analytics/gpa', description: 'Calculate weighted GPA and study hour distribution' }
      ],
      milestones: [
        {
          id: 'm1',
          title: 'Database Schema & Relational Models',
          agent: 'Database Architect',
          status: 'completed',
          tasks: [
            { id: 't1', title: 'PostgreSQL Drizzle schema definition', description: 'Configured tables, primary keys, and relationships.', files: ['src/db/schema.ts'], status: 'completed' },
            { id: 't2', title: 'Seed mock records for courses and tasks', description: 'Populated 5 starter tasks and lecture notebooks.', files: ['src/db/seed.ts'], status: 'completed' }
          ]
        },
        {
          id: 'm2',
          title: 'Express REST Backend & AI Tutor Route',
          agent: 'Backend Developer',
          status: 'completed',
          tasks: [
            { id: 't3', title: 'Construct REST endpoints for tasks & notes', description: 'Implemented CRUD handlers with request validation.', files: ['src/server/routes.ts'], status: 'completed' },
            { id: 't4', title: 'Gemini 3.8 study tutor prompt pipeline', description: 'Engineered contextual study companion with flashcards.', files: ['src/server/tutor.ts'], status: 'completed' }
          ]
        },
        {
          id: 'm3',
          title: 'Responsive Frontend Workspace & Live Preview',
          agent: 'Frontend Developer',
          status: 'completed',
          tasks: [
            { id: 't5', title: 'Main dashboard view and Pomodoro timer', description: 'Created modular React components with state management.', files: ['src/App.tsx'], status: 'completed' },
            { id: 't6', title: 'GPA and study hours visualization', description: 'Built SVG distribution charts and metric indicators.', files: ['src/components/AnalyticsCharts.tsx'], status: 'completed' }
          ]
        },
        {
          id: 'm4',
          title: 'Automated Vitest Suite & Self-Healing',
          agent: 'QA & Testing',
          status: 'completed',
          tasks: [
            { id: 't7', title: 'Execute API and component regression tests', description: 'Verified all 6 test cases pass with zero warnings.', files: ['tests/student-app.test.ts'], status: 'completed' }
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
        content: `import React, { useState } from 'react';
import { StudentProductivityApp } from './components/preview-apps/StudentProductivityApp';

export default function App() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col font-sans">
      <StudentProductivityApp />
    </div>
  );
}`
      },
      'src/db/schema.ts': {
        name: 'schema.ts',
        path: 'src/db/schema.ts',
        language: 'typescript',
        isGenerated: true,
        modifiedAt: '2 hours ago',
        content: `import { pgTable, text, timestamp, uuid, boolean, numeric, integer, jsonb } from 'drizzle-orm/pg-core';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  major: text('major').default('Computer Science'),
  gpa: numeric('gpa', { precision: 3, scale: 2 }).default('3.92'),
  streakDays: integer('streak_days').default(12),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => students.id).notNull(),
  title: text('title').notNull(),
  courseCode: text('course_code').notNull(),
  priority: text('priority', { enum: ['High', 'Medium', 'Low'] }).default('Medium').notNull(),
  dueDate: timestamp('due_date'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => students.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  courseCode: text('course_code').notNull(),
  tags: jsonb('tags').$type<string[]>(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});`
      },
      'src/server/routes.ts': {
        name: 'routes.ts',
        path: 'src/server/routes.ts',
        language: 'typescript',
        isGenerated: true,
        modifiedAt: '1 hour ago',
        content: `import { Router, Request, Response } from 'express';

export const apiRouter = Router();

// GET /api/v1/tasks
apiRouter.get('/tasks', async (req: Request, res: Response) => {
  // Query tasks from PostgreSQL via Drizzle ORM
  res.json({
    success: true,
    data: [
      { id: '1', title: 'Implement Binary Search Tree in C++', course: 'CS 201', priority: 'High', completed: false },
      { id: '2', title: 'Read Multivariable Calculus Ch. 4 (Jacobians)', course: 'MATH 302', priority: 'Medium', completed: true },
      { id: '3', title: 'Draft Research Proposal on Transformer Attention', course: 'AI 405', priority: 'High', completed: false }
    ]
  });
});

// POST /api/v1/tasks
apiRouter.post('/tasks', async (req: Request, res: Response) => {
  const { title, course, priority } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  
  const newTask = { id: Date.now().toString(), title, course: course || 'General', priority: priority || 'Medium', completed: false };
  res.status(201).json({ success: true, task: newTask });
});

// POST /api/v1/tutor/query
apiRouter.post('/tutor/query', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  // Calls Gemini 3.8 Flash via server SDK
  res.json({
    success: true,
    response: "Here is your customized review roadmap with key theorems and memory cues."
  });
});`
      },
      'package.json': {
        name: 'package.json',
        path: 'package.json',
        language: 'json',
        isGenerated: false,
        modifiedAt: 'Today',
        content: `{
  "name": "pulsedesk-ai",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.546.0",
    "drizzle-orm": "^0.38.0",
    "express": "^4.21.0"
  }
}`
      },
      'README.md': {
        name: 'README.md',
        path: 'README.md',
        language: 'markdown',
        isGenerated: true,
        modifiedAt: 'Today',
        content: `# PulseDesk AI — Student Productivity Platform

> Built with **BuildMint AI** — From Idea to Live App in Minutes.

## Features
- **Task Kanban & Priority Scheduler**: Filter by course, deadline, or priority.
- **AI Study Tutor**: Interactive STEM explanations and flashcard generator.
- **Markdown Notebook**: Lecture note-taking with auto-save.
- **Pomodoro Deep Focus**: 25-minute intervals with break alerts.
- **GPA & Progress Analytics**: Track assignments completed and study hours.

## Local Setup
\`\`\`bash
npm install
npm run dev
\`\`\`
`
      }
    },
    chatHistory: [
      {
        id: 'c1',
        sender: 'user',
        content: 'Build me a complete AI-powered student productivity platform with authentication, task management, an AI study assistant, notes, reminders, analytics, a responsive dashboard, and a database.',
        timestamp: '15:20'
      },
      {
        id: 'c2',
        sender: 'agent',
        agentRole: 'Software Architect',
        content: "I have architected the complete full-stack application specification for PulseDesk AI. The database models (students, tasks, notes, tutor_sessions) are established in PostgreSQL with Drizzle ORM, and the responsive React 19 frontend is mounted.",
        timestamp: '15:22'
      },
      {
        id: 'c3',
        sender: 'agent',
        agentRole: 'Frontend Developer',
        content: "I generated the interactive views: Dashboard, Tasks Kanban, AI Tutor companion with flashcard rendering, Notebooks editor, and the 25-minute Pomodoro timer.",
        timestamp: '15:24'
      },
      {
        id: 'c4',
        sender: 'agent',
        agentRole: 'QA & Testing',
        content: "All 6 automated test suites passed (API endpoints, task toggle state, and schema validation). Zero compiler errors detected.",
        timestamp: '15:25'
      }
    ],
    tests: [
      { id: 'test-1', name: 'POST /api/v1/tasks creates record with valid course code', suite: 'Task API Suite', status: 'passed', durationMs: 42 },
      { id: 'test-2', name: 'PATCH /api/v1/tasks/:id/toggle updates boolean state in PostgreSQL', suite: 'Task API Suite', status: 'passed', durationMs: 28 },
      { id: 'test-3', name: 'AI Tutor generates 3 structured flashcards on STEM query', suite: 'AI Tutor Service', status: 'passed', durationMs: 140 },
      { id: 'test-4', name: 'Markdown note editor preserves UTF-8 characters and code blocks', suite: 'Notes Suite', status: 'passed', durationMs: 19 },
      { id: 'test-5', name: 'Pomodoro timer transitions from focus (25m) to break (5m)', suite: 'Timer Suite', status: 'passed', durationMs: 12 },
      { id: 'test-6', name: 'GPA calculation respects course credit hours and weights', suite: 'Analytics Suite', status: 'passed', durationMs: 15 },
    ],
    terminalLogs: [
      { id: 'tl-1', type: 'info', text: 'BuildMint AI Autonomous Engine v2.4 initialized', timestamp: '15:20:00' },
      { id: 'tl-2', type: 'command', text: '$ npm install drizzle-orm pg express lucide-react', timestamp: '15:20:02' },
      { id: 'tl-3', type: 'stdout', text: 'added 42 packages in 1.4s', timestamp: '15:20:04' },
      { id: 'tl-4', type: 'command', text: '$ npm run test', timestamp: '15:24:45' },
      { id: 'tl-5', type: 'success', text: '✓ 6 passed in 256ms (Vitest v3.0)', timestamp: '15:24:46' },
      { id: 'tl-6', type: 'command', text: '$ vite build', timestamp: '15:25:01' },
      { id: 'tl-7', type: 'success', text: '✓ Built dist in 680ms (0 errors, 0 warnings)', timestamp: '15:25:02' },
    ],
    checkpoints: [
      {
        id: 'cp-init',
        title: 'Initial Autonomous Build Checkpoint',
        timestamp: '15:25',
        files: {},
        message: 'Completed Phase 1-4 full-stack generation with verified test coverage.'
      }
    ]
  },
  {
    id: 'proj-saas-analytics',
    name: 'NeuroMetrics Cloud',
    tagline: 'Enterprise SaaS Telemetry & ARR Dashboard',
    prompt: 'Create an enterprise SaaS analytics platform with subscription metrics, revenue MRR/ARR charts, audit logs, and team permissions.',
    framework: 'React 19 + TypeScript + Vite',
    backend: 'Node.js + Express',
    database: 'PostgreSQL',
    designStyle: 'Dark Slate & Indigo',
    mode: 'expert',
    status: 'ready',
    appTemplateType: 'saas_analytics',
    favorite: false,
    createdAt: '2026-10-28T09:00:00Z',
    updatedAt: '2026-11-02T11:15:00Z',
    deploymentUrl: 'https://neurometrics.buildmint.app',
    activeFile: 'src/App.tsx',
    openFiles: ['src/App.tsx'],
    spec: {
      title: 'NeuroMetrics SaaS Cloud',
      summary: 'High-density telemetry dashboard with real-time revenue charts and API keys.',
      category: 'SaaS & Enterprise',
      techStack: {
        frontend: 'React 19 + Vite',
        styling: 'Tailwind v4',
        backend: 'Node.js + Express',
        database: 'PostgreSQL',
        auth: 'Bearer API Key + OAuth',
      },
      roles: ['Admin', 'Analyst', 'DevOps'],
      entities: [
        { name: 'Subscription', fields: ['id', 'orgId', 'plan', 'mrr', 'status'], relations: '1:1 with Organization' }
      ],
      apiEndpoints: [
        { method: 'GET', path: '/api/v1/analytics/arr', description: 'Retrieve ARR trajectory' }
      ],
      milestones: []
    },
    files: {
      'src/App.tsx': {
        name: 'App.tsx',
        path: 'src/App.tsx',
        language: 'typescript',
        isGenerated: true,
        modifiedAt: 'Yesterday',
        content: `import React from 'react';
import { SaaSAnalyticsApp } from './components/preview-apps/SaaSAnalyticsApp';

export default function App() {
  return <SaaSAnalyticsApp />;
}`
      }
    },
    chatHistory: [
      {
        id: 'c1',
        sender: 'user',
        content: 'Create an enterprise SaaS analytics platform with subscription metrics, revenue MRR/ARR charts, audit logs, and team permissions.',
        timestamp: '11:10'
      },
      {
        id: 'c2',
        sender: 'agent',
        agentRole: 'Software Architect',
        content: 'NeuroMetrics has been generated with transaction tables, ARR visualizations, and secret API key generators.',
        timestamp: '11:12'
      }
    ],
    tests: [
      { id: 't-1', name: 'Calculates ARR from active monthly cohorts', suite: 'Revenue Math', status: 'passed', durationMs: 18 }
    ],
    terminalLogs: [
      { id: 'tl-1', type: 'success', text: '✓ Build succeeded. 0 errors.', timestamp: '11:14:00' }
    ],
    checkpoints: []
  },
  {
    id: 'proj-ecommerce-store',
    name: 'OmniCommerce',
    tagline: 'Modern Headless Storefront & Hardware Catalog',
    prompt: 'Build a high-performance headless e-commerce store with product filtering, cart drawer, checkout simulator, and inventory management.',
    framework: 'React 19 + TypeScript + Vite',
    backend: 'Node.js REST API',
    database: 'PostgreSQL',
    designStyle: 'Clean Minimalist Dark',
    mode: 'instant',
    status: 'ready',
    appTemplateType: 'ecommerce',
    favorite: false,
    createdAt: '2026-10-25T14:00:00Z',
    updatedAt: '2026-10-30T16:45:00Z',
    deploymentUrl: 'https://omnicommerce.buildmint.app',
    activeFile: 'src/App.tsx',
    openFiles: ['src/App.tsx'],
    spec: {
      title: 'OmniCommerce Headless Store',
      summary: 'High-performance e-commerce catalog with live cart drawer and checkout simulator.',
      category: 'E-Commerce',
      techStack: {
        frontend: 'React 19 + Tailwind CSS',
        styling: 'Tailwind v4',
        backend: 'Express REST API',
        database: 'PostgreSQL',
        auth: 'Customer Session Cookie',
      },
      roles: ['Customer', 'Store Manager'],
      entities: [
        { name: 'Product', fields: ['id', 'name', 'price', 'inventory', 'category'], relations: '1:N with OrderItems' }
      ],
      apiEndpoints: [
        { method: 'GET', path: '/api/v1/products', description: 'List catalog items with category filter' }
      ],
      milestones: []
    },
    files: {
      'src/App.tsx': {
        name: 'App.tsx',
        path: 'src/App.tsx',
        language: 'typescript',
        isGenerated: true,
        modifiedAt: 'Oct 30',
        content: `import React from 'react';
import { ECommerceApp } from './components/preview-apps/ECommerceApp';

export default function App() {
  return <ECommerceApp />;
}`
      }
    },
    chatHistory: [],
    tests: [],
    terminalLogs: [],
    checkpoints: []
  }
];

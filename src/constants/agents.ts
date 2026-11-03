import { AgentInfo, AgentRole } from '../types';

export const SPECIALIZED_AGENTS: Record<AgentRole, AgentInfo> = {
  'Product Manager': {
    name: 'Product Manager',
    shortDesc: 'Transforms ideas into user stories, specifications, and acceptance criteria.',
    avatarColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    badge: 'PM Agent',
  },
  'UI/UX Designer': {
    name: 'UI/UX Designer',
    shortDesc: 'Engineers responsive layouts, design systems, tokens, and WCAG AA contrast.',
    avatarColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    badge: 'Design Agent',
  },
  'Software Architect': {
    name: 'Software Architect',
    shortDesc: 'Designs tech stack, dependency graphs, API schemas, and modular architecture.',
    avatarColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    badge: 'Architect Agent',
  },
  'Frontend Developer': {
    name: 'Frontend Developer',
    shortDesc: 'Generates TypeScript React components, state hooks, and client logic.',
    avatarColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    badge: 'Frontend Agent',
  },
  'Backend Developer': {
    name: 'Backend Developer',
    shortDesc: 'Implements REST endpoints, server logic, validation, and session auth.',
    avatarColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    badge: 'Backend Agent',
  },
  'Database Architect': {
    name: 'Database Architect',
    shortDesc: 'Designs normalized schemas, relationships, indexes, and migrations.',
    avatarColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    badge: 'DB Agent',
  },
  'QA & Testing': {
    name: 'QA & Testing',
    shortDesc: 'Generates and runs Vitest suites, checks regressions, validates types.',
    avatarColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    badge: 'QA Agent',
  },
  'Debugging Agent': {
    name: 'Debugging Agent',
    shortDesc: 'Traces stack traces, isolates runtime issues, and crafts atomic patches.',
    avatarColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    badge: 'Debug Agent',
  },
  'Security Agent': {
    name: 'Security Agent',
    shortDesc: 'Audits inputs, secret leaks, CSRF/XSS vectors, and RBAC authorization.',
    avatarColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    badge: 'Security Agent',
  },
  'Deployment Agent': {
    name: 'Deployment Agent',
    shortDesc: 'Compiles production assets, configures cloud targets, and verifies live URLs.',
    avatarColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    badge: 'DevOps Agent',
  },
};

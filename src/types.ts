export type AutonomousMode =
  | 'instant'
  | 'plan_build'
  | 'autonomous'
  | 'expert'
  | 'learning';

export type AgentRole =
  | 'Product Manager'
  | 'UI/UX Designer'
  | 'Software Architect'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Database Architect'
  | 'QA & Testing'
  | 'Debugging Agent'
  | 'Security Agent'
  | 'Deployment Agent';

export interface AgentInfo {
  name: AgentRole;
  shortDesc: string;
  avatarColor: string;
  badge: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'json' | 'css' | 'html' | 'markdown' | 'sql';
  isGenerated?: boolean;
  modifiedAt?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  files: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dependencies?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  agent: AgentRole;
  tasks: TaskItem[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ApplicationSpec {
  title: string;
  summary: string;
  category: string;
  techStack: {
    frontend: string;
    styling: string;
    backend: string;
    database: string;
    auth: string;
  };
  roles: string[];
  entities: {
    name: string;
    fields: string[];
    relations: string;
  }[];
  apiEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
  }[];
  milestones: Milestone[];
  clarificationQuestions?: string[];
}

export interface ProposedPatch {
  id: string;
  summary: string;
  filePath: string;
  originalContent: string;
  newContent: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentRole?: AgentRole;
  content: string;
  timestamp: string;
  patch?: ProposedPatch;
  actions?: {
    label: string;
    onClickPayload: string;
  }[];
}

export interface TestCase {
  id: string;
  name: string;
  suite: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  durationMs: number;
  error?: string;
}

export interface TerminalLog {
  id: string;
  type: 'stdout' | 'stderr' | 'info' | 'success' | 'command';
  text: string;
  timestamp: string;
}

export interface Checkpoint {
  id: string;
  title: string;
  timestamp: string;
  files: Record<string, string>;
  message: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  prompt: string;
  framework: string;
  backend: string;
  database: string;
  designStyle: string;
  mode: AutonomousMode;
  status: 'ready' | 'generating' | 'building' | 'deployed' | 'error';
  files: Record<string, ProjectFile>;
  spec: ApplicationSpec;
  activeFile: string;
  openFiles: string[];
  chatHistory: ChatMessage[];
  tests: TestCase[];
  terminalLogs: TerminalLog[];
  checkpoints: Checkpoint[];
  deploymentUrl?: string;
  githubRepo?: string;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
  appTemplateType: 'student_productivity' | 'saas_analytics' | 'ecommerce' | 'generic';
}

export interface StarterTemplate {
  id: string;
  title: string;
  description: string;
  category: 'SaaS' | 'Productivity' | 'E-Commerce' | 'Developer' | 'AI & Data';
  prompt: string;
  tags: string[];
  framework: string;
  backend: string;
  database: string;
  appTemplateType: 'student_productivity' | 'saas_analytics' | 'ecommerce' | 'generic';
}

export interface VisualSelectedElement {
  id: string;
  tag: string;
  name: string;
  text: string;
  styles: {
    padding: string;
    margin: string;
    backgroundColor: string;
    color: string;
    fontSize: string;
    borderRadius: string;
  };
  fileSource: string;
}

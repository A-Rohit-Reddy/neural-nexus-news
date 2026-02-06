export type AgentStatus = 'idle' | 'working' | 'success' | 'error' | 'waiting';

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: AgentStatus;
  color: 'cyan' | 'magenta' | 'purple' | 'green' | 'orange' | 'blue' | 'red';
}

export interface AgentLog {
  id: string;
  agentId: string;
  agentName: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  status: 'rumor' | 'confirmed' | 'unverified';
  url?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  marketPulse: {
    metric: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  sources: string[];
  publishedAt: Date;
  status: 'draft' | 'review' | 'published';
}

export interface WorkflowState {
  phase: 'idle' | 'gathering' | 'verifying' | 'analyzing' | 'writing' | 'reviewing' | 'publishing';
  newsItems: NewsItem[];
  currentPost: BlogPost | null;
  logs: AgentLog[];
}

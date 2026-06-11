import { useState, useCallback, useRef } from 'react';
import { Agent, AgentLog, WorkflowState, NewsItem, BlogPost } from '@/types/agent';
import { agents as initialAgents } from '@/data/agents';
import { apiFetch } from '@/lib/api';
import { normalizeArticle, normalizeArticles } from '@/lib/utils';

const generateId = () => Math.random().toString(36).substring(2, 9);

export function useAgentWorkflow() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    phase: 'idle',
    newsItems: [],
    currentPost: null,
    logs: [],
  });
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef(false);

  const updateAgentStatus = useCallback((agentId: string, status: Agent['status']) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status } : a));
  }, []);

  const addLog = useCallback((agentId: string, agentName: string, message: string, type: AgentLog['type'] = 'info') => {
    const log: AgentLog = {
      id: generateId(),
      agentId,
      agentName,
      message,
      timestamp: new Date(),
      type,
    };
    setWorkflowState(prev => ({
      ...prev,
      logs: [...prev.logs, log],
    }));
  }, []);

  const runWorkflow = useCallback(async () => {
    if (isRunning) return;

    abortRef.current = false;
    setIsRunning(true);
    setWorkflowState({ phase: 'gathering', newsItems: [], currentPost: null, logs: [] });
    setAgents(initialAgents.map((agent) => ({ ...agent, status: 'idle' })));

    try {
      updateAgentStatus('manager', 'working');
      addLog('manager', 'The Orchestrator', 'Requesting backend workflow execution...', 'action');

      const response = await apiFetch<{
        article: BlogPost;
        logs: AgentLog[];
        newsItems: NewsItem[];
      }>('/workflow/start', { method: 'POST' });

      const normalizedArticle = normalizeArticle(response.article);
      const normalizedNewsItems = normalizeArticles(response.newsItems);
      const normalizedLogs = response.logs.map((log) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      }));

      setWorkflowState({
        phase: 'idle',
        newsItems: normalizedNewsItems,
        currentPost: normalizedArticle,
        logs: normalizedLogs,
      });
      setAgents(initialAgents.map((agent) => ({ ...agent, status: 'success' })));
    } catch (error) {
      addLog('manager', 'The Orchestrator', `Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setWorkflowState((prev) => ({ ...prev, phase: 'idle' }));
      setAgents(initialAgents.map((agent) => ({ ...agent, status: 'error' })));
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, updateAgentStatus, addLog]);

  const stopWorkflow = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' })));
    addLog('manager', 'The Orchestrator', 'Workflow stopped', 'warning');
    setWorkflowState((prev) => ({ ...prev, phase: 'idle' }));
  }, [addLog]);

  return {
    agents,
    workflowState,
    isRunning,
    runWorkflow,
    stopWorkflow,
  };
}

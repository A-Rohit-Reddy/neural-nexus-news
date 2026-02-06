import { useState, useCallback, useRef } from 'react';
import { Agent, AgentLog, WorkflowState, NewsItem, BlogPost } from '@/types/agent';
import { agents as initialAgents } from '@/data/agents';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substring(2, 9);

const mockNewsItems: NewsItem[] = [
  { id: '1', headline: 'GPT-5 to be released next month', source: 'Twitter @aibreaking', status: 'unverified' },
  { id: '2', headline: 'NVIDIA announces new H200 GPU', source: 'NVIDIA Press Release', status: 'unverified' },
  { id: '3', headline: 'Anthropic raises $2B Series D', source: 'TechCrunch', status: 'unverified' },
  { id: '4', headline: 'Google Gemini 2.0 benchmarks leaked', source: 'Reddit r/LocalLLaMA', status: 'unverified' },
  { id: '5', headline: 'Meta releases Llama 3.5', source: 'Meta AI Blog', status: 'unverified' },
];

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
    setWorkflowState(prev => ({ ...prev, logs: [], newsItems: [], phase: 'gathering' }));
    setAgents(initialAgents);

    try {
      // Phase 1: Manager kicks off
      updateAgentStatus('manager', 'working');
      addLog('manager', 'The Orchestrator', 'Initiating news gathering workflow...', 'action');
      await delay(1000);
      addLog('manager', 'The Orchestrator', 'Dispatching The Scavenger to hunt for AI news', 'info');
      updateAgentStatus('manager', 'success');

      if (abortRef.current) return;

      // Phase 2: Scavenger gathers news
      updateAgentStatus('scavenger', 'working');
      setWorkflowState(prev => ({ ...prev, phase: 'gathering' }));
      addLog('scavenger', 'The Scavenger', 'Scanning sources for keywords: "LLM", "NVIDIA", "OpenAI"...', 'action');
      await delay(1500);
      
      for (const item of mockNewsItems) {
        if (abortRef.current) return;
        addLog('scavenger', 'The Scavenger', `Found: "${item.headline}" [${item.source}]`, 'info');
        setWorkflowState(prev => ({
          ...prev,
          newsItems: [...prev.newsItems, item],
        }));
        await delay(500);
      }
      
      addLog('scavenger', 'The Scavenger', `Collected ${mockNewsItems.length} potential stories`, 'success');
      updateAgentStatus('scavenger', 'success');

      if (abortRef.current) return;

      // Phase 3: Skeptic fact-checks
      updateAgentStatus('skeptic', 'working');
      setWorkflowState(prev => ({ ...prev, phase: 'verifying' }));
      addLog('skeptic', 'The Skeptic', 'Beginning fact-check process...', 'action');
      await delay(1000);

      const verifiedItems: NewsItem[] = [];
      for (const item of mockNewsItems) {
        if (abortRef.current) return;
        await delay(800);
        
        const isOfficial = item.source.includes('Press Release') || 
                          item.source.includes('Blog') || 
                          item.source.includes('TechCrunch');
        
        if (isOfficial) {
          addLog('skeptic', 'The Skeptic', `✓ CONFIRMED: "${item.headline}" - Official source verified`, 'success');
          verifiedItems.push({ ...item, status: 'confirmed' });
        } else {
          addLog('skeptic', 'The Skeptic', `⚠ RUMOR: "${item.headline}" - Unverified social media source`, 'warning');
        }
      }
      
      setWorkflowState(prev => ({
        ...prev,
        newsItems: prev.newsItems.map(n => verifiedItems.find(v => v.id === n.id) || { ...n, status: 'rumor' as const }),
      }));
      
      addLog('skeptic', 'The Skeptic', `Verification complete: ${verifiedItems.length} confirmed, ${mockNewsItems.length - verifiedItems.length} rumors`, 'info');
      updateAgentStatus('skeptic', 'success');

      if (abortRef.current) return;

      // Phase 4: Analyst extracts specs
      updateAgentStatus('analyst', 'working');
      setWorkflowState(prev => ({ ...prev, phase: 'analyzing' }));
      addLog('analyst', 'The Analyst', 'Extracting technical specifications from confirmed sources...', 'action');
      await delay(1500);
      addLog('analyst', 'The Analyst', 'Found: GPU specs, model parameters, benchmark scores', 'info');
      await delay(1000);
      addLog('analyst', 'The Analyst', 'Located relevant GitHub repos with star counts', 'info');
      addLog('analyst', 'The Analyst', 'Technical analysis complete. Passing to Editor.', 'success');
      updateAgentStatus('analyst', 'success');

      if (abortRef.current) return;

      // Phase 5: Editor sets tone
      updateAgentStatus('editor', 'working');
      addLog('editor', 'The Editor-in-Chief', 'Reviewing analyzed content...', 'action');
      await delay(1000);
      addLog('editor', 'The Editor-in-Chief', 'Setting tone: Professional, analytical, slightly provocative', 'info');
      addLog('editor', 'The Editor-in-Chief', 'Instructing Writer: Focus on NVIDIA announcement, include benchmarks', 'success');
      updateAgentStatus('editor', 'success');

      if (abortRef.current) return;

      // Phase 6: Writer creates content
      updateAgentStatus('writer', 'working');
      setWorkflowState(prev => ({ ...prev, phase: 'writing' }));
      addLog('writer', 'The Writer', 'Generating blog post...', 'action');
      await delay(2000);
      addLog('writer', 'The Writer', 'Crafting headline and summary...', 'info');
      await delay(1000);
      addLog('writer', 'The Writer', 'Formatting markdown with code blocks and tables...', 'info');
      await delay(1000);
      
      const newPost: BlogPost = {
        id: generateId(),
        title: 'Breaking: NVIDIA H200 Redefines AI Training Performance',
        summary: 'The latest GPU from NVIDIA promises 2x faster training times with improved memory bandwidth.',
        content: `# NVIDIA H200: The Next Generation of AI Compute

NVIDIA has officially announced the H200, the successor to the wildly successful H100 GPU.

## Key Specifications
- **Memory**: 141GB HBM3e
- **Bandwidth**: 4.8 TB/s
- **Performance**: 2x H100 for large language models

## Market Impact
Early adopters are already pre-ordering in bulk...

*Full technical analysis coming soon.*`,
        marketPulse: {
          metric: 'NVDA Pre-Market',
          value: '+3.2%',
          trend: 'up',
        },
        sources: ['NVIDIA Press Release', 'TechCrunch', 'AnandTech'],
        publishedAt: new Date(),
        status: 'draft',
      };
      
      setWorkflowState(prev => ({ ...prev, currentPost: newPost }));
      addLog('writer', 'The Writer', 'Draft complete. Sending to Guardian for review.', 'success');
      updateAgentStatus('writer', 'success');

      if (abortRef.current) return;

      // Phase 7: Guardian reviews
      updateAgentStatus('guardian', 'working');
      setWorkflowState(prev => ({ ...prev, phase: 'reviewing' }));
      addLog('guardian', 'The Guardian', 'Scanning content for hallucinations...', 'action');
      await delay(1500);
      addLog('guardian', 'The Guardian', 'Checking for offensive content...', 'info');
      await delay(1000);
      addLog('guardian', 'The Guardian', 'Verifying source citations...', 'info');
      await delay(500);
      addLog('guardian', 'The Guardian', '✓ Content approved for publication', 'success');
      updateAgentStatus('guardian', 'success');

      if (abortRef.current) return;

      // Phase 8: Quant adds market data
      updateAgentStatus('quant', 'working');
      addLog('quant', 'The Quant', 'Fetching market data...', 'action');
      await delay(1000);
      addLog('quant', 'The Quant', 'Checking GitHub stars for mentioned repos...', 'info');
      await delay(800);
      addLog('quant', 'The Quant', 'Injecting Market Pulse: NVDA +3.2% pre-market', 'success');
      updateAgentStatus('quant', 'success');

      if (abortRef.current) return;

      // Final: Publishing
      setWorkflowState(prev => ({ 
        ...prev, 
        phase: 'publishing',
        currentPost: prev.currentPost ? { ...prev.currentPost, status: 'published' } : null,
      }));
      
      updateAgentStatus('manager', 'working');
      addLog('manager', 'The Orchestrator', '🚀 Publishing article to The Neural Nexus!', 'success');
      await delay(500);
      updateAgentStatus('manager', 'success');

      addLog('manager', 'The Orchestrator', 'Workflow complete. Article published successfully.', 'success');
      setWorkflowState(prev => ({ ...prev, phase: 'idle' }));

    } catch (error) {
      addLog('manager', 'The Orchestrator', `Error: ${error}`, 'error');
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, updateAgentStatus, addLog]);

  const stopWorkflow = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
    addLog('manager', 'The Orchestrator', 'Workflow aborted by user', 'warning');
    setWorkflowState(prev => ({ ...prev, phase: 'idle' }));
  }, [addLog]);

  return {
    agents,
    workflowState,
    isRunning,
    runWorkflow,
    stopWorkflow,
  };
}

import { Agent } from '@/types/agent';
import { AgentCard } from './AgentCard';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface WorkflowVisualizerProps {
  agents: Agent[];
  phase: string;
}

const pipelineOrder = [
  'manager',
  'scavenger',
  'skeptic',
  'analyst',
  'editor',
  'writer',
  'guardian',
  'quant',
];

export function WorkflowVisualizer({ agents, phase }: WorkflowVisualizerProps) {
  const orderedAgents = pipelineOrder
    .map(id => agents.find(a => a.id === id))
    .filter(Boolean) as Agent[];

  return (
    <div className="space-y-4">
      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={cn(
          'px-3 py-1 rounded-full font-mono text-sm',
          phase === 'idle' 
            ? 'bg-muted text-muted-foreground' 
            : 'bg-neural-cyan/20 text-neural-cyan'
        )}>
          {phase === 'idle' ? 'STANDBY' : phase.toUpperCase()}
        </div>
        {phase !== 'idle' && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-success font-mono">LIVE</span>
          </div>
        )}
      </div>

      {/* Pipeline visualization */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {orderedAgents.slice(0, 4).map((agent, i) => (
          <div key={agent.id} className="relative">
            <AgentCard agent={agent} isActive={agent.status === 'working'} />
            {i < 3 && (
              <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>

      {/* Connection arrows */}
      <div className="flex justify-center">
        <ArrowDown className="w-6 h-6 text-muted-foreground/30" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {orderedAgents.slice(4, 8).map((agent, i) => (
          <div key={agent.id} className="relative">
            <AgentCard agent={agent} isActive={agent.status === 'working'} />
            {i < 3 && (
              <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

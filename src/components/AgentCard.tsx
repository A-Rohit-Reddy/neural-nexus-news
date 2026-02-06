import { Agent } from '@/types/agent';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  isActive?: boolean;
}

const statusColors: Record<Agent['status'], string> = {
  idle: 'bg-muted',
  working: 'bg-warning animate-pulse',
  success: 'bg-success',
  error: 'bg-destructive',
  waiting: 'bg-neural-purple',
};

const agentColorClasses: Record<Agent['color'], string> = {
  cyan: 'border-neural-cyan/50 hover:border-neural-cyan',
  magenta: 'border-neural-magenta/50 hover:border-neural-magenta',
  purple: 'border-neural-purple/50 hover:border-neural-purple',
  green: 'border-success/50 hover:border-success',
  orange: 'border-warning/50 hover:border-warning',
  blue: 'border-blue-500/50 hover:border-blue-500',
  red: 'border-destructive/50 hover:border-destructive',
};

const agentGlowClasses: Record<Agent['color'], string> = {
  cyan: 'shadow-glow-cyan',
  magenta: 'shadow-glow-magenta',
  purple: 'shadow-[0_0_30px_hsl(260_100%_60%/0.3)]',
  green: 'shadow-[0_0_30px_hsl(142_76%_46%/0.3)]',
  orange: 'shadow-[0_0_30px_hsl(38_92%_50%/0.3)]',
  blue: 'shadow-[0_0_30px_hsl(217_91%_60%/0.3)]',
  red: 'shadow-[0_0_30px_hsl(0_72%_51%/0.3)]',
};

export function AgentCard({ agent, isActive }: AgentCardProps) {
  const isWorking = agent.status === 'working';

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all duration-300 bg-gradient-card',
        agentColorClasses[agent.color],
        isWorking && agentGlowClasses[agent.color],
        isWorking && 'scale-105'
      )}
    >
      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <div className={cn('w-3 h-3 rounded-full', statusColors[agent.status])} />
      </div>

      {/* Icon */}
      <div className="text-3xl mb-2">{agent.icon}</div>

      {/* Name and role */}
      <h3 className="font-display font-semibold text-foreground text-sm">
        {agent.name}
      </h3>
      <p className="text-xs text-muted-foreground font-mono">{agent.role}</p>

      {/* Working indicator */}
      {isWorking && (
        <div className="mt-2 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-warning animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-warning animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-warning animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
}

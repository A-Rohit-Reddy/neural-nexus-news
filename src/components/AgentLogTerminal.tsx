import { useEffect, useRef } from 'react';
import { AgentLog } from '@/types/agent';
import { cn } from '@/lib/utils';

interface AgentLogTerminalProps {
  logs: AgentLog[];
}

const typeColors: Record<AgentLog['type'], string> = {
  info: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  action: 'text-neural-cyan',
};

const typePrefix: Record<AgentLog['type'], string> = {
  info: 'INFO',
  success: '✓ OK',
  warning: 'WARN',
  error: 'ERR!',
  action: '>>>',
};

export function AgentLogTerminal({ logs }: AgentLogTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-warning/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <span className="font-mono text-xs text-muted-foreground ml-2">
          agent-workflow.log
        </span>
      </div>

      {/* Terminal content */}
      <div
        ref={scrollRef}
        className="h-80 overflow-y-auto p-4 font-mono text-sm scrollbar-thin"
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground/50 flex items-center gap-2">
            <span className="text-neural-cyan">$</span>
            <span>Awaiting workflow initialization...</span>
            <span className="animate-pulse">▊</span>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className={cn(
                'py-0.5 animate-slide-in',
                typeColors[log.type]
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-muted-foreground/50">
                {log.timestamp.toLocaleTimeString('en-US', { hour12: false })}
              </span>
              {' '}
              <span className={cn('font-bold', typeColors[log.type])}>
                [{typePrefix[log.type]}]
              </span>
              {' '}
              <span className="text-neural-magenta">[{log.agentName}]</span>
              {': '}
              <span className="text-foreground">{log.message}</span>
            </div>
          ))
        )}
        {logs.length > 0 && (
          <div className="text-muted-foreground/50 mt-2 flex items-center gap-2">
            <span className="text-neural-cyan">$</span>
            <span className="animate-pulse">▊</span>
          </div>
        )}
      </div>
    </div>
  );
}

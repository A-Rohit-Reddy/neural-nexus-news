import { useAgentWorkflow } from '@/hooks/useAgentWorkflow';
import { WorkflowVisualizer } from '@/components/WorkflowVisualizer';
import { AgentLogTerminal } from '@/components/AgentLogTerminal';
import { NewsItemsList } from '@/components/NewsItemsList';
import { Button } from '@/components/ui/button';
import { Play, Square, Zap, Radio } from 'lucide-react';

export default function ControlRoom() {
  const { agents, workflowState, isRunning, runWorkflow, stopWorkflow } = useAgentWorkflow();

  return (
    <div className="min-h-screen bg-gradient-hero neural-grid">
      {/* Header */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Radio className="w-6 h-6 text-neural-magenta" />
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Agent Control Room
                </h1>
              </div>
              <p className="text-muted-foreground">
                Monitor and control the multi-agent news pipeline in real-time
              </p>
            </div>

            <div className="flex gap-3">
              {!isRunning ? (
                <Button
                  onClick={runWorkflow}
                  className="bg-gradient-neural text-primary-foreground font-mono gap-2 shadow-glow-cyan"
                >
                  <Play className="w-4 h-4" />
                  Trigger News Search
                </Button>
              ) : (
                <Button
                  onClick={stopWorkflow}
                  variant="destructive"
                  className="font-mono gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop Workflow
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Pipeline View */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agent Pipeline */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-neural-cyan" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Agent Pipeline
                </h2>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <WorkflowVisualizer agents={agents} phase={workflowState.phase} />
              </div>
            </section>

            {/* Agent Logs */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📡</span>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Agent Communication Log
                </h2>
              </div>
              <AgentLogTerminal logs={workflowState.logs} />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Gathered News */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📰</span>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  News Queue
                </h2>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm max-h-96 overflow-y-auto scrollbar-thin">
                <NewsItemsList items={workflowState.newsItems} />
              </div>
            </section>

            {/* Current Draft Preview */}
            {workflowState.currentPost && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">✍️</span>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Current Draft
                  </h2>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                      workflowState.currentPost.status === 'published' 
                        ? 'bg-success/20 text-success' 
                        : workflowState.currentPost.status === 'review'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {workflowState.currentPost.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm mb-2">
                    {workflowState.currentPost.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {workflowState.currentPost.summary}
                  </p>
                </div>
              </section>
            )}

            {/* System Stats */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">📊</span>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  System Stats
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <p className="text-2xl font-mono font-bold text-neural-cyan">
                    {agents.filter(a => a.status === 'working').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active Agents</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <p className="text-2xl font-mono font-bold text-neural-magenta">
                    {workflowState.logs.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Log Entries</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <p className="text-2xl font-mono font-bold text-success">
                    {workflowState.newsItems.filter(n => n.status === 'confirmed').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <p className="text-2xl font-mono font-bold text-warning">
                    {workflowState.newsItems.filter(n => n.status === 'rumor').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Rumors</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

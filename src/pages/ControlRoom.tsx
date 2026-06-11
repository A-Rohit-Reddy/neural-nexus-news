import { useAgentWorkflow } from '@/hooks/useAgentWorkflow';
import { useArticleStore } from '@/context/ArticleContext';
import { WorkflowVisualizer } from '@/components/WorkflowVisualizer';
import { AgentLogTerminal } from '@/components/AgentLogTerminal';
import { NewsItemsList } from '@/components/NewsItemsList';
import { BlogPostModal } from '@/components/BlogPostModal';
import { Button } from '@/components/ui/button';
import { Play, Square, Zap, Radio } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useMediumIntegration } from '@/hooks/useMediumIntegration';
import { toast } from '@/hooks/use-toast';

export default function ControlRoom() {
  const { agents, workflowState, isRunning, runWorkflow, stopWorkflow } = useAgentWorkflow();
  const { addOrUpdateArticle } = useArticleStore();
  const { isConnected, connectMedium, publishMedium } = useMediumIntegration();
  const [draftOpen, setDraftOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (workflowState.currentPost?.status === 'published') {
      addOrUpdateArticle(workflowState.currentPost);
    }
  }, [workflowState.currentPost, addOrUpdateArticle]);

  const currentPost = workflowState.currentPost;
  const publishedAgo = useMemo(() => {
    if (!currentPost?.publishedAt) return '';
    const minutes = Math.max(1, Math.floor((Date.now() - new Date(currentPost.publishedAt).getTime()) / 60000));
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }, [currentPost]);

  const handlePublishMedium = async () => {
    if (!currentPost) return;

    if (!isConnected) {
      connectMedium();
      return;
    }

    try {
      setIsPublishing(true);
      const canonicalUrl = `${window.location.origin}/blog/${currentPost.id}`;
      const result = await publishMedium(currentPost, canonicalUrl);

      toast({
        title: '✅ Successfully published to Medium',
        description: result.postUrl ? (
          <a href={result.postUrl} target="_blank" rel="noreferrer" className="underline text-neural-cyan">
            View on Medium →
          </a>
        ) : 'The article was published successfully.',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Medium publish failed',
        description: error instanceof Error ? error.message : 'Unable to publish to Medium',
        status: 'error',
      });
    } finally {
      setIsPublishing(false);
    }
  };

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
            {currentPost && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">✍️</span>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Current Draft
                  </h2>
                </div>
                <div
                  className={`group p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all ${
                    currentPost.status === 'published' ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-glow-cyan/20' : ''
                  }`}
                  onClick={() => currentPost.status === 'published' && setDraftOpen(true)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                      currentPost.status === 'published'
                        ? 'bg-success/20 text-success'
                        : currentPost.status === 'review'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {currentPost.status.toUpperCase()}
                    </span>
                    {currentPost.status === 'published' ? (
                      <span className="text-xs text-muted-foreground font-mono">Published {publishedAgo}</span>
                    ) : null}
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-xl mb-2">
                    {currentPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {currentPost.summary}
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      variant="default"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (currentPost.status === 'published') setDraftOpen(true);
                      }}
                      disabled={currentPost.status !== 'published'}
                    >
                      View Full Article
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePublishMedium();
                      }}
                      disabled={isPublishing}
                    >
                      {currentPost.status === 'published' ? 'Publish to Medium' : 'Waiting for publishing'}
                    </Button>
                  </div>
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
      <BlogPostModal
        post={currentPost}
        open={draftOpen}
        onOpenChange={setDraftOpen}
      />
    </div>
  );
}

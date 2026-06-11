import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Download, ExternalLink, Share2, Send } from 'lucide-react';
import { BlogPost } from '@/types/agent';
import { Button } from '@/components/ui/button';
import { useMediumIntegration } from '@/hooks/useMediumIntegration';
import { toast } from '@/hooks/use-toast';

interface ArticlePublishActionsProps {
  post: BlogPost;
  canonicalUrl: string;
}

export function ArticlePublishActions({ post, canonicalUrl }: ArticlePublishActionsProps) {
  const navigate = useNavigate();
  const {
    status,
    loading,
    isConnected,
    connectMedium,
    disconnectMedium,
    publishMedium,
    lastPublishedUrl,
  } = useMediumIntegration();
  const [isPublishing, setIsPublishing] = useState(false);

  const publishLabel = useMemo(() => {
    if (!isConnected) return 'Connect Medium to Publish';
    return 'Publish to Medium';
  }, [isConnected]);

  const onCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(post.content);
      toast({ title: 'Markdown copied', description: 'The article markdown is ready to paste.', status: 'success' });
    } catch {
      toast({ title: 'Copy failed', description: 'Unable to copy markdown to clipboard.', status: 'error' });
    }
  };

  const onDownloadMarkdown = () => {
    const blob = new Blob([post.content], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${post.title.replace(/[^a-zA-Z0-9_-]/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Download started', description: 'Markdown file has been downloaded.', status: 'success' });
  };

  const onPublishMedium = async () => {
    if (!isConnected) {
      connectMedium();
      return;
    }

    try {
      setIsPublishing(true);
      const result = await publishMedium(post, canonicalUrl);
      toast({
        title: '✅ Successfully published to Medium',
        description: (
          <span>
            <a
              href={result.postUrl}
              target="_blank"
              rel="noreferrer"
              className="underline text-neural-cyan hover:text-neural-cyan/80"
            >
              View on Medium →
            </a>
          </span>
        ),
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Medium publish failed',
        description: error instanceof Error ? error.message : 'Something went wrong while publishing.',
        status: 'error',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card/70 p-6 shadow-neon">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Publish Externally</p>
          <h3 className="text-lg font-semibold text-foreground">Syndicate this article beyond Neural Nexus</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Share2 className="w-4 h-4" />
          {loading ? 'Checking integration...' : isConnected ? 'Medium connected' : 'Medium not connected'}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant={isConnected ? 'default' : 'secondary'}
          onClick={onPublishMedium}
          disabled={isPublishing}
        >
          <Send className="w-4 h-4" />
          {isPublishing ? 'Publishing…' : publishLabel}
        </Button>
        <Button variant="outline" onClick={() => navigate('/settings/integrations')}>
          <ExternalLink className="w-4 h-4" />
          Manage Medium Connection
        </Button>
        <Button variant="ghost" onClick={onCopyMarkdown}>
          <Copy className="w-4 h-4" />
          Copy Markdown
        </Button>
        <Button variant="outline" onClick={onDownloadMarkdown}>
          <Download className="w-4 h-4" />
          Download Markdown
        </Button>
      </div>

      {lastPublishedUrl ? (
        <div className="mt-4 text-sm text-neural-cyan">
          Last published Medium URL: <a href={lastPublishedUrl} target="_blank" rel="noreferrer" className="underline">{lastPublishedUrl}</a>
        </div>
      ) : null}

      {status ? (
        <div className="mt-4 grid gap-2 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <div>Medium user: <span className="font-medium text-foreground">{status.mediumUserId}</span></div>
          <div>Connected: <span className="font-medium text-foreground">{new Date(status.connectedAt).toLocaleString()}</span></div>
          <Button variant="destructive" size="sm" onClick={disconnectMedium} className="w-full sm:w-auto mt-2">
            Disconnect Medium
          </Button>
        </div>
      ) : null}
    </div>
  );
}

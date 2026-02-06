import { BlogPost } from '@/types/agent';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface BlogPostModalProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-success bg-success/10',
  down: 'text-destructive bg-destructive/10',
  neutral: 'text-muted-foreground bg-muted',
};

export function BlogPostModal({ post, open, onOpenChange }: BlogPostModalProps) {
  if (!post) return null;

  const TrendIcon = trendIcons[post.marketPulse.trend];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-card border-border p-0">
        <div className="overflow-y-auto max-h-[90vh] scrollbar-thin">
          {/* Header */}
          <DialogHeader className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-6 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-mono',
                post.status === 'published' 
                  ? 'bg-success/20 text-success' 
                  : 'bg-warning/20 text-warning'
              )}>
                {post.status.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {post.publishedAt.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <DialogTitle className="text-2xl font-display font-bold text-foreground pr-8">
              {post.title}
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 pt-4">
            {/* Market Pulse Banner */}
            <div className={cn(
              'flex items-center justify-between p-4 rounded-lg mb-6',
              trendColors[post.marketPulse.trend]
            )}>
              <div>
                <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Market Pulse</p>
                <p className="font-mono font-semibold">{post.marketPulse.metric}</p>
              </div>
              <div className="flex items-center gap-2 text-2xl font-mono font-bold">
                <TrendIcon className="w-6 h-6" />
                {post.marketPulse.value}
              </div>
            </div>

            {/* Summary */}
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {post.summary}
            </p>

            {/* Article Content */}
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-neural-cyan prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:text-neural-magenta prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-muted prose-pre:border prose-pre:border-border
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:marker:text-neural-cyan
              prose-hr:border-border
              prose-table:text-sm
              prose-th:text-foreground prose-th:font-semibold prose-th:bg-muted/50
              prose-td:text-muted-foreground
            ">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Sources */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Verified Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.sources.map((source, i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1 rounded-full bg-muted text-foreground font-mono"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

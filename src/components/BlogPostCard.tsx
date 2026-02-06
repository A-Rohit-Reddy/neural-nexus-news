import { BlogPost } from '@/types/agent';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost;
  onClick?: () => void;
  featured?: boolean;
}

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-success',
  down: 'text-destructive',
  neutral: 'text-muted-foreground',
};

export function BlogPostCard({ post, onClick, featured }: BlogPostCardProps) {
  const TrendIcon = trendIcons[post.marketPulse.trend];

  return (
    <article
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-gradient-card transition-all duration-300 cursor-pointer',
        'hover:border-neural-cyan/50 hover:shadow-glow-cyan',
        featured && 'md:col-span-2'
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neural-cyan/5 via-transparent to-neural-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-6">
        {/* Status badge */}
        <div className="flex items-center gap-2 mb-3">
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
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Title */}
        <h2 className={cn(
          'font-display font-bold text-foreground mb-2 group-hover:text-gradient-neural transition-colors',
          featured ? 'text-2xl' : 'text-lg'
        )}>
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {post.summary}
        </p>

        {/* Market Pulse */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono uppercase">
              Market Pulse
            </span>
            <span className="text-xs font-mono text-foreground">
              {post.marketPulse.metric}
            </span>
          </div>
          <div className={cn('flex items-center gap-1 font-mono font-bold', trendColors[post.marketPulse.trend])}>
            <TrendIcon className="w-4 h-4" />
            <span>{post.marketPulse.value}</span>
          </div>
        </div>

        {/* Sources */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {post.sources.map((source, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {source}
            </span>
          ))}
        </div>

        {/* Hover indicator */}
        <ExternalLink className="absolute top-6 right-6 w-5 h-5 text-muted-foreground/0 group-hover:text-neural-cyan transition-all" />
      </div>
    </article>
  );
}

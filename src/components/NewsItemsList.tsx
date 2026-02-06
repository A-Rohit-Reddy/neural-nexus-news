import { NewsItem } from '@/types/agent';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface NewsItemsListProps {
  items: NewsItem[];
}

const statusConfig = {
  confirmed: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    label: 'CONFIRMED',
  },
  rumor: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    label: 'RUMOR',
  },
  unverified: {
    icon: HelpCircle,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    label: 'UNVERIFIED',
  },
};

export function NewsItemsList({ items }: NewsItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-mono">No news items gathered yet</p>
        <p className="text-xs">Start the workflow to begin scanning</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;

        return (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border border-border animate-slide-in',
              config.bg
            )}
          >
            <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.color)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-1">{item.headline}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-xs font-mono', config.color)}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground truncate">
                  {item.source}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

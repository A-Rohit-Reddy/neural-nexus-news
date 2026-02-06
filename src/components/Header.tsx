import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Newspaper, Terminal, Cpu } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'The Blog', icon: Newspaper },
    { path: '/control-room', label: 'Control Room', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Cpu className="w-8 h-8 text-neural-cyan group-hover:animate-pulse" />
              <div className="absolute inset-0 blur-lg bg-neural-cyan/30 group-hover:bg-neural-cyan/50 transition-colors" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gradient-neural">
                The Neural Nexus
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground -mt-0.5">
                AI-Powered News • Multi-Agent System
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all',
                  location.pathname === path
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

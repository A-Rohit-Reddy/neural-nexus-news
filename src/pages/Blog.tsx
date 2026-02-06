import { useState } from 'react';
import { BlogPost } from '@/types/agent';
import { mockPosts } from '@/data/mockPosts';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogPostModal } from '@/components/BlogPostModal';
import { Cpu, Sparkles } from 'lucide-react';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="min-h-screen bg-gradient-hero neural-grid">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neural-cyan/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6">
              <Sparkles className="w-4 h-4 text-neural-cyan" />
              <span className="font-mono text-sm text-muted-foreground">
                Powered by Multi-Agent AI
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">The </span>
              <span className="text-gradient-neural">Neural Nexus</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              AI-generated news curated by autonomous agents. Every article is gathered, 
              verified, analyzed, and published by our multi-agent system.
            </p>

            {/* Agent badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['Scavenger', 'Skeptic', 'Analyst', 'Editor', 'Writer', 'Guardian', 'Quant'].map((agent) => (
                <span
                  key={agent}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-muted text-muted-foreground"
                >
                  {agent}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-neural-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-neural-magenta/10 rounded-full blur-3xl" />
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-5 h-5 text-neural-cyan" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Latest Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPosts.map((post, index) => (
              <BlogPostCard
                key={post.id}
                post={post}
                featured={index === 0}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <BlogPostModal
        post={selectedPost}
        open={!!selectedPost}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      />
    </div>
  );
}

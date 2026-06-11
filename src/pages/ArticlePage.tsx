import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { apiFetch } from '@/lib/api';
import { ArticlePublishActions } from '@/components/ArticlePublishActions';
import { Button } from '@/components/ui/button';

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useQuery(['article', id], () => apiFetch(`/articles/${id}`), {
    enabled: Boolean(id),
    select: (article: any) => ({
      ...article,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    }),
  });

  useEffect(() => {
    if (!post) {
      document.title = 'Article Not Found | Neural Nexus';
      return;
    }

    document.title = `${post.title} | Neural Nexus`;
    const url = window.location.href;

    const metaTags = [
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.summary },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: post.title },
      { property: 'twitter:description', content: post.summary },
    ];

    metaTags.forEach(({ property, content }) => {
      let element = document.querySelector(`meta[property='${property}']`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });

    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero neural-grid px-4 py-24">
        <div className="container mx-auto rounded-3xl border border-border bg-card/80 p-10 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Loading article...</h1>
          <p className="text-muted-foreground">Please wait while we retrieve the latest content.</p>
        </div>
      </div>
    );
  }

  if (!post || isError) {
    return (
      <div className="min-h-screen bg-gradient-hero neural-grid px-4 py-24">
        <div className="container mx-auto rounded-3xl border border-border bg-card/80 p-10 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">
            The article you are looking for is unavailable. Try returning to the blog index.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            Back to The Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero neural-grid">
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-[2rem] border border-border bg-card/70 p-8 shadow-neon backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-neural-cyan/80 mb-3">{post.category ?? 'AI Infrastructure'}</p>
              <h1 className="font-display text-5xl font-bold leading-tight text-foreground mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{post.author ?? 'AI Multi-Agent System'}</span>
                <span>•</span>
                <span>{post.publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span>{post.tags?.join(', ') ?? 'AI, GPU, Market'}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/blog')}>Back to Blog</Button>
              <Button variant="default" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Scroll Top</Button>
            </div>
          </div>

          {post.featuredImage ? (
            <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-muted/50">
              <img src={post.featuredImage} alt={post.title} className="w-full object-cover" />
            </div>
          ) : null}

          <div className="mt-10 prose prose-invert prose-sm max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-neural-cyan prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-neural-magenta prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-muted prose-pre:border prose-pre:border-border
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-li:marker:text-neural-cyan
            prose-hr:border-border
            prose-table:text-sm prose-th:text-foreground prose-th:font-semibold prose-th:bg-muted/50 prose-td:text-muted-foreground
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{post.content}</ReactMarkdown>
          </div>

          <ArticlePublishActions post={post} canonicalUrl={window.location.href} />
        </div>
      </section>
    </div>
  );
}

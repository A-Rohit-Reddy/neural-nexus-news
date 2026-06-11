import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BlogPost } from '@/types/agent';
import { mockPosts } from '@/data/mockPosts';

interface MediumConnection {
  mediumUserId: string;
  connectedAt: string;
}

interface ArticleContextValue {
  articles: BlogPost[];
  mediumConnection: MediumConnection | null;
  addOrUpdateArticle: (post: BlogPost) => void;
  getArticleById: (id: string) => BlogPost | undefined;
  setMediumConnection: (connection: MediumConnection) => void;
  clearMediumConnection: () => void;
}

const STORAGE_KEY = 'neural-nexus-article-store';

const ArticleContext = createContext<ArticleContextValue | undefined>(undefined);

const hydrateArticles = (value: string | null): { articles: BlogPost[]; mediumConnection: MediumConnection | null } => {
  if (!value) {
    return { articles: mockPosts, mediumConnection: null };
  }

  try {
    const parsed = JSON.parse(value);
    const articles: BlogPost[] = Array.isArray(parsed.articles)
      ? parsed.articles.map((post: any) => ({
          ...post,
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
        }))
      : mockPosts;

    return {
      articles,
      mediumConnection: parsed.mediumConnection ?? null,
    };
  } catch {
    return { articles: mockPosts, mediumConnection: null };
  }
};

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<BlogPost[]>(() => {
    if (typeof window === 'undefined') return mockPosts;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return hydrateArticles(stored).articles;
  });
  const [mediumConnection, setMediumConnection] = useState<MediumConnection | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return hydrateArticles(stored).mediumConnection;
  });

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        articles,
        mediumConnection,
      }),
    );
  }, [articles, mediumConnection]);

  const addOrUpdateArticle = useCallback((post: BlogPost) => {
    setArticles((prev) => {
      const existing = prev.find((item) => item.id === post.id);
      if (existing) {
        return prev.map((item) => (item.id === post.id ? post : item));
      }

      return [post, ...prev];
    });
  }, []);

  const getArticleById = useCallback(
    (id: string) => articles.find((post) => post.id === id),
    [articles],
  );

  const setConnection = useCallback((connection: MediumConnection) => {
    setMediumConnection(connection);
  }, []);

  const clearConnection = useCallback(() => {
    setMediumConnection(null);
  }, []);

  const value = useMemo(
    () => ({
      articles,
      mediumConnection,
      addOrUpdateArticle,
      getArticleById,
      setMediumConnection: setConnection,
      clearMediumConnection: clearConnection,
    }),
    [articles, mediumConnection, addOrUpdateArticle, getArticleById, setConnection, clearConnection],
  );

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
}

export function useArticleStore() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticleStore must be used within ArticleProvider');
  }
  return context;
}

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { BlogPost } from '@/types/agent';

interface MediumStatus {
  mediumUserId: string;
  connectedAt: string;
}

interface MediumPublishResult {
  postUrl: string;
  message: string;
}

export function useMediumIntegration() {
  const [status, setStatus] = useState<MediumStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastPublishedUrl, setLastPublishedUrl] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch<{ mediumUserId: string; connectedAt: string }>('/integrations/medium/status');
      setStatus(response);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const connectMedium = useCallback(async () => {
    const response = await apiFetch<{ authUrl: string }>('/integrations/medium/auth-url');
    window.open(response.authUrl, '_blank', 'noopener,noreferrer');
  }, []);

  const disconnectMedium = useCallback(async () => {
    await apiFetch('/integrations/medium/disconnect', { method: 'POST' });
    setStatus(null);
  }, []);

  const publishMedium = useCallback(
    async (post: BlogPost, canonicalUrl: string): Promise<MediumPublishResult> => {
      const response = await apiFetch<{ postUrl: string; message: string }>(
        `/articles/${encodeURIComponent(post.id)}/publish-medium`,
        {
          method: 'POST',
          body: {
            title: post.title,
            content: post.content,
            canonicalUrl,
            tags: post.tags ?? [],
            publishStatus: 'draft',
          },
        },
      );
      setLastPublishedUrl(response.postUrl);
      return response;
    },
    [],
  );

  return {
    status,
    loading,
    lastPublishedUrl,
    fetchStatus,
    connectMedium,
    disconnectMedium,
    publishMedium,
    isConnected: Boolean(status?.mediumUserId),
  };
}

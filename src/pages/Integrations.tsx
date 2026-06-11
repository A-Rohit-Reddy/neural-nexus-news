import { useEffect } from 'react';
import { useMediumIntegration } from '@/hooks/useMediumIntegration';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function Integrations() {
  const {
    status,
    loading,
    isConnected,
    connectMedium,
    disconnectMedium,
    fetchStatus,
  } = useMediumIntegration();

  useEffect(() => {
    document.title = 'Integration Settings | Neural Nexus';
  }, []);

  const handleConnect = async () => {
    try {
      await connectMedium();
      toast({ title: 'Medium auth started', description: 'A new window has opened for Medium authentication.', status: 'success' });
    } catch (error) {
      toast({ title: 'Unable to connect', description: error instanceof Error ? error.message : 'Medium connection failed', status: 'error' });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectMedium();
      toast({ title: 'Disconnected', description: 'Your Medium account has been disconnected.', status: 'success' });
    } catch (error) {
      toast({ title: 'Disconnect failed', description: error instanceof Error ? error.message : 'Unable to disconnect.', status: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero neural-grid px-4 py-10">
      <div className="container mx-auto">
        <div className="rounded-[2rem] border border-border bg-card/80 p-8 shadow-neon backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neural-cyan/80 mb-2">Integrations</p>
              <h1 className="font-display text-4xl font-bold text-foreground">External Publishing Connections</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={fetchStatus} variant="secondary">
                Refresh Status
              </Button>
              {isConnected ? (
                <Button variant="destructive" onClick={handleDisconnect}>
                  Disconnect Medium
                </Button>
              ) : (
                <Button variant="default" onClick={handleConnect}>
                  Connect Medium
                </Button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-muted/50 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">Medium Account</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Link your Medium account once and publish directly from the platform.
                The OAuth token is encrypted and stored securely on the backend.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Status: <span className="font-medium text-foreground">{loading ? 'Checking…' : isConnected ? 'Connected' : 'Not connected'}</span></div>
                {status ? (
                  <>
                    <div>Medium user: <span className="font-medium text-foreground">{status.mediumUserId}</span></div>
                    <div>Connected at: <span className="font-medium text-foreground">{new Date(status.connectedAt).toLocaleString()}</span></div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/50 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">Future Ready</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Dev.to publishing is ready in the UI and will be enabled as soon as the backend integration is added.
              </p>
              <div className="rounded-2xl border border-border bg-background/80 p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Planned support:</strong>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Dev.to draft publishing</li>
                  <li>Twitter and LinkedIn sharing metadata</li>
                  <li>Custom canonical URL support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

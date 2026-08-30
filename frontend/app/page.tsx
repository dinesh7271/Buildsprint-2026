'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ReportTabs } from '@/components/ReportTabs';
import { analyzeRepository } from '@/lib/api';
import { MigrationRequest, AnalysisResponse, ApiError } from '@/lib/types';
import { Terminal, GitFork } from 'lucide-react';

type ViewState = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [currentRequest, setCurrentRequest] = useState<MigrationRequest | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const handleFormSubmit = async (data: MigrationRequest) => {
    setCurrentRequest(data);
    setError(null);
    setViewState('loading');

    try {
      const response = await analyzeRepository(data);
      setAnalysisResult(response);
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      setError(err as ApiError);
      setViewState('error');
    }
  };

  const handleLoadingComplete = () => {
    if (analysisResult) {
      setViewState('success');
    }
  };

  const handleRetry = () => {
    if (currentRequest) {
      handleFormSubmit(currentRequest);
    } else {
      setViewState('idle');
    }
  };

  const handleReset = () => {
    setViewState('idle');
    setCurrentRequest(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Soft Glows for Landing Page Style */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[50%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '15s' }} />

      {/* Background Grid Pattern */}
      <div 
         className="fixed inset-0 pointer-events-none opacity-[0.25] z-0" 
        style={{
          backgroundImage: `radial-gradient(circle, var(--primary) 0.75px, transparent 0.75px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Header / Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-border/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 font-black shadow-lg shadow-primary/5">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-foreground font-mono">
                Migration<span className="text-primary font-black">Scout</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block -mt-1 uppercase tracking-wider font-bold">Suite v2.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-secondary border border-border text-foreground flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Agent Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10 flex flex-col justify-center">
        {viewState === 'idle' && (
          <div className="space-y-8">
            <Hero />
            <AnalysisForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {viewState === 'loading' && (
          <div className="py-6">
            <LoadingState
              onComplete={handleLoadingComplete}
              targetStack={currentRequest?.targetStack}
              repoUrl={currentRequest?.githubUrl}
            />
          </div>
        )}

        {viewState === 'error' && (
          <div className="py-6">
            <ErrorState error={error} onRetry={handleRetry} onReset={handleReset} />
          </div>
        )}

        {viewState === 'success' && analysisResult && (
          <div className="py-6">
            <ReportTabs data={analysisResult} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 backdrop-blur-sm py-6 relative z-10 text-center text-xs text-muted-foreground font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>Legacy → Modern Migration Scout Agent • Relaxing Light Theme UI</div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 uppercase tracking-wider font-bold">
            <span>Next.js 15 (App Router)</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
            <span>shadcn/ui</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Phase1ResultPreview } from '@/components/Phase1ResultPreview';
import { analyzeRepository } from '@/lib/api';
import { MigrationRequest, AnalysisResponse, ApiError } from '@/lib/types';
import { Terminal, Shield, GitFork, Sparkles, Layers } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{
          backgroundImage: `radial-[#cbd5e1] 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white font-mono">
                Migration<span className="text-cyan-400">Scout</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 block -mt-1">Agent CLI v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Agent Ready
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
            <Phase1ResultPreview data={analysisResult} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 relative z-10 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>Legacy → Modern Migration Scout Agent • Phase 1 Foundation</div>
          <div className="flex items-center gap-4 text-[11px]">
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

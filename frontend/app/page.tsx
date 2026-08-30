'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ReportTabs } from '@/components/ReportTabs';
import { analyzeRepository } from '@/lib/api';
import { MigrationRequest, AnalysisResponse, ApiError } from '@/lib/types';
import { Terminal, GitFork, Layout, Settings, Compass, Sparkles, AlertCircle, HelpCircle, User, Award, Flame, Star, Coffee } from 'lucide-react';

type ViewState = 'idle' | 'loading' | 'success' | 'error';
type ActiveMenu = 'dashboard' | 'presets' | 'guide' | 'support';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [currentRequest, setCurrentRequest] = useState<MigrationRequest | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('dashboard');

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
      {/* Background Soft Glows for Cozy Warm Linen/Beige Landing Page Style */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[50%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '15s' }} />

      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.2] z-0" 
        style={{
          backgroundImage: `radial-gradient(circle, var(--primary) 0.75px, transparent 0.75px)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Header / Navbar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm shadow-border/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 font-black shadow-md shadow-primary/5">
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

      {/* Main Two-Column Sidebar Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Left Sidebar Control Panel */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">Control Center</h3>
              <p className="text-[11px] text-muted-foreground font-mono leading-tight">Manage scanner preferences</p>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => { setActiveMenu('dashboard'); if (viewState === 'success') handleReset(); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMenu === 'dashboard'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveMenu('presets')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMenu === 'presets'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Stack Presets</span>
              </button>

              <button
                onClick={() => setActiveMenu('guide')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeMenu === 'guide'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Scanner Guide</span>
              </button>
            </nav>

            <div className="h-px bg-border" />

            {/* Micro Session Quick Stats Widget */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider block">Session Info</span>
              <div className="p-3 rounded-xl bg-background/50 border border-border space-y-2 text-[11px] font-mono text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Engine:</span>
                  <span className="font-bold text-foreground">FastAPI + AST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Vibe check:</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-amber-600" /> Sand Beige
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-bold">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick tips card in sidebar */}
          <div className="p-5 rounded-2xl border border-border bg-primary/5 backdrop-blur-md shadow-sm space-y-3 hidden lg:block">
            <div className="flex items-center gap-2 text-primary">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider">Fast Insights</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
              Scout scans AST node structures, tracking packages to construct a safe, minimal-risk migration route.
            </p>
          </div>
        </aside>

        {/* Right Workspace Content Area */}
        <main className="flex-1 flex flex-col justify-center min-w-0">
          {activeMenu === 'presets' ? (
            <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-mono flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-600 animate-pulse" /> TARGET ARCHITECTURE PRESETS
                </h2>
                <p className="text-xs text-muted-foreground font-mono">Pre-configured modern architectural stacks for seamless legacy replacement.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-primary" /> NEXT.JS 15 + REACT 19</span>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">Fullstack server-first architectures, Server Components, advanced caching structures, and standard route layouts.</p>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> FASTIFY + NODE.JS 20</span>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">High-performance asynchronous backend services, schema validation rules, and extremely lightweight memory footprint.</p>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> FASTAPI + PYTHON 3.12</span>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">High speed asynchronous REST microservices with native OpenAPI generation and robust data validation with Pydantic.</p>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> GO (GIN FRAMEWORK)</span>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">Ultra high concurrency RESTful routing and execution speeds with minimized memory profile.</p>
                </div>
              </div>
              <button onClick={() => setActiveMenu('dashboard')} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase rounded-xl hover:bg-primary/90 shadow-sm cursor-pointer inline-block w-fit">
                Back to Scanner
              </button>
            </div>
          ) : activeMenu === 'guide' ? (
            <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-mono flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" /> SCANNER USER GUIDE
                </h2>
                <p className="text-xs text-muted-foreground font-mono">Understand how the AI Scout Agent scans and generates your roadmap.</p>
              </div>
              <div className="space-y-4 font-mono text-xs text-muted-foreground leading-relaxed">
                <p>
                  <strong>1. Codebase Identification:</strong> Inputting a GitHub URL allows our scanner to clone, parse, and analyze directory files dynamically.
                </p>
                <p>
                  <strong>2. AST (Abstract Syntax Tree) Mapping:</strong> The backend maps exact imports, functions, and models to look for deprecated schemas, legacy structures, or insecure code flows.
                </p>
                <p>
                  <strong>3. Phased Roadmap Generation:</strong> A complete migration plan is designed to implement, verify, and switch system paths iteratively to prevent regressions.
                </p>
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-700">
                  ⚡ <strong>Note:</strong> Make sure to supply your LLM keys in the backend configurations to enable automatic, personalized code suggestions.
                </div>
              </div>
              <button onClick={() => setActiveMenu('dashboard')} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase rounded-xl hover:bg-primary/90 shadow-sm cursor-pointer inline-block w-fit">
                Back to Scanner
              </button>
            </div>
          ) : (
            // Default Dashboard Menu
            <>
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
            </>
          )}
        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 backdrop-blur-sm py-6 relative z-10 text-center text-xs text-muted-foreground font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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

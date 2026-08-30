'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ReportTabs } from '@/components/ReportTabs';
import { analyzeRepository } from '@/lib/api';
import { MigrationRequest, AnalysisResponse, ApiError } from '@/lib/types';
import { Radar, GitFork, Layout, Compass, Sparkles, HelpCircle, Award, Flame, Star, Coffee, Code2, Shield, Activity, ChevronRight, Layers, Cpu, Terminal, Rocket } from 'lucide-react';

type ViewState = 'idle' | 'loading' | 'success' | 'error';
type ActiveTab = 'overview' | 'workbench' | 'presets' | 'guide';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [currentRequest, setCurrentRequest] = useState<MigrationRequest | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

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
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Animated Soft Ambient Background Glows */}
      <div className="fixed top-[-100px] left-[10%] w-[650px] h-[650px] bg-emerald-600/10 rounded-full blur-[160px] pointer-events-none animate-float-slow" />
      <div className="fixed bottom-[-100px] right-[10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[160px] pointer-events-none animate-float-reverse" />
      <div className="fixed top-[40%] left-[40%] w-[450px] h-[450px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Grid Canvas Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.25] z-0" 
        style={{
          backgroundImage: `radial-gradient(circle, var(--primary) 0.75px, transparent 0.75px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Professional Landing Navigation Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-sm flex items-center justify-center">
              <Radar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight font-mono text-foreground flex items-center gap-1">
                Migration<span className="text-primary font-black">Scout</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block -mt-1 font-bold">AI Modernization Suite</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'overview' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'workbench' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Workbench
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'presets' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'guide' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Docs
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <button
              onClick={() => setActiveTab('workbench')}
              className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Scout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main SaaS Layout Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row items-start gap-8 relative z-10">
        
        {/* Left Sidebar Control Dashboard Panel */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 lg:self-start flex flex-col gap-6">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-6">
            
            {/* Sidebar Title */}
            <div>
              <div className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">AGENT CONTROL PANEL</div>
              <h2 className="text-sm font-bold font-mono text-foreground mt-0.5">Scout Suite v2.0</h2>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex flex-col gap-1.5 font-mono text-xs font-bold">
              <button
                onClick={() => { setActiveTab('overview'); if (viewState === 'success') handleReset(); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layout className="w-4 h-4" />
                  <span>Landing Overview</span>
                </div>
                {activeTab === 'overview' && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-ping" />}
              </button>

              <button
                onClick={() => setActiveTab('workbench')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'workbench'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4" />
                  <span>Scanner Workbench</span>
                </div>
                {viewState === 'success' && <span className="px-1.5 py-0.5 text-[9px] rounded bg-emerald-500/20 text-emerald-800">Result Ready</span>}
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4" />
                  <span>Architecture Stacks</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Docs & Guidelines</span>
                </div>
              </button>
            </nav>

            <div className="h-px bg-border" />

            {/* Real-time System Metrics Widget */}
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">LIVE ENGINE METRICS</span>
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border space-y-2.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-primary" /> AST Engine:</span>
                  <span className="font-bold text-foreground">Python 3.12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-600" /> System Vibe:</span>
                  <span className="font-bold text-primary">Chilly Sage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> OWASP Audit:</span>
                  <span className="text-emerald-700 font-bold">Enabled</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Card */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="text-[10px] font-mono font-bold text-primary uppercase">Modernization Readiness</div>
              <div className="text-xl font-bold font-mono text-foreground">100% Automated</div>
              <p className="text-[11px] text-muted-foreground font-sans leading-tight">Zero manual code inventory required.</p>
            </div>

          </div>
        </aside>

        {/* Right Dynamic Page Workspace */}
        <main className="flex-1 flex flex-col justify-start min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <Hero />
              
              {/* Primary Workspace Form Anchor */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold font-mono text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> SCOUT ANY REPOSITORY
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">Paste a public or private GitHub repository URL to initiate analysis.</p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 font-bold border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                <AnalysisForm onSubmit={handleFormSubmit} isLoading={viewState === 'loading'} />
              </div>
            </div>
          )}

          {activeTab === 'workbench' && (
            <div className="space-y-6">
              {viewState === 'idle' && (
                <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold font-mono text-foreground flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-primary" /> SCANNER WORKBENCH
                    </h2>
                    <p className="text-xs text-muted-foreground font-sans">Provide repository credentials or choose a pre-configured sample repo to test.</p>
                  </div>

                  <AnalysisForm onSubmit={handleFormSubmit} isLoading={false} />
                </div>
              )}

              {viewState === 'loading' && (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <LoadingState
                    onComplete={handleLoadingComplete}
                    targetStack={currentRequest?.targetStack}
                    repoUrl={currentRequest?.githubUrl}
                  />
                </div>
              )}

              {viewState === 'error' && (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <ErrorState error={error} onRetry={handleRetry} onReset={handleReset} />
                </div>
              )}

              {viewState === 'success' && analysisResult && (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <ReportTabs data={analysisResult} onReset={handleReset} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-mono text-foreground flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary animate-pulse" /> TARGET ARCHITECTURE PRESETS
                </h2>
                <p className="text-xs text-muted-foreground font-sans">Pre-configured modern architectural stacks for seamless legacy replacement.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-secondary/40 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-primary" /> NEXT.JS 15 + REACT 19</span>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">Fullstack server-first architectures, Server Components, advanced caching structures, and standard route layouts.</p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/40 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> FASTIFY + NODE.JS 20</span>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">High-performance asynchronous backend services, schema validation rules, and extremely lightweight memory footprint.</p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/40 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> FASTAPI + PYTHON 3.12</span>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">High speed asynchronous REST microservices with native OpenAPI generation and robust data validation with Pydantic.</p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/40 border border-border space-y-2 hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> GO (GIN FRAMEWORK)</span>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">Ultra high concurrency RESTful routing and execution speeds with minimized memory profile.</p>
                </div>
              </div>

              <button onClick={() => setActiveTab('workbench')} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase rounded-xl hover:bg-primary/90 shadow-sm cursor-pointer inline-block w-fit">
                Start Analysis
              </button>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-mono text-foreground flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" /> SCANNER USER GUIDE & DOCS
                </h2>
                <p className="text-xs text-muted-foreground font-sans">Understand how the AI Scout Agent scans and generates your roadmap.</p>
              </div>

              <div className="space-y-4 font-sans text-xs text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground font-mono">1. Codebase Identification:</strong> Inputting a GitHub URL allows our scanner to clone, parse, and analyze directory files dynamically.
                </p>
                <p>
                  <strong className="text-foreground font-mono">2. AST (Abstract Syntax Tree) Mapping:</strong> The backend maps exact imports, functions, and models to look for deprecated schemas, legacy structures, or insecure code flows.
                </p>
                <p>
                  <strong className="text-foreground font-mono">3. Phased Roadmap Generation:</strong> A complete migration plan is designed to implement, verify, and switch system paths iteratively to prevent regressions.
                </p>
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium font-mono">
                  ⚡ <strong>Note:</strong> Make sure to supply your LLM keys in the backend configurations to enable automatic, personalized code suggestions.
                </div>
              </div>

              <button onClick={() => setActiveTab('workbench')} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-mono font-bold uppercase rounded-xl hover:bg-primary/90 shadow-sm cursor-pointer inline-block w-fit">
                Go to Workbench
              </button>
            </div>
          )}
        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm py-6 relative z-10 text-center text-xs text-muted-foreground font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>Migration Scout Agent • Professional Landing Page & Workbench</div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 uppercase tracking-wider font-bold">
            <span>Next.js 15</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
            <span>FastAPI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

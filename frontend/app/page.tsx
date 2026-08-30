'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { AnalysisForm } from '@/components/AnalysisForm';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ReportTabs } from '@/components/ReportTabs';
import { CursorGlow } from '@/components/CursorGlow';
import { ScanHistory } from '@/components/ScanHistory';
import { analyzeRepository } from '@/lib/api';
import { MigrationRequest, AnalysisResponse, ApiError } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
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
      {/* Interactive Cursor Glowing Tracker */}
      <CursorGlow />

      {/* Animated Soft Cyberpunk Background Glows */}
      <div className="fixed top-[-100px] left-[10%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[170px] pointer-events-none animate-float-slow" />
      <div className="fixed bottom-[-100px] right-[10%] w-[650px] h-[650px] bg-purple-600/20 rounded-full blur-[170px] pointer-events-none animate-float-reverse" />
      <div className="fixed top-[35%] left-[35%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Rich Animated Codebase AST Graph & Circuit SVG Background Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        {/* Floating Animated AST Tree Graph Vector 1 */}
        <div className="absolute top-[12%] left-[2%] w-[450px] h-[450px] animate-float-slow text-primary/30">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="100" cy="40" r="8" fill="currentColor" />
            <circle cx="50" cy="100" r="6" fill="currentColor" />
            <circle cx="150" cy="100" r="6" fill="currentColor" />
            <circle cx="30" cy="160" r="5" fill="currentColor" />
            <circle cx="80" cy="160" r="5" fill="currentColor" />
            <circle cx="120" cy="160" r="5" fill="currentColor" />
            <circle cx="170" cy="160" r="5" fill="currentColor" />
            <path d="M100 48L50 94M100 48L150 94M50 106L30 155M50 106L80 155M150 106L120 155M150 106L170 155" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Floating Animated Circuit Mesh Vector 2 */}
        <div className="absolute bottom-[10%] right-[3%] w-[500px] h-[500px] animate-float-reverse text-teal-600/20">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="20" y="20" width="160" height="160" rx="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="60" cy="60" r="10" fill="currentColor" />
            <circle cx="140" cy="60" r="10" fill="currentColor" />
            <circle cx="100" cy="140" r="12" fill="currentColor" />
            <path d="M60 70V110H100M140 70V110H100M100 110V128" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Floating Matrix Code Snippet Vector Card 3 */}
        <div className="absolute top-[45%] right-[5%] w-[320px] h-[200px] rounded-2xl border border-primary/15 bg-card/10 backdrop-blur-3xl p-4 font-mono text-[10px] text-primary/40 shadow-2xl animate-pulse" style={{ animationDuration: '8s' }}>
          <div className="flex items-center gap-1.5 mb-2 text-primary/60 font-bold">
            <Code2 className="w-3.5 h-3.5" /> AST_PARSE_ENGINE.TS
          </div>
          <div className="space-y-1">
            <p>import &#123; parseAST &#125; from &apos;@scout/core&apos;;</p>
            <p className="text-emerald-700/60 font-bold">&gt; scanning tree nodes...</p>
            <p>const targetStack = &apos;Next.js 15&apos;;</p>
            <p>return transform(legacyComponent);</p>
          </div>
        </div>
      </div>

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
          <nav className="hidden md:flex items-center justify-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-secondary/40 border border-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'workbench' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              Workbench
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'presets' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              Presets
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'guide' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
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
        
        {/* Left Sidebar Mission Control Panel */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20 lg:self-start flex flex-col gap-5">
          {/* Main Control Card */}
          <div className="p-5 rounded-3xl border border-border bg-card/95 backdrop-blur-xl shadow-lg space-y-6">
            
            {/* Header Status Widget */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 relative z-10" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">Scout Core Agent</h3>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold block -mt-0.5">AST Telemetry Active</span>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary bg-primary/10">
                v2.0
              </Badge>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex flex-col gap-1.5 font-mono text-xs font-bold">
              <button
                onClick={() => { setActiveTab('overview'); if (viewState === 'success') handleReset(); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layout className="w-4 h-4" />
                  <span>Landing Overview</span>
                </div>
                {activeTab === 'overview' && <span className="w-2 h-2 rounded-full bg-primary-foreground" />}
              </button>

              <button
                onClick={() => setActiveTab('workbench')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'workbench'
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radar className="w-4 h-4" />
                  <span>Scanner Workbench</span>
                </div>
                {viewState === 'success' && <span className="px-2 py-0.5 text-[9px] rounded-full bg-emerald-500/20 text-emerald-800 font-bold border border-emerald-500/30">Ready</span>}
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4" />
                  <span>Target Architectures</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4" />
                  <span>Scanner Docs</span>
                </div>
              </button>
            </nav>

            {/* Real-time Telemetry Dashboard */}
            <div className="p-4 rounded-2xl bg-secondary/60 border border-border space-y-3 font-mono text-xs">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>Agent Telemetry</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-primary" /> Parser:</span>
                  <span className="font-bold text-foreground">Tree-sitter AST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-600" /> Mode:</span>
                  <span className="font-bold text-primary">Autonomous</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> OWASP Audit:</span>
                  <span className="text-emerald-700 font-bold">Enabled</span>
                </div>
              </div>
            </div>

            {/* Quick Action Trigger */}
            <button
              onClick={() => setActiveTab('workbench')}
              className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Rocket className="w-4 h-4" />
              <span>Run Quick Repo Scan</span>
            </button>

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

              {/* Scan History Persistence Manager */}
              <ScanHistory />
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
          <div>Built by Team Sprint Latte • Migration Scout Agent</div>
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

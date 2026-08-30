'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Terminal, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Step {
  id: string;
  title: string;
  description: string;
  logs: string[];
}

interface LoadingStateProps {
  onComplete?: () => void;
  targetStack?: string;
  repoUrl?: string;
}

const STEPS: Step[] = [
  {
    id: 'scan',
    title: 'Scanning repository...',
    description: 'Fetching file manifest, cloning structure & establishing AST index',
    logs: [
      'GIT: Establishing HTTPS handshake with remote host...',
      'CLONE: Downloading HEAD commit tree references',
      'INDEX: Parsing 142 repository files across 18 directories',
      'DETECT: Legacy project structure detected (Java / Maven framework)',
    ],
  },
  {
    id: 'analyze',
    title: 'Analyzing legacy code...',
    description: 'Scanning for anti-patterns, deprecated APIs & component coupling',
    logs: [
      'AST: Building abstract syntax tree for Java 8 Controller classes',
      'DEPS: Flagged 12 deprecated libraries (Spring Security 4.x, Hibernate 5.2)',
      'SECURITY: 3 high-severity CVE vulnerability risks flagged in old dependencies',
      'COMPLEXITY: High cyclical dependency found in legacy DataAccessObject layer',
    ],
  },
  {
    id: 'recommend',
    title: 'Generating recommendations...',
    description: 'Synthesizing modern architecture mapping & replacement patterns',
    logs: [
      'MAPPING: Translating Java Spring Controllers -> Next.js 15 App Router Endpoints',
      'STATE: Recommending React Server Components for server-rendered views',
      'ORM: Mapping Hibernate entity classes -> Prisma ORM schemas',
      'AI: Evaluating optimal modern tech stack trade-offs',
    ],
  },
  {
    id: 'plan',
    title: 'Writing migration plan...',
    description: 'Structuring phased task execution roadmap and effort estimation',
    logs: [
      'PLAN: Scaffolding Phase 1 initialization & core setup scripts',
      'TIMELINE: Estimating 2.5 engineering weeks for full migration effort',
      'DOCS: Generating interactive modernization blueprint report',
      'STATUS: Scout Agent analysis complete. Report compiled!',
    ],
  },
];

export function LoadingState({ onComplete, targetStack, repoUrl }: LoadingStateProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progressPercent = Math.min(
    Math.round((((currentStepIndex >= STEPS.length ? STEPS.length - 1 : currentStepIndex) * 4 + activeLogIndex + 1) / (STEPS.length * 4)) * 100),
    100
  );

  useEffect(() => {
    if (currentStepIndex >= STEPS.length) return;

    const currentStepLogs = STEPS[currentStepIndex]?.logs;
    if (!currentStepLogs) return;

    const timer = setTimeout(() => {
      if (activeLogIndex < currentStepLogs.length - 1) {
        setActiveLogIndex((prev) => prev + 1);
      } else {
        // Finish current step
        setCompletedSteps((prev) => [...prev, currentStepIndex]);
        
        if (currentStepIndex < STEPS.length - 1) {
          setCurrentStepIndex((prevStep) => prevStep + 1);
          setActiveLogIndex(0);
        } else {
          if (onComplete) {
            onComplete();
          }
        }
      }
    }, 1100);

    return () => clearTimeout(timer);
  }, [currentStepIndex, activeLogIndex, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <Card className="border-border bg-card shadow-md overflow-hidden rounded-2xl">
        {/* Header gradient bar */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Agent Active Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono tracking-tight text-foreground flex items-center gap-2">
                  SCOUT AGENT ACTIVE
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider font-bold">
                    PARSING
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-md">
                  {repoUrl || 'https://github.com/legacy-project'}
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right font-mono">
              <span className="text-2xl font-black text-primary tracking-tight">{progressPercent}%</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Overall Progress</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2 bg-secondary border border-border rounded-full overflow-hidden" />
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider font-bold text-muted-foreground">
              <span>Target: {targetStack || 'Next.js 15'}</span>
              <span>Step {Math.min(currentStepIndex + 1, STEPS.length)} of {STEPS.length}</span>
            </div>
          </div>

          {/* Multi-step pipeline tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all relative ${
                    isDone
                      ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-900'
                      : isCurrent
                      ? 'bg-primary/10 border-primary text-primary shadow-xs'
                      : 'bg-secondary/40 border-border text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-bold font-mono uppercase text-[10px] tracking-wider">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-border text-[9px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                    )}
                    <span className="truncate">{step.title.replace('...', '')}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Real-time Agent CLI Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                Live Agent Terminal Execution
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                STREAMING
              </span>
            </div>

            <div className="bg-secondary/60 rounded-xl p-4 border border-border font-mono text-[11px] text-muted-foreground space-y-2 h-44 overflow-y-auto shadow-inner">
              {completedSteps.map((sIdx) =>
                STEPS[sIdx].logs.map((log, lIdx) => (
                  <div key={`done-${sIdx}-${lIdx}`} className="text-muted-foreground/80 flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✔</span>
                    <span>{log}</span>
                  </div>
                ))
              )}

              {/* Active step logs */}
              {STEPS[currentStepIndex] && STEPS[currentStepIndex].logs && STEPS[currentStepIndex].logs.slice(0, activeLogIndex + 1).map((log, idx) => (
                <motion.div
                  key={`active-${currentStepIndex}-${idx}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-foreground font-bold flex items-start gap-2"
                >
                  <span className="text-primary animate-pulse font-bold">&gt;</span>
                  <span>{log}</span>
                </motion.div>
              ))}

              <div className="flex items-center gap-1 text-muted-foreground pt-1">
                <span className="w-1.5 h-3 bg-primary animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

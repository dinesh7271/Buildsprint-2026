'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Terminal, Cpu, FileSearch, Sparkles, Code, GitBranch } from 'lucide-react';
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
    Math.round(((currentStepIndex * 4 + activeLogIndex + 1) / (STEPS.length * 4)) * 100),
    100
  );

  useEffect(() => {
    // Step progression timer
    const interval = setInterval(() => {
      setActiveLogIndex((prevLogIndex) => {
        const currentStepLogs = STEPS[currentStepIndex].logs;
        if (prevLogIndex < currentStepLogs.length - 1) {
          return prevLogIndex + 1;
        } else {
          // Finish current step
          setCompletedSteps((prev) => [...prev, currentStepIndex]);
          
          if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex((prevStep) => prevStep + 1);
            return 0;
          } else {
            clearInterval(interval);
            if (onComplete) {
              setTimeout(onComplete, 1200);
            }
            return prevLogIndex;
          }
        }
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [currentStepIndex, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 overflow-hidden">
        {/* Header gradient bar */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 animate-pulse" />

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Agent Active Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Scout Agent Active
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    PARSING
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-md">
                  {repoUrl || 'https://github.com/legacy-project'}
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right font-mono">
              <span className="text-2xl font-black text-cyan-400">{progressPercent}%</span>
              <p className="text-[11px] text-slate-500">Overall Progress</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2 bg-slate-950 border border-slate-800" />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Target: {targetStack || 'Next.js 15'}</span>
              <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
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
                  className={`p-3 rounded-lg border text-xs transition-all relative ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-semibold">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                    )}
                    <span className="truncate">{step.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Real-time Agent CLI Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Live Agent Terminal Execution
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                STREAMING
              </span>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 h-44 overflow-y-auto shadow-inner">
              {completedSteps.map((sIdx) =>
                STEPS[sIdx].logs.map((log, lIdx) => (
                  <div key={`done-${sIdx}-${lIdx}`} className="text-slate-500 flex items-start gap-2">
                    <span className="text-emerald-500/80">✔</span>
                    <span>{log}</span>
                  </div>
                ))
              )}

              {/* Active step logs */}
              {STEPS[currentStepIndex].logs.slice(0, activeLogIndex + 1).map((log, idx) => (
                <motion.div
                  key={`active-${currentStepIndex}-${idx}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-cyan-300 flex items-start gap-2"
                >
                  <span className="text-cyan-400 animate-pulse font-bold">&gt;</span>
                  <span>{log}</span>
                </motion.div>
              ))}

              <div className="flex items-center gap-1 text-slate-600 pt-1">
                <span className="w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw, Cpu, Layers, Clock, AlertTriangle, FileCode2, Zap, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalysisResponse } from '@/lib/types';

interface Phase1ResultPreviewProps {
  data: AnalysisResponse;
  onReset: () => void;
}

export function Phase1ResultPreview({ data, onReset }: Phase1ResultPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Overview Banner Card */}
      <Card className="border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 overflow-hidden relative">
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400" />
        
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[11px] font-mono">
                  Phase 1 Scout Complete
                </Badge>
                <span className="text-xs text-slate-500 font-mono">ID: {data.id}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 font-mono flex items-center gap-2">
                {data.repoName}
              </h2>
            </div>

            <Button
              onClick={onReset}
              variant="outline"
              className="border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs h-9 font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Analyze Another Repo
            </Button>
          </div>

          {/* Key Metrics Summary */}
          {data.summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Total Files</div>
                <div className="text-xl font-bold text-slate-100 font-mono mt-0.5">{data.summary.totalFiles}</div>
              </div>
              
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Lines of Code</div>
                <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
                  {data.summary.linesOfCode.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Complexity Risk</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                  {data.summary.complexityScore}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400">Est. Migration Effort</div>
                <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">
                  {data.summary.migrationEffortEstimate}
                </div>
              </div>
            </div>
          )}

          {/* Detected vs Recommended Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Legacy Detected */}
            {data.detectedStack && (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Detected Legacy Stack
                  </span>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-300 text-[10px]">
                    Current
                  </Badge>
                </div>
                <div className="text-base font-bold text-slate-200">{data.detectedStack.language}</div>
                <div className="text-xs text-slate-400 font-mono space-y-0.5">
                  <div>Framework: {data.detectedStack.framework}</div>
                  <div>Build Tool: {data.detectedStack.buildTool} (JDK {data.detectedStack.version})</div>
                </div>
              </div>
            )}

            {/* Recommended Modern */}
            {data.recommendedStack && (
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Recommended Modern Stack
                  </span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                    Target
                  </Badge>
                </div>
                <div className="text-base font-bold text-slate-100">{data.recommendedStack.framework}</div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {data.recommendedStack.rationale}
                </p>
              </div>
            )}
          </div>

          {/* Completed Pipeline Execution Steps */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Agent Pipeline Execution Log
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.steps.map((step) => (
                <div
                  key={step.id}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{step.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2 Teaser Notice */}
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-center space-y-2">
            <div className="text-xs font-mono font-semibold text-cyan-400 flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Phase 1 Agent Scout Scan Succeeded
            </div>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Deep dependency graphs, file-by-file AST mappings, automatically refactored PR patches, and interactive report tabs will unlock in Phase 2.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

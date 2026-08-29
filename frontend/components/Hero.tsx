'use client';

import { motion } from 'framer-motion';
import { Terminal, Sparkles, Cpu, ArrowRight, ShieldCheck, GitBranch, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <div className="relative pt-8 pb-12 overflow-hidden text-center">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-mono font-medium mb-6 backdrop-blur-md shadow-lg shadow-cyan-950/40"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
        <span>Autonomous AI Migration Agent • Phase 1 Scout</span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/40 text-cyan-300 bg-cyan-500/10">
          v1.0
        </Badge>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.15]"
      >
        Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">Legacy Codebases</span> Into{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Modern Stacks</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
      >
        Scan any GitHub repository to instantly detect outdated patterns, evaluate architectural technical debt, and generate an automated, step-by-step modernization roadmap.
      </motion.p>

      {/* Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left mb-4"
      >
        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
          <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">AST Analysis</div>
            <div className="text-[11px] text-slate-400">Deep structural scanning</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
          <div className="p-2 rounded-md bg-purple-500/10 text-purple-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Stack Mapping</div>
            <div className="text-[11px] text-slate-400">Legacy to next-gen targets</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Effort Score</div>
            <div className="text-[11px] text-slate-400">Automated risk matrix</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

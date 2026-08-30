'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, GitBranch, Zap } from 'lucide-react';
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
        transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/10 bg-cyan-950/10 text-cyan-400 text-xs font-mono font-medium mb-6 backdrop-blur-md shadow shadow-cyan-950/10"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
        <span>Autonomous AI Migration Agent • Modernization Suite</span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/20 text-cyan-300 bg-cyan-500/5">
          v2.0
        </Badge>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.2 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.15] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
      >
        Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">Legacy Codebases</span> Into{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Modern Stacks</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.35 }}
        className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
      >
        Scan any GitHub repository to instantly detect outdated patterns, evaluate architectural technical debt, and generate an automated, step-by-step modernization roadmap.
      </motion.p>

      {/* Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left mb-4"
      >
        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-800/60 bg-slate-900/10 backdrop-blur-md shadow-sm hover:border-cyan-500/30 hover:bg-slate-900/20 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-cyan-500/5 text-cyan-400 border border-cyan-500/10">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 font-mono tracking-tight">AST Analysis</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Deep structural scanning</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-800/60 bg-slate-900/10 backdrop-blur-md shadow-sm hover:border-purple-500/30 hover:bg-slate-900/20 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-purple-500/5 text-purple-400 border border-purple-500/10">
            <GitBranch className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 font-mono tracking-tight">Stack Mapping</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Legacy to next-gen targets</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-800/60 bg-slate-900/10 backdrop-blur-md shadow-sm hover:border-emerald-500/30 hover:bg-slate-900/20 transition-all duration-300">
          <div className="p-2.5 rounded-lg bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 font-mono tracking-tight">Effort Score</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Automated risk matrix</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

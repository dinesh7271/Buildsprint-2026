'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, GitBranch, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <div className="relative pt-12 pb-14 overflow-hidden text-center">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/8 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-teal-500/8 blur-[110px] rounded-full pointer-events-none" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-mono font-medium mb-6 backdrop-blur-md shadow-sm shadow-primary/5"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-primary" />
        <span>Autonomous AI Migration Agent • Modernization Suite</span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary bg-primary/5">
          v2.0
        </Badge>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.2 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.15] bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text"
      >
        Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 font-black">Legacy Codebases</span> Into{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-500 to-emerald-500 font-black">Modern Stacks</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.35 }}
        className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
      >
        Scan any GitHub repository to instantly detect outdated patterns, evaluate architectural technical debt, and generate an automated, step-by-step modernization roadmap.
      </motion.p>

      {/* Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left mb-4"
      >
        <div className="flex items-center gap-3.5 p-4.5 rounded-2xl border border-border bg-card/50 backdrop-blur-md shadow-sm hover:border-primary/40 hover:bg-card/80 hover:shadow-md transition-all duration-300 group">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all group-hover:scale-105">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-mono tracking-tight">AST Analysis</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Deep structural scanning</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4.5 rounded-2xl border border-border bg-card/50 backdrop-blur-md shadow-sm hover:border-teal-500/40 hover:bg-card/80 hover:shadow-md transition-all duration-300 group">
          <div className="p-2.5 rounded-xl bg-teal-550/10 text-teal-600 border border-teal-500/20 transition-all group-hover:scale-105">
            <GitBranch className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-mono tracking-tight">Stack Mapping</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Legacy to next-gen targets</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4.5 rounded-2xl border border-border bg-card/50 backdrop-blur-md shadow-sm hover:border-emerald-500/40 hover:bg-card/80 hover:shadow-md transition-all duration-300 group">
          <div className="p-2.5 rounded-xl bg-emerald-550/10 text-emerald-600 border border-emerald-500/20 transition-all group-hover:scale-105">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground font-mono tracking-tight">Effort Score</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Automated risk matrix</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

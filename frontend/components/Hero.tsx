'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, GitBranch, Zap, ArrowRight, ShieldCheck, Code2, Layers, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <div className="relative pt-6 pb-10 overflow-hidden text-center">
      {/* Ambient Chilly Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-teal-600/8 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-mono font-semibold mb-6 backdrop-blur-md shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-primary" />
        <span>Next-Gen Autonomous Migration Intelligence</span>
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-primary/30 text-primary bg-primary/10 font-mono">
          v2.0 Release
        </Badge>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.2 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.12]"
      >
        Modernize <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600 font-black">Legacy Codebases</span> At{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-600 font-black">Autonomous Speed</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.3 }}
        className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed font-sans"
      >
        Transform monolithic debt into high-performance, next-gen architectures. Scout analyzes Abstract Syntax Trees, maps dependencies, and generates phased migration routes automatically.
      </motion.p>

      {/* Interactive Code Preview Comparison Widget */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.4 }}
        className="max-w-4xl mx-auto text-left rounded-2xl border border-border bg-card/90 shadow-xl overflow-hidden mb-12"
      >
        {/* Terminal Header Bar */}
        <div className="bg-secondary/80 border-b border-border px-4 py-3 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            <span className="ml-2 text-muted-foreground text-[11px] font-bold">scout-ast-transformation.ts</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold">
            <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> AST Parsed</span>
            <span className="hidden sm:inline">React 15 → Next.js 15</span>
          </div>
        </div>

        {/* Code Grid Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border font-mono text-xs p-4 bg-card">
          {/* Legacy side */}
          <div className="space-y-2 pr-0 md:pr-4 pb-4 md:pb-0">
            <div className="text-[10px] text-rose-700 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Legacy React 15 Component</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700">Deprecated</span>
            </div>
            <pre className="text-[11px] text-muted-foreground overflow-x-auto leading-relaxed p-3 rounded-lg bg-background/80 border border-border">
{`// Old class component pattern
var React = require('react');
var UserList = React.createClass({
  componentWillMount: function() {
    fetch('/api/users').then(...)
  },
  render: function() {
    return <div>{this.props.users}</div>;
  }
});`}
            </pre>
          </div>

          {/* Modernized side */}
          <div className="space-y-2 pl-0 md:pl-4 pt-4 md:pt-0">
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Next.js 15 Server Component</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700">Modernized</span>
            </div>
            <pre className="text-[11px] text-foreground overflow-x-auto leading-relaxed p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
{`// Modern React 19 Server Component
import { use } from 'react';

export async function UserList() {
  const users = await fetchUsers(); // Cached
  return <div className="grid font-sans">{users}</div>;
}`}
            </pre>
          </div>
        </div>
      </motion.div>

      {/* Feature Bento Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left mb-2"
      >
        <div className="p-5 rounded-2xl border border-border bg-card/70 shadow-sm hover:border-primary/40 transition-all duration-300">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground font-mono mb-1">Tree-Sitter AST Scanner</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            Parses language syntax trees down to individual tokens to detect unsafe dependencies & anti-patterns.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card/70 shadow-sm hover:border-primary/40 transition-all duration-300">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 border border-teal-500/20 flex items-center justify-center mb-3">
            <GitBranch className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground font-mono mb-1">Phased Execution Plan</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            Generates incremental modernization steps with rollbacks so your production app never breaks.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card/70 shadow-sm hover:border-primary/40 transition-all duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground font-mono mb-1">Risk & Effort Estimator</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            Calculates precise engineering hours and complexity scores before a single line of code is moved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

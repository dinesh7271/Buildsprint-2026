'use client';

import { AnalysisResponse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Code2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Server,
  Zap,
} from 'lucide-react';

interface OverviewCardProps {
  data: AnalysisResponse;
}

export function OverviewCard({ data }: OverviewCardProps) {
  const { summary, detectedStack, recommendedStack, repoName } = data;

  const getComplexityBadge = (score?: string) => {
    switch (score) {
      case 'Low':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-[10px] uppercase font-bold tracking-wider">Low Complexity</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-[10px] uppercase font-bold tracking-wider">Medium Complexity</Badge>;
      case 'High':
        return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 font-mono text-[10px] uppercase font-bold tracking-wider">High Complexity</Badge>;
      case 'Critical':
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 font-mono text-[10px] uppercase font-bold tracking-wider">Critical Complexity</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* High-level Architecture Transformation Hero Card */}
      <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-sm overflow-hidden relative rounded-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="pb-4 border-b border-slate-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Repository Target</span>
                <span className="text-slate-700 font-mono">•</span>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">{repoName}</span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-100 font-mono uppercase tracking-tight flex items-center gap-2">
                <span>Architecture Modernization Scout</span>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getComplexityBadge(summary?.complexityScore)}
              <Badge variant="outline" className="border-cyan-500/20 text-cyan-400 bg-cyan-500/5 font-mono text-[10px] uppercase font-bold tracking-wider">
                {summary?.migrationEffortEstimate || '2-3 Weeks'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Stack Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Legacy Stack */}
            <div className="md:col-span-5 p-4.5 rounded-xl bg-slate-950/40 border border-slate-800/80 relative group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-rose-500/70" /> Legacy Environment
                </span>
                <Badge className="bg-rose-500/10 text-rose-300 border-rose-500/20 text-[9px] font-mono font-bold uppercase tracking-wider">Current</Badge>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Language:</span>
                  <span className="font-bold text-slate-350">{detectedStack?.language || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Framework:</span>
                  <span className="font-bold text-slate-350">{detectedStack?.framework || 'Unknown'}</span>
                </div>
                {detectedStack?.buildTool && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Build Tool:</span>
                    <span className="font-bold text-slate-355">{detectedStack.buildTool}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Transition Arrow */}
            <div className="md:col-span-2 flex justify-center py-2 md:py-0">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-cyan-400 shadow-sm shadow-cyan-500/5">
                <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Target Stack */}
            <div className="md:col-span-5 p-4.5 rounded-xl bg-slate-950/40 border border-slate-800/80 relative group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Recommended Stack
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-wider">Target</Badge>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Language:</span>
                  <span className="font-bold text-emerald-300">{recommendedStack?.language || 'Modern JS/TS'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Framework:</span>
                  <span className="font-bold text-cyan-300">{recommendedStack?.framework || 'Next.js 15'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rationale Banner */}
          {recommendedStack?.rationale && (
            <div className="mt-5 p-3.5 rounded-xl bg-cyan-950/10 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed font-sans">
              <span className="font-bold text-cyan-300 font-mono text-[10px] uppercase tracking-wider mr-1">Rationale:</span>
              {recommendedStack.rationale}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/5 text-cyan-400 border border-cyan-500/10">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Total Files</p>
              <p className="text-lg font-bold font-mono text-slate-100">{summary?.totalFiles.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-500/5 text-teal-400 border border-teal-500/10">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Lines of Code</p>
              <p className="text-lg font-bold font-mono text-slate-100">{summary?.linesOfCode.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/5 text-amber-400 border border-amber-500/10">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Outdated Packages</p>
              <p className="text-lg font-bold font-mono text-amber-400">{summary?.deprecatedDepsCount || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/10">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Security Risks</p>
              <p className="text-lg font-bold font-mono text-rose-400">{summary?.securityVulnerabilitiesCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 font-mono text-[10px] uppercase font-bold tracking-wider">High Complexity</Badge>;
      case 'Critical':
        return <Badge className="bg-rose-600/20 text-rose-300 border-rose-600/40 font-mono text-[10px] uppercase font-bold tracking-wider">Critical Complexity</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* High-level Architecture Transformation Hero Card */}
      <Card className="bg-card border-border backdrop-blur-sm overflow-hidden relative rounded-2xl shadow-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-bold">Repository Target</span>
                <span className="text-muted-foreground font-mono">•</span>
                <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-wider">{repoName}</span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground font-mono uppercase tracking-tight flex items-center gap-2">
                <span>Architecture Modernization Scout</span>
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getComplexityBadge(summary?.complexityScore)}
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-mono text-[10px] uppercase font-bold tracking-wider">
                {summary?.migrationEffortEstimate || '2-3 Weeks'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Stack Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Legacy Stack */}
            <div className="md:col-span-5 p-4.5 rounded-xl bg-secondary/40 border border-border relative group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-rose-400" /> Legacy Environment
                </span>
                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[9px] font-mono font-bold uppercase tracking-wider">Current</Badge>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-bold">{detectedStack?.language || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Framework:</span>
                  <span className="font-bold">{detectedStack?.framework || 'Unknown'}</span>
                </div>
                {detectedStack?.buildTool && (
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Build Tool:</span>
                    <span className="font-bold">{detectedStack.buildTool}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Transition Arrow */}
            <div className="md:col-span-2 flex justify-center py-2 md:py-0">
              <div className="p-3 rounded-xl bg-card border border-border text-primary shadow-xs">
                <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
              </div>
            </div>

            {/* Target Stack */}
            <div className="md:col-span-5 p-4.5 rounded-xl bg-secondary/40 border border-border relative group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Recommended Stack
                </span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-wider">Target</Badge>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="font-bold text-emerald-400">{recommendedStack?.language || 'Modern JS/TS'}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span className="text-muted-foreground">Framework:</span>
                  <span className="font-bold text-primary">{recommendedStack?.framework || 'Next.js 15'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rationale Banner */}
          {recommendedStack?.rationale && (
            <div className="mt-5 p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground leading-relaxed font-sans">
              <span className="font-bold text-primary font-mono text-[10px] uppercase tracking-wider mr-1">Rationale:</span>
              {recommendedStack.rationale}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Total Files</p>
              <p className="text-lg font-bold font-mono text-foreground">{summary?.totalFiles.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Lines of Code</p>
              <p className="text-lg font-bold font-mono text-foreground">{summary?.linesOfCode.toLocaleString() || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-600/10 text-amber-800 border border-amber-600/20">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Outdated Packages</p>
              <p className="text-lg font-bold font-mono text-amber-800">{summary?.deprecatedDepsCount || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-2xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-600/10 text-rose-800 border border-rose-600/20">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Security Risks</p>
              <p className="text-lg font-bold font-mono text-rose-800">{summary?.securityVulnerabilitiesCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

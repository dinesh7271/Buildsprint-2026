'use client';

import { Recommendation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations?: Recommendation[];
}

export function RecommendationsSection({ recommendations = [] }: RecommendationsSectionProps) {
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">High Impact</Badge>;
      case 'Medium':
        return <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">Medium Impact</Badge>;
      case 'Low':
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">Low Impact</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'Low':
        return <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-emerald-500/5">Low Effort</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-amber-500/5">Medium Effort</Badge>;
      case 'High':
        return <Badge variant="outline" className="border-rose-500/20 text-rose-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-500/5">High Effort</Badge>;
      default:
        return <Badge variant="outline">{effort}</Badge>;
    }
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
      <CardHeader className="border-b border-slate-800/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/5 text-cyan-400 border border-cyan-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-slate-100">Modernization Recommendations</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Actionable engineering proposals to optimize performance, DX, and maintainability
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-cyan-500/5">
            {recommendations.length} Proposals
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-cyan-400" />
            <span>No specific recommendations generated for this repository.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{rec.id}</span>
                    <span className="text-slate-700 font-mono">•</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">{rec.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImpactBadge(rec.impact)}
                    {getEffortBadge(rec.effort)}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

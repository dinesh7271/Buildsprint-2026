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
        return <Badge className="bg-emerald-600/10 text-emerald-800 border-emerald-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">High Impact</Badge>;
      case 'Medium':
        return <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase font-bold tracking-wider">Medium Impact</Badge>;
      case 'Low':
        return <Badge className="bg-secondary text-muted-foreground border-border font-mono text-[10px] uppercase font-bold tracking-wider">Low Impact</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'Low':
        return <Badge variant="outline" className="border-emerald-600/20 text-emerald-800 font-mono text-[10px] uppercase font-bold tracking-wider bg-emerald-600/5">Low Effort</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="border-amber-600/20 text-amber-800 font-mono text-[10px] uppercase font-bold tracking-wider bg-amber-600/5">Medium Effort</Badge>;
      case 'High':
        return <Badge variant="outline" className="border-rose-600/20 text-rose-800 font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-600/5">High Effort</Badge>;
      default:
        return <Badge variant="outline">{effort}</Badge>;
    }
  };

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">Modernization Recommendations</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Actionable engineering proposals to optimize performance, DX, and maintainability
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider bg-primary/5">
            {recommendations.length} Proposals
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm font-mono flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-primary" />
            <span>No specific recommendations generated for this repository.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-secondary/30 border border-border hover:border-primary/40 transition-all duration-300 space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary font-bold">{rec.id}</span>
                    <span className="text-muted-foreground font-mono">•</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold">{rec.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImpactBadge(rec.impact)}
                    {getEffortBadge(rec.effort)}
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {rec.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">{rec.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

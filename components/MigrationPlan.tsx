'use client';

import { MigrationPhase } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCommit, Calendar, Clock, CheckSquare, Layers } from 'lucide-react';

interface MigrationPlanProps {
  migrationPlan?: MigrationPhase[];
}

export function MigrationPlan({ migrationPlan = [] }: MigrationPlanProps) {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono">Low Risk</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono">Medium Risk</Badge>;
      case 'High':
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 font-mono">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'Small':
        return <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono">Effort: Small</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="border-teal-500/30 text-teal-400 font-mono">Effort: Medium</Badge>;
      case 'Large':
        return <Badge variant="outline" className="border-purple-500/30 text-purple-400 font-mono">Effort: Large</Badge>;
      case 'X-Large':
        return <Badge variant="outline" className="border-rose-500/30 text-rose-400 font-mono">Effort: XL</Badge>;
      default:
        return <Badge variant="outline">{effort}</Badge>;
    }
  };

  return (
    <Card className="bg-slate-900/80 border-slate-800">
      <CardHeader className="border-b border-slate-800/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-100">Step-by-Step Migration Roadmap</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Phased execution strategy designed for zero-downtime cutover
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-teal-500/30 text-teal-400 font-mono">
            {migrationPlan.length} Phases
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative border-l-2 border-slate-800 ml-3 sm:ml-4 space-y-8 pl-6">
          {migrationPlan.map((phase) => (
            <div key={phase.phase} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>

              <div className="p-5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                      Phase {phase.phase}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{phase.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {phase.duration}
                    </span>
                    {getRiskBadge(phase.risk)}
                    {getEffortBadge(phase.effort)}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{phase.description}</p>

                {phase.tasks && phase.tasks.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                      Key Deliverables & Action Items:
                    </span>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2 font-mono">
                          <CheckSquare className="w-3.5 h-3.5 mt-0.5 text-cyan-400 shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

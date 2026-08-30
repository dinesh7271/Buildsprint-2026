'use client';

import { useState } from 'react';
import { MigrationPhase } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckSquare, Layers, CheckCircle2, Circle } from 'lucide-react';

interface MigrationPlanProps {
  migrationPlan?: MigrationPhase[];
}

export function MigrationPlan({ migrationPlan = [] }: MigrationPlanProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (phaseIdx: number, taskIdx: number) => {
    const key = `${phaseIdx}-${taskIdx}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = migrationPlan.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low':
        return <Badge className="bg-emerald-600/10 text-emerald-800 border-emerald-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">Low Risk</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-600/10 text-amber-800 border-amber-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">Medium Risk</Badge>;
      case 'High':
        return <Badge className="bg-rose-600/10 text-rose-800 border-rose-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'Small':
        return <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider bg-primary/5">Effort: Small</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider bg-primary/5">Effort: Medium</Badge>;
      case 'Large':
        return <Badge variant="outline" className="border-rose-600/20 text-rose-800 font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-600/5">Effort: Large</Badge>;
      default:
        return <Badge variant="outline">{effort}</Badge>;
    }
  };

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">Interactive Migration Checklist</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Click deliverables to track live modernization execution progress
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs">
              <span className="text-muted-foreground font-bold">{completedCount}/{totalTasks} Completed</span>
              <div className="w-28 h-2 bg-secondary rounded-full overflow-hidden mt-1 border border-border">
                <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider bg-primary/5">
              {migrationPlan.length} Phases
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="relative border-l border-border ml-3 sm:ml-4 space-y-8 pl-6">
          {migrationPlan.map((phase, pIdx) => (
            <div key={phase.phase} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-card border-2 border-primary group-hover:bg-primary transition-all duration-300 shadow-sm flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-card" />
              </div>

              <div className="p-5 rounded-2xl bg-secondary/40 border border-border hover:border-primary/40 transition-colors duration-300 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider">
                      Phase {phase.phase}
                    </span>
                    <h3 className="text-sm font-bold text-foreground font-sans">{phase.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 bg-card px-2 py-1 rounded-lg border border-border uppercase font-bold">
                      <Clock className="w-3 h-3 text-primary" />
                      {phase.duration}
                    </span>
                    {getRiskBadge(phase.risk)}
                    {getEffortBadge(phase.effort)}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-sans">{phase.description}</p>

                {phase.tasks && phase.tasks.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block font-bold">
                      Interactive Tasks & Deliverables:
                    </span>
                    <ul className="space-y-1.5">
                      {phase.tasks.map((task, tIdx) => {
                        const isDone = Boolean(completedTasks[`${pIdx}-${tIdx}`]);
                        return (
                          <li
                            key={tIdx}
                            onClick={() => toggleTask(pIdx, tIdx)}
                            className={`text-xs flex items-start gap-2.5 font-mono p-2 rounded-xl border transition-all cursor-pointer select-none ${
                              isDone
                                ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-900 line-through opacity-80'
                                : 'bg-card border-border hover:border-primary/40 text-foreground'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                            )}
                            <span className="leading-snug">{task}</span>
                          </li>
                        );
                      })}
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

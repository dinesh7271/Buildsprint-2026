'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Clock, Zap, TrendingUp, RefreshCw } from 'lucide-react';

interface RoiCalculatorProps {
  linesOfCode?: number;
  complexityScore?: string;
}

export function RoiCalculator({ linesOfCode = 2500, complexityScore = 'Medium' }: RoiCalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState<number>(75);
  const [developerCount, setDeveloperCount] = useState<number>(3);

  // ROI Math
  const estimatedManualHours = Math.round((linesOfCode / 100) * (complexityScore === 'Critical' ? 4.5 : complexityScore === 'High' ? 3.2 : 2.0));
  const estimatedScoutHours = Math.round(estimatedManualHours * 0.25); // 75% time saved
  const hoursSaved = estimatedManualHours - estimatedScoutHours;
  const costSavings = hoursSaved * hourlyRate;
  const velocityMultiplier = '3.8x';

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">Migration ROI & Effort Estimator</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Calculate developer hours and engineering budget saved with Scout
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-emerald-600/10 text-emerald-800 border-emerald-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            75% Time Saved
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Interactive Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-secondary/30 p-4 rounded-2xl border border-border">
          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-bold">Developer Hourly Rate ($/hr):</span>
              <span className="text-primary font-bold">${hourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-bold">Engineering Team Size:</span>
              <span className="text-primary font-bold">{developerCount} Devs</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={developerCount}
              onChange={(e) => setDeveloperCount(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>

        {/* ROI Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground font-bold">
              <Clock className="w-4 h-4 text-primary" />
              <span>Manual vs Scout Hours</span>
            </div>
            <div className="text-xl font-mono font-bold text-foreground">
              {hoursSaved} hrs <span className="text-xs text-emerald-800">Saved</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              Manual: {estimatedManualHours} hrs | Scout: {estimatedScoutHours} hrs
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground font-bold">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>Estimated Cost Savings</span>
            </div>
            <div className="text-xl font-mono font-bold text-emerald-800">
              ${costSavings.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              Based on ${hourlyRate}/hr team rate
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground font-bold">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Velocity Boost</span>
            </div>
            <div className="text-xl font-mono font-bold text-foreground">
              {velocityMultiplier} Faster
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              Accelerates sprint delivery timelines
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
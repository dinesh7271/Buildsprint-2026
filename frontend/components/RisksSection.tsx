'use client';

import { OutdatedLibrary, SecurityRisk } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';

interface RisksSectionProps {
  outdatedLibraries?: OutdatedLibrary[];
  securityRisks?: SecurityRisk[];
}

export function RisksSection({ outdatedLibraries = [], securityRisks = [] }: RisksSectionProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">Critical</Badge>;
      case 'High':
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500/10 text-yellow-300 border-yellow-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Security Vulnerabilities Card */}
      <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
        <CardHeader className="border-b border-slate-800/60 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/5 text-rose-400 border border-rose-500/10">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-slate-100">Security Vulnerabilities</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Detected code patterns or dependencies with known security risks
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-rose-500/20 text-rose-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-500/5">
              {securityRisks.length} Issues Found
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {securityRisks.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span>No critical security vulnerabilities detected in target scan.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {securityRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 font-bold">{risk.id}</span>
                      <h4 className="text-sm font-bold text-slate-200 font-sans">{risk.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">{risk.category}</span>
                      {getSeverityBadge(risk.severity)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{risk.description}</p>
                  {risk.location && (
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-850 inline-block">
                      <span className="text-slate-500">Location:</span> {risk.location}
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800/40 text-xs text-emerald-400/90 font-mono flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
                    <span><strong className="text-emerald-300">Remediation:</strong> {risk.remediation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deprecated & Outdated Libraries Card */}
      <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
        <CardHeader className="border-b border-slate-800/60 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/5 text-amber-400 border border-amber-500/10">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-slate-100">Outdated & Deprecated Libraries</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Legacy dependencies requiring modernization or structural replacement
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-amber-500/5">
              {outdatedLibraries.length} Packages
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {outdatedLibraries.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm flex flex-col items-center gap-2">
              <PackageCheck className="w-8 h-8 text-emerald-400" />
              <span>All detected dependencies are up to date!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outdatedLibraries.map((lib, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex flex-col justify-between space-y-3 hover:border-slate-700/80 transition-all duration-300"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-cyan-300 truncate max-w-[200px]" title={lib.name}>
                        {lib.name}
                      </span>
                      {getSeverityBadge(lib.riskLevel)}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 font-bold">
                      <span className="text-rose-400/85">v{lib.currentVersion}</span>
                      <ArrowRight className="w-3 h-3 text-slate-700" />
                      <span className="text-emerald-400/85">v{lib.latestVersion}</span>
                    </div>
                  </div>

                  {lib.vulnerabilities && lib.vulnerabilities.length > 0 && (
                    <div className="space-y-1">
                      {lib.vulnerabilities.map((vuln, vIdx) => (
                        <div key={vIdx} className="text-[10px] font-mono text-rose-300/85 bg-rose-950/15 px-2.5 py-1 rounded-lg border border-rose-500/10">
                          ⚠ {vuln}
                        </div>
                      ))}
                    </div>
                  )}

                  {lib.replacement && (
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-850">
                      <span className="text-slate-500">Replacement:</span>{' '}
                      <span className="text-cyan-400 font-bold">{lib.replacement}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

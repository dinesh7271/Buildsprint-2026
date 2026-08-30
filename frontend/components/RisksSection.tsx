'use client';

import { useState } from 'react';
import { OutdatedLibrary, SecurityRisk } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, PackageCheck, Search, Filter } from 'lucide-react';

interface RisksSectionProps {
  outdatedLibraries?: OutdatedLibrary[];
  securityRisks?: SecurityRisk[];
}

export function RisksSection({ outdatedLibraries = [], securityRisks = [] }: RisksSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const filteredRisks = securityRisks.filter((risk) => {
    const matchesQuery =
      risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'All' || risk.severity === selectedSeverity;
    return matchesQuery && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <Badge className="bg-rose-600/10 text-rose-800 border-rose-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">Critical</Badge>;
      case 'High':
        return <Badge className="bg-amber-600/10 text-amber-800 border-amber-600/20 font-mono text-[10px] uppercase font-bold tracking-wider">High</Badge>;
      case 'Medium':
        return <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 font-mono text-[10px] uppercase font-bold tracking-wider">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase font-bold tracking-wider">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Security Vulnerabilities Card */}
      <Card className="bg-card border-border rounded-2xl shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-600/10 text-rose-800 border border-rose-600/20">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">Security Vulnerabilities Audit</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Detected code patterns or dependencies with known security risks
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-rose-600/20 text-rose-800 font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-600/5">
              {securityRisks.length} Issues Found
            </Badge>
          </div>

          {/* Interactive Search & Severity Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter vulnerability title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-9 pr-3 bg-secondary/50 border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Filter className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    selectedSeverity === sev
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-card text-muted-foreground border-border hover:text-foreground'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredRisks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm font-mono flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <span>No matching security vulnerabilities found for this filter.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRisks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/40 transition-colors space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground font-bold">{risk.id}</span>
                      <h4 className="text-sm font-bold text-foreground font-sans">{risk.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold">{risk.category}</span>
                      {getSeverityBadge(risk.severity)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">{risk.description}</p>
                  {risk.location && (
                    <div className="text-[10px] font-mono text-muted-foreground bg-card px-2.5 py-1.5 rounded-lg border border-border inline-block">
                      <span className="font-bold text-foreground">Location:</span> {risk.location}
                    </div>
                  )}
                  <div className="pt-2 border-t border-border text-xs text-emerald-800 font-mono flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-700" />
                    <span><strong className="text-emerald-900 font-bold">Remediation:</strong> {risk.remediation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deprecated & Outdated Libraries Card */}
      <Card className="bg-card border-border rounded-2xl shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-600/10 text-amber-800 border border-amber-600/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">Outdated & Deprecated Libraries</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Legacy dependencies requiring modernization or structural replacement
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-amber-600/20 text-amber-800 font-mono text-[10px] uppercase font-bold tracking-wider bg-amber-600/5">
              {outdatedLibraries.length} Packages
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {outdatedLibraries.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm font-mono flex flex-col items-center gap-2">
              <PackageCheck className="w-8 h-8 text-emerald-600" />
              <span>All detected dependencies are up to date!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outdatedLibraries.map((lib, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-secondary/30 border border-border flex flex-col justify-between space-y-3 hover:border-primary/40 transition-all duration-300"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-foreground truncate max-w-[200px]" title={lib.name}>
                        {lib.name}
                      </span>
                      {getSeverityBadge(lib.riskLevel)}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 font-bold">
                      <span className="text-rose-700">v{lib.currentVersion}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-emerald-700">v{lib.latestVersion}</span>
                    </div>
                  </div>

                  {lib.vulnerabilities && lib.vulnerabilities.length > 0 && (
                    <div className="space-y-1">
                      {lib.vulnerabilities.map((vuln, vIdx) => (
                        <div key={vIdx} className="text-[10px] font-mono text-rose-800 bg-rose-600/10 px-2.5 py-1 rounded-lg border border-rose-600/20">
                          ⚠ {vuln}
                        </div>
                      ))}
                    </div>
                  )}

                  {lib.replacement && (
                    <div className="text-[10px] font-mono text-muted-foreground bg-card px-2.5 py-1.5 rounded-lg border border-border">
                      <span>Replacement:</span>{' '}
                      <span className="text-primary font-bold">{lib.replacement}</span>
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

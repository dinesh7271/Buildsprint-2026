'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Columns, ListFilter, Copy, Check } from 'lucide-react';

interface DiffViewerProps {
  filename?: string;
  legacyCode?: string;
  modernCode?: string;
}

export function DiffViewer({
  filename = 'migration-diff.ts',
  legacyCode = `// Legacy Callback Pattern
function fetchUserData(userId, callback) {
  db.query('SELECT * FROM users WHERE id = ' + userId, function(err, res) {
    if (err) return callback(err);
    callback(null, res);
  });
}`,
  modernCode = `// Modern Async Server Component Action
import { z } from 'zod';

const userSchema = z.object({ userId: z.string().uuid() });

export async function getUserData(input: { userId: string }) {
  const { userId } = userSchema.parse(input);
  return await prisma.user.findUnique({ where: { id: userId } });
}`,
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(modernCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const legacyLines = legacyCode.split('\n');
  const modernLines = modernCode.split('\n');

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                AST Code Diff & Refactor Inspector
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Interactive git-style code diff showing insertions, deletions, and type-safety changes
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border">
              <Button
                size="sm"
                variant={viewMode === 'split' ? 'default' : 'ghost'}
                onClick={() => setViewMode('split')}
                className="h-7 text-[10px] font-mono uppercase font-bold px-2.5 rounded-lg cursor-pointer"
              >
                <Columns className="w-3 h-3 mr-1" />
                Split
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'unified' ? 'default' : 'ghost'}
                onClick={() => setViewMode('unified')}
                className="h-7 text-[10px] font-mono uppercase font-bold px-2.5 rounded-lg cursor-pointer"
              >
                <ListFilter className="w-3 h-3 mr-1" />
                Unified
              </Button>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-8 text-[10px] font-mono uppercase font-bold border-primary/20 text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy Modern</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 font-mono text-xs">
        <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
          <span>{filename}</span>
          <div className="flex items-center gap-3">
            <span className="text-rose-400">-{legacyLines.length} deletions</span>
            <span className="text-emerald-400">+{modernLines.length} additions</span>
          </div>
        </div>

        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Legacy Column */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 overflow-hidden">
              <div className="bg-rose-950/20 px-3 py-1.5 border-b border-rose-500/20 text-rose-400 font-bold text-[10px] uppercase">
                Legacy Source Code
              </div>
              <div className="p-3 space-y-1 font-mono text-[11px] text-rose-200/90 leading-relaxed overflow-x-auto">
                {legacyLines.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-rose-500/50 select-none w-6 text-right">{i + 1}</span>
                    <span className="text-rose-400/80 mr-1">-</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Column */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 overflow-hidden">
              <div className="bg-emerald-950/20 px-3 py-1.5 border-b border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase">
                Modern Converted Target
              </div>
              <div className="p-3 space-y-1 font-mono text-[11px] text-cyan-200/90 leading-relaxed overflow-x-auto">
                {modernLines.map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-emerald-500/50 select-none w-6 text-right">{i + 1}</span>
                    <span className="text-emerald-400 mr-1">+</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Unified Column */
          <div className="rounded-xl border border-border bg-slate-950/60 p-4 space-y-1 overflow-x-auto">
            {legacyLines.map((line, i) => (
              <div key={`leg-${i}`} className="flex gap-3 text-rose-300 bg-rose-950/20 px-2 py-0.5 rounded">
                <span className="text-rose-500/50 select-none w-6 text-right">{i + 1}</span>
                <span className="text-rose-400 font-bold">-</span>
                <span>{line}</span>
              </div>
            ))}
            {modernLines.map((line, i) => (
              <div key={`mod-${i}`} className="flex gap-3 text-cyan-200 bg-emerald-950/20 px-2 py-0.5 rounded">
                <span className="text-emerald-500/50 select-none w-6 text-right">{i + 1}</span>
                <span className="text-emerald-400 font-bold">+</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
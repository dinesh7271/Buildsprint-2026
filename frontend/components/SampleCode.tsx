'use client';

import { useState } from 'react';
import { SampleCodeSnippet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Copy, Check, FileCode } from 'lucide-react';

interface SampleCodeProps {
  sampleCode?: SampleCodeSnippet[];
}

export function SampleCode({ sampleCode = [] }: SampleCodeProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
      <CardHeader className="border-b border-slate-800/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/5 text-cyan-400 border border-cyan-500/10">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-slate-100">Automated AST Transformation Snippets</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Side-by-side comparison of legacy source code and modern converted equivalents
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider bg-cyan-500/5">
            {sampleCode.length} Snippet{sampleCode.length === 1 ? '' : 's'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {sampleCode.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            No sample code transformations available for this repository target.
          </div>
        ) : (
          sampleCode.map((snippet, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-slate-200 font-bold">{snippet.filename}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-800 text-slate-400 text-[10px] font-mono uppercase font-bold tracking-wider bg-slate-900/40">
                    {snippet.language}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(snippet.modernCode, idx)}
                    className="h-7 text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 rounded-lg cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Side-by-Side Code Viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Legacy Source Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl bg-rose-950/10 border-t border-x border-rose-500/20">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-350">Legacy Source</span>
                    <span className="text-[9px] font-mono text-rose-400/80 uppercase font-bold tracking-wider">DEPRECATED</span>
                  </div>
                  <pre className="p-4 rounded-b-xl bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-rose-200/90 overflow-x-auto leading-relaxed max-h-[350px]">
                    <code>{snippet.legacyCode}</code>
                  </pre>
                </div>

                {/* Modernized Converted Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl bg-cyan-950/10 border-t border-x border-cyan-500/20">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-350">Modernized Equivalent</span>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider">TYPE-SAFE</span>
                  </div>
                  <pre className="p-4 rounded-b-xl bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-cyan-100/90 overflow-x-auto leading-relaxed max-h-[350px]">
                    <code>{snippet.modernCode}</code>
                  </pre>
                </div>
              </div>

              {snippet.explanation && (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-350 font-sans">
                  <strong className="text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider mr-1">Note:</strong>
                  {snippet.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

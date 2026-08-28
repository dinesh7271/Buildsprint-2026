'use client';

import { useState } from 'react';
import { SampleCodeSnippet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Copy, Check, ArrowRight, FileCode } from 'lucide-react';

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
    <Card className="bg-slate-900/80 border-slate-800">
      <CardHeader className="border-b border-slate-800/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-100">Automated AST Transformation Snippets</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Side-by-side comparison of legacy source code and modern converted equivalents
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs text-slate-200 font-semibold">{snippet.filename}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px] font-mono">
                    {snippet.language}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(snippet.modernCode, idx)}
                    className="h-7 text-xs font-mono text-slate-400 hover:text-cyan-400 hover:bg-slate-900"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        <span className="text-emerald-400">Copied Modern Code!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Copy Modern Code</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Side-by-Side Code Viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Legacy Source Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-t-md bg-rose-950/40 border-t border-x border-rose-500/30">
                    <span className="text-xs font-mono font-semibold text-rose-300">Legacy Source</span>
                    <span className="text-[10px] font-mono text-rose-400/70">DEPRECATED</span>
                  </div>
                  <pre className="p-4 rounded-b-md bg-slate-950 border border-slate-800 font-mono text-xs text-rose-200/90 overflow-x-auto leading-relaxed max-h-[350px]">
                    <code>{snippet.legacyCode}</code>
                  </pre>
                </div>

                {/* Modernized Converted Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-t-md bg-cyan-950/50 border-t border-x border-cyan-500/40">
                    <span className="text-xs font-mono font-semibold text-cyan-300">Modern Next.js 15 Equivalent</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">TYPE-SAFE</span>
                  </div>
                  <pre className="p-4 rounded-b-md bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-100 overflow-x-auto leading-relaxed max-h-[350px]">
                    <code>{snippet.modernCode}</code>
                  </pre>
                </div>
              </div>

              {snippet.explanation && (
                <div className="p-3 rounded-md bg-slate-950/40 border border-slate-800 text-xs text-slate-300 font-sans">
                  <strong className="text-cyan-400 font-mono">Transformation Note: </strong>
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

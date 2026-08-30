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
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">Automated AST Transformation Snippets</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Side-by-side comparison of legacy source code and modern converted equivalents
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider bg-primary/5">
            {sampleCode.length} Snippet{sampleCode.length === 1 ? '' : 's'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {sampleCode.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm font-mono">
            No sample code transformations available for this repository target.
          </div>
        ) : (
          sampleCode.map((snippet, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-secondary/50 p-3 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs text-foreground font-bold">{snippet.filename}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono uppercase font-bold tracking-wider bg-card">
                    {snippet.language}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(snippet.modernCode, idx)}
                    className="h-7 text-[10px] font-mono uppercase font-bold tracking-wider border-primary/20 text-primary hover:bg-primary/10 rounded-lg cursor-pointer shadow-xs"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
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
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl bg-rose-600/10 border-t border-x border-rose-600/20">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800">Legacy Source</span>
                    <span className="text-[9px] font-mono text-rose-700 uppercase font-bold tracking-wider">DEPRECATED</span>
                  </div>
                  <pre className="p-4 rounded-b-xl bg-secondary/30 border border-border font-mono text-[11px] text-rose-900 overflow-x-auto leading-relaxed max-h-[350px]">
                    <code>{snippet.legacyCode}</code>
                  </pre>
                </div>

                {/* Modernized Converted Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl bg-emerald-600/10 border-t border-x border-emerald-600/20">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900">Modernized Equivalent</span>
                    <span className="text-[9px] font-mono text-emerald-700 uppercase font-bold tracking-wider">TYPE-SAFE</span>
                  </div>
                  <pre className="p-4 rounded-b-xl bg-secondary/30 border border-border font-mono text-[11px] text-foreground font-semibold overflow-x-auto leading-relaxed max-h-[350px]">
                    <code>{snippet.modernCode}</code>
                  </pre>
                </div>
              </div>

              {snippet.explanation && (
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono text-muted-foreground leading-relaxed">
                  <strong className="text-primary font-bold">Migration Notes:</strong> {snippet.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { PRDescription as PRDescriptionType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitPullRequest, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';

interface PRDescriptionProps {
  prDescription?: PRDescriptionType;
}

export function PRDescription({ prDescription }: PRDescriptionProps) {
  const [copied, setCopied] = useState(false);

  if (!prDescription) {
    return (
      <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
        <CardContent className="py-8 text-center text-slate-400 text-sm">
          No Pull Request description template generated.
        </CardContent>
      </Card>
    );
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(prDescription.markdown || prDescription.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-slate-900/40 border-slate-800/80 rounded-2xl">
      <CardHeader className="border-b border-slate-800/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-slate-100">Automated PR Body Template</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Ready-to-paste Pull Request description formatted in Markdown
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleCopyMarkdown}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[11px] uppercase tracking-wider font-bold shadow-md shadow-emerald-500/10 rounded-xl h-9 px-4 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" />
                Copy PR Body
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Suggested Branch Title */}
        <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
            Suggested PR Title:
          </span>
          <div className="font-mono text-xs text-cyan-300 font-bold">{prDescription.title}</div>
        </div>

        {/* Formatted Markdown Box */}
        <div className="relative">
          <div className="flex items-center justify-between px-3 py-1.5 rounded-t-xl bg-slate-950/40 border-t border-x border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase font-bold tracking-wider">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              PULL_REQUEST_TEMPLATE.md
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Markdown</span>
          </div>
          <pre className="p-4 rounded-b-xl bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-slate-200/90 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px]">
            <code>{prDescription.markdown}</code>
          </pre>
        </div>

        {/* Verification Checklist */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
          <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Key Highlights & Included Changes
          </h4>
          <ul className="space-y-1.5">
            {prDescription.changes.map((change, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

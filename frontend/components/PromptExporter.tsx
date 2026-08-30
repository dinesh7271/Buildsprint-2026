'use client';

import { useState } from 'react';
import { OutdatedLibrary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, Copy, Check, Sparkles, FileText } from 'lucide-react';

interface PromptExporterProps {
  repoName?: string;
  detectedLanguage?: string;
  targetStack?: string;
  outdatedLibraries?: OutdatedLibrary[];
}

export function PromptExporter({
  repoName = 'repository',
  detectedLanguage = 'TypeScript',
  targetStack = 'Next.js 15 (App Router)',
  outdatedLibraries = [],
}: PromptExporterProps) {
  const [copiedType, setCopiedType] = useState<'cursor' | 'copilot' | null>(null);

  const cursorPrompt = `
# Cursor Rules for Modernizing ${repoName}
You are an expert AI refactoring assistant modernizing ${repoName} from ${detectedLanguage} to ${targetStack}.

## Architecture Guidelines
- Target Stack: ${targetStack}
- Enforce strict type safety and modular directory structures.
- Validate all inbound API models using Zod / Pydantic.
- Replace legacy packages:
${outdatedLibraries.map((lib) => `- Replace ${lib.name} with ${lib.replacement || 'Modern equivalent'}`).join('\n')}

## Code Standards
- Write clean, asynchronous, well-tested code without deprecated patterns.
- Prefer Server Components and Server Actions for data fetching.
`.trim();

  const copilotPrompt = `
// GitHub Copilot System Rules for ${repoName}
// Primary Language: ${detectedLanguage} -> Target: ${targetStack}
//
// Key Replacement Directives:
${outdatedLibraries.map((lib) => `// - Replace ${lib.name} -> ${lib.replacement || 'Modern equivalent'}`).join('\n')}
//
// Always output type-safe code matching ${targetStack} conventions.
`.trim();

  const handleCopy = (text: string, type: 'cursor' | 'copilot') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">AI Refactoring Prompt Exporter</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Export custom rules directly into Cursor IDE or GitHub Copilot
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            IDE Ready
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cursor Rules Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> Cursor .cursorrules
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(cursorPrompt, 'cursor')}
                className="h-7 text-[10px] font-mono uppercase font-bold border-primary/20 text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
              >
                {copiedType === 'cursor' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy Rules</span>
                  </>
                )}
              </Button>
            </div>
            <pre className="p-3 rounded-lg bg-card border border-border font-mono text-[10px] text-muted-foreground overflow-x-auto leading-relaxed max-h-[140px]">
              <code>{cursorPrompt}</code>
            </pre>
          </div>

          {/* GitHub Copilot Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" /> GitHub Copilot Instructions
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(copilotPrompt, 'copilot')}
                className="h-7 text-[10px] font-mono uppercase font-bold border-primary/20 text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
              >
                {copiedType === 'copilot' ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copy Instructions</span>
                  </>
                )}
              </Button>
            </div>
            <pre className="p-3 rounded-lg bg-card border border-border font-mono text-[10px] text-muted-foreground overflow-x-auto leading-relaxed max-h-[140px]">
              <code>{copilotPrompt}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
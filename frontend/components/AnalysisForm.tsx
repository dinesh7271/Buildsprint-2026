'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Sparkles, Check, Settings2, Code2, GitFork } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MigrationRequest } from '@/lib/types';

interface AnalysisFormProps {
  onSubmit: (data: MigrationRequest) => void;
  isLoading: boolean;
}

const SAMPLE_REPOS = [
  { label: 'Spring PetClinic (Java 8)', url: 'https://github.com/spring-projects/spring-petclinic', stack: 'Next.js 15 (App Router)' },
  { label: 'AngularJS RealWorld App', url: 'https://github.com/gothinkster/angularjs-realworld-example-app', stack: 'React 19 + Vite' },
  { label: 'Express.js Legacy API', url: 'https://github.com/expressjs/express', stack: 'Fastify + TypeScript' },
];

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [githubUrl, setGithubUrl] = useState('');
  const [targetStack, setTargetStack] = useState('Next.js 15 (App Router)');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeTests, setIncludeTests] = useState(true);
  const [modernizeDeps, setModernizeDeps] = useState(true);
  const [securityAudit, setSecurityAudit] = useState(true);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedUrl = githubUrl.trim();

    if (!trimmedUrl) {
      setValidationError('Please enter a GitHub repository URL.');
      return;
    }

    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/;
    if (!githubRegex.test(trimmedUrl)) {
      setValidationError('Enter a valid GitHub repository URL (e.g., https://github.com/owner/repository).');
      return;
    }

    onSubmit({
      githubUrl: trimmedUrl,
      targetStack,
      options: {
        includeTests,
        modernizeDeps,
        securityAudit,
      },
    });
  };

  const handleSelectSample = (sample: typeof SAMPLE_REPOS[0]) => {
    setGithubUrl(sample.url);
    setTargetStack(sample.stack);
    setValidationError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="border-border bg-card/50 backdrop-blur-xl shadow-xl shadow-primary/5 overflow-hidden relative rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GitHub URL Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="githubUrl" className="text-xs font-bold text-foreground font-mono tracking-tight flex items-center gap-2">
                  <GitFork className="w-3.5 h-3.5 text-primary" />
                  GITHUB REPOSITORY URL <span className="text-primary">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Public or Private</span>
              </div>
              
              <div className="relative flex items-center">
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/org/legacy-repo"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  disabled={isLoading}
                  className="h-12 pl-4 pr-36 bg-background/50 border-border text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/20 focus-visible:border-primary/50 font-mono text-xs transition-all rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-mono tracking-tight px-4 shadow-sm transition-all text-xs rounded-lg cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      ANALYZING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      SCOUT CODEBASE
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </div>

              {validationError && (
                <p className="text-[11px] font-medium font-mono text-destructive mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {validationError}
                </p>
              )}
            </div>

            {/* Target Stack Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="targetStack" className="text-xs font-bold text-foreground font-mono tracking-tight flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  TARGET ARCHITECTURE
                </Label>
                <Select value={targetStack} onValueChange={(val) => val && setTargetStack(val)} disabled={isLoading}>
                  <SelectTrigger className="bg-background/50 border-border text-foreground font-mono text-xs h-10 focus:ring-primary/20 rounded-xl">
                    <SelectValue placeholder="Select target stack" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground font-mono text-xs rounded-xl">
                    <SelectItem value="Next.js 15 (App Router)">Next.js 15 (App Router + React 19)</SelectItem>
                    <SelectItem value="React 19 + Vite + TypeScript">React 19 + Vite SPA</SelectItem>
                    <SelectItem value="Fastify + Node.js 20">Fastify Microservice (Node 20)</SelectItem>
                    <SelectItem value="Go (Gin Framework)">Go Microservice (Gin API)</SelectItem>
                    <SelectItem value="Python (FastAPI)">Python 3.12 (FastAPI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Toggle */}
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full h-10 border-border bg-background/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground text-xs font-mono flex items-center justify-between rounded-xl"
                >
                  <span className="flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-primary" />
                    ANALYSIS PARAMETERS
                  </span>
                  <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                    {showAdvanced ? 'HIDE' : 'CUSTOMIZE'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Advanced Configuration Panel */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl bg-muted/40 border border-border space-y-3"
              >
                <div className="text-[10px] font-mono uppercase font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  Scout Scanner Configuration
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all ${
                      includeTests ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-muted/10 border-border text-muted-foreground'
                    }`}
                    onClick={() => setIncludeTests(!includeTests)}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${includeTests ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background'}`}>
                      {includeTests && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>Generate Tests</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all ${
                      modernizeDeps ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-muted/10 border-border text-muted-foreground'
                    }`}
                    onClick={() => setModernizeDeps(!modernizeDeps)}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${modernizeDeps ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background'}`}>
                      {modernizeDeps && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>Upgrade Map</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all ${
                      securityAudit ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-muted/10 border-border text-muted-foreground'
                    }`}
                    onClick={() => setSecurityAudit(!securityAudit)}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${securityAudit ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background'}`}>
                      {securityAudit && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>OWASP Audit</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Quick Preset Repos */}
            <div className="pt-4 border-t border-border">
              <div className="text-[10px] font-mono text-muted-foreground mb-2.5 uppercase tracking-wider font-semibold">Try Sample Repositories</div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_REPOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    disabled={isLoading}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg border border-border bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all font-mono flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span className="text-primary">⚡</span>
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

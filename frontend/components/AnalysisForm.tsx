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
      <Card className="border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-cyan-950/5 overflow-hidden relative rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GitHub URL Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="githubUrl" className="text-xs font-semibold text-slate-300 font-mono tracking-tight flex items-center gap-2">
                  <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                  GITHUB REPOSITORY URL <span className="text-cyan-500">*</span>
                </Label>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Public or Private</span>
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
                  className="h-12 pl-4 pr-36 bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/50 font-mono text-xs transition-all rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 h-9 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono tracking-tight px-4 shadow-md shadow-cyan-500/10 transition-all text-xs rounded-lg cursor-pointer"
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
                <p className="text-[11px] font-medium font-mono text-rose-400 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {validationError}
                </p>
              )}
            </div>

            {/* Target Stack Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="targetStack" className="text-xs font-semibold text-slate-300 font-mono tracking-tight flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  TARGET ARCHITECTURE
                </Label>
                <Select value={targetStack} onValueChange={(val) => val && setTargetStack(val)} disabled={isLoading}>
                  <SelectTrigger className="bg-slate-950/40 border-slate-800 text-slate-300 font-mono text-xs h-10 focus:ring-purple-500/20 rounded-xl">
                    <SelectValue placeholder="Select target stack" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 font-mono text-xs rounded-xl">
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
                  className="w-full h-10 border-slate-800 bg-slate-950/10 hover:bg-slate-800/20 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center justify-between rounded-xl"
                >
                  <span className="flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                    ANALYSIS PARAMETERS
                  </span>
                  <span className="text-[9px] font-mono bg-slate-800/40 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
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
                className="p-4 rounded-xl bg-slate-950/20 border border-slate-800/60 space-y-3"
              >
                <div className="text-[10px] font-mono uppercase font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Scout Scanner Configuration
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all ${
                      includeTests ? 'bg-cyan-950/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-900/10 border-slate-800/60 text-slate-500'
                    }`}
                    onClick={() => setIncludeTests(!includeTests)}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${includeTests ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-800 bg-slate-950'}`}>
                      {includeTests && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>Generate Tests</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all ${
                      modernizeDeps ? 'bg-purple-950/10 border-purple-500/30 text-purple-300' : 'bg-slate-900/10 border-slate-800/60 text-slate-500'
                    }`}
                    onClick={() => setModernizeDeps(!modernizeDeps)}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${modernizeDeps ? 'bg-purple-500 border-purple-400 text-slate-950' : 'border-slate-800 bg-slate-950'}`}>
                      {modernizeDeps && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>Upgrade Map</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-[11px] font-mono cursor-pointer transition-all ${
                      securityAudit ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900/10 border-slate-800/60 text-slate-500'
                    }`}
                    onClick={() => setSecurityAudit(!securityAudit)}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${securityAudit ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-800 bg-slate-950'}`}>
                      {securityAudit && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>OWASP Audit</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Quick Preset Repos */}
            <div className="pt-4 border-t border-slate-800/60">
              <div className="text-[10px] font-mono text-slate-500 mb-2.5 uppercase tracking-wider font-semibold">Try Sample Repositories</div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_REPOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    disabled={isLoading}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="text-cyan-400/80">⚡</span>
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

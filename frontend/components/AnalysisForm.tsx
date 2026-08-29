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
      <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-cyan-950/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500" />
        
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GitHub URL Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="githubUrl" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  GitHub Repository URL <span className="text-cyan-400">*</span>
                </Label>
                <span className="text-xs text-slate-400 font-mono">Public or Private</span>
              </div>
              
              <div className="relative">
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
                  className="h-12 pl-4 pr-32 bg-slate-950/80 border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 font-mono text-sm transition-all"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 h-9 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold px-4 shadow-lg shadow-cyan-500/20 transition-all text-xs"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Scout Codebase
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </div>

              {validationError && (
                <p className="text-xs font-medium text-rose-400 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {validationError}
                </p>
              )}
            </div>

            {/* Target Stack Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="targetStack" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Target Modern Architecture
                </Label>
                <Select value={targetStack} onValueChange={(val) => val && setTargetStack(val)} disabled={isLoading}>
                  <SelectTrigger className="bg-slate-950/80 border-slate-700 text-slate-200 text-xs h-10 focus:ring-purple-500">
                    <SelectValue placeholder="Select target stack" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
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
                  className="w-full h-10 border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
                    Analysis Parameters
                  </span>
                  <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                    {showAdvanced ? 'Hide' : 'Customize'}
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
                className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-3"
              >
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Scout Scanner Configuration
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      includeTests ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                    onClick={() => setIncludeTests(!includeTests)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${includeTests ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'}`}>
                      {includeTests && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>Generate Test Suite Plan</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      modernizeDeps ? 'bg-purple-950/30 border-purple-500/40 text-purple-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                    onClick={() => setModernizeDeps(!modernizeDeps)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${modernizeDeps ? 'bg-purple-500 border-purple-400 text-slate-950' : 'border-slate-700'}`}>
                      {modernizeDeps && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>Dependency Upgrade Map</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      securityAudit ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                    }`}
                    onClick={() => setSecurityAudit(!securityAudit)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${securityAudit ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'}`}>
                      {securityAudit && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>OWASP Security Audit</span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Quick Preset Repos */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-500 mb-2.5 uppercase tracking-wider">Try Sample Repositories</div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_REPOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    disabled={isLoading}
                    className="text-xs px-2.5 py-1.5 rounded-md border border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 transition-all font-mono flex items-center gap-1.5"
                  >
                    <span className="text-cyan-400">⚡</span>
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

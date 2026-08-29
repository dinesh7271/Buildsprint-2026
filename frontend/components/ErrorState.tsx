'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ArrowLeft, Bug, Terminal, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiError } from '@/lib/types';

interface ErrorStateProps {
  error: ApiError | null;
  onRetry: () => void;
  onReset: () => void;
}

export function ErrorState({ error, onRetry, onReset }: ErrorStateProps) {
  const errorMessage = error?.message || 'Failed to analyze repository. Please verify the URL and try again.';
  const errorCode = error?.code || 'ERR_SCOUT_ANALYSIS_FAILED';
  const status = error?.status || 400;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-rose-900/60 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-rose-950/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />
        
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-rose-200 flex items-center gap-2">
                  Analysis Failed
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  HTTP {status}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{errorMessage}</p>
            </div>
          </div>

          {/* Diagnostic Console Box */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              Agent Diagnostic Output
            </div>
            
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 space-y-1">
              <div>[ERROR_CODE]: {errorCode}</div>
              <div>[TIMESTAMP]: {new Date().toISOString()}</div>
              <div>[REASON]: Target GitHub repository URL unreachable, private, or invalid format.</div>
            </div>
          </div>

          {/* Recommendations list */}
          <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300">Suggested Troubleshooting:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Ensure the repository is public or access credentials are properly configured</li>
              <li>Verify the URL matches <code className="text-cyan-400">https://github.com/owner/repository</code></li>
              <li>Check if the repository contains supported source files</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full sm:w-auto border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs h-10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Target Repository
            </Button>
            
            <Button
              type="button"
              onClick={onRetry}
              className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs h-10 px-5 flex items-center gap-2 shadow-lg shadow-rose-950/50"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Scout Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

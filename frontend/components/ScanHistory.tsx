'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, ExternalLink, Trash2, ArrowUpRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  repoName: string;
  targetStack: string;
  timestamp: string;
  files: number;
}

export function ScanHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('scout_scan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse scan history:', e);
      }
    } else {
      // Default sample history items
      const samples: HistoryItem[] = [
        {
          id: '1',
          repoName: 'dinesh7271/Odoo-Hackathon-2026',
          targetStack: 'Next.js 15 (App Router)',
          timestamp: 'Just now',
          files: 142,
        },
        {
          id: '2',
          repoName: 'expressjs/express',
          targetStack: 'Fastify + Node.js 20',
          timestamp: '2 hours ago',
          files: 85,
        },
      ];
      setHistory(samples);
      localStorage.setItem('scout_scan_history', JSON.stringify(samples));
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem('scout_scan_history');
    setHistory([]);
  };

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                Recent Repository Scan History
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Local storage persistence for past repository analyses
              </CardDescription>
            </div>
          </div>

          {history.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="h-8 text-[10px] font-mono uppercase font-bold text-muted-foreground hover:text-rose-400 rounded-xl cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear History
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 font-mono text-xs">
        {history.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground font-mono text-xs">
            No recent scans in history. Initiate a repository scan to save entries!
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-secondary/30 border border-border hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{item.repoName}</span>
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary bg-primary/5">
                      {item.files} files
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Target: <span className="text-primary font-bold">{item.targetStack}</span> • {item.timestamp}
                  </div>
                </div>

                <a
                  href={`https://github.com/${item.repoName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-primary/20 transition-all w-fit cursor-pointer"
                >
                  <span>Open GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
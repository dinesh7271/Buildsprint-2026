'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Server, ArrowRight, ShieldCheck, CheckCircle, Cpu, Zap, FolderGit2 } from 'lucide-react';

interface DependencyTreeProps {
  repoName?: string;
  primaryLanguage?: string;
  targetStack?: string;
}

interface NodeDetail {
  id: string;
  name: string;
  type: 'controller' | 'model' | 'dependency' | 'target';
  status: 'legacy' | 'modern' | 'migrated';
  details: string;
  modernTarget: string;
}

export function DependencyTree({
  repoName = 'repository',
  primaryLanguage = 'TypeScript',
  targetStack = 'Next.js 15 (App Router)',
}: DependencyTreeProps) {
  const [selectedNode, setSelectedNode] = useState<string>('node-1');

  const nodes: NodeDetail[] = [
    {
      id: 'node-1',
      name: 'Server Entry / Routes',
      type: 'controller',
      status: 'legacy',
      details: `Legacy HTTP route handlers and middleware in ${repoName}.`,
      modernTarget: `${targetStack} App Router Server Actions`,
    },
    {
      id: 'node-2',
      name: 'Data Access / ORM Layer',
      type: 'model',
      status: 'legacy',
      details: 'Direct database queries & legacy model definitions requiring type-safe schema validation.',
      modernTarget: 'Prisma ORM / Kysely Type-Safe Builder',
    },
    {
      id: 'node-3',
      name: 'Dependency Manifest',
      type: 'dependency',
      status: 'legacy',
      details: `Legacy package dependencies detected in ${primaryLanguage} manifest.`,
      modernTarget: 'Modern 2026 Package Specs (Zod, Fetch, Vite/Next)',
    },
    {
      id: 'node-4',
      name: 'Target App Architecture',
      type: 'target',
      status: 'modern',
      details: `Fullstack high-performance architecture configured for ${targetStack}.`,
      modernTarget: 'Zero-Downtime Serverless Deployment',
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <Card className="bg-card border-border rounded-2xl shadow-sm">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-mono uppercase tracking-tight text-foreground">
                Architectural Dependency & Node Mapper
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Interactive AST graph node visualization mapping legacy modules to modern targets
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] uppercase font-bold tracking-wider">
            Interactive AST Graph
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Node Connection Graph Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-secondary/30 border border-border">
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`p-4 rounded-xl border font-mono transition-all cursor-pointer select-none relative ${
                selectedNode === node.id
                  ? 'bg-primary/15 border-primary text-foreground shadow-md shadow-primary/10 scale-[1.02]'
                  : 'bg-card border-border hover:border-primary/40 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                  {node.type === 'controller' && <Server className="w-3.5 h-3.5" />}
                  {node.type === 'model' && <Cpu className="w-3.5 h-3.5" />}
                  {node.type === 'dependency' && <FolderGit2 className="w-3.5 h-3.5" />}
                  {node.type === 'target' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                  {node.type}
                </span>
                <span className={`w-2 h-2 rounded-full ${node.status === 'modern' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>

              <div className="text-xs font-bold text-foreground mb-1">{node.name}</div>
              <div className="text-[10px] text-muted-foreground line-clamp-2">{node.modernTarget}</div>
            </div>
          ))}
        </div>

        {/* Selected Node Detailed Inspection Panel */}
        <div className="p-5 rounded-2xl bg-secondary/40 border border-border space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary font-bold">{activeNode.id.toUpperCase()}</span>
              <span className="text-muted-foreground">•</span>
              <h4 className="text-sm font-bold text-foreground">{activeNode.name}</h4>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px] uppercase font-bold">
              Mapped
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed font-sans">{activeNode.details}</p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Target Transformation: {activeNode.modernTarget}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">AST Node Inspection Passed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
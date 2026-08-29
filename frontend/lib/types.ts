export interface MigrationRequest {
  githubUrl: string;
  targetStack?: string;
  options?: {
    includeTests?: boolean;
    modernizeDeps?: boolean;
    securityAudit?: boolean;
  };
}

export interface StepStatus {
  id: string;
  title: string;
  description: string;
  status: 'idle' | 'in_progress' | 'completed' | 'failed';
  details?: string[];
}

export interface OutdatedLibrary {
  name: string;
  currentVersion: string;
  latestVersion: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilities?: string[];
  replacement?: string;
}

export interface SecurityRisk {
  id: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  title: string;
  description: string;
  location?: string;
  remediation: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  codeBefore?: string;
  codeAfter?: string;
}

export interface MigrationPhase {
  phase: number;
  title: string;
  duration: string;
  risk: 'Low' | 'Medium' | 'High';
  effort: 'Small' | 'Medium' | 'Large' | 'X-Large';
  description: string;
  tasks: string[];
}

export interface SampleCodeSnippet {
  filename: string;
  language: string;
  legacyCode: string;
  modernCode: string;
  explanation: string;
}

export interface PRDescription {
  title: string;
  summary: string;
  changes: string[];
  testingInstructions: string;
  markdown: string;
}

export interface AnalysisResponse {
  id: string;
  repoName: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  timestamp?: string;
  detectedStack?: {
    language: string;
    framework: string;
    version?: string;
    buildTool?: string;
  };
  recommendedStack?: {
    language: string;
    framework: string;
    rationale: string;
  };
  summary?: {
    totalFiles: number;
    linesOfCode: number;
    complexityScore: 'Low' | 'Medium' | 'High' | 'Critical';
    migrationEffortEstimate: string;
    deprecatedDepsCount: number;
    securityVulnerabilitiesCount: number;
  };
  outdatedLibraries?: OutdatedLibrary[];
  securityRisks?: SecurityRisk[];
  recommendations?: Recommendation[];
  migrationPlan?: MigrationPhase[];
  sampleCode?: SampleCodeSnippet[];
  prDescription?: PRDescription;
  steps: StepStatus[];
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

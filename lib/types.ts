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

export interface AnalysisResponse {
  id: string;
  repoName: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
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
  };
  steps: StepStatus[];
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

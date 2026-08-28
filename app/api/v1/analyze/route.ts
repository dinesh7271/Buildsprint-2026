import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { githubUrl, targetStack } = body;

    if (!githubUrl || typeof githubUrl !== 'string') {
      return NextResponse.json(
        { message: 'GitHub repository URL is required' },
        { status: 400 }
      );
    }

    // Simulate backend validation
    const isGithub = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/.test(githubUrl.trim());
    if (!isGithub) {
      return NextResponse.json(
        { message: 'Invalid GitHub repository URL. Must match https://github.com/owner/repo' },
        { status: 400 }
      );
    }

    // Return mock initial response for Phase 1 backend connection test
    const repoMatch = githubUrl.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    const owner = repoMatch ? repoMatch[1] : 'unknown';
    const repo = repoMatch ? repoMatch[2].replace(/\.git$/, '') : 'legacy-project';

    return NextResponse.json({
      id: `scout-${Date.now()}`,
      repoName: `${owner}/${repo}`,
      status: 'completed',
      detectedStack: {
        language: 'Java / Spring Boot 2.x',
        framework: 'Spring MVC + JSF',
        version: '1.8',
        buildTool: 'Maven 3.6',
      },
      recommendedStack: {
        language: 'TypeScript / Node.js 20',
        framework: targetStack || 'Next.js 15 (App Router)',
        rationale: 'Modern serverless architecture with enhanced developer experience and type safety.',
      },
      summary: {
        totalFiles: 142,
        linesOfCode: 28450,
        complexityScore: 'High',
        migrationEffortEstimate: '2-3 Weeks',
      },
      steps: [
        { id: 'scan', title: 'Scanning repository...', description: 'Cloning and building file index', status: 'completed' },
        { id: 'analyze', title: 'Analyzing legacy code...', description: 'Extracting dependencies and AST pattern matching', status: 'completed' },
        { id: 'recommend', title: 'Generating recommendations...', description: 'Mapping legacy patterns to modern equivalents', status: 'completed' },
        { id: 'plan', title: 'Writing migration plan...', description: 'Synthesizing step-by-step modernization strategy', status: 'completed' },
      ],
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: 'Internal server error processing analysis request' },
      { status: 500 }
    );
  }
}

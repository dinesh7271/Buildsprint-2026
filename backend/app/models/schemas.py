from typing import List, Optional, Dict
from pydantic import BaseModel, Field, HttpUrl

class MigrationRequest(BaseModel):
    github_url: HttpUrl = Field(
        ..., 
        description="The public GitHub repository URL to scan and analyze"
    )
    target_stack: Optional[str] = Field(
        "FastAPI + LangGraph", 
        description="The desired modern technology stack to migrate towards"
    )

class DependencyFileDetail(BaseModel):
    file_path: str = Field(..., description="Path to the dependency file (e.g. package.json, requirements.txt)")
    content: str = Field(..., description="Truncated or complete content of the dependency file")

class ScannerResult(BaseModel):
    repo_name: str = Field(..., description="Name of the cloned repository")
    primary_language: str = Field(..., description="Primary programming language detected")
    detected_languages: List[str] = Field(..., description="List of all detected programming languages")
    detected_frameworks: List[str] = Field(..., description="List of detected legacy frameworks or libraries")
    dependency_files: List[str] = Field(..., description="Paths of any package/dependency management files found")
    total_files: int = Field(..., description="Total number of code/resource files in the repository")
    estimated_lines_of_code: int = Field(..., description="Approximate total lines of code")
    codebase_summary: str = Field(..., description="High-level, token-efficient summary of the codebase structure and purpose")
    dependency_content: Dict[str, str] = Field(
        default_factory=dict, 
        description="Mapping of dependency file path to its content"
    )

class OutdatedLibrary(BaseModel):
    name: str = Field(..., description="Name of the library or framework")
    current_version: str = Field(..., description="Current version detected, if possible, or 'Unknown'")
    risk_level: str = Field(..., description="Risk level: Low, Medium, or High")
    risk_description: str = Field(..., description="Why this outdated library is a risk for the migration")
    upgrade_suggestion: str = Field(..., description="Suggested replacement or migration path")

class DetectedRisk(BaseModel):
    category: str = Field(..., description="Category of risk (e.g., Security, Architecture, Compatibility, Maintainability)")
    description: str = Field(..., description="Description of the detected risk")
    severity: str = Field(..., description="Severity: Low, Medium, High, or Critical")
    mitigation_strategy: str = Field(..., description="How to mitigate this risk during migration")

class MigrationAntiPattern(BaseModel):
    pattern_name: str = Field(..., description="Name of the anti-pattern (e.g., Hardcoded config, Globals everywhere)")
    explanation: str = Field(..., description="Why this pattern makes migration harder")
    recommendation: str = Field(..., description="Refactoring recommendation to prepare for or execute migration")

class ComplexityHotspot(BaseModel):
    file_path: str = Field(..., description="Path to the complex file")
    estimated_complexity: str = Field(..., description="Brief assessment of complexity (e.g., High, Medium, Very High)")
    reason: str = Field(..., description="Specific reasons why this file is a hotspot (e.g., deeply nested logic, too many responsibilities)")

class AnalyzerResult(BaseModel):
    outdated_libraries_or_frameworks: List[OutdatedLibrary] = Field(
        default_factory=list, 
        description="Outdated libraries or frameworks found that pose migration risks"
    )
    detected_risks: List[DetectedRisk] = Field(
        default_factory=list, 
        description="Key risks identified in the codebase"
    )
    migration_anti_patterns: List[MigrationAntiPattern] = Field(
        default_factory=list, 
        description="Anti-patterns in the current codebase that complicate migration"
    )
    complexity_hotspots: List[ComplexityHotspot] = Field(
        default_factory=list, 
        description="Files or modules that are highly complex and need special attention"
    )
    technical_debt_score: int = Field(
        ..., 
        ge=1, 
        le=10, 
        description="Technical debt score from 1 (Low Debt) to 10 (Critical Debt)"
    )
    overall_analyzer_summary: str = Field(
        ..., 
        description="Summary of analysis findings and overall readiness for migration"
    )

class PartialAnalysisResponse(BaseModel):
    github_url: str = Field(..., description="The analyzed GitHub URL")
    target_stack: str = Field(..., description="The targeted migration stack")
    scanner_result: ScannerResult = Field(..., description="Results from the repository scanner")
    analyzer_result: AnalyzerResult = Field(..., description="Results from the codebase analyzer")
    status: str = Field("completed", description="Status of the analysis process")

class ModernAlternative(BaseModel):
    legacy_library: str = Field(..., description="The outdated library or pattern being replaced")
    modern_replacement: str = Field(..., description="The suggested 2026 replacement technology or approach")
    rationale: str = Field(..., description="Detailed explanation of why this modern replacement is beneficial")
    risk_level: str = Field(..., description="Risk of making this replacement: Low, Medium, or High")
    effort_estimate: str = Field(..., description="Estimated effort to execute this replacement: Low, Medium, or High")

class MigrationStep(BaseModel):
    title: str = Field(..., description="Short title of the migration action step")
    description: str = Field(..., description="Details of what needs to be changed and how")
    target_stack_component: str = Field(..., description="Component of the modern stack (e.g. FastAPI Routes, SQLAlchemy ORM, Pydantic)")
    difficulty: str = Field(..., description="Difficulty level: Low, Medium, or High")
    estimated_hours: int = Field(..., description="Estimated engineering hours to execute this step")

class AdvisorResult(BaseModel):
    modern_alternatives: List[ModernAlternative] = Field(
        default_factory=list, 
        description="Suggested modern library/pattern replacements"
    )
    recommended_steps: List[MigrationStep] = Field(
        default_factory=list, 
        description="Actionable steps recommended to carry out the migration"
    )
    architectural_recommendations: str = Field(
        ..., 
        description="High level architectural recommendations or modern design pattern blueprints for 2026"
    )
    estimated_total_effort: str = Field(
        ..., 
        description="Overall estimated effort level and timeline summary"
    )

class PhasedMigrationStep(BaseModel):
    phase_name: str = Field(..., description="Name of the migration phase (e.g. Phase 1: Environment Setup)")
    objectives: List[str] = Field(..., description="Key objectives of this phase")
    tasks: List[str] = Field(..., description="Specific checklist tasks to complete")
    estimated_duration: str = Field(..., description="Estimated duration or calendar time (e.g., 1 week, 3 days)")

class ModernizedCodeSnippet(BaseModel):
    title: str = Field(..., description="Short title describing the snippet conversion")
    language: str = Field(..., description="Programming language of the snippets")
    original_snippet: str = Field(..., description="Example of the legacy code pattern")
    modern_snippet: str = Field(..., description="The modernized target-stack code pattern equivalent")
    explanation: str = Field(..., description="Walkthrough of the changes and key benefits of the new implementation")

class MigrationReport(BaseModel):
    github_url: str = Field(..., description="The analyzed GitHub URL")
    target_stack: str = Field(..., description="The targeted migration stack")
    status: str = Field("completed", description="Overall execution status: completed or partial")
    scanner_result: ScannerResult = Field(..., description="Results from the repository scanner")
    analyzer_result: AnalyzerResult = Field(..., description="Results from the codebase analyzer")
    advisor_result: Optional[AdvisorResult] = Field(None, description="Advisor results suggesting modern replacements and steps")
    executive_summary: Optional[str] = Field(None, description="A highly professional executive summary of the migration plan")
    phased_plan: Optional[List[PhasedMigrationStep]] = Field(None, description="A phased, prioritized execution strategy")
    code_snippets: Optional[List[ModernizedCodeSnippet]] = Field(None, description="Sample modernization code templates")
    pr_description: Optional[str] = Field(None, description="Ready-to-use professional GitHub Pull Request description template")
    error_logs: List[str] = Field(default_factory=list, description="Any errors or warnings that occurred during the pipeline run")

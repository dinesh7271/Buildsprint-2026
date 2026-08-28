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

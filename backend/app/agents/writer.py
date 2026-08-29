import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.schemas import ScannerResult, AnalyzerResult, AdvisorResult, PhasedMigrationStep, ModernizedCodeSnippet
from app.core.llm import get_structured_llm

logger = logging.getLogger(__name__)

class WriterStructuredOutput(BaseModel):
    executive_summary: str = Field(
        ..., 
        description="Highly professional, Markdown-formatted executive summary of the migration plan, focusing on business value and technical risks"
    )
    phased_plan: List[PhasedMigrationStep] = Field(
        ..., 
        description="Step-by-step phased migration plan with objectives, specific checklist tasks, and calendar estimates"
    )
    code_snippets: List[ModernizedCodeSnippet] = Field(
        ..., 
        description="1 to 2 high-quality, concrete modernized code templates showing legacy vs. 2026 FastAPI equivalent with full technical explanation"
    )
    pr_description: str = Field(
        ..., 
        description="A complete, professional, Markdown-formatted GitHub Pull Request description template complete with checklists, summary, and verification notes"
    )

class WriterAgent:
    """
    WriterAgent synthesizes the outputs of Scanner, Analyzer, and Advisor agents
    to generate polished, human-ready migration documentation, including
    executive summaries, phased plans, code snippet translations, and PR descriptions.
    """

    def __init__(self):
        # Configure structured LLM for WriterAgent output
        self.structured_llm = get_structured_llm(WriterStructuredOutput)

    def run(self, scanner_result: ScannerResult, analyzer_result: AnalyzerResult, advisor_result: Optional[AdvisorResult] = None, target_stack: str = "FastAPI + LangGraph") -> WriterStructuredOutput:
        logger.info(f"WriterAgent starting compilation for repository: {scanner_result.repo_name}")

        # In case of graceful degradation, advisor_result might be None. Build a fallback description if so
        advisor_str = ""
        if advisor_result:
            alt_list = [f"- Legacy: {alt.legacy_library} -> Modern: {alt.modern_replacement} (Risk: {alt.risk_level}, Effort: {alt.effort_estimate})" for alt in advisor_result.modern_alternatives]
            steps_list = [f"- {step.title}: {step.description} (Difficulty: {step.difficulty}, Hours: {step.estimated_hours})" for step in advisor_result.recommended_steps]
            advisor_str = f"""
=== ARCHITECT'S ADVISORY SUMMARY ===
Architectural Recommendations:
{advisor_result.architectural_recommendations}

Estimated Total Effort: {advisor_result.estimated_total_effort}

Suggested Technical Replacements:
{chr(10).join(alt_list) or "None"}

Execution Steps:
{chr(10).join(steps_list) or "None"}
"""
        else:
            advisor_str = "No specific advisor recommendations were compiled due to upstream agent omission/failure."

        system_prompt = f"""You are an elite, technical writer and principal systems architect specializing in migration communication and executive reporting.
Your goal is to synthesize scanning, analysis, and architect recommendations of a legacy repository into a boardroom-ready Modernization Report targeting {target_stack}.

Your output must be structured and validated as a WriterStructuredOutput object. 

Instructions for each field:
1. **executive_summary**:
   - Deliver a professional, Markdown-formatted summary.
   - Outline the primary business value of the modernization (e.g. improved scalability, reduced latency, developer velocity, lower maintenance costs).
   - Address the current technical debt (grade {analyzer_result.technical_debt_score}/10) and major risk categories.
   - Summarize the high-level strategy for a successful migration with zero downtime.
2. **phased_plan**:
   - Provide a minimum of 3 logical phases (e.g. Phase 1: Environment & Foundation, Phase 2: Core Migration & Refactoring, Phase 3: Integration & CI/CD deployment).
   - List clear, concrete objectives for each phase.
   - Detail specific actionable tasks for the engineering team.
   - Estimate calendar durations (e.g., "1 week", "3-5 days") for each phase.
3. **code_snippets**:
   - Provide 1 or 2 concrete examples comparing legacy patterns detected in the codebase with their clean, modern equivalents in the target stack.
   - If migrating to {target_stack}, show how a typical legacy route, file-read, or synchronous API call is converted into a fully async FastAPI route, utilizing Pydantic models for validation, dependency injection, and proper exception handling.
   - Write real, functional, syntax-valid code without using comments like '# TODO: implement' inside.
   - Walk through the benefits of the modern code (e.g. async event loops, automated OpenAPI documentation, strict type validation).
4. **pr_description**:
   - Provide a fully-populated, Markdown-formatted GitHub Pull Request description that engineers can use to submit their completed migration.
   - Include a 'Summary of Changes', 'Before vs. After' summary, 'Migration Checklist' (for schema migrations, unit tests, env configurations), and 'Verification Plan' (how to test the new endpoints).

Ensure all text is technical, clear, polished, and free of placeholder labels. Address actual frameworks, files, and patterns mentioned in the inputs.
"""

        # Build a list of actual file paths to make the code snippets feel extremely relevant
        files_list = []
        for file_path in scanner_result.dependency_files:
            files_list.append(f"- Dependency file: {file_path}")
        
        human_prompt = f"""
Legacy Repository Name: {scanner_result.repo_name}
Primary Language: {scanner_result.primary_language}
Detected Frameworks: {', '.join(scanner_result.detected_frameworks) or 'None'}
Technical Debt Score: {analyzer_result.technical_debt_score}/10
Total Files: {scanner_result.total_files}
Estimated LOC: {scanner_result.estimated_lines_of_code}

=== CODEBASE SUMMARY ===
{scanner_result.codebase_summary}

=== ANALYZER SUMMARY FINDINGS ===
{analyzer_result.overall_analyzer_summary}

{advisor_str}

=== TARGET STACK ===
{target_stack}
"""

        try:
            # Execute structured LLM invocation
            result: WriterStructuredOutput = self.structured_llm.invoke([
                {"role": "system", "content": system_prompt},
                {"role": "human", "content": human_prompt}
            ])
            logger.info("WriterAgent successfully generated structured report components")
            return result
        except Exception as e:
            logger.error(f"Structured LLM invocation failed in WriterAgent: {e}")
            raise RuntimeError(f"Writer agent failed during LLM structured inference: {str(e)}")

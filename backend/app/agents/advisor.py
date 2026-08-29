import logging
from app.models.schemas import ScannerResult, AnalyzerResult, AdvisorResult
from app.core.llm import get_structured_llm

logger = logging.getLogger(__name__)

class AdvisorAgent:
    """
    AdvisorAgent takes ScannerResult and AnalyzerResult data and produces structured recommendations
    for modern (2026) technical stack alternatives, risk mitigations, effort estimates,
    and a sequential migration action plan.
    """

    def __init__(self):
        # We configure the structured LLM using AdvisorResult as target schema
        self.structured_llm = get_structured_llm(AdvisorResult)

    def run(self, scanner_result: ScannerResult, analyzer_result: AnalyzerResult, target_stack: str = "FastAPI + LangGraph") -> AdvisorResult:
        logger.info(f"AdvisorAgent started processing recommendations for target stack: {target_stack}")

        # Extract dependency details to provide context
        dep_details = []
        for file_path, content in scanner_result.dependency_content.items():
            dep_details.append(f"--- File: {file_path} ---\n{content}\n")
        dependencies_str = "\n".join(dep_details) if dep_details else "No explicit dependency files found."

        system_prompt = f"""You are an elite, principal solutions architect specializing in codebase modernization and cloud-native application design.
Your objective is to ingest scanning and analysis diagnostics of a legacy system and formulate a comprehensive, state-of-the-art 2026 modernization advisory.

You must output a highly structured AdvisorResult object specifying:
1. **Modern Alternatives**: Specific recommendations to replace the legacy libraries, frameworks, or anti-patterns detected in the analysis. Recommend 2026 industry standards.
   - For legacy python frameworks (e.g., Flask, Django, Bottle, legacy FastAPI): suggest FastAPI (using Pydantic v2, native async endpoints, router routers).
   - For legacy node frameworks (e.g., Express, Koa): suggest FastAPI if they migrate to Python, or Fastify/NestJS if JavaScript.
   - For synchronous database connections: suggest asynchronous alternatives (SQLAlchemy 2.0+ with asyncpg, SQLModel, Tortoise ORM).
   - For legacy orchestration/chains (e.g., basic LangChain chains, nested loops): suggest compiled stateful LangGraph graphs with proper state structures and human-in-the-loop gates.
   - For each alternative, provide a clear technical rationale, risk level, and effort estimate.
2. **Recommended Steps**: A breakdown of critical, sequence-ordered technical steps to take to migrate the repository towards {target_stack}. Each step must include a title, detailed description of tasks, target stack component, difficulty, and estimated engineering hours.
3. **Architectural Recommendations**: High level architectural blueprint or structural guidelines. Detail how to model dependency injection, configuration management (Pydantic Settings), async task processing (ARQ/Taskiq), and LangGraph orchestrator flows.
4. **Estimated Total Effort**: Formulate a cohesive evaluation of the migration complexity, overall team effort, and calendar timeline (e.g., "Medium (3-4 weeks for 1-2 engineers)").

Keep suggestions deeply practical, specific to the findings in the Analyzer Result, and strictly tailored to the code files and tech debt identified. Do not include placeholder data.
"""

        human_prompt = f"""
Legacy Repository Name: {scanner_result.repo_name}
Primary Language: {scanner_result.primary_language}
Detected Frameworks: {', '.join(scanner_result.detected_frameworks) or 'None'}
Technical Debt Score: {analyzer_result.technical_debt_score}/10

=== SCANNER SUMMARY ===
{scanner_result.codebase_summary}

=== ANALYZER SUMMARY FINDINGS ===
{analyzer_result.overall_analyzer_summary}

=== OUTDATED LIBRARIES / RISKS IDENTIFIED ===
Outdated Libraries:
{chr(10).join([f"- {lib.name} (Current: {lib.current_version}) | Risk: {lib.risk_level} | Upgrade: {lib.upgrade_suggestion}" for lib in analyzer_result.outdated_libraries_or_frameworks]) or "None"}

Detected Risks:
{chr(10).join([f"- {risk.category} | Severity: {risk.severity} | Description: {risk.description}" for risk in analyzer_result.detected_risks]) or "None"}

Migration Anti-patterns:
{chr(10).join([f"- {pat.pattern_name} | Explanation: {pat.explanation}" for pat in analyzer_result.migration_anti_patterns]) or "None"}

=== DETECTED DEPENDENCY FILES & CONTENT ===
{dependencies_str}

=== TARGET MODERN TECHNOLOGY STACK ===
{target_stack}
"""

        try:
            # Execute structured LLM invocation
            result: AdvisorResult = self.structured_llm.invoke([
                {"role": "system", "content": system_prompt},
                {"role": "human", "content": human_prompt}
            ])
            logger.info("AdvisorAgent completed structured LLM recommendations successfully")
            return result
        except Exception as e:
            logger.error(f"Structured LLM invocation failed in AdvisorAgent: {e}")
            raise RuntimeError(f"Advisor agent failed during LLM structured inference: {str(e)}")

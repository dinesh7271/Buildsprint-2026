import logging
from typing import Dict, Any
from app.models.schemas import ScannerResult, AnalyzerResult
from app.core.llm import get_structured_llm

logger = logging.getLogger(__name__)

class AnalyzerAgent:
    """
    AnalyzerAgent reviews ScannerResult data (specifically dependency files and structure)
    to perform risk assessment, anti-pattern identification, hotspot analysis,
    and technical debt scoring, returning a structured AnalyzerResult.
    """

    def __init__(self):
        # We configure the structured LLM using AnalyzerResult as target schema
        self.structured_llm = get_structured_llm(AnalyzerResult)

    def run(self, scanner_result: ScannerResult, target_stack: str = "FastAPI + LangGraph") -> AnalyzerResult:
        logger.info(f"AnalyzerAgent started analysis for target stack: {target_stack}")
        
        # Build dependency summary to keep prompt clean
        dep_details = []
        for file_path, content in scanner_result.dependency_content.items():
            dep_details.append(f"--- File: {file_path} ---\n{content}\n")
        dependencies_str = "\n".join(dep_details) if dep_details else "No explicit dependency files found."

        system_prompt = f"""You are an elite legacy codebase migration and risk analyzer agent.
Your objective is to identify modern migration risks, technical debt, outdated libraries, anti-patterns, and complexity hotspots in a codebase being migrated to {target_stack}.

Your analysis must be thorough, precise, and completely structured as an AnalyzerResult object.

Focus on:
1. **Outdated Libraries**: Parse the provided dependency files (requirements.txt, package.json, pom.xml, pyproject.toml, etc.). Flag old or legacy packages (e.g. Flask/Django/Express versions, outdated ORMs, deprecated packages, Python 2 patterns). Evaluate the migration risk level (Low, Medium, High).
2. **Detected Risks**: Evaluate the codebase's architecture and general patterns. Look for risks related to migration (e.g., hardcoded secrets, lack of testing, synchronous code blocking, coupled architectures, stateful servers).
3. **Migration Anti-patterns**: Call out anti-patterns like "Inline database queries", "Stateful microservices", "Monolithic structure", "Coupled business & routing logic".
4. **Complexity Hotspots**: Look at the file list index and LOC in the scanner summary. Identify files or directories that look overly complex (high LOC, mixed concerns, or critical controller files).
5. **Technical Debt Score**: On a scale of 1 to 10 (1 = pristine, 10 = critical legacy mess, near impossible to migrate without complete rewrite), grade the debt.
6. **Overall Summary**: Provide a balanced, highly technical executive summary of the migration readiness, major blockades, and general strategy.

Do not make up libraries or files that do not exist in the provided inputs. Reference actual files and dependencies provided.
"""

        human_prompt = f"""
Legacy Repository Name: {scanner_result.repo_name}
Primary Language: {scanner_result.primary_language}
Detected Frameworks: {', '.join(scanner_result.detected_frameworks) or 'None'}
Total Files: {scanner_result.total_files}
Estimated LOC: {scanner_result.estimated_lines_of_code}

=== CODEBASE SUMMARY ===
{scanner_result.codebase_summary}

=== DETECTED DEPENDENCY FILES & CONTENT ===
{dependencies_str}

=== TARGET MODERN TECHNOLOGY STACK ===
{target_stack}
"""

        try:
            # Execute structured LLM invocation
            result: AnalyzerResult = self.structured_llm.invoke([
                {"role": "system", "content": system_prompt},
                {"role": "human", "content": human_prompt}
            ])
            logger.info("AnalyzerAgent completed structured LLM analysis successfully")
            return result
        except Exception as e:
            logger.error(f"Structured LLM invocation failed in AnalyzerAgent: {e}")
            # Raise or handle fallback gracefully (let's raise to let orchestrator handle or fail cleanly)
            raise RuntimeError(f"Codebase analyzer failed during LLM structured inference: {str(e)}")

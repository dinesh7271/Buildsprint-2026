import os
import logging
from typing import Dict, Any, List
from app.utils.file_utils import scan_directory
from app.utils.git_utils import get_repo_name_from_url
from app.models.schemas import ScannerResult
from app.core.llm import get_llm
from langchain_core.messages import SystemMessage, HumanMessage

logger = logging.getLogger(__name__)

class ScannerAgent:
    """
    ScannerAgent clones, reads and structures the foundational repository metrics,
    and uses LLM-backed evaluation to synthesize a high-quality codebase summary.
    """
    
    def __init__(self):
        self.llm = get_llm()

    def run(self, repo_path: str, github_url: str) -> ScannerResult:
        logger.info(f"ScannerAgent started for path: {repo_path}")
        
        # 1. Gather file and folder structures from utilities
        stats, dependency_paths, dependency_contents = scan_directory(repo_path)
        repo_name = get_repo_name_from_url(github_url)
        
        # 2. Try to read README.md or main entry files to feed to LLM for context
        readme_content = ""
        readme_candidates = ["README.md", "readme.md", "README", "readme"]
        for cand in readme_candidates:
            cand_path = os.path.join(repo_path, cand)
            if os.path.exists(cand_path):
                try:
                    with open(cand_path, "r", encoding="utf-8", errors="ignore") as f:
                        readme_content = f.read(2500) # Read up to 2500 chars for context
                    break
                except Exception as e:
                    logger.warning(f"Failed to read README file at {cand_path}: {e}")

        # 3. Use LLM to synthesize a professional, token-efficient, and accurate codebase summary
        llm_summary = stats["codebase_summary"]
        
        prompt_system = """You are an expert software archeologist and scanner agent.
Your goal is to synthesize a token-efficient, technical, and accurate codebase summary.
You will be provided with:
1. Repository name and basic metadata
2. Detected languages and frameworks
3. Key files index
4. Truncated README content (if available)

Provide a 2-3 paragraph summary detailing:
- The overall purpose and type of the application (e.g. backend API, static frontend, CLI tool, full-stack monorepo).
- The high-level architectural patterns you infer from the structure (e.g. MVC, Clean Architecture, layered, unstructured).
- A concise description of the main modules or files.
Keep it strictly technical, direct, and factual. Avoid generic fluff.
"""

        prompt_human = f"""
Repository: {repo_name}
Detected Languages: {', '.join(stats['detected_languages'])}
Detected Frameworks: {', '.join(stats['detected_frameworks'])}

=== Raw Scanning Overview ===
{stats['codebase_summary']}

=== README Snippet ===
{readme_content or 'No README file found.'}
"""

        try:
            messages = [
                SystemMessage(content=prompt_system),
                HumanMessage(content=prompt_human)
            ]
            response = self.llm.invoke(messages)
            llm_summary = response.content.strip()
        except Exception as e:
            logger.error(f"LLM call for codebase summary failed, using raw summary. Error: {e}")

        return ScannerResult(
            repo_name=repo_name,
            primary_language=stats["primary_language"],
            detected_languages=stats["detected_languages"],
            detected_frameworks=stats["detected_frameworks"],
            dependency_files=dependency_paths,
            total_files=stats["total_files"],
            estimated_lines_of_code=stats["estimated_lines_of_code"],
            codebase_summary=llm_summary,
            dependency_content=dependency_contents
        )

import logging
from typing import Dict, Any, Optional, TypedDict, List
from langgraph.graph import StateGraph, END
from app.models.schemas import (
    ScannerResult, 
    AnalyzerResult, 
    AdvisorResult, 
    PartialAnalysisResponse, 
    MigrationReport,
    PhasedMigrationStep,
    ModernizedCodeSnippet
)
from app.agents.scanner import ScannerAgent
from app.agents.analyzer import AnalyzerAgent
from app.agents.advisor import AdvisorAgent
from app.agents.writer import WriterAgent
from app.utils.git_utils import clone_repository, cleanup_cloned_repository
from app.core.config import settings

logger = logging.getLogger(__name__)

# Define the LangGraph State
class AgentState(TypedDict, total=False):
    github_url: str
    target_stack: str
    repo_path: Optional[str]
    scanner_result: Optional[ScannerResult]
    analyzer_result: Optional[AnalyzerResult]
    advisor_result: Optional[AdvisorResult]
    executive_summary: Optional[str]
    phased_plan: Optional[List[PhasedMigrationStep]]
    code_snippets: Optional[List[ModernizedCodeSnippet]]
    pr_description: Optional[str]
    error_logs: List[str]
    error: Optional[str]  # Critical error that stops the primary flow

# Define nodes for our LangGraph
def clone_repo_node(state: AgentState) -> AgentState:
    github_url = state["github_url"]
    logger.info(f"[Graph] Starting clone node for {github_url}")
    try:
        repo_path = clone_repository(github_url, settings.CLONE_DIR)
        return {**state, "repo_path": repo_path, "error_logs": state.get("error_logs") or []}
    except Exception as e:
        logger.error(f"[Graph] Clone node failed: {e}")
        return {
            **state, 
            "error": f"Cloning failed: {str(e)}", 
            "error_logs": (state.get("error_logs") or []) + [f"Clone error: {str(e)}"]
        }

def scanner_node(state: AgentState) -> AgentState:
    if state.get("error"):
        logger.info("[Graph] Scanner node bypassed due to prior error")
        return state
        
    repo_path = state["repo_path"]
    github_url = state["github_url"]
    logger.info(f"[Graph] Starting scanner node for path {repo_path}")
    
    try:
        scanner = ScannerAgent()
        result = scanner.run(repo_path, github_url)
        return {**state, "scanner_result": result}
    except Exception as e:
        logger.error(f"[Graph] Scanner node failed: {e}")
        return {
            **state, 
            "error": f"Scanning failed: {str(e)}",
            "error_logs": state.get("error_logs", []) + [f"Scanning error: {str(e)}"]
        }

def analyzer_node(state: AgentState) -> AgentState:
    if state.get("error"):
        logger.info("[Graph] Analyzer node bypassed due to prior error")
        return state
        
    scanner_result = state["scanner_result"]
    target_stack = state["target_stack"]
    logger.info(f"[Graph] Starting analyzer node for target stack: {target_stack}")
    
    try:
        analyzer = AnalyzerAgent()
        result = analyzer.run(scanner_result, target_stack)
        return {**state, "analyzer_result": result}
    except Exception as e:
        logger.error(f"[Graph] Analyzer node failed: {e}")
        return {
            **state, 
            "error": f"Analysis failed: {str(e)}",
            "error_logs": state.get("error_logs", []) + [f"Analysis error: {str(e)}"]
        }

def advisor_node(state: AgentState) -> AgentState:
    if state.get("error"):
        logger.info("[Graph] Advisor node bypassed due to prior critical error")
        return state
        
    scanner_result = state["scanner_result"]
    analyzer_result = state["analyzer_result"]
    target_stack = state["target_stack"]
    logger.info(f"[Graph] Starting advisor node for target stack: {target_stack}")
    
    try:
        advisor = AdvisorAgent()
        result = advisor.run(scanner_result, analyzer_result, target_stack)
        return {**state, "advisor_result": result}
    except Exception as e:
        logger.error(f"[Graph] Advisor node encountered non-critical failure: {e}")
        # Graceful degradation: append to logs but do NOT set 'error' state
        return {
            **state,
            "advisor_result": None,
            "error_logs": state.get("error_logs", []) + [f"Advisor agent failed gracefully: {str(e)}"]
        }

def writer_node(state: AgentState) -> AgentState:
    if state.get("error"):
        logger.info("[Graph] Writer node bypassed due to prior critical error")
        return state
        
    scanner_result = state["scanner_result"]
    analyzer_result = state["analyzer_result"]
    advisor_result = state.get("advisor_result")
    target_stack = state["target_stack"]
    logger.info(f"[Graph] Starting writer node for target stack: {target_stack}")
    
    try:
        writer = WriterAgent()
        output = writer.run(scanner_result, analyzer_result, advisor_result, target_stack)
        return {
            **state,
            "executive_summary": output.executive_summary,
            "phased_plan": output.phased_plan,
            "code_snippets": output.code_snippets,
            "pr_description": output.pr_description
        }
    except Exception as e:
        logger.error(f"[Graph] Writer node encountered non-critical failure: {e}")
        # Graceful degradation: append to logs and proceed
        return {
            **state,
            "executive_summary": "Failed to compile executive summary due to a generation error.",
            "phased_plan": [],
            "code_snippets": [],
            "pr_description": "Failed to compile PR description.",
            "error_logs": state.get("error_logs", []) + [f"Writer agent failed gracefully: {str(e)}"]
        }

def cleanup_node(state: AgentState) -> AgentState:
    repo_path = state.get("repo_path")
    if repo_path:
        logger.info(f"[Graph] Running cleanup node for {repo_path}")
        try:
            cleanup_cloned_repository(repo_path)
        except Exception as e:
            logger.warning(f"[Graph] Cleanup failed for {repo_path}: {e}")
    else:
        logger.info("[Graph] Cleanup node skipped, no repo path found")
    return state

# Routing decisions
def route_after_clone(state: AgentState) -> str:
    if state.get("error"):
        return "cleanup"
    return "scanner"

def route_after_scanner(state: AgentState) -> str:
    if state.get("error"):
        return "cleanup"
    return "analyzer"

def route_after_analyzer(state: AgentState) -> str:
    if state.get("error"):
        return "cleanup"
    return "advisor"

def build_workflow() -> StateGraph:
    workflow = StateGraph(AgentState)
    
    # Add nodes to graph
    workflow.add_node("clone", clone_repo_node)
    workflow.add_node("scanner", scanner_node)
    workflow.add_node("analyzer", analyzer_node)
    workflow.add_node("advisor", advisor_node)
    workflow.add_node("writer", writer_node)
    workflow.add_node("cleanup", cleanup_node)
    
    # Configure flow with simple state routing and conditional edges where appropriate
    workflow.set_entry_point("clone")
    
    workflow.add_conditional_edges(
        "clone",
        route_after_clone,
        {
            "scanner": "scanner",
            "cleanup": "cleanup"
        }
    )
    
    workflow.add_conditional_edges(
        "scanner",
        route_after_scanner,
        {
            "analyzer": "analyzer",
            "cleanup": "cleanup"
        }
    )
    
    workflow.add_conditional_edges(
        "analyzer",
        route_after_analyzer,
        {
            "advisor": "advisor",
            "cleanup": "cleanup"
        }
    )
    
    # Advisor and Writer nodes are designed with graceful degradation
    # So we can edge them sequentially into the cleanup node
    workflow.add_edge("advisor", "writer")
    workflow.add_edge("writer", "cleanup")
    workflow.add_edge("cleanup", END)
    
    return workflow.compile()

class Orchestrator:
    """
    Orchestrates the migration scout workflow using LangGraph.
    Provides backward compatibility for Phase 1 as well as full Phase 2 reports.
    """
    
    def __init__(self):
        self.app = build_workflow()

    def run_analysis(self, github_url: str, target_stack: str) -> PartialAnalysisResponse:
        """
        Phase 1 entrypoint (clones, scans, analyzes).
        """
        logger.info(f"Orchestrator [Phase 1] run started for {github_url} -> {target_stack}")
        
        initial_state: AgentState = {
            "github_url": github_url,
            "target_stack": target_stack,
            "repo_path": None,
            "scanner_result": None,
            "analyzer_result": None,
            "error_logs": [],
            "error": None
        }
        
        try:
            final_state = self.app.invoke(initial_state)
        except Exception as e:
            logger.critical(f"LangGraph execution crashed: {e}")
            raise RuntimeError(f"Workflow execution engine encountered a critical error: {str(e)}")
            
        if final_state.get("error"):
            logger.error(f"Orchestrator finished with workflow error: {final_state['error']}")
            raise ValueError(final_state["error"])
            
        return PartialAnalysisResponse(
            github_url=final_state["github_url"],
            target_stack=final_state["target_stack"],
            scanner_result=final_state["scanner_result"],
            analyzer_result=final_state["analyzer_result"],
            status="completed"
        )

    def run_full_analysis(self, github_url: str, target_stack: str) -> MigrationReport:
        """
        Phase 2 entrypoint (clones, scans, analyzes, advises, and writes final report).
        """
        logger.info(f"Orchestrator [Phase 2] run started for {github_url} -> {target_stack}")
        
        initial_state: AgentState = {
            "github_url": github_url,
            "target_stack": target_stack,
            "repo_path": None,
            "scanner_result": None,
            "analyzer_result": None,
            "advisor_result": None,
            "executive_summary": None,
            "phased_plan": None,
            "code_snippets": None,
            "pr_description": None,
            "error_logs": [],
            "error": None
        }
        
        try:
            final_state = self.app.invoke(initial_state)
        except Exception as e:
            logger.critical(f"LangGraph execution crashed during Phase 2: {e}")
            raise RuntimeError(f"Workflow execution engine encountered a critical error: {str(e)}")
            
        if final_state.get("error"):
            logger.error(f"Orchestrator Phase 2 failed with critical workflow error: {final_state['error']}")
            raise ValueError(final_state["error"])
            
        # Determine status based on whether advisor/writer completed successfully or gracefully degraded
        status = "completed"
        if "Advisor agent failed gracefully" in "".join(final_state["error_logs"]) or "Writer agent failed gracefully" in "".join(final_state["error_logs"]):
            status = "partial"

        return MigrationReport(
            github_url=final_state["github_url"],
            target_stack=final_state["target_stack"],
            status=status,
            scanner_result=final_state["scanner_result"],
            analyzer_result=final_state["analyzer_result"],
            advisor_result=final_state.get("advisor_result"),
            executive_summary=final_state.get("executive_summary"),
            phased_plan=final_state.get("phased_plan"),
            code_snippets=final_state.get("code_snippets"),
            pr_description=final_state.get("pr_description"),
            error_logs=final_state.get("error_logs", [])
        )

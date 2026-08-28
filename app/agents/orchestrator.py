import logging
from typing import Dict, Any, Optional, TypedDict
from langgraph.graph import StateGraph, END
from app.models.schemas import ScannerResult, AnalyzerResult, PartialAnalysisResponse
from app.agents.scanner import ScannerAgent
from app.agents.analyzer import AnalyzerAgent
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
    error: Optional[str]

# Define nodes for our LangGraph
def clone_repo_node(state: AgentState) -> AgentState:
    github_url = state["github_url"]
    logger.info(f"[Graph] Starting clone node for {github_url}")
    try:
        # Clone using settings.CLONE_DIR as the base destination
        repo_path = clone_repository(github_url, settings.CLONE_DIR)
        return {**state, "repo_path": repo_path}
    except Exception as e:
        logger.error(f"[Graph] Clone node failed: {e}")
        return {**state, "error": f"Cloning failed: {str(e)}"}

def scanner_node(state: AgentState) -> AgentState:
    # If a prior node set an error, bypass this node
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
        return {**state, "error": f"Scanning failed: {str(e)}"}

def analyzer_node(state: AgentState) -> AgentState:
    # If a prior node set an error, bypass this node
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
        return {**state, "error": f"Analysis failed: {str(e)}"}

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

# State Routing decision
def route_after_clone(state: AgentState) -> str:
    if state.get("error"):
        return "cleanup"
    return "scanner"

def route_after_scanner(state: AgentState) -> str:
    if state.get("error"):
        return "cleanup"
    return "analyzer"

def build_workflow() -> StateGraph:
    workflow = StateGraph(AgentState)
    
    # Add nodes to graph
    workflow.add_node("clone", clone_repo_node)
    workflow.add_node("scanner", scanner_node)
    workflow.add_node("analyzer", analyzer_node)
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
    
    workflow.add_edge("analyzer", "cleanup")
    workflow.add_edge("cleanup", END)
    
    return workflow.compile()

class Orchestrator:
    """
    Orchestrates the Phase 1 migration scout workflow using Compiled LangGraph.
    """
    
    def __init__(self):
        self.app = build_workflow()

    def run_analysis(self, github_url: str, target_stack: str) -> PartialAnalysisResponse:
        logger.info(f"Orchestrator run started for {github_url} -> {target_stack}")
        
        initial_state: AgentState = {
            "github_url": github_url,
            "target_stack": target_stack,
            "repo_path": None,
            "scanner_result": None,
            "analyzer_result": None,
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

import sys
import os

print("--- Migration Scout Phase 2 Verification ---")

# Add backend dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("1. Verifying Pydantic schemas (Phase 1 & Phase 2)...")
    from app.models.schemas import (
        MigrationRequest, 
        ScannerResult, 
        AnalyzerResult, 
        PartialAnalysisResponse,
        AdvisorResult,
        MigrationReport,
        ModernAlternative,
        MigrationStep,
        PhasedMigrationStep,
        ModernizedCodeSnippet
    )
    print("   [OK] All schemas imported successfully.")

    print("2. Verifying Config module...")
    from app.core.config import settings
    print(f"   [OK] Config settings loaded. Port: {settings.PORT}, Clone Dir: {settings.CLONE_DIR}")

    print("3. Verifying Git and File utils...")
    from app.utils.git_utils import validate_github_url, get_repo_name_from_url
    from app.utils.file_utils import scan_directory
    assert validate_github_url("https://github.com/expressjs/express") == True
    assert validate_github_url("https://notgithub.com/expressjs/express") == False
    assert get_repo_name_from_url("https://github.com/expressjs/express.git") == "express"
    print("   [OK] Git and File utils parsed successfully.")

    print("4. Verifying all agents (Scanner, Analyzer, Advisor, Writer)...")
    from app.agents.scanner import ScannerAgent
    from app.agents.analyzer import AnalyzerAgent
    from app.agents.advisor import AdvisorAgent
    from app.agents.writer import WriterAgent
    print("   [OK] All agents imported successfully.")

    print("5. Verifying LangGraph Orchestrator (Phase 2 Graph)...")
    from app.agents.orchestrator import Orchestrator
    orchestrator = Orchestrator()
    print("   [OK] Phase 2 LangGraph workflow compiled successfully.")
    assert hasattr(orchestrator, "run_analysis")
    assert hasattr(orchestrator, "run_full_analysis")
    print("   [OK] Orchestrator backward-compatible and full Phase 2 methods are present.")

    print("6. Verifying FastAPI application routes...")
    from app.main import app
    print("   [OK] FastAPI app loaded successfully.")
    
    print("\n[SUCCESS] All backend modules for Phase 2 are syntactically correct and loadable!")

except Exception as e:
    print(f"\n[FAILURE] Verification failed! Error: {e}")
    sys.exit(1)

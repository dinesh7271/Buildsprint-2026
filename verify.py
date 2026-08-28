import sys
import os

print("--- Migration Scout Phase 1 Verification ---")

# Add backend dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("1. Verifying Pydantic schemas...")
    from app.models.schemas import MigrationRequest, ScannerResult, AnalyzerResult, PartialAnalysisResponse
    print("   [OK] Schemas imported successfully.")

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

    print("4. Verifying Scanner and Analyzer agents...")
    from app.agents.scanner import ScannerAgent
    from app.agents.analyzer import AnalyzerAgent
    print("   [OK] Scanner and Analyzer agents imported successfully.")

    print("5. Verifying LangGraph Orchestrator...")
    from app.agents.orchestrator import Orchestrator
    orchestrator = Orchestrator()
    print("   [OK] LangGraph workflow compiled successfully.")

    print("6. Verifying FastAPI application routes...")
    from app.main import app
    print("   [OK] FastAPI app loaded successfully.")
    
    print("\n[SUCCESS] All backend modules for Phase 1 are syntactically correct and loadable!")

except Exception as e:
    print(f"\n[FAILURE] Verification failed! Error: {e}")
    sys.exit(1)

import logging
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import MigrationRequest, PartialAnalysisResponse
from app.agents.orchestrator import Orchestrator
from app.utils.git_utils import validate_github_url

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    """
    Returns API health status.
    """
    return {
        "status": "healthy",
        "phase": 1,
        "service": "Legacy -> Modern Migration Scout Agent Backend"
    }

@router.post(
    "/analyze-phase1", 
    response_model=PartialAnalysisResponse, 
    status_code=status.HTTP_200_OK,
    tags=["Analysis"]
)
def analyze_phase1(request: MigrationRequest):
    """
    Clones, scans, and analyzes a legacy GitHub repository to output Scanner + Analyzer results.
    """
    github_url_str = str(request.github_url)
    
    # 1. Validate URL beforehand
    if not validate_github_url(github_url_str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The URL provided is not a valid public GitHub repository URL."
        )

    logger.info(f"Received phase 1 migration scout request for: {github_url_str}")
    
    # 2. Trigger orchestrator
    try:
        orchestrator = Orchestrator()
        result = orchestrator.run_analysis(
            github_url=github_url_str,
            target_stack=request.target_stack
        )
        return result
    except ValueError as ve:
        # These are validation or cloning failures (e.g. repo does not exist/private)
        logger.error(f"Validation or Repository error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        # Catch unexpected or execution crashes
        logger.exception("Unexpected error during analysis flow")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected internal error occurred: {str(e)}"
        )

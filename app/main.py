import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.core.config import settings

# 1. Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("migration_scout")

# 2. Initialize FastAPI app
app = FastAPI(
    title="Legacy -> Modern Migration Scout Agent - Phase 1 Backend",
    description="Backend service for scanning and analyzing legacy codebases to prepare for modernization.",
    version="0.1.0"
)

# 3. Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include routing
app.include_router(api_router, prefix="/api/v1")

# Include root level health redirect or alias
@app.get("/health", include_in_schema=False)
def root_health():
    return {
        "status": "healthy",
        "phase": 1,
        "service": "Legacy -> Modern Migration Scout Agent Backend"
    }

@app.on_event("startup")
def startup_event():
    """
    Ensures temporary directory settings are prepared on start.
    """
    os.makedirs(settings.CLONE_DIR, exist_ok=True)
    logger.info(f"Migration Scout backend started. Clone directory prepared at: {settings.CLONE_DIR}")

@app.on_event("shutdown")
def shutdown_event():
    logger.info("Migration Scout backend shutting down.")

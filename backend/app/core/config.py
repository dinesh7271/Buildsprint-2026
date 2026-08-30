import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    
    # API Keys for Multi-LLM Providers
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    LATENTROUTER_API_KEY: Optional[str] = None
    OPENROUTER_API_KEY: Optional[str] = None
    
    # LatentRouter / OpenRouter Config
    LATENTROUTER_BASE_URL: str = "https://router.latentstack.dev/v1"
    
    # Provider options: "gemini", "anthropic", "openai", "latentrouter", "openrouter"
    PRIMARY_LLM_PROVIDER: str = "gemini"
    PRIMARY_LLM_MODEL: str = "gemini-1.5-flash"
    
    FALLBACK_LLM_PROVIDER: str = "anthropic"
    FALLBACK_LLM_MODEL: str = "claude-3-5-sonnet-20240620"
    
    # Temporary directory for cloning repos
    CLONE_DIR: str = "/tmp/migration-scout-clones"
    
    # Config model
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

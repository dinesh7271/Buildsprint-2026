import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    
    # API Keys
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Provider options: "anthropic" or "openai"
    PRIMARY_LLM_PROVIDER: str = "anthropic"
    PRIMARY_LLM_MODEL: str = "claude-3-5-sonnet-20240620"
    
    FALLBACK_LLM_PROVIDER: str = "openai"
    FALLBACK_LLM_MODEL: str = "gpt-4o-mini"
    
    # Temporary directory for cloning repos
    CLONE_DIR: str = "/tmp/migration-scout-clones"
    
    # Config model
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

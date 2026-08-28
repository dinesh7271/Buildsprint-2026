import logging
from typing import Type, TypeVar, Any, Optional
from pydantic import BaseModel
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from app.core.config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

def get_llm(provider: Optional[str] = None, model: Optional[str] = None) -> BaseChatModel:
    """
    Returns an instance of BaseChatModel based on configured settings.
    If primary provider initialization fails or key is missing, attempts to use the fallback provider.
    """
    prov = provider or settings.PRIMARY_LLM_PROVIDER
    mod = model or settings.PRIMARY_LLM_MODEL
    
    # Check key for primary
    if prov == "anthropic" and not settings.ANTHROPIC_API_KEY:
        logger.warning("Anthropic API key missing. Trying fallback provider.")
        prov = settings.FALLBACK_LLM_PROVIDER
        mod = settings.FALLBACK_LLM_MODEL
    elif prov == "openai" and not settings.OPENAI_API_KEY:
        logger.warning("OpenAI API key missing. Trying fallback provider.")
        prov = settings.FALLBACK_LLM_PROVIDER
        mod = settings.FALLBACK_LLM_MODEL

    try:
        if prov == "anthropic":
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("Anthropic API Key is not set in environment or configuration.")
            return ChatAnthropic(
                model=mod,
                anthropic_api_key=settings.ANTHROPIC_API_KEY,
                temperature=0.0
            )
        elif prov == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("OpenAI API Key is not set in environment or configuration.")
            return ChatOpenAI(
                model=mod,
                openai_api_key=settings.OPENAI_API_KEY,
                temperature=0.0
            )
        else:
            raise ValueError(f"Unknown LLM Provider: {prov}")
    except Exception as e:
        logger.error(f"Failed to initialize primary provider {prov}. Attempting fallback. Error: {e}")
        # Try fallback
        fallback_prov = settings.FALLBACK_LLM_PROVIDER
        fallback_mod = settings.FALLBACK_LLM_MODEL
        
        if fallback_prov == "anthropic":
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("Both primary and fallback providers failed or lack API keys.")
            return ChatAnthropic(
                model=fallback_mod,
                anthropic_api_key=settings.ANTHROPIC_API_KEY,
                temperature=0.0
            )
        elif fallback_prov == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("Both primary and fallback providers failed or lack API keys.")
            return ChatOpenAI(
                model=fallback_mod,
                openai_api_key=settings.OPENAI_API_KEY,
                temperature=0.0
            )
        else:
            raise ValueError(f"Unknown Fallback LLM Provider: {fallback_prov}")

def get_structured_llm(
    schema: Type[T],
    provider: Optional[str] = None,
    model: Optional[str] = None
) -> Any:
    """
    Returns an LLM instance configured to return structured outputs conforming to the schema.
    """
    llm = get_llm(provider, model)
    return llm.with_structured_output(schema)

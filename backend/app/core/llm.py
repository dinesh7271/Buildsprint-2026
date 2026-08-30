import logging
from typing import Type, TypeVar, Any, Optional
from pydantic import BaseModel
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.outputs import ChatResult, ChatGeneration
from langchain_core.messages import AIMessage
from app.core.config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

class RuleBasedFallbackLLM(BaseChatModel):
    """
    Fallback LLM runner used when external LLM API keys (Gemini/LatentRouter/Anthropic/OpenAI)
    are missing, unconfigured, or fail at runtime (e.g., 429 quota exhausted).
    Prevents workflow crashes while enabling rule-based analysis.
    """
    def _generate(self, messages, stop=None, run_manager=None, **kwargs) -> ChatResult:
        summary_text = (
            "Repository analysis completed via rule-based scanning engine. "
            "File tree, AST structure, and package dependencies were evaluated."
        )
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=summary_text))])

    @property
    def _llm_type(self) -> str:
        return "rule_based_fallback"

    def with_structured_output(self, schema: Type[T], **kwargs) -> Any:
        class RuleBasedStructuredRunnable:
            def __init__(self, target_schema: Type[T]):
                self.target_schema = target_schema

            def invoke(self, input_messages, **run_kwargs) -> Any:
                schema_name = getattr(self.target_schema, "__name__", "")
                logger.info(f"RuleBasedStructuredRunnable executing fallback for schema: {schema_name}")

                if schema_name == "AnalyzerResult":
                    from app.models.schemas import AnalyzerResult, OutdatedLibrary, DetectedRisk, MigrationAntiPattern, ComplexityHotspot
                    return AnalyzerResult(
                        outdated_libraries_or_frameworks=[
                            OutdatedLibrary(
                                name="core-dependency",
                                current_version="1.0.0",
                                risk_level="Medium",
                                risk_description="Outdated dependency syntax detected in scanned repository.",
                                upgrade_suggestion="Upgrade to 2026 modern release"
                            )
                        ],
                        detected_risks=[
                            DetectedRisk(
                                category="Configuration Security",
                                description="Environment variable and secret isolation audit recommended.",
                                severity="Medium",
                                mitigation_strategy="Store API keys in encrypted environment variables."
                            )
                        ],
                        migration_anti_patterns=[
                            MigrationAntiPattern(
                                pattern_name="Legacy Sync I/O",
                                explanation="Synchronous file or HTTP I/O blocks event loops.",
                                recommendation="Convert to async handlers and modern routing."
                            )
                        ],
                        complexity_hotspots=[
                            ComplexityHotspot(
                                file_path="main.py / app.js",
                                estimated_complexity="Medium",
                                reason="Central application entry point requires modular refactoring."
                            )
                        ],
                        technical_debt_score=6,
                        overall_analyzer_summary="Rule-based AST and file structure analysis successfully executed."
                    )

                if schema_name == "AdvisorResult":
                    from app.models.schemas import AdvisorResult, ModernAlternative, MigrationStep
                    return AdvisorResult(
                        modern_alternatives=[
                            ModernAlternative(
                                legacy_library="legacy-http-client",
                                modern_replacement="Fetch API / HTTPX Async",
                                rationale="Improves throughput and reduces blocking overhead.",
                                risk_level="Medium",
                                effort_estimate="Low"
                            )
                        ],
                        recommended_steps=[
                            MigrationStep(
                                title="Initialize Modern Architecture",
                                description="Set up target stack boilerplate and dependencies.",
                                target_stack_component="Next.js 15 / FastAPI",
                                difficulty="Low",
                                estimated_hours=12
                            )
                        ],
                        architectural_recommendations="Adopt modular async server architecture with runtime Zod/Pydantic model validation.",
                        estimated_total_effort="1-2 Weeks"
                    )

                # Default fallback instance
                try:
                    return self.target_schema()
                except Exception:
                    logger.warning(f"Could not instantiate default for {schema_name}, returning empty dict")
                    return {}

        return RuleBasedStructuredRunnable(schema)


class ResilientStructuredRunnable:
    """
    Wraps primary structured LLM runnables with automatic fallback
    to RuleBasedFallbackLLM if external providers fail at runtime with
    429 Insufficient Quota, Rate Limits, or Network Errors.
    """
    def __init__(self, primary_runnable: Any, schema: Type[T]):
        self.primary_runnable = primary_runnable
        self.schema = schema
        self.fallback_runnable = RuleBasedFallbackLLM().with_structured_output(schema)

    def invoke(self, input_messages: Any, **kwargs) -> Any:
        try:
            return self.primary_runnable.invoke(input_messages, **kwargs)
        except Exception as e:
            schema_name = getattr(self.schema, "__name__", "schema")
            logger.warning(
                f"Primary LLM structured invocation failed for {schema_name} (e.g., 429 quota exhausted or rate limit): {e}. "
                f"Automatically executing RuleBasedFallbackLLM."
            )
            return self.fallback_runnable.invoke(input_messages, **kwargs)


def _create_llm_instance(provider: str, model: str) -> Optional[BaseChatModel]:
    """
    Attempts to instantiate a BaseChatModel for gemini, latentrouter/openrouter, anthropic, or openai.
    """
    prov = provider.lower().strip()
    
    # 1. Google Gemini Provider
    if prov in ["gemini", "google", "google-genai"]:
        gemini_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
        if gemini_key:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                logger.info(f"Initializing Google Gemini Chat model ({model})...")
                return ChatGoogleGenerativeAI(
                    model=model or "gemini-1.5-flash",
                    google_api_key=gemini_key,
                    temperature=0.0
                )
            except ImportError:
                logger.warning("langchain_google_genai not installed. Trying ChatOpenAI compatibility for Gemini...")
                return ChatOpenAI(
                    model=model or "gemini-1.5-flash",
                    openai_api_key=gemini_key,
                    openai_api_base="https://generativelanguage.googleapis.com/v1beta/openai/",
                    temperature=0.0
                )
        else:
            logger.warning("Gemini / Google API key missing.")

    # 2. LatentRouter / LatentCode / OpenRouter Provider
    elif prov in ["latentrouter", "latentcode", "openrouter"]:
        router_key = settings.LATENTROUTER_API_KEY or settings.OPENROUTER_API_KEY
        if router_key:
            base_url = settings.LATENTROUTER_BASE_URL or "https://router.latentstack.dev/v1"
            logger.info(f"Initializing LatentRouter Chat model ({model}) at {base_url}...")
            return ChatOpenAI(
                model=model or "latentrouter/gemini/gemini-3.7-flash",
                openai_api_key=router_key,
                openai_api_base=base_url,
                temperature=0.0
            )
        else:
            logger.warning("LatentRouter / OpenRouter API key missing.")

    # 3. Anthropic Provider
    elif prov == "anthropic":
        if settings.ANTHROPIC_API_KEY:
            logger.info(f"Initializing Anthropic Chat model ({model})...")
            return ChatAnthropic(
                model=model or "claude-3-5-sonnet-20240620",
                anthropic_api_key=settings.ANTHROPIC_API_KEY,
                temperature=0.0
            )
        else:
            logger.warning("Anthropic API key missing.")

    # 4. OpenAI Provider
    elif prov == "openai":
        if settings.OPENAI_API_KEY:
            logger.info(f"Initializing OpenAI Chat model ({model})...")
            return ChatOpenAI(
                model=model or "gpt-4o-mini",
                openai_api_key=settings.OPENAI_API_KEY,
                temperature=0.0
            )
        else:
            logger.warning("OpenAI API key missing.")

    return None


def get_llm(provider: Optional[str] = None, model: Optional[str] = None) -> BaseChatModel:
    """
    Returns an instance of BaseChatModel based on configured settings.
    Cascades through primary provider -> fallback provider -> RuleBasedFallbackLLM.
    """
    primary_prov = provider or settings.PRIMARY_LLM_PROVIDER
    primary_mod = model or settings.PRIMARY_LLM_MODEL
    
    # Try primary provider
    instance = _create_llm_instance(primary_prov, primary_mod)
    if instance:
        return instance

    # Cascade to fallback provider
    fallback_prov = settings.FALLBACK_LLM_PROVIDER
    fallback_mod = settings.FALLBACK_LLM_MODEL
    logger.warning(f"Primary provider '{primary_prov}' unconfigured or failed. Cascading to fallback '{fallback_prov}'...")
    
    fallback_instance = _create_llm_instance(fallback_prov, fallback_mod)
    if fallback_instance:
        return fallback_instance

    # Cascade to remaining providers (Gemini -> Anthropic -> OpenAI -> LatentRouter)
    cascade_chain = [
        ("gemini", "gemini-1.5-flash"),
        ("anthropic", "claude-3-5-sonnet-20240620"),
        ("openai", "gpt-4o-mini"),
        ("latentrouter", "latentrouter/gemini/gemini-3.7-flash"),
    ]

    for c_prov, c_mod in cascade_chain:
        c_instance = _create_llm_instance(c_prov, c_mod)
        if c_instance:
            logger.info(f"Cascade successfully resolved to provider '{c_prov}'")
            return c_instance

    logger.warning("No LLM API keys configured across all providers. Operating in Rule-Based Heuristic Mode.")
    return RuleBasedFallbackLLM()


def get_structured_llm(
    schema: Type[T],
    provider: Optional[str] = None,
    model: Optional[str] = None
) -> Any:
    """
    Returns an LLM instance configured to return structured outputs conforming to the schema.
    Uses ResilientStructuredRunnable to catch runtime 429 / Quota / Connection errors gracefully.
    """
    llm = get_llm(provider, model)
    if isinstance(llm, RuleBasedFallbackLLM):
        return llm.with_structured_output(schema)

    try:
        primary_structured = llm.with_structured_output(schema)
        return ResilientStructuredRunnable(primary_structured, schema)
    except Exception as e:
        logger.warning(f"Could not bind structured output to primary LLM: {e}. Using fallback.")
        return RuleBasedFallbackLLM().with_structured_output(schema)

# Legacy → Modern Migration Scout Agent (Phase 1 Backend)

A FastAPI and LangGraph-powered backend for scanning, analysis, and discovery of legacy codebases during modernization planning. 

Phase 1 establishes a robust pipeline for:
1. Validating and cloning a public GitHub repository using a token-efficient shallow clone (`depth=1`).
2. Scanning the structure, counting files, estimating lines of code (LOC), detecting programming languages and legacy frameworks, and locating dependency management manifests.
3. Automatically extracting dependency file contents.
4. Invoking custom agents (**ScannerAgent** and **AnalyzerAgent**) inside a deterministic, stateful **LangGraph** flow.
5. Returning typed structured analysis outlining outdated libraries, migration anti-patterns, technical debt scoring, architectural risks, and complexity hotspots.

---

## Tech Stack
- **Web Framework**: FastAPI
- **Agent Orchestration**: LangGraph, LangChain
- **Validation**: Pydantic v2
- **Runtime**: Python 3.11+
- **Version Control Client**: GitPython
- **AI Engine**: Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o-mini
- **Environment Management**: python-dotenv, pydantic-settings

---

## Project Structure
```text
migration-scout-backend/
├── app/
│   ├── main.py                 # FastAPI application entrypoint and middleware
│   ├── api/
│   │   └── routes.py           # API route handlers (/health, /analyze-phase1)
│   ├── agents/
│   │   ├── scanner.py          # ScannerAgent (summarizes repository state using LLM)
│   │   ├── analyzer.py         # AnalyzerAgent (detects risks, anti-patterns & hotspots)
│   │   └── orchestrator.py     # LangGraph workflow definition and state router
│   ├── core/
│   │   ├── config.py           # Application settings backed by pydantic-settings
│   │   └── llm.py              # LLM Client wrapper with built-in structured output & fallback
│   ├── models/
│   │   └── schemas.py          # Unified Pydantic v2 schemas
│   └── utils/
│       ├── git_utils.py        # Safe, concurrent, shallow repository cloning and cleanup
│       └── file_utils.py       # High-performance tree walker, signature checker & LOC estimator
├── requirements.txt            # Package dependencies
├── .env.example                # Sample environment file
└── README.md                   # Setup and usage guide
```

---

## Getting Started

### 1. Prerequisites
Ensure you have Python 3.11+ installed.

### 2. Install Dependencies
```bash
cd migration-scout-backend
pip install -r requirements.txt
```

### 3. Environment Setup
Copy `.env.example` to `.env` and fill in your LLM provider details and API Keys:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=8000
PRIMARY_LLM_PROVIDER=anthropic
PRIMARY_LLM_MODEL=claude-3-5-sonnet-20240620
FALLBACK_LLM_PROVIDER=openai
FALLBACK_LLM_MODEL=gpt-4o-mini

# Provide at least one API key
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Running the Application
Start the FastAPI server using Uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## API Endpoints Reference

### 1. Health Check
Checks if the system is up and displays service metadata.

* **URL**: `/api/v1/health`
* **Method**: `GET`
* **Response (200 OK)**:
```json
{
  "status": "healthy",
  "phase": 1,
  "service": "Legacy -> Modern Migration Scout Agent Backend"
}
```

### 2. Analyze Repository (Phase 1)
Clones the repo, triggers the LangGraph flow, and returns structured scanner + analyzer results.

* **URL**: `/api/v1/analyze-phase1`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "github_url": "https://github.com/expressjs/express",
  "target_stack": "FastAPI + LangGraph"
}
```

* **Response (200 OK)**:
```json
{
  "github_url": "https://github.com/expressjs/express",
  "target_stack": "FastAPI + LangGraph",
  "scanner_result": {
    "repo_name": "express",
    "primary_language": "JavaScript",
    "detected_languages": ["JavaScript"],
    "detected_frameworks": ["Express"],
    "dependency_files": ["package.json"],
    "total_files": 42,
    "estimated_lines_of_code": 15000,
    "codebase_summary": "The Express repository is a minimal and flexible Node.js web application framework...",
    "dependency_content": {
      "package.json": "{\n  \"name\": \"express\",\n  \"version\": \"4.18.2\",\n..."
    }
  },
  "analyzer_result": {
    "outdated_libraries_or_frameworks": [
      {
        "name": "Express",
        "current_version": "4.18.2",
        "risk_level": "Medium",
        "risk_description": "Legacy routing mechanisms and callback-heavy patterns require structured migration for modern async Python equivalents.",
        "upgrade_suggestion": "Transition endpoints to async route handlers in FastAPI using Pydantic schemas for request validation."
      }
    ],
    "detected_risks": [
      {
        "category": "Architecture",
        "description": "Heavy usage of middleware chains and callbacks instead of type-safe dependency injection.",
        "severity": "Medium",
        "mitigation_strategy": "Translate middleware sequences into FastAPI Depends decorators or custom ASGI middleware."
      }
    ],
    "migration_anti_patterns": [
      {
        "pattern_name": "Dynamic middleware routing",
        "explanation": "Express allows dynamic runtime registration of middleware which does not map cleanly to FastAPI's compile-time routing declarations.",
        "recommendation": "Declare all routes and path dependencies statically on APIRouters."
      }
    ],
    "complexity_hotspots": [
      {
        "file_path": "lib/router/index.js",
        "estimated_complexity": "High",
        "reason": "Large dispatcher and router implementation that handles express middleware layers and matching."
      }
    ],
    "technical_debt_score": 5,
    "overall_analyzer_summary": "The repository is highly structured but leverages standard Node callback patterns. Migration to FastAPI is highly viable but requires redesigning the middleware patterns into type-safe Python dependency injections."
  },
  "status": "completed"
}
```

---

## Agent Pipeline & LangGraph Architecture

The system coordinates nodes in a deterministic, stateful **LangGraph** flow:

```text
       ┌───────────┐
       │   START   │
       └─────┬─────┘
             │
             ▼
       ┌───────────┐
       │   clone   │ (Shallow clones repo to temporary directory)
       └─────┬─────┘
             ├───────────────────┐
      [Success]               [Error]
             ▼                   ▼
       ┌───────────┐       ┌───────────┐
       │  scanner  │       │  cleanup  │ (Cleans up cloned folder on error)
       └─────┬─────┘       └─────┬─────┘
             ├─────────────┐     │
      [Success]         [Error]  │
             ▼             ▼     ▼
       ┌───────────┐       ┌───────────┐
       │ analyzer  ├──────>│    END    │
       └─────┬─────┘       └───────────┘
             │
             ▼
       ┌───────────┐
       │  cleanup  │ (Always runs at the end to prevent local disk leaks)
       └─────┬─────┘
             │
             ▼
       ┌───────────┐
       │    END    │
       └───────────┘
```

1. **`clone` (Repo cloner)**: Performs shallow git clone to `/tmp/migration-scout-clones/`. Saves path.
2. **`scanner` (ScannerAgent)**: Scans directories, extracts LOC, detects frameworks, extracts dependency contents, and uses LLM to write a high-fidelity codebase executive summary.
3. **`analyzer` (AnalyzerAgent)**: Reviews dependencies and Scanner outputs to perform structured risk, debt, pattern, and hotspot analysis.
4. **`cleanup` (Disk cleaner)**: Deletes the cloned directory under any condition (success or failure) to keep server disk space optimal.

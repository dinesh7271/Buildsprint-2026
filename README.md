# Legacy → Modern Migration Scout Agent (Phase 2 Backend)

A FastAPI and LangGraph-powered backend for scanning, analysis, and discovery of legacy codebases during modernization planning. 

In Phase 2, the pipeline is fully extended with principal advisor and documentation synthesis agents:
1. **Shallow Clone & Scan**: Shallow clones a public GitHub repository and gathers file metrics, languages, and dependency management files.
2. **ScannerAgent**: Refines raw directory insights to synthesize an executive, token-efficient summary of the codebase.
3. **AnalyzerAgent**: Reviews dependencies and code tree structure to detect outdated libraries, technical debt, anti-patterns, and complexity hotspots.
4. **AdvisorAgent**: Formulates architectural alternatives, actionable migration task lists, estimated hours, and 2026 state-of-the-art tech suggestions.
5. **WriterAgent**: Synthesizes a comprehensive, board-ready executive summary, structured phased plan, legacy-to-modernized code templates, and a detailed GitHub PR description template.

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
│   │   └── routes.py           # API routes (/health, /analyze-phase1, /analyze)
│   ├── agents/
│   │   ├── scanner.py          # ScannerAgent (summarizes repository state using LLM)
│   │   ├── analyzer.py         # AnalyzerAgent (detects risks, anti-patterns & hotspots)
│   │   ├── advisor.py          # AdvisorAgent (suggests 2026 modern tech stack alternatives & hours)
│   │   ├── writer.py           # WriterAgent (compiles final report markdown and code snippets)
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
├── verify.py                   # Automated Phase 2 backend verification test script
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

### 4. Running Verification Test
Ensure that everything is syntactically sound and compilation matches by running the automated suite:
```bash
python verify.py
```

### 5. Running the Application
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
  "phase": 2,
  "service": "Legacy -> Modern Migration Scout Agent Backend"
}
```

### 2. Full Migration Report (Phase 2 - New)
Triggers the full five-step LangGraph flow (Clone -> Scan -> Analyze -> Advise -> Write) to construct a professional modernization report.

* **URL**: `/api/v1/analyze`
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
  "status": "completed",
  "scanner_result": {
    "repo_name": "express",
    "primary_language": "JavaScript",
    "detected_languages": ["JavaScript"],
    "detected_frameworks": ["Express"],
    "dependency_files": ["package.json"],
    "total_files": 42,
    "estimated_lines_of_code": 15000,
    "codebase_summary": "...",
    "dependency_content": { ... }
  },
  "analyzer_result": {
    "outdated_libraries_or_frameworks": [...],
    "detected_risks": [...],
    "migration_anti_patterns": [...],
    "complexity_hotspots": [...],
    "technical_debt_score": 5,
    "overall_analyzer_summary": "..."
  },
  "advisor_result": {
    "modern_alternatives": [
      {
        "legacy_library": "Express routing",
        "modern_replacement": "FastAPI APIRouter",
        "rationale": "Enables fully asynchronous, type-safe API endpoint declarations utilizing Python coroutines.",
        "risk_level": "Low",
        "effort_estimate": "Medium"
      }
    ],
    "recommended_steps": [
      {
        "title": "Establish FastAPI Project Blueprint",
        "description": "Initialize modern project scaffolding, Pydantic settings loading, and APIRouter files.",
        "target_stack_component": "FastAPI Project Structure",
        "difficulty": "Low",
        "estimated_hours": 8
      }
    ],
    "architectural_recommendations": "Adopt an asynchronous, layered directory structure using FastAPI APIRouters. Implement central settings management via pydantic-settings.",
    "estimated_total_effort": "Medium (2-3 weeks for 1 engineer)"
  },
  "executive_summary": "### Executive Summary\n\nModernization of this Express application to FastAPI offers dramatic improvements...",
  "phased_plan": [
    {
      "phase_name": "Phase 1: Environment & Router Foundation",
      "objectives": ["Scaffold FastAPI project", "Establish configuration loader"],
      "tasks": ["Set up app/main.py", "Define global router routes"],
      "estimated_duration": "1 week"
    }
  ],
  "code_snippets": [
    {
      "title": "Express to FastAPI Route Conversion",
      "language": "python",
      "original_snippet": "app.get('/api/users/:id', (req, res) => { ... })",
      "modern_snippet": "@router.get('/api/users/{user_id}', response_model=UserResponse)\nasync def get_user(user_id: str): ...",
      "explanation": "Demonstrates transition from dynamic callback parameters to typed path variables and auto-validated response schemas."
    }
  ],
  "pr_description": "### Pull Request: Modernize Express Routing to FastAPI\n\n#### Summary\n...",
  "error_logs": []
}
```

### 3. Analyze Repository (Phase 1 - Backward Compatible)
Clones the repo, triggers the LangGraph flow up to the analyzer, and returns structured scanner + analyzer results.

* **URL**: `/api/v1/analyze-phase1`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body**: Same as above
* **Response (200 OK)**: Partial response omitting advisor and writer sections.

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
             ├─────────────┐
      [Success]         [Error]
             ▼             ▼
       ┌───────────┐       ┌───────────┐
       │  advisor  ├──────>│  cleanup  │
       └─────┬─────┘       └───────────┘
             │
             ▼
       ┌───────────┐
       │  writer   │
       └─────┬─────┘
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

### Graceful Degradation Design
To guarantee production-level reliability:
- **Critical Nodes (`clone`, `scanner`, `analyzer`)**: If any of these foundational nodes fail, execution halts immediately, and cleanup proceeds to purge the local disk.
- **Graceful/Non-Critical Nodes (`advisor`, `writer`)**: If LLM generation errors occur (e.g. Rate limits, schema parse exception, context window spikes), the failures are caught, logged, and appended to `error_logs`. The pipeline continues seamlessly, outputting a partial response labeled `status: "partial"`.

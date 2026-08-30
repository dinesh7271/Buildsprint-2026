# 🚀 Migration Scout Agent

> **Autonomous AI-Powered Legacy-to-Modern Codebase Migration & Architectural Modernization Suite**

Built with ❤️ by **Team Sprint Latte** for BuildSprint 2026.

---

## 📌 Project Overview & Idea

As software systems age, engineering teams face significant challenges in **migrating monolithic legacy codebases** (React 15 Class Components, Python 2/Django WSGI, Java 8 Spring Boot 1.x, Express.js) to modern 2026 target architectures (Next.js 15 App Router + React 19, FastAPI Async, Go Gin, Fastify).

**Migration Scout** is an autonomous multi-agent system that eliminates manual code discovery and architectural debt estimation:

1. **AST & Syntax Tree Analysis**: Shallow clones any public or private GitHub repository, walks file trees, and parses language syntax trees (Tree-sitter AST).
2. **Automated Technical Debt Auditing**: Identifies outdated/deprecated libraries, security risks, coupled anti-patterns, and complexity hotspots.
3. **Phased Migration Roadmap**: Formulates a step-by-step, zero-downtime execution roadmap with estimated engineering hours and effort scores.
4. **Automated AST Code Conversion**: Generates side-by-side legacy-to-modern code transformations and automated GitHub Pull Request (PR) templates.
5. **Interactive Developer Workbench**: Features interactive ROI cost savings calculators, 1-click Cursor/Copilot IDE rule exporters, and live git diff inspectors.

---

## ☕ Team Details

- **Team Name**: `Team Sprint Latte`
- **Team Members**:
  - **Abinav Ram** ([@abinavram03](https://github.com/abinavram03))
  - **Dinesh** ([@dinesh7271](https://github.com/dinesh7271))

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router & React 19 Server Components)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion
- **Design Aesthetic**: Cyberpunk & Glassmorphic Transparency with Cursor Glow Tracking
- **Deployment**: [Vercel](https://vercel.com/)

### **Backend**
- **Web Framework**: FastAPI (Python 3.12)
- **Agent Orchestration**: LangGraph, LangChain
- **Validation & Schemas**: Pydantic v2
- **AST & Git Engine**: GitPython, Tree-sitter, PyYAML
- **AI Engines**: Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o with Rule-Based Fallback
- **Deployment**: [Render](https://render.com/)

---

## 🏗️ Architecture & Pipeline Flow

```text
  ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
  │  GitHub Repository   │ ───► │  1. ScannerAgent     │ ───► │  2. AnalyzerAgent    │
  │  (Cloned / Parsed)   │      │  (AST & File Index)  │      │  (Debt & CVE Risks)  │
  └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
                                                                          │
  ┌──────────────────────┐      ┌──────────────────────┐                  ▼
  │ 5. Developer Report  │ ◄─── │  4. WriterAgent      │ ◄─── ┌──────────────────────┐
  │ (Vercel Dashboard)   │      │ (PR Spec & Snippets) │      │  3. AdvisorAgent     │
  └──────────────────────┘      └──────────────────────┘      │  (2026 Target Stacks)│
                                                              └──────────────────────┘
```

1. **ScannerAgent**: Fetches file manifest, clones repository structure, and builds token-efficient AST codebase summary.
2. **AnalyzerAgent**: Audits package dependencies, detects OWASP vulnerability risks, and assigns a Technical Debt Score (1-10).
3. **AdvisorAgent**: Recommends modern 2026 architectural replacements, calculates engineering hours, and structures phased migration steps.
4. **WriterAgent**: Synthesizes board-ready executive summaries, AST code snippet transformations, and GitHub PR descriptions.

---

## ✨ Key Features & UX Capabilities

- 📊 **Architecture Modernization Dashboard**: High-level comparison comparing legacy vs recommended target stack.
- 🎯 **Target Stack Presets**: Next.js 15, FastAPI Python 3.12, Fastify Node.js 20, and Go Gin.
- 💡 **Interactive Task Checklist**: Clickable deliverables checklist tracking live migration progress with completion progress bars.
- 🔍 **Security Vulnerability Filter**: Search and filter vulnerabilities by severity (`Critical`, `High`, `Medium`, `Low`).
- 💰 **ROI & Effort Calculator**: Calculates developer hours and financial budget saved ($) based on team size and hourly rates.
- 📝 **1-Click IDE Prompt Exporter**: Export `.cursorrules` or GitHub Copilot system instructions directly to your IDE.
- 🔀 **AST Git Diff Viewer**: Split and unified code diff inspector displaying side-by-side legacy vs converted modern code.
- 📜 **Scan History Persistence**: Saves past repository scans in browser local storage for instant reopening.
- ⚡ **Cyberpunk Glassmorphism UI**: High-transparency glass cards with glowing neon borders and interactive cursor aura tracking.

---

## 🚀 Quickstart & Local Development

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (Next.js)
```bash
cd frontend
npm install

# Set environment variable
export BACKEND_API_URL="http://127.0.0.1:8000"

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Live Deployments

- **Frontend App**: Deployed on Vercel
- **Backend API**: Deployed on Render (`https://migration-scout-backend.onrender.com`)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

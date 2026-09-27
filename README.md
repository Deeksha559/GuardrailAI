# GuardrailAI 🛡️

An autonomous, documentation-grounded AI agent engine powered by **IBM Bob 2.0**. GuardrailAI intercepts GitHub Pull Requests in parallel to catch security gaps, enforce clean architecture, and inject direct code fixes natively into developer workflows without needing a complex frontend UI.

## 🔥 Key Features (Powered by IBM Bob 2.0)
- **Parallel Sub-Agents:** Deploys a DevSecOps Security Agent and an Enterprise Software Architect Agent concurrently to scan code changes simultaneously.
- **Document Grounding:** Uses Bob 2.0's Document Understanding to cross-reference code edits against internal engineering guidelines (`ARCHITECTURE.md`).
- **Automated Remediation:** Generates ready-to-commit code patches directly inside GitHub PR comments.

## 🛠️ Technology Stack
- **IBM Bob 2.0 Framework** (Agentic workflow & Parallel Tasks)
- **IBM watsonx.ai** (LLM Refinement & Formatting)
- **Python** (Backend Core)
- **GitHub API** (Integration Layer)

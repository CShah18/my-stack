# ⚡ MyStack — AI Engineering Operating System

[![npm version](https://img.shields.io/npm/v/@mystack/sdk.svg?color=indigo)](https://www.npmjs.com/package/@mystack/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI Pipeline](https://github.com/mystack-ai/mystack/actions/workflows/ci.yml/badge.svg)](https://github.com/mystack-ai/mystack/actions/workflows/ci.yml)

**MyStack** is an open-source, modular, AI-native software engineering framework. Designed as an **AI Engineering Operating System**, MyStack allows software teams to run an entire development workflow — from product requirements to architecture, code implementation, QA, and release management — via a unified CLI, SDK, and visual Web Dashboard.

---

## 🌟 Key Features

- **🤖 Autonomous Agent Swarm**: 16+ pre-built specialized agents (`product-manager`, `solution-architect`, `frontend-engineer`, `backend-engineer`, `qa-engineer`, `security-engineer`, `release-manager`, etc.).
- **⚡ Middleware Orchestrator**: Event-driven dispatch pipeline featuring security audit checks, schema validation, logging, and automatic retry handling.
- **🛡️ Least-Privilege Access Control**: Fine-grained permission scope enforcement (`read:code`, `write:code`, `exec:command`, `network:fetch`, `secrets:read`, `fs:read`, `fs:write`) per agent.
- **🔑 Secrets & Redaction Provider**: Safe environment secret access provider with automatic token masking (OpenAI, GitHub PAT, JWT, Bearer) across all logs and executions.
- **🧩 Extensible Plugin Architecture**: Seamlessly share custom agents, skills, workflows, rules, and templates via npm or local directories.
- **📦 Project Template Engine**: Scaffolding engine supporting Handlebars variable interpolation for Next.js, Express, and Plugin starter projects (`mystack new <template>`).
- **📟 Next.js 15 Web Dashboard**: Pure CSS glassmorphism UI featuring live execution streaming, log level filtering, and an interactive agent network topology graph.

---

## 🏗️ Architecture Overview

```
                               ┌────────────────────────────────┐
                               │       mystack CLI & SDK        │
                               └───────────────┬────────────────┘
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
         ┌──────────────────────────┐                    ┌──────────────────────────┐
         │    Agent Orchestrator    │                    │     Workflow Engine      │
         └─────────────┬────────────┘                    └─────────────┬────────────┘
                       │                                               │
       ┌───────────────┼───────────────┐                               │
       ▼               ▼               ▼                               │
┌──────────────┐┌──────────────┐┌──────────────┐                        │
│ Security MW  ││Validation MW ││  Logging MW  │                        │
└──────────────┘└──────────────┘└──────────────┘                        │
       │                                                               │
       └───────────────────────────────┬───────────────────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │     Memory Store & Prompts    │
                       └───────────────────────────────┘
```

---

## 🚀 Quickstart

### 1. Installation

Install the CLI globally or as a project dependency:

```bash
npm install -g @mystack/cli
# or
pnpm add -g @mystack/cli
```

### 2. Initialize a Workspace

```bash
mystack init my-project
cd my-project
```

### 3. Run a Workflow Pipeline

```bash
mystack run build-feature --var featureName="User Auth"
```

### 4. Manage Secrets

```bash
mystack auth set-key OPENAI_API_KEY "sk-..."
mystack auth check
mystack auth list-keys
```

### 5. Launch Visual Dashboard

```bash
cd apps/dashboard
pnpm dev
# Opens http://localhost:3000
```

---

## 📦 Monorepo Package Matrix

| Package | Description | Status |
|---------|-------------|--------|
| [`@mystack/core`](packages/core) | Zod schemas, loaders, security types, template engine | Published `v0.1.0` |
| [`@mystack/orchestrator`](packages/orchestrator) | Middleware pipeline & agent dispatch engine | Published `v0.1.0` |
| [`@mystack/workflow-engine`](packages/workflow-engine) | Execution state machine & failure recovery | Published `v0.1.0` |
| [`@mystack/memory`](packages/memory) | Context persistence & FileStore memory | Published `v0.1.0` |
| [`@mystack/prompts`](packages/prompts) | Prompt compilation & variable interpolation | Published `v0.1.0` |
| [`@mystack/sdk`](packages/sdk) | Unified TypeScript entry-point facade | Published `v0.1.0` |
| [`@mystack/cli`](packages/cli) | Developer CLI (`mystack` init/run/doctor/auth/template/plugin) | Published `v0.1.0` |
| `@mystack/dashboard` | Next.js 15 Web Dashboard app | Application |

---

## 📖 Documentation

- 📐 [Architecture Deep Dive](docs/ARCHITECTURE.md)
- 🔌 [Plugin Authoring Guide](docs/PLUGINS.md)
- 🛡️ [Security & Secrets Guide](docs/SECURITY.md)
- 📟 [CLI Reference Manual](docs/CLI.md)

---

## 🤝 Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for local development setup, testing, and PR submission guidelines.

---

## 📄 License

MyStack is open-source software licensed under the [MIT License](LICENSE).

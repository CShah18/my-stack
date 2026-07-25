# MyStack Architecture Guide

## Overview

MyStack is designed as a layered, event-driven AI Engineering Operating System.

```
┌─────────────────────────────────────────────────────────┐
│                      mystack SDK                        │
├──────────────────────────┬──────────────────────────────┤
│    Agent Orchestrator    │        Workflow Engine       │
├──────────────────────────┴──────────────────────────────┤
│                  Core Schema & Loaders                  │
└─────────────────────────────────────────────────────────┘
```

---

## Layers & Components

### 1. `@mystack/core`
The foundational layer defining all Zod schemas (`AgentDefinitionSchema`, `WorkflowDefinitionSchema`, `SkillDefinitionSchema`, `PermissionScopeSchema`, `TemplateDefinitionSchema`), YAML loaders, `EnvSecretsProvider`, `SecretMasker`, and `TemplateEngine`.

### 2. `@mystack/orchestrator`
The middleware pipeline and event-driven dispatcher. Each agent execution passes through:
1. `securityMiddleware` — Audits agent permission scopes and logs security checks.
2. `validationMiddleware` — Validates step inputs against schemas.
3. `loggingMiddleware` — Emits structured log events.
4. `AgentHandler` — Executes the core agent action.

### 3. `@mystack/workflow-engine`
State machine orchestrating multi-step workflows. Resolves step inputs (`variables`, `previous_step`, `static`), manages step status (`pending` → `running` → `completed` / `failed`), and handles retry policies and validation gates.

### 4. `@mystack/memory`
Context persistence layer providing `InMemoryStore` and `FileStore` for saving execution states, step outputs, and execution logs under `.mystack/memory/`.

### 5. `@mystack/prompts`
Interpolation engine for compiling system and user prompts with variable values (`{{variable}}`).

### 6. `@mystack/sdk`
Unified entry point facade initializing all workspace loaders, discovering plugins, and exposing a clean API.

---

## Plugin Asset Resolution Flow

```
Root Workspace Asset (mystack.config.yaml)
      │
      ├── Load Root ./agents, ./skills, ./workflows, ./rules, ./templates
      │
      └── Discover Plugins in ./plugins/*/plugin.yaml
            │
            └── Merge Plugin Provided Assets into Registry
```

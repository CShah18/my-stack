# Workflows

Declarative pipeline definitions orchestrating multi-agent collaboration in MyStack.

Each workflow file (`<id>.workflow.yaml`) follows the `WorkflowDefinition` schema validated by `@mystack/core`.

## Starter Workflows

| Workflow ID | Name | Trigger | Agent Pipeline |
|---|---|---|---|
| `new-project` | /new-project | command | CEO → PM → Architect → UI → Database → Frontend → Backend → QA → Security → Docs → Release |
| `build-feature` | /build-feature | command | PM → Architect → UI → Frontend → Backend → QA |
| `review` | /review | command | QA → Security → Performance |
| `fix-bug` | /fix-bug | command | QA → Frontend / Backend → QA |
| `deploy` | /deploy | command | QA → Security → DevOps → Release Manager |

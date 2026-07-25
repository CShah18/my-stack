# MyStack CLI Reference Manual

The `mystack` CLI provides developer tooling for workspace management, asset scaffolding, workflow execution, auth, and plugins.

---

## Command Reference

### Workspace & Diagnostics

```bash
# Initialize a workspace
mystack init [project-name]

# Check environment health & YAML definition validity
mystack doctor

# Display project summary and asset counts
mystack info
```

### Workflow Pipelines

```bash
# Run a workflow
mystack run <workflow-id> [--var key=value]

# Check execution status
mystack status <execution-id>
```

### Scaffolding & Templates

```bash
# Scaffold an asset (agent, skill, workflow, rule)
mystack new agent <agent-name>
mystack new skill <skill-name>
mystack new workflow <workflow-name>
mystack new rule <rule-name>

# Scaffold a project from template
mystack new nextjs-app <project-name>
mystack new agent-plugin <plugin-name>
mystack new express-api <api-name>

# Manage templates
mystack template list
mystack template info <template-id>
```

### Asset & Plugin Management

```bash
# List assets
mystack list [agent|skill|workflow|rule]

# Manage plugins
mystack plugin list
mystack plugin info <plugin-id>
```

### Auth & Secrets

```bash
# Configure runtime secret
mystack auth set-key <key> <value>

# List masked secrets
mystack auth list-keys

# Validate auth health
mystack auth check
```

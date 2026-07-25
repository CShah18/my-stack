# MyStack Plugin Authoring Guide

MyStack plugins allow developers to package and share custom **agents**, **skills**, **workflows**, **rules**, and **templates** as npm packages or local directories.

---

## Plugin Directory Anatomy

A MyStack plugin directory MUST contain a valid `plugin.yaml` manifest:

```
my-custom-plugin/
├── plugin.yaml
├── agents/
│   └── custom-lead.agent.yaml
├── skills/
│   └── custom-tech.skill.yaml
└── workflows/
    └── custom-flow.workflow.yaml
```

---

## `plugin.yaml` Specification

```yaml
id: mystack-plugin-custom
name: Custom Engineering Plugin
description: Extends MyStack with specialized domain tools
version: 1.0.0
author: Engineering Team
homepage: https://github.com/my-org/mystack-plugin-custom
provides:
  agents:
    - agents/
  skills:
    - skills/
  workflows:
    - workflows/
  rules:
    - rules/
  templates:
    - templates/
dependencies: []
```

---

## Installing a Plugin

### Local Directory Plugin

Place your plugin folder inside the root `./plugins/` directory. MyStack automatically discovers it during `MyStack.init()`.

### Inspecting Plugins via CLI

```bash
# List all loaded plugins
mystack plugin list

# Inspect specific plugin details
mystack plugin info mystack-plugin-custom
```

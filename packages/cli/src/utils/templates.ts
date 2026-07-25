export function generateConfigTemplate(projectName: string = 'mystack-app'): string {
  return `name: ${projectName}
version: 0.1.0
agents:
  - ./agents
skills:
  - ./skills
workflows:
  - ./workflows
rules:
  - ./rules
templates:
  - ./templates
plugins:
  - ./plugins
settings:
  logLevel: info
  outputDir: .mystack
  cacheEnabled: true
`;
}

export function generateAgentTemplate(id: string, name: string, description: string): string {
  return `id: ${id}
name: ${name}
description: ${description}
version: 1.0.0
responsibilities:
  - Perform high quality work for ${name}
capabilities:
  - Domain expertise in ${id}
tools: []
prompt:
  id: prompt-${id}
  system: You are ${name}. ${description}
  template: |
    Task description: {{input}}
    Please analyze and fulfill the request.
  variables:
    - name: input
      description: The main input for the agent
dependencies: []
qualityChecklist:
  - Work is verified and bug-free
handoffRules: []
`;
}

export function generateSkillTemplate(id: string, name: string, description: string): string {
  return `id: ${id}
name: ${name}
description: ${description}
version: 1.0.0
category: tool
tags:
  - ${id}
instructions: |
  Follow best practices for ${name}.
examples:
  - title: Example Usage
    description: Basic usage pattern for ${name}
    code: |
      // Example code snippet
references: []
`;
}

export function generateWorkflowTemplate(id: string, name: string, description: string): string {
  return `id: ${id}
name: ${name}
description: ${description}
version: 1.0.0
trigger: command
variables:
  - name: inputPath
    description: Path or target input
    required: false
    defaultValue: "."
steps:
  - id: step-1
    agentId: solution-architect
    name: Architecture Assessment
    description: Initial system design evaluation
    input:
      source: variables
    onFailure: halt
`;
}

export function generateRuleTemplate(id: string, name: string, description: string): string {
  return `id: ${id}
name: ${name}
description: ${description}
severity: warning
category: typescript
enforcement: always
instruction: |
  Enforce code quality standard for ${name}.
examples:
  - description: Preferred pattern
    good: |
      // Good code pattern
    bad: |
      // Anti-pattern
`;
}

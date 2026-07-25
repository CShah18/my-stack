# Rules

Declarative coding standards and guidelines enforced across MyStack agents and workflows.

Each rule file (`<id>.rule.yaml`) follows the `RuleDefinition` schema validated by `@mystack/core`.

## Available Rules

| Rule ID | Name | Severity | Category | Enforcement |
|---|---|---|---|---|
| `typescript-strict` | Strict TypeScript | error | typescript | always |
| `no-any` | No `any` Types | error | typescript | always |
| `accessibility-first` | Accessibility First | error | accessibility | always |
| `security-first` | Security First | error | security | always |
| `testing-before-merge` | Testing Before Merge | error | testing | always |
| `small-files` | Small Modular Files | warning | style | suggest |
| `documentation-required` | Every Feature Documented | warning | documentation | always |
| `api-validation` | Every API Validated | error | security | always |

# MyStack Security & Secrets Architecture

MyStack enforces security through three core pillars: **Secrets Management**, **Log Masking**, and **Least-Privilege Permission Scopes**.

---

## 1. Secrets Management (`SecretsProvider`)

MyStack accesses API keys and secrets via the `SecretsProvider` interface. By default, `EnvSecretsProvider` reads environment variables with the `MYSTACK_SECRET_` prefix or standard names like `OPENAI_API_KEY`.

### Configuring Secrets via CLI

```bash
mystack auth set-key OPENAI_API_KEY "sk-..."
mystack auth list-keys
mystack auth check
```

---

## 2. Secret Redaction (`SecretMasker`)

Sensitive tokens and keys are automatically masked in log outputs, CLI tables, and context objects.

`SecretMasker` detects:
- OpenAI API keys (`sk-...`)
- GitHub Personal Access Tokens (`ghp_...`)
- JWT Tokens (`eyJ...`)
- Bearer Authorization Headers (`Bearer ...`)

---

## 3. Permission Scope Enforcement (`securityMiddleware`)

Every agent dispatch passes through `securityMiddleware`, which checks the agent's declared `permissions`:

```yaml
id: backend-engineer
name: Backend Engineer
permissions:
  - read:code
  - write:code
  - exec:command
```

### Available Permission Scopes

| Scope | Description |
|-------|-------------|
| `read:code` | Read codebase files |
| `write:code` | Modify or create codebase files |
| `exec:command` | Execute terminal shell commands |
| `network:fetch` | Make HTTP network requests |
| `secrets:read` | Access secrets from provider |
| `fs:read` | Read filesystem files |
| `fs:write` | Write filesystem files |

Agents without explicit `permissions` default to `['read:code']` (least privilege).

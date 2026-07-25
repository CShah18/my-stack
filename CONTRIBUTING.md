# Contributing to MyStack

Thank you for your interest in contributing to **MyStack**! MyStack is built on open source principles and welcomes contributions from developers, architects, and designers.

---

## 🛠️ Monorepo Setup

MyStack uses **pnpm workspaces** and **Turborepo**.

### Prerequisites

- Node.js `>= 20.0.0`
- pnpm `>= 9.0.0`

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/mystack-ai/mystack.git
cd mystack

# 2. Install dependencies
pnpm install

# 3. Build all packages
pnpm turbo run build typecheck
```

---

## 🧪 Running Verification

Before submitting a pull request, ensure all packages build, typecheck, and pass integration tests:

```bash
# Run full monorepo build and typecheck
pnpm turbo run build typecheck

# Run end-to-end integration test suite
npx tsx packages/sdk/src/e2e-test.ts
```

---

## 🦋 Changesets Workflow

All pull requests modifying any `@mystack/*` library package MUST include a changeset file.

### Adding a Changeset

```bash
pnpm changeset
```

1. Select the affected packages.
2. Select bump type (`patch`, `minor`, `major`).
3. Enter a clear summary of your changes.
4. Commit the generated `.changeset/*.md` file with your code.

---

## 📜 Pull Request Checklist

- [ ] Code follows TypeScript strict standards (no `as any`).
- [ ] Added or updated unit/integration tests as needed.
- [ ] Ran `pnpm turbo run build typecheck` with 0 errors.
- [ ] Created a changeset file via `pnpm changeset`.
- [ ] Preserved docstrings and updated documentation in `docs/` if necessary.

---

## 📄 Code of Conduct

Please maintain a welcoming, respectful, and collaborative environment when communicating in issues, pull requests, and discussions.

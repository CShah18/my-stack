# Changesets in MyStack

Hello! This folder contains files managed by [Changesets](https://github.com/changesets/changesets).

## For Contributors

When submitting a Pull Request that modifies any `@mystack/*` package, run:

```bash
pnpm changeset
```

Follow the interactive prompts to:
1. Select the packages affected by your change.
2. Choose bump type (`major`, `minor`, `patch`).
3. Enter a summary of your changes.

Commit the generated `.changeset/*.md` file along with your code changes.

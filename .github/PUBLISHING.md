# Publishing to npm

This repo publishes automatically when a new version lands on `master`.

## Package name

The npm package is **`harness-skills`**.

```bash
npx harness-skills install
```

The legacy name `harness-engineering-skills` still works for older installs. After publishing `harness-skills`, deprecate the old name once:

```bash
npm deprecate harness-engineering-skills "Renamed to harness-skills. Use: npx harness-skills install"
```

The name `harness-engineering` is owned by another project on npm and cannot be used.

## One-time setup

1. Create an npm account and ensure you can publish `harness-skills`.
2. Create an npm **Automation** token at https://www.npmjs.com/settings/~your-user/tokens
3. Add it to GitHub repo secrets as `NPM_TOKEN`:
   - Repository → Settings → Secrets and variables → Actions → New repository secret

No extra secret is needed for GitHub Releases — the workflow uses the built-in `GITHUB_TOKEN`.

## Release flow

1. Bump `version` in `package.json` (semver).
2. Merge to `master`.
3. GitHub Actions runs **Publish npm**:
   - Skips if that version already exists on npm
   - Runs smoke tests
   - Publishes to npm with provenance
   - Creates git tag `v{version}` and a GitHub Release with auto-generated notes

## Manual publish trigger

Actions → **Publish npm** → **Run workflow**

## GitHub repo settings (manual)

Cloud agents may not have permission to edit repository metadata. Run locally as maintainer:

```bash
gh repo edit solanodz/harness-engineering-skills \
  --description "Agent skills for Cursor, Claude Code, and Codex — reliable agent loops with scope, verify, and resume" \
  --add-topic harness-engineering \
  --add-topic agent-skills \
  --add-topic cursor \
  --add-topic claude-code \
  --add-topic codex \
  --add-topic ai-coding-agents \
  --add-topic npm-package
```

Or set the same in **GitHub → Settings → General** (description) and **Topics**.

## Verify after publish

```bash
npx harness-skills@latest install
npx harness-skills@latest list
```

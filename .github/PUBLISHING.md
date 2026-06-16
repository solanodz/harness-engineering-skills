# Publishing to npm

This repo publishes automatically when a new version lands on `master`.

## One-time setup

1. Create an npm account and ensure you own the `harness-engineering-skills` package name.
2. Create an npm **Automation** or **Publish** token at https://www.npmjs.com/settings/~your-user/tokens
3. Add it to GitHub repo secrets as `NPM_TOKEN`:
   - Repository → Settings → Secrets and variables → Actions → New repository secret

## Release flow

1. Bump `version` in `package.json` (semver).
2. Merge to `master`.
3. GitHub Actions runs `Publish npm`:
   - Skips if that version already exists on npm
   - Runs smoke tests
   - Publishes with provenance

## Manual publish trigger

Actions → **Publish npm** → **Run workflow**

Useful after fixing a failed publish without changing `package.json`.

## Verify after publish

```bash
npx harness-engineering-skills@latest install
npx harness-engineering-skills@latest list
```

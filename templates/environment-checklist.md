# Environment checklist

Use once when adopting the harness, and again after stack or secret changes.

## Toolchain

- [ ] Runtime version is pinned (`.nvmrc`, `engines`, `.python-version`, or equivalent)
- [ ] `init.sh` fails if the runtime is missing or too old
- [ ] Package manager matches the lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `uv.lock`)

## Dependencies

- [ ] Install command is documented in `AGENTS.md` and used in `init.sh`
- [ ] Fresh install works from a clean checkout (CI or a temp dir)

## Environment variables

- [ ] `.env.example` exists (or the project has no env vars — say so in `AGENTS.md`)
- [ ] Every required var is listed with `required` / `optional` and a placeholder
- [ ] `.env` is gitignored
- [ ] No real secrets in git history or skill files

## Services

- [ ] Local services listed (Postgres, Redis, Docker Compose) or explicitly "none"
- [ ] Start command documented (example: `docker compose up -d`)
- [ ] Migrations / schema sync documented if a database exists

## Health

- [ ] One command proves the environment can run (HTTP health, CLI, or test smoke)
- [ ] That command is part of `./init.sh`
- [ ] Dev server is printed, not launched by default

## Agent docs

- [ ] `AGENTS.md` has an Environment table (runtime, install, env, services, health, start)
- [ ] If `init.sh` fails, agents must fix the environment before feature work

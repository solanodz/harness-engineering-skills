# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest on npm (`harness-skills`) | Yes |
| Older major/minor releases | Best effort |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

1. Open a [GitHub Security Advisory](https://github.com/solanodz/harness-engineering-skills/security/advisories/new) (preferred), or
2. Email the maintainer via GitHub private contact if advisories are unavailable.

Include:

- Description of the issue and potential impact
- Steps to reproduce
- Affected version(s)
- Suggested fix (if any)

## What to expect

- Acknowledgment within **7 days**
- Status update within **30 days** for confirmed issues
- Coordinated disclosure once a fix is available

## Scope

This repository ships:

- CLI scripts (`scripts/`)
- Agent skill files (`skills/`)
- Templates and references

Reports about misconfiguration in **consumer projects** (how skills are invoked, IDE settings, or project harness files) are out of scope unless they stem from a defect in this package.

## Safe usage

- Install from npm: `npx harness-skills@latest install`
- When developing this repo locally, use `npm run dev:install` or `node scripts/cli.mjs` — see README troubleshooting
- Review skill content before installing in sensitive environments

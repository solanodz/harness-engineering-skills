# AGENTS.md

This repository contains Harness Engineering skills for Cursor and compatible agents.

## Purpose

Modular skills based on [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/).

## Structure

- `skills/` — one skill per harness subsystem
- `templates/` — copy-ready harness templates
- `scripts/` — create-harness, validate-harness, render-assessment
- `references/course/` — reference patterns from the original course

## Commands

```bash
node scripts/validate-harness.mjs --target .
node scripts/create-harness.mjs --target /path/to/project
```

## Rules

- Keep each SKILL.md under 500 lines
- Write skill descriptions in third person with clear triggers
- **All content is written in English**
- Attribute to walkinglabs/learn-harness-engineering (MIT)

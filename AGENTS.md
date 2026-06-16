# AGENTS.md

Este repositorio contiene skills de Harness Engineering para Cursor y agentes compatibles.

## Propósito

Skills modulares basadas en [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/es/).

## Estructura

- `skills/` — una skill por subsistema del harness
- `templates/` — plantillas EN + `templates/es/` en español
- `scripts/` — create-harness, validate-harness, render-assessment
- `references/course/` — patrones de referencia del curso original

## Comandos

```bash
node scripts/validate-harness.mjs --target .
node scripts/create-harness.mjs --target /path/to/project
```

## Reglas

- Mantener cada SKILL.md bajo 500 líneas
- Descripciones en tercera persona con triggers claros
- Atribuir al curso walkinglabs/learn-harness-engineering (MIT)

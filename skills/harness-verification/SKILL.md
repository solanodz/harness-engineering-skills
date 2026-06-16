---
name: harness-verification
description: >-
  Configura verificación obligatoria antes de declarar trabajo completado: tests,
  lint, type-check, smoke/e2e. Usar cuando el agente declare victoria prematura,
  al diseñar init.sh, o al implementar autorreflexión (Lecciones 09–10, Proyecto 05).
---

# Harness Verification

Confianza ≠ corrección (Lección 09). Solo una ejecución de pipeline completo cuenta como evidencia real (Lección 10).

## Principio central

El agente **no puede** marcar una feature como `passing` hasta que:

1. Ejecutó los comandos de verificación documentados
2. Todos pasaron (o documentó fallos conocidos como `blocked`)
3. Registró evidencia en `feature_list.json` o `progress.md`

## Jerarquía de verificación

```
1. Unit tests        → lógica aislada
2. Lint / format     → estilo y errores estáticos
3. Type-check        → contratos de tipos
4. Integration       → módulos conectados
5. Smoke / E2E       → flujo completo observable
```

Documenta todos los niveles aplicables en AGENTS.md. El mínimo viable es `./init.sh`.

## init.sh — contrato

```bash
#!/usr/bin/env bash
set -euo pipefail
# 1. Instalar dependencias
# 2. Ejecutar verificación baseline
# 3. Mostrar comando de arranque (no lanzar por defecto)
```

Regla: **si init.sh falla, no empieces features nuevas**. Repara el baseline primero.

## Comandos en AGENTS.md

Formato explícito y copiable:

```markdown
## Verificación

| Nivel | Comando |
|-------|---------|
| Tests | `npm test` |
| Lint | `npm run lint` |
| Types | `npm run typecheck` |
| Full | `./init.sh` |
| Smoke | `npm run test:e2e` |
```

## Loop de corrección

```
Implementar → Ejecutar verificación → ¿Pasa?
  ├── Sí → Registrar evidencia → Marcar passing
  └── No → Leer error → Corregir → Re-ejecutar (no declarar done)
```

## Separación de roles (Proyecto 05)

Para tareas críticas, separa implementador de verificador:

- Agente A implementa
- Agente B (o subagente readonly) revisa contra `verification[]` en feature_list
- Usa [evaluator-rubric](../../templates/es/evaluator-rubric.md) como guía

## Evidencia mínima

```json
{
  "evidence": [{
    "date": "2026-06-16",
    "commands": ["npm test", "npm run lint"],
    "result": "pass",
    "output_summary": "42/42 tests, 0 lint errors"
  }]
}
```

## Anti-patrones

- "Se ve bien" sin ejecutar tests
- Marcar passing con tests skipped
- Cambiar umbrales de verificación para forzar pass
- Solo unit tests cuando la feature es user-visible (falta smoke/e2e)

## Plantillas

- [templates/es/init.sh](../../templates/es/init.sh)
- [templates/es/evaluator-rubric.md](../../templates/es/evaluator-rubric.md)

## Referencia del curso

- Lección 09: Por qué los agentes declaran victoria demasiado pronto
- Lección 10: Por qué el testing end-to-end cambia resultados
- Proyecto 05: Autoverificación y Q&A con evidencia

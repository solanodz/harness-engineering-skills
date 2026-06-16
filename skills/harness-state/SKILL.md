---
name: harness-state
description: >-
  Diseña archivos de estado persistente (feature_list.json, progress.md) para
  continuidad entre sesiones de agente. Usar en tareas largas, al perder contexto
  entre sesiones, o al implementar handoff multi-sesión (Proyecto 03).
---

# Harness State

Las tareas largas pierden continuidad si el estado vive solo en el chat (Lección 05). Persiste progreso en disco para que la próxima sesión retome exactamente donde quedó.

## Artefactos de estado

| Archivo | Rol | Actualizar |
|---------|-----|------------|
| `feature_list.json` | Fuente de verdad de features | Al cambiar status o añadir evidencia |
| `progress.md` / `claude-progress.md` | Registro de sesión | Al inicio (leer) y al cierre (escribir) |
| `session-handoff.md` | Entrega compacta | Al cerrar sesiones largas |
| Git log | Historial de cambios | Commits descriptivos |

## Reglas de feature_list.json

```json
{
  "rules": {
    "single_active_feature": true,
    "passing_requires_evidence": true,
    "do_not_skip_verification": true
  }
}
```

Estados válidos:

- `not_started` — sin trabajo
- `in_progress` — feature activa (solo una)
- `blocked` — bloqueo documentado en `notes`
- `passing` — verificación ejecutada + evidencia en `evidence[]`

## Formato de evidence

```json
"evidence": [
  {
    "date": "2026-06-16",
    "verification_run": "npm test && npm run lint",
    "result": "pass",
    "notes": "42 tests passed, 0 lint errors"
  }
]
```

No marques `passing` sin entrada en `evidence`.

## progress.md — estructura

```markdown
# Progress Log

## Current State
- Active feature: [id] — [title]
- Last verification: [command] — [pass/fail]
- Blockers: [none | description]

## Session History

### YYYY-MM-DD — [brief title]
- Worked on: ...
- Verification: ...
- Next: ...
```

## Flujo multi-sesión

**Inicio de sesión:**
1. Leer `progress.md` → estado verificado más reciente
2. Leer `feature_list.json` → feature inacabada de mayor prioridad
3. `git log --oneline -5` → cambios recientes
4. `./init.sh` → confirmar baseline sano

**Fin de sesión:**
1. Actualizar `progress.md` con lo hecho y lo pendiente
2. Actualizar `feature_list.json` (status + evidence)
3. Opcional: completar `session-handoff.md`
4. Commit si el repo es reiniciable

## Anti-patrones

- Confiar en memoria del chat
- Marcar features done sin evidence
- Dejar `in_progress` en múltiples features
- Progress aspiracional ("casi listo") vs verificado

## Plantillas

- [templates/es/claude-progress.md](../../templates/es/claude-progress.md)
- [templates/es/session-handoff.md](../../templates/es/session-handoff.md)
- [templates/es/feature_list.json](../../templates/es/feature_list.json)

## Referencia del curso

- Lección 05: Por qué las tareas largas pierden continuidad
- Proyecto 03: Continuidad entre sesiones

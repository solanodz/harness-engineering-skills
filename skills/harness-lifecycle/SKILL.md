---
name: harness-lifecycle
description: >-
  Gestiona el ciclo de vida de sesión del agente: init.sh al inicio, handoff al
  cerrar, checklist de estado limpio. Usar al iniciar/cerrar sesiones agentic,
  al diseñar init.sh, o cuando la próxima sesión no pueda retomar (Lecciones 06, 12).
---

# Harness Lifecycle

La inicialización necesita su propia fase (Lección 06). Cada sesión debe dejar estado limpio (Lección 12).

## Ciclo de sesión completo

```
START
  1. Leer AGENTS.md / CLAUDE.md
  2. Ejecutar ./init.sh (install + verify + health check)
  3. Leer progress.md (qué pasó la última vez)
  4. Leer feature_list.json (qué sigue)
  5. git log --oneline -5

SELECT
  6. Elegir UNA feature inacabada
  7. status → in_progress

EXECUTE
  8. Implementar
  9. Verificar (tests, lint, type-check)
  10. Si falla → corregir → re-verificar
  11. Si pasa → registrar evidencia

WRAP UP
  12. Actualizar progress.md
  13. Actualizar feature_list.json
  14. Documentar riesgos/bloqueos
  15. Commit (solo si es seguro reanudar)
  16. Dejar ruta de reinicio limpia
```

## init.sh

Fase de inicialización separada del trabajo de features:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> Syncing dependencies"
npm install  # adaptar al gestor del proyecto

echo "==> Running baseline verification"
npm test     # adaptar comandos

echo "==> Startup: npm run dev"
echo "Set RUN_START_COMMAND=1 to launch directly."
```

Si init.sh falla → **reparar entorno, no implementar features**.

## session-handoff.md

Completar al cerrar sesiones largas o antes de cambiar de agente:

```markdown
## Verificado ahora
- Qué funciona:
- Qué verificación se ejecutó:

## Cambiado en esta sesión
- Código:
- Harness/infra:

## Roto o sin verificar
- Defectos conocidos:
- Riesgos para próxima sesión:

## Mejor próximo paso
- Feature: [id] — [title]
- Criterio de done:
- Qué NO cambiar:

## Comandos
- Inicio: ./init.sh
- Verificación: ...
- Debug: ...
```

## Checklist de estado limpio

Antes de terminar, verificar [clean-state-checklist.md](../../templates/es/clean-state-checklist.md):

- [ ] init.sh funciona
- [ ] Verificación baseline pasa
- [ ] Progress actualizado
- [ ] feature_list refleja realidad
- [ ] Sin pasos a medias sin documentar
- [ ] Próxima sesión puede continuar sin reparación manual

## Reglas de commit

Commit cuando:

- Verificación pasa (o bloqueo documentado)
- Progress y feature_list actualizados
- No hay archivos temporales/debug olvidados

No commit cuando:

- Tests rotos sin documentar
- Feature a medias sin notas
- init.sh fallaría en fresh checkout

## Anti-patrones

- Empezar a codear sin init.sh
- Cerrar sesión sin actualizar progress
- Commit con baseline roto
- Handoff genérico ("se avanzó bastante")

## Plantillas

- [templates/es/init.sh](../../templates/es/init.sh)
- [templates/es/session-handoff.md](../../templates/es/session-handoff.md)
- [templates/es/clean-state-checklist.md](../../templates/es/clean-state-checklist.md)

## Referencia del curso

- Lección 06: Por qué la inicialización necesita su propia fase
- Lección 12: Por qué cada sesión debe dejar estado limpio
- Proyecto 03: Continuidad entre sesiones

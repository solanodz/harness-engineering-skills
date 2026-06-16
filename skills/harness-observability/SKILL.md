---
name: harness-observability
description: >-
  Hace observable el runtime del agente: logs, métricas, trazas, estado de
  servicios. Usar al depurar comportamiento del agente, diseñar harness capstone,
  o cuando no se pueda ver qué hizo el agente (Lección 11, Proyecto 06).
---

# Harness Observability

Si no puedes ver qué hizo el agente, no puedes arreglar lo que rompió (Lección 11). La observabilidad pertenece **dentro** del harness, no como afterthought.

## Qué hacer observable

| Señal | Para qué | Dónde |
|-------|----------|-------|
| Logs estructurados | Qué ejecutó, qué falló | stdout, archivos en `logs/` |
| Estado de servicios | ¿App corriendo? ¿DB up? | health endpoints, status bar |
| Resultados de verificación | Evidencia de pass/fail | progress.md, feature_list evidence |
| Diff de cambios | Qué modificó el agente | git diff, git log |
| Errores de runtime | Bugs post-implementación | console, test output |

## Patrones prácticos

### 1. Verificación con output capturado

```bash
npm test 2>&1 | tee .harness/last-test-run.log
echo "Exit: $?" >> .harness/last-test-run.log
```

El agente (y tú) pueden leer el log después.

### 2. Status visible en la app

Para apps con UI (como el proyecto capstone del curso):

- Barra de estado: docs indexados, último sync, errores
- Indicadores de health en pantalla
- El agente puede verificar estado sin adivinar

### 3. Directorio `.harness/` (opcional)

```
.harness/
├── last-init.log
├── last-test-run.log
├── session-metrics.json
└── README.md  # qué contiene cada archivo
```

Añadir `.harness/*.log` a `.gitignore` si son efímeros; commitear métricas si son evidencia.

### 4. Comandos de debug documentados

En AGENTS.md o session-handoff:

```markdown
## Debug
- Ver logs: `tail -50 logs/app.log`
- Health check: `curl localhost:3000/health`
- Estado DB: `npm run db:status`
```

## Integración con verificación

Observabilidad + verificación = evidencia completa:

```json
{
  "evidence": [{
    "date": "2026-06-16",
    "commands": ["./init.sh", "npm run test:e2e"],
    "result": "pass",
    "artifacts": [".harness/last-test-run.log"],
    "observations": "Status bar shows 42 docs indexed"
  }]
}
```

## Diagnóstico de fallos del agente

Cuando el agente falla repetidamente:

1. ¿Puede **ejecutar** el comando? (Gulf of Execution)
2. ¿Puede **interpretar** el output? (Gulf of Evaluation)
3. ¿El output es **visible** en su contexto?
4. ¿Hay **feedback loop** para corregir?

Cierra la brecha con harness, no con prompts más largos.

## Ablation study (Proyecto 06)

Para el capstone, elimina subsistemas uno a la vez y mide:

```
Baseline (harness completo)     → tasa de éxito X%
Sin observabilidad              → tasa de éxito Y%
Sin verificación                → tasa de éxito Z%
...
```

Documenta resultados en progress.md.

## Anti-patrones

- Agente declara done sin logs de verificación
- Errores solo en terminal efímera (no capturados)
- Sin health check antes de smoke tests
- Observabilidad solo en producción, no en dev harness

## Referencia del curso

- Lección 11: Por qué la observabilidad pertenece al harness
- Proyecto 06: Harness completo con observabilidad y debugging
- [references/course/gotchas.md](../../references/course/gotchas.md)

## Skills relacionadas

- `harness-verification` — evidencia de pass/fail
- `harness-lifecycle` — logs de sesión en progress/handoff
- `harness-audit` — detectar gaps de observabilidad

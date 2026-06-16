---
name: harness-audit
description: >-
  Audita y puntúa un harness existente en cinco subsistemas (instrucciones,
  estado, verificación, alcance, ciclo de vida). Usar al evaluar un repositorio
  agent-ready, antes de mejorar un harness, o para diagnóstico de fallos del
  agente.
---

# Harness Audit

Evalúa qué tan preparado está un repositorio para trabajo agentic fiable. Basado en Lección 02 (cinco subsistemas) y ejercicio de auditoría del curso.

## Ejecutar auditoría automatizada

```bash
node scripts/validate-harness.mjs --target /path/to/project
node scripts/validate-harness.mjs --target /path/to/project --json
node scripts/render-assessment-html.mjs --target /path/to/project
```

Exit code ≠ 0 si el score global < 70 (configurable con `--min-score`).

## Checklist manual por subsistema

Califica cada subsistema del 1 al 5:

### 1. Instrucciones (1–5)

- [ ] Existe `AGENTS.md` o `CLAUDE.md`
- [ ] Tiene flujo de inicio explícito (qué leer, en qué orden)
- [ ] Comandos de verificación listados y copiables
- [ ] ≤ ~100 líneas en el archivo raíz (divulgación progresiva a `docs/`)
- [ ] Definición de done clara

### 2. Estado (1–5)

- [ ] Existe `feature_list.json` o equivalente machine-readable
- [ ] Existe `progress.md` o `claude-progress.md`
- [ ] El estado refleja la realidad (no aspiracional)
- [ ] Git history complementa el estado en disco

### 3. Verificación (1–5)

- [ ] Existe `init.sh` o comandos documentados equivalentes
- [ ] Tests/lint/type-check son ejecutables por el agente
- [ ] Hay smoke test o e2e documentado
- [ ] El agente no puede marcar done sin evidencia

### 4. Alcance (1–5)

- [ ] Una feature activa a la vez
- [ ] Features tienen criterios de verificación observables
- [ ] Dependencias entre features documentadas
- [ ] No hay reescritura silenciosa de la lista de features

### 5. Ciclo de vida (1–5)

- [ ] init.sh verifica salud del entorno antes de trabajar
- [ ] Existe plantilla de handoff (`session-handoff.md`)
- [ ] Checklist de estado limpio al cerrar sesión
- [ ] Commit solo cuando es seguro reanudar

## Reporte al usuario

Formato:

```markdown
## Auditoría de Harness: [proyecto]

| Subsistema | Score | Estado |
|------------|-------|--------|
| Instrucciones | X/5 | ... |
| Estado | X/5 | ... |
| Verificación | X/5 | ... |
| Alcance | X/5 | ... |
| Ciclo de vida | X/5 | ... |

**Cuello de botella probable**: [subsistema más bajo]

**Top 3 mejoras** (ordenadas por impacto):
1. ...
2. ...
3. ...
```

## Ablación (opcional)

Para cuantificar valor marginal de cada componente (Lección 02, ejercicio 2):

1. Fija modelo y tarea
2. Elimina UN subsistema a la vez (ej. borrar AGENTS.md)
3. Mide caída de rendimiento
4. Combina con logs de fallos — la mayor caída sugiere pero no prueba el cuello de botella

## Siguiente paso

Según el subsistema más débil, invocar la skill correspondiente:

- Instrucciones → `harness-instructions`
- Estado → `harness-state`
- Verificación → `harness-verification`
- Alcance → `harness-scope`
- Ciclo de vida → `harness-lifecycle`

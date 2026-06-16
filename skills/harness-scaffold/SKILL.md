---
name: harness-scaffold
description: >-
  Crea un harness mínimo de producción para agentes de codificación: AGENTS.md,
  feature_list.json, progress.md, init.sh y session-handoff.md. Usar al iniciar
  un proyecto nuevo, al adoptar harness engineering, o cuando el usuario pida
  configurar un entorno agentic fiable.
---

# Harness Scaffold

Crea el paquete mínimo de harness para que un agente pueda iniciar, mantener alcance, verificar trabajo y reanudar entre sesiones.

Basado en [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/es/) — Proyecto 01 y biblioteca de recursos.

## Modelo de cinco subsistemas

| Subsistema | Artefacto | Propósito |
|------------|-----------|-----------|
| Instrucciones | `AGENTS.md` o `CLAUDE.md` | Ruta de inicio, reglas, definición de done |
| Estado | `feature_list.json`, `progress.md` | Feature activa, evidencia, siguiente paso |
| Verificación | `init.sh` | Comandos que el agente debe ejecutar antes de declarar done |
| Alcance | Dependencias y criterios en feature_list | Evita sobre-alcance y trabajo a medias |
| Ciclo de vida | `session-handoff.md`, checklist de cierre | Reinicio limpio en la próxima sesión |

## Primer paso

1. Inspecciona qué existe: archivos de instrucción, estado, comandos de verificación, docs, manifests.
2. Pregunta solo lo que no puedas inferir: agente objetivo (Cursor/Claude Code), nombre del archivo, tolerancia a sobrescritura.
3. Prefiere un harness mínimo. Añade complejidad solo cuando el problema lo exija.

## Crear harness

Si tienes acceso al repo de skills:

```bash
node scripts/create-harness.mjs --target /path/to/project
```

Opciones útiles:

- `--agent-file CLAUDE.md` para proyectos Claude Code
- `--package-manager npm|pnpm|yarn|bun`
- `--commands "cmd one,cmd two"` para verificación custom
- `--force` solo con confirmación explícita del usuario

Si no puedes ejecutar scripts, crea manualmente estos archivos usando las plantillas en `templates/es/` o `templates/` del repo de skills.

## Contenido mínimo de AGENTS.md

Mantener ~100 líneas. Debe incluir:

1. **Flujo de inicio**: leer progress → feature_list → git log → ejecutar init.sh
2. **Reglas de trabajo**: una feature a la vez, no marcar done sin evidencia
3. **Definición de done**: comportamiento + verificación ejecutada + evidencia registrada
4. **Fin de sesión**: actualizar progress y feature_list, commit seguro

Ver plantilla completa: [templates/es/AGENTS.md](../../templates/es/AGENTS.md)

## feature_list.json

Cada feature necesita:

- `id`, `priority`, `title`, `user_visible_behavior`
- `status`: `not_started` | `in_progress` | `blocked` | `passing`
- `verification`: pasos concretos y observables
- `evidence`: array vacío hasta que la verificación pase

Reglas globales en el JSON:

```json
"rules": {
  "single_active_feature": true,
  "passing_requires_evidence": true,
  "do_not_skip_verification": true
}
```

## init.sh

Debe: sincronizar dependencias → ejecutar verificación baseline → mostrar comando de arranque.

No apilar trabajo nuevo sobre un baseline roto.

## Después de crear

1. Explica qué se creó y dónde
2. Indica al usuario que reemplace las features de ejemplo con las reales del proyecto
3. Sugiere ejecutar `harness-audit` para validar

## Recursos adicionales

- [Memory Persistence](../../references/course/memory-persistence-pattern.md)
- [Lifecycle & Bootstrap](../../references/course/lifecycle-bootstrap-pattern.md)
- [Gotchas](../../references/course/gotchas.md)

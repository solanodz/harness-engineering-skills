# Harness Engineering Skills

Skills for [Cursor](https://cursor.com) and other coding agents, based on the [Learn Harness Engineering](https://walkinglabs.github.io/learn-harness-engineering/) course by Walking Labs.

A **harness** does not make the model smarter: it establishes a closed-loop workflow with instructions, state, verification, scope, and session lifecycle. These skills implement those five subsystems as invocable workflows.

**All skills are written in English by default.** Spanish templates live under `templates/es/`.

## Instalación

Copia las skills a tu directorio personal de Cursor:

```bash
git clone https://github.com/solanodz/harness-engineering-skills.git
cp -r harness-engineering-skills/skills/* ~/.cursor/skills/
```

O instala solo las que necesites:

```bash
cp -r harness-engineering-skills/skills/harness-scaffold ~/.cursor/skills/
```

## Skills incluidas

| Skill | Subsistema | Cuándo usarla |
|-------|------------|---------------|
| [harness-scaffold](skills/harness-scaffold/) | Todos | Crear un harness mínimo en un proyecto nuevo |
| [harness-audit](skills/harness-audit/) | Todos | Auditar y puntuar un harness existente |
| [harness-instructions](skills/harness-instructions/) | Instrucciones | Escribir AGENTS.md con divulgación progresiva |
| [harness-state](skills/harness-state/) | Estado | Persistir progreso entre sesiones |
| [harness-verification](skills/harness-verification/) | Verificación | Evitar victorias prematuras con pruebas reales |
| [harness-scope](skills/harness-scope/) | Alcance | Controlar alcance con feature_list.json |
| [harness-lifecycle](skills/harness-lifecycle/) | Ciclo de vida | init.sh, handoff y estado limpio al cerrar |
| [harness-observability](skills/harness-observability/) | Observabilidad | Hacer visible lo que hace el agente en runtime |

## Ruta de aprendizaje (curso)

```
Fase 1: harness-scaffold + harness-audit     → Ver el problema (P01)
Fase 2: harness-instructions                 → Repo legible para el agente (P02)
Fase 3: harness-state + harness-lifecycle    → Continuidad entre sesiones (P03)
Fase 4: harness-scope + harness-verification → Feedback y alcance (P04–P05)
Fase 5: harness-observability                → Harness completo (P06)
```

## Templates

Copy-ready templates in `templates/` (English, default) and `templates/es/` (Spanish):

- `AGENTS.md` / `CLAUDE.md` — manual de operación del agente
- `feature_list.json` — lista de features con verificación
- `init.sh` — instalación + verificación al inicio
- `claude-progress.md` — registro de sesión
- `session-handoff.md` — entrega entre sesiones
- `clean-state-checklist.md` — checklist de cierre

## Scripts

```bash
# Crear harness mínimo en un proyecto
node scripts/create-harness.mjs --target /path/to/project

# Auditar harness existente
node scripts/validate-harness.mjs --target /path/to/project

# Reporte HTML
node scripts/render-assessment-html.mjs --target /path/to/project
```

## Referencias

- [Learn Harness Engineering (ES)](https://walkinglabs.github.io/learn-harness-engineering/es/)
- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

## Licencia

MIT — adaptado del curso [walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering).

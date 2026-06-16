---
name: harness-instructions
description: >-
  Escribe o mejora AGENTS.md/CLAUDE.md con divulgación progresiva: mapa corto
  en la raíz, detalle en docs/. Usar al estructurar instrucciones para agentes,
  cuando un archivo de reglas es demasiado largo, o al hacer el repo legible
  para IA (Proyecto 02).
---

# Harness Instructions

El repositorio es la única fuente de verdad (Lección 03). Las instrucciones deben ser un **mapa**, no un manual (Lección 04).

## Principios

1. **~100 líneas máximo** en `AGENTS.md` / `CLAUDE.md` raíz
2. **Divulgación progresiva**: enlazar a `docs/` para detalle
3. **Restringir, no microgestionar**: invariantes ejecutables, no pasos de implementación
4. **Comandos copiables**: verificación como bloques de código, no prosa

## Estructura recomendada

```markdown
# AGENTS.md

## Propósito (1 línea)
[Qué hace el proyecto]

## Stack
[Lenguaje, framework, versiones clave]

## Flujo de inicio
1. pwd
2. Leer progress.md
3. Leer feature_list.json → elegir feature inacabada de mayor prioridad
4. git log --oneline -5
5. ./init.sh

## Comandos de verificación
- Tests: `...`
- Lint: `...`
- Type-check: `...`
- Full: `./init.sh`

## Reglas invariantes
- Una feature a la vez
- No marcar done sin evidencia
- No cambiar reglas de verificación durante implementación

## Definición de done
[Checklist breve]

## Documentación detallada
- Arquitectura: docs/architecture.md
- Convenciones: docs/conventions.md
- API: docs/api.md

## Fin de sesión
[5 pasos de cierre]
```

## Anti-patrones

| Mal | Bien |
|-----|------|
| 500 líneas en AGENTS.md | 80 líneas + docs/ |
| "Sigue buenas prácticas" | "Todas las APIs usan OAuth 2.0" |
| Historia del proyecto | Comandos y reglas actuales |
| Duplicar README completo | Enlazar al README |

## Workflow

1. Lee el proyecto: stack, scripts en package.json, estructura de dirs
2. Identifica qué debe saber el agente **antes** de escribir código
3. Escribe AGENTS.md corto con routing a docs/
4. Crea docs/ solo para lo que no cabe en el mapa
5. Valida: ¿un agente nuevo puede iniciar solo con estos archivos?

## Plantillas

- Español: [templates/es/AGENTS.md](../../templates/es/AGENTS.md)
- Inglés: [templates/agents.md](../../templates/agents.md)

## Referencia del curso

- Lección 03: El repositorio como sistema de registro
- Lección 04: Por qué falla un archivo gigante de instrucciones
- Proyecto 02: Workspace legible para el agente

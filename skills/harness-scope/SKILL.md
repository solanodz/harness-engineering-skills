---
name: harness-scope
description: >-
  Controla el alcance del agente con feature_list.json: una feature a la vez,
  criterios observables, definición de done. Usar cuando el agente sobre-alcance,
  deje trabajo a medias, o reescriba la lista de tareas (Lecciones 07–08, Proyecto 04).
---

# Harness Scope

Los agentes sobre-alcancen y sub-terminan (Lección 07). Las listas de features son primitivas del harness (Lección 08): límites machine-readable que el agente no puede ignorar.

## Reglas de alcance

1. **Una feature activa** — solo una con `status: "in_progress"`
2. **Prioridad explícita** — número menor = más urgente
3. **Comportamiento observable** — `user_visible_behavior` describe qué ve el usuario
4. **Verificación como contrato** — pasos concretos, no vagos
5. **No reescribir la lista** — añadir features requiere justificación documentada

## Anatomía de una feature

```json
{
  "id": "auth-001",
  "priority": 1,
  "area": "auth",
  "title": "Login con email y password",
  "user_visible_behavior": "El usuario ingresa credenciales y accede al dashboard.",
  "status": "not_started",
  "verification": [
    "Abrir /login",
    "Ingresar credenciales válidas",
    "Verificar redirect a /dashboard",
    "Verificar mensaje de error con credenciales inválidas"
  ],
  "evidence": [],
  "notes": ""
}
```

## Selección de feature

Al inicio de sesión:

```
1. Filtrar status != "passing"
2. Ordenar por priority ASC
3. Elegir la primera
4. Cambiar su status a "in_progress"
5. Trabajar SOLO en esa feature
```

## Manejo de bloqueos

Si una feature queda bloqueada:

```json
{
  "status": "blocked",
  "notes": "Requiere API key de Stripe — ver issue #42"
}
```

No saltes a otra feature sin documentar el bloqueo. No marques `passing` parcial.

## Correcciones de soporte

Cambios fuera del alcance de la feature activa solo si:

- Desbloquean la feature actual (fix estrecho)
- Son correcciones de verificación baseline rota
- Están documentados en `notes` o `progress.md`

## Crear feature_list desde cero

1. Lista features user-visible (no tareas internas)
2. Ordena por dependencia → priority
3. Escribe verification[] como pasos que un humano puede seguir
4. Establece reglas globales en el JSON

## Workflow de actualización

```
Terminar trabajo en feature X:
  → Ejecutar verification[] de X
  → Si pasa: status="passing", evidence=[...]
  → Si falla: corregir o status="blocked"
  → Nunca: status="passing" sin evidence
```

## Anti-patrones

- Tres features `in_progress` simultáneas
- Verification vaga: "funciona correctamente"
- Borrar features incompletas de la lista
- Implementar feature priority 5 mientras priority 1 está pendiente

## Plantillas

- [templates/es/feature_list.json](../../templates/es/feature_list.json)
- Schema: [templates/feature-list.schema.json](../../templates/feature-list.schema.json)

## Referencia del curso

- Lección 07: Por qué los agentes sobre-alcancen y sub-terminan
- Lección 08: Por qué las listas de features son primitivas del harness
- Proyecto 04: Feedback de runtime y control de alcance

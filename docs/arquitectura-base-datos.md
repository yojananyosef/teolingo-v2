# Arquitectura de base de datos

## 1. Motor y acceso

- Motor: Turso / libSQL.
- Cliente: `@libsql/client/web`.
- ORM: Drizzle.
- Configuracion: `src/infrastructure/database/db.ts`.

Variables esperadas:
- `TURSO_DATABASE_URL` (o `TURSO_CONNECTION_URL`)
- `TURSO_AUTH_TOKEN`

## 2. Esquema principal

Definido en `src/infrastructure/database/schema.ts`.

## 2.1 Usuario y progreso

- `users`
  - identidad, credenciales hash, puntos, nivel, racha.
- `user_progress`
  - progreso por leccion (`is_completed`, `accuracy`, `is_perfect`).
- `achievements`
  - catalogo de logros.
- `user_achievements`
  - logros desbloqueados por usuario.

## 2.2 Curriculo

- `lessons`
  - metadatos de leccion (titulo, orden, xp).
- `exercises`
  - ejercicios por leccion (`type`, `question`, `correct_answer`, `options`, `hebrew_text`).

Tipos de ejercicio hoy:
- `multiple-choice`
- `translation`
- `word-bank` (asignado en cliente para ciertos casos)
- `noun-parsing` (modo sustantivos)

## 2.3 IME y SRS

- `flashcards`
- `user_flashcard_progress`
  - estado SRS por tarjeta (`next_review`, `interval`, `ease_factor`, `repetition_count`).

## 2.4 Inmersion y modo israeli

- `anchor_texts`
- `alphabet`
- `rhythm_paradigms`
- `israeli_units`
- `israeli_vocabulary`
- `israeli_sentences`
- `user_israeli_progress`

## 3. Integridad y constraints

- PK UUID en tablas principales.
- FKs entre usuario-progreso, leccion-ejercicio, unidad-vocabulario.
- Unicos:
  - `user_lesson_idx`
  - `user_flashcard_idx`
  - `user_unit_idx`

## 4. Seed y fuente de verdad

Flujo oficial:
- `bun run db:seed:safe`
- Script: `src/infrastructure/database/seed.ts`
- Contenido curricular: `src/infrastructure/database/seed-lessons.ts`

Estado actual confirmado:
- `practice-nouns` esta incluido en seed oficial.
- 10 ejercicios `noun-parsing` cargados.

## 5. Flujo de datos clave

## 5.1 Practica (nouns/freq/quick)

1. UI llama `/api/lessons/practice`.
2. Route Handler parsea `mode`, `range`, `random`.
3. `GetPracticeExercisesUseCase` consulta `exercises`.
4. Respuesta serializada para render en `lesson/[id]`.

## 5.2 Cierre de leccion/practica

1. Cliente envia precision.
2. Use case actualiza puntos/nivel/racha.
3. Se recalculan logros.
4. Se actualiza cookie de sesion para reflejo inmediato en UI.

## 6. Deuda tecnica de datos

- `exercises.options` y otros campos JSON viven como `text`.
- Faltan tipos estructurados por modalidad a nivel DB.
- Conviene agregar versionado de seed para trazabilidad curricular.

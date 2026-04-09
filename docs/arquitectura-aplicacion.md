# Arquitectura de la aplicacion

## 1. Stack y enfoque

- Framework: Next.js 16 (App Router).
- Runtime: Bun.
- Estado cliente: Zustand.
- ORM: Drizzle ORM.
- Base de datos: Turso/libSQL.
- Auth: JWT + cookie de sesion.
- UI: React + Tailwind + Lucide.

El proyecto sigue un enfoque de arquitectura por features (screaming architecture):

- `src/app`: paginas, layouts, rutas API y acciones de borde.
- `src/features`: logica de negocio por dominio (`lessons`, `auth`, `israeli-mode`, `leaderboard`).
- `src/infrastructure`: persistencia, auth y adaptadores externos.
- `src/components`: componentes de UI reutilizables.

## 2. Flujo de capa a capa

1. UI en `src/app/**` consume Server Actions o Route Handlers.
2. Actions y rutas delegan en Use Cases (`src/features/**/use-case.ts`).
3. Use Cases operan con Drizzle sobre `src/infrastructure/database/db.ts`.
4. Respuesta vuelve a UI con datos ya listos para render.

## 3. Modulos principales

## 3.1 Aprendizaje y practica

- Lecciones progresivas: `src/app/learn`, `src/app/lesson/[id]`.
- Practica personalizada: `src/app/practice`.
- Modos actuales:
  - Frecuencia biblica (`mode=freq`)
  - Sustantivos (`mode=nouns`, tipo `noun-parsing`)
  - Repaso rapido (`mode=quick`)

Use case clave:
- `GetPracticeExercisesUseCase` en `src/features/lessons/use-case.ts`.

## 3.2 IME / inmersion

- Inmersion multisensorial: `src/app/immerse`.
- Textos ancla: `src/app/anchor-texts`.
- Flashcards SRS: `src/app/practice/flashcards`.

## 3.3 Modo israeli

- Lista de unidades: `src/app/modes/israeli/page.tsx`.
- Ejecucion por unidad: `src/app/modes/israeli/[unitId]/page.tsx`.
- Casos de uso: `src/features/israeli-mode/use-case.ts`.

## 3.4 Auth y sesion

- Login/register en `src/app/auth/**`.
- Session cookie y utilidades en `src/infrastructure/lib/auth.ts`.
- Proteccion global con `AuthGuard`.

## 3.5 PWA

- Manifest configurado desde `src/app/layout.tsx`.
- Registro de Service Worker (`public/sw.js`) en runtime.

## 4. Decisiones tecnicas relevantes

- Server Actions para mutaciones (ej. completar leccion/practica).
- Route Handlers para endpoints de consulta (ej. `/api/lessons/practice`).
- Estado local de UX con Zustand (`useUIStore`, `useAuthStore`).
- Seed centralizado en `seed-lessons.ts` como fuente oficial de contenido.

## 5. Riesgos actuales

- Parte del tipado usa `any` en algunos use cases y componentes.
- Lint global con ruido de formato heredado en varios archivos no funcionales.
- Documentacion historica dispersa (corregido con la carpeta `docs/`).

## 6. Recomendaciones inmediatas

1. Mantener un solo seed oficial para contenido curricular.
2. Endurecer tipado de respuestas de ejercicios por tipo (`translation`, `word-bank`, `noun-parsing`).
3. Incorporar pruebas E2E para los modos de practica.
4. Reducir logica de parseo en cliente moviendo validaciones al dominio cuando aplique.

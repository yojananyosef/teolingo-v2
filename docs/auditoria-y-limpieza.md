# Auditoria y limpieza de la app

## 1. Alcance

Revision funcional y tecnica orientada a dejar el repositorio listo para hardening de Fase 1.

## 2. Hallazgos funcionales

- El modo `nouns` depende de datos en seed oficial (`seed-lessons.ts`).
- Se verifico retorno correcto de ejercicios `noun-parsing` tras seed.
- Se corrigio warning de keys en `NounParsingExercise`.
- Se ajusto layout compacto de `noun-parsing` para mejorar viewport.
- Se alineo orden de tarjetas en pagina de practica segun requerimiento.

## 3. Hallazgos de arquitectura

- `src/features/**/use-case.ts` concentra reglas de negocio.
- `src/app/api/**` y Server Actions actuan como interfaz de aplicacion.
- DB schema consistente para progreso, logros, SRS y modo israeli.

## 4. Archivos obsoletos detectados

Detectados como no referenciados por el runtime actual:

- `src/infrastructure/database/seed-nouns.ts` (seed paralelo sin uso en flujo oficial).
- `test-hebrew.html` (archivo de pruebas manuales local).
- Documentos en `public/` usados como insumo editorial y no como assets runtime:
  - `public/1.md`
  - `public/2.md`
  - `public/implementation_plan.md`
  - PDFs de trabajo de sustantivos

## 5. Criterio aplicado

- Mantener en `public/` solo assets necesarios para runtime (logos, manifest, sounds, sw).
- Centralizar documentacion en `docs/`.
- No versionar bases SQLite locales generadas (`local.db`).
- Eliminar o mover artefactos de trabajo fuera de rutas publicas.

Acciones ejecutadas:

- Eliminado `src/infrastructure/database/seed-nouns.ts` (obsoleto).
- Eliminado `test-hebrew.html` (prueba manual).
- Las referencias historicas se documentan en `docs/referencias/README.md`. Los archivos fuente no estan versionados actualmente en esta rama:
  - `public/1.md` -> `docs/referencias/marco-original-1.md`
  - `public/2.md` -> `docs/referencias/marco-original-2.md`
  - `public/implementation_plan.md` -> `docs/referencias/implementation-plan-nouns.md`
  - `public/sustantivos.pdf` -> `docs/referencias/sustantivos.pdf`
  - `public/tareadesustantivos (1).pdf` -> `docs/referencias/tareadesustantivos-1.pdf`
  - `analisis_nivel_introductorio.md` -> `docs/referencias/analisis-nivel-introductorio.md`
  - `inmersion_multisensorial_estructurada_ime_version_final_revisada.md` -> `docs/referencias/ime-version-final-revisada.md`

Acciones de hardening Fase 1:

- `local.db` se retira del control de versiones por estar desfasada respecto del schema actual.
- La base local debe regenerarse con `bun run db:push` y `bun run db:seed:safe`, o conectarse a Turso mediante `.env`.
- `seed-lessons.ts` se mantiene como fuente curricular oficial; `seed.ts` orquesta el seed completo.

## 6. Checklist pre-commit final

1. Validar rutas de practica (`freq`, `nouns`, `quick`).
2. Ejecutar seed seguro en entorno de trabajo.
3. Ejecutar `bun run lint`, `bun run build` y smoke E2E.
4. Verificar que `docs/` sea la fuente de verdad documental.
5. Revisar diff final y confirmar que no quedan archivos de pruebas sueltos.

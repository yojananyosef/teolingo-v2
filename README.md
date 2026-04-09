# TeoLingo v2

Aplicacion web para aprendizaje de hebreo biblico con enfoque neuroinclusivo (IME), practica guiada y seguimiento de progreso.

## Stack

- Next.js 16 (App Router)
- Bun
- Turso/libSQL + Drizzle
- Zustand
- Tailwind

## Puesta en marcha local

1. Instalar dependencias:

```bash
bun install
```

2. Configurar variables de entorno (`.env`):

- `TURSO_DATABASE_URL` (o `TURSO_CONNECTION_URL`)
- `TURSO_AUTH_TOKEN`

3. Seed recomendado sin perder progreso:

```bash
bun run db:seed:safe
```

4. Iniciar desarrollo:

```bash
bun dev
```

## Scripts utiles

- `bun run db:seed:safe`
- `bun run db:seed:reset`
- `bun run db:push`
- `bun run lint`

## Documentacion oficial

Toda la documentacion consolidada vive en la carpeta `docs/`:

- `docs/README.md`
- `docs/defensa-proyecto.md`
- `docs/arquitectura-aplicacion.md`
- `docs/arquitectura-base-datos.md`
- `docs/marco-neurocognitivo-ime.md`
- `docs/roadmap.md`
- `docs/plan-futuro.md`
- `docs/auditoria-y-limpieza.md`

## Estado actual funcional

- Lecciones progresivas
- Practica por frecuencia biblica
- Modo sustantivos (`noun-parsing`)
- Inmersion y textos ancla
- Flashcards SRS
- Modo israeli (ILC)

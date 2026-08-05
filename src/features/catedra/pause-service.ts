import { db } from "@/infrastructure/database/db";
import { catedraControl, catedraExceptions } from "@/infrastructure/database/schema";
import { and, eq, gt, sql } from "drizzle-orm";

function controlIdForWeek(weekNumber: number): string {
  return `semana-${weekNumber}`;
}

export interface CatedraAccessState {
  isPaused: boolean;
  pausedAt: string | null;
  exceptionActiveUntil: string | null;
  accessGranted: boolean;
}

// Cache del ensure para que solo corra UNA vez por proceso, no por cada
// lectura (el cliente web de Turso no soporta parámetros en run() y además
// hacer DDL repetido hace muy lento el pending-count).
const globalThisCache = globalThis as unknown as {
  __catedraPauseEnsurePromise?: Promise<void>;
};

export function ensureCatedraPauseTables(database = db): Promise<void> {
  if (globalThisCache.__catedraPauseEnsurePromise) {
    return globalThisCache.__catedraPauseEnsurePromise;
  }

  const ensure = (async () => {
    // Las columnas id/is_paused etc. usan literales (sin interpolación), así evita
    // parámetros en run(). Las filas por semana NO se pre-crean: pause/resume las
    // crean con INSERT ... ON CONFLICT DO UPDATE y getCatedraAccessState trata la
    // ausencia de fila como "no pausada".
    await database.run(sql`
      CREATE TABLE IF NOT EXISTS catedra_control (
        id TEXT PRIMARY KEY NOT NULL,
        is_paused INTEGER NOT NULL DEFAULT 0,
        paused_by TEXT,
        paused_at INTEGER,
        updated_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    await database.run(sql`
      CREATE TABLE IF NOT EXISTS catedra_exceptions (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        week_number INTEGER,
        active_until INTEGER NOT NULL,
        granted_by TEXT,
        created_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `);

    // Migración para tablas creadas antes del modelo por semana
    await database
      .run(sql`ALTER TABLE catedra_exceptions ADD COLUMN week_number INTEGER;`)
      .catch(() => undefined);

    // El modelo antiguo usaba una sola fila global; ya no aplica.
    await database
      .run(sql`DELETE FROM catedra_control WHERE id = 'global';`)
      .catch(() => undefined);
  })();

  // Si falla, no cachear la promesa para poder reintentar en la siguiente llamada.
  globalThisCache.__catedraPauseEnsurePromise = ensure.catch(() => {
    globalThisCache.__catedraPauseEnsurePromise = undefined;
  });

  return globalThisCache.__catedraPauseEnsurePromise;
}

export async function getCatedraAccessState(
  studentId: string,
  weekNumber: number,
): Promise<CatedraAccessState> {
  await ensureCatedraPauseTables();

  const [control] = await db
    .select()
    .from(catedraControl)
    .where(eq(catedraControl.id, controlIdForWeek(weekNumber)))
    .limit(1)
    .all();

  const isPaused = control?.isPaused ?? false;

  if (!isPaused) {
    return { isPaused: false, pausedAt: null, exceptionActiveUntil: null, accessGranted: true };
  }

  const now = new Date();
  const [exception] = await db
    .select()
    .from(catedraExceptions)
    .where(
      and(
        eq(catedraExceptions.studentId, studentId),
        eq(catedraExceptions.weekNumber, weekNumber),
        gt(catedraExceptions.activeUntil, now),
      ),
    )
    .limit(1)
    .all();

  const activeUntil = exception?.activeUntil ?? null;

  return {
    isPaused: true,
    pausedAt: control?.pausedAt?.toISOString() ?? null,
    exceptionActiveUntil: activeUntil !== null ? activeUntil.toISOString() : null,
    accessGranted: activeUntil !== null,
  };
}

/** Extrae el número de semana de un id de quiz/lección de Cátedra. P.ej. `catedra-semana-3` o `catedra-lesson-semana-3` → 3. */
export function getWeekNumberFromCatedraId(id: string): number | null {
  const match = id.match(/(?:catedra-lesson-)?semana-(\d+)/);
  if (!match) return null;
  const week = Number.parseInt(match[1], 10);
  return Number.isNaN(week) ? null : week;
}

const ALL_WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);

/** Estado de acceso de TODAS las semanas con solo 2 queries (control + excepciones). */
export async function getAllCatedraAccessStates(
  studentId: string,
): Promise<Record<number, CatedraAccessState>> {
  await ensureCatedraPauseTables();

  const controlRows = await db
    .select({
      id: catedraControl.id,
      isPaused: catedraControl.isPaused,
      pausedAt: catedraControl.pausedAt,
    })
    .from(catedraControl)
    .all();

  const controlByWeek = new Map<number, { isPaused: boolean; pausedAt: Date | null }>();
  for (const row of controlRows) {
    const week = getWeekNumberFromCatedraId(row.id);
    if (week !== null) {
      controlByWeek.set(week, { isPaused: row.isPaused, pausedAt: row.pausedAt });
    }
  }

  const now = new Date();
  const exceptions = await db
    .select({
      weekNumber: catedraExceptions.weekNumber,
      activeUntil: catedraExceptions.activeUntil,
    })
    .from(catedraExceptions)
    .where(and(eq(catedraExceptions.studentId, studentId), gt(catedraExceptions.activeUntil, now)))
    .all();

  const exceptionByWeek = new Map<number, Date>();
  for (const ex of exceptions) {
    if (ex.weekNumber !== null && !exceptionByWeek.has(ex.weekNumber)) {
      exceptionByWeek.set(ex.weekNumber, ex.activeUntil);
    }
  }

  const result: Record<number, CatedraAccessState> = {};
  for (const week of ALL_WEEKS) {
    const control = controlByWeek.get(week);
    const isPaused = control?.isPaused ?? false;
    const activeUntil = exceptionByWeek.get(week) ?? null;

    result[week] = {
      isPaused,
      pausedAt: control?.pausedAt ? control.pausedAt.toISOString() : null,
      exceptionActiveUntil: activeUntil !== null ? activeUntil.toISOString() : null,
      accessGranted: !isPaused || activeUntil !== null,
    };
  }

  return result;
}

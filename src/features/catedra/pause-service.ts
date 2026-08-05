import { db } from "@/infrastructure/database/db";
import { catedraControl, catedraExceptions } from "@/infrastructure/database/schema";
import { and, eq, gt, sql } from "drizzle-orm";

const GLOBAL_CONTROL_ID = "global";

export interface CatedraAccessState {
  isPaused: boolean;
  pausedAt: string | null;
  exceptionActiveUntil: string | null;
  accessGranted: boolean;
}

export async function ensureCatedraPauseTables(database = db): Promise<void> {
  try {
    await Promise.all([
      database.run(sql`
        CREATE TABLE IF NOT EXISTS catedra_control (
          id TEXT PRIMARY KEY NOT NULL,
          is_paused INTEGER NOT NULL DEFAULT 0,
          paused_by TEXT,
          paused_at INTEGER,
          updated_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
        );
      `),
      database.run(sql`
        CREATE TABLE IF NOT EXISTS catedra_exceptions (
          id TEXT PRIMARY KEY NOT NULL,
          student_id TEXT NOT NULL,
          active_until INTEGER NOT NULL,
          granted_by TEXT,
          created_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
        );
      `),
    ]);
    await database.run(sql`
      INSERT OR IGNORE INTO catedra_control (id, is_paused, updated_at)
      VALUES ('global', 0, CURRENT_TIMESTAMP);
    `);
  } catch (error) {
    console.error("Error ensuring Cátedra pause tables:", error);
  }
}

export async function getCatedraAccessState(studentId: string): Promise<CatedraAccessState> {
  await ensureCatedraPauseTables();

  const [control] = await db
    .select()
    .from(catedraControl)
    .where(eq(catedraControl.id, GLOBAL_CONTROL_ID))
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
    .where(and(eq(catedraExceptions.studentId, studentId), gt(catedraExceptions.activeUntil, now)))
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

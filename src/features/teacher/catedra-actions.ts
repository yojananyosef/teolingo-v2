"use server";

import { db } from "@/infrastructure/database/db";
import { catedraControl, catedraExceptions } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function controlIdForWeek(weekNumber: number): string {
  return `semana-${weekNumber}`;
}

export async function pauseCatedraAction(weekNumber: number): Promise<{
  success: boolean;
  error?: string;
  isPaused: boolean;
}> {
  const session = await getSession();
  if (!session?.id || (session.role !== "teacher" && session.role !== "admin")) {
    return { success: false, error: "No autorizado", isPaused: false };
  }

  try {
    await db
      .insert(catedraControl)
      .values({
        id: controlIdForWeek(weekNumber),
        isPaused: true,
        pausedBy: session.id,
        pausedAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: catedraControl.id,
        set: { isPaused: true, pausedBy: session.id, pausedAt: new Date(), updatedAt: new Date() },
      });

    revalidatePath("/catedra");
    revalidatePath("/teacher/catedra");
    return { success: true, isPaused: true };
  } catch (error) {
    console.error(`Error pausando Cátedra semana ${weekNumber}:`, error);
    return { success: false, error: "Error interno al pausar la semana", isPaused: false };
  }
}

export async function resumeCatedraAction(weekNumber: number): Promise<{
  success: boolean;
  error?: string;
  isPaused: boolean;
}> {
  const session = await getSession();
  if (!session?.id || (session.role !== "teacher" && session.role !== "admin")) {
    return { success: false, error: "No autorizado", isPaused: true };
  }

  try {
    await db
      .insert(catedraControl)
      .values({ id: controlIdForWeek(weekNumber), isPaused: false, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: catedraControl.id,
        set: { isPaused: false, pausedBy: null, pausedAt: null, updatedAt: new Date() },
      });

    revalidatePath("/catedra");
    revalidatePath("/teacher/catedra");
    return { success: true, isPaused: false };
  } catch (error) {
    console.error(`Error reanudando Cátedra semana ${weekNumber}:`, error);
    return { success: false, error: "Error interno al reanudar la semana", isPaused: true };
  }
}

export async function setCatedraExceptionAction(data: {
  weekNumber: number;
  studentId: string;
  activeUntil: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.id || (session.role !== "teacher" && session.role !== "admin")) {
    return { success: false, error: "No autorizado" };
  }

  const activeUntil = new Date(data.activeUntil);
  if (Number.isNaN(activeUntil.getTime()) || activeUntil.getTime() <= Date.now()) {
    return { success: false, error: "La fecha límite debe ser futura" };
  }

  try {
    const existing = await db
      .select({ id: catedraExceptions.id })
      .from(catedraExceptions)
      .where(
        and(
          eq(catedraExceptions.studentId, data.studentId),
          eq(catedraExceptions.weekNumber, data.weekNumber),
        ),
      )
      .limit(1)
      .all();

    if (existing && existing.length > 0) {
      await db
        .update(catedraExceptions)
        .set({ activeUntil, grantedBy: session.id })
        .where(eq(catedraExceptions.id, existing[0].id));
    } else {
      await db.insert(catedraExceptions).values({
        studentId: data.studentId,
        weekNumber: data.weekNumber,
        activeUntil,
        grantedBy: session.id,
      });
    }

    revalidatePath("/catedra");
    revalidatePath("/teacher/catedra");
    return { success: true };
  } catch (error) {
    console.error("Error otorgando excepción Cátedra:", error);
    return { success: false, error: "Error interno al otorgar la excepción" };
  }
}

export async function clearCatedraExceptionAction(data: {
  weekNumber: number;
  studentId: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.id || (session.role !== "teacher" && session.role !== "admin")) {
    return { success: false, error: "No autorizado" };
  }

  try {
    await db
      .delete(catedraExceptions)
      .where(
        and(
          eq(catedraExceptions.studentId, data.studentId),
          eq(catedraExceptions.weekNumber, data.weekNumber),
        ),
      );

    revalidatePath("/catedra");
    revalidatePath("/teacher/catedra");
    return { success: true };
  } catch (error) {
    console.error("Error eliminando excepción Cátedra:", error);
    return { success: false, error: "Error interno al eliminar la excepción" };
  }
}

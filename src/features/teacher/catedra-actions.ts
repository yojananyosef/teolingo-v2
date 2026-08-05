"use server";

import { db } from "@/infrastructure/database/db";
import { catedraControl, catedraExceptions } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const GLOBAL_CONTROL_ID = "global";

export async function pauseCatedraAction(): Promise<{
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
        id: GLOBAL_CONTROL_ID,
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
    console.error("Error pausando módulo Cátedra:", error);
    return { success: false, error: "Error interno al pausar el módulo", isPaused: false };
  }
}

export async function resumeCatedraAction(): Promise<{
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
      .values({ id: GLOBAL_CONTROL_ID, isPaused: false, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: catedraControl.id,
        set: { isPaused: false, pausedBy: null, pausedAt: null, updatedAt: new Date() },
      });

    revalidatePath("/catedra");
    revalidatePath("/teacher/catedra");
    return { success: true, isPaused: false };
  } catch (error) {
    console.error("Error reanudando módulo Cátedra:", error);
    return { success: false, error: "Error interno al reanudar el módulo", isPaused: true };
  }
}

export async function setCatedraExceptionAction(data: {
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
      .where(eq(catedraExceptions.studentId, data.studentId))
      .limit(1)
      .all();

    if (existing && existing.length > 0) {
      await db
        .update(catedraExceptions)
        .set({ activeUntil, grantedBy: session.id })
        .where(eq(catedraExceptions.id, existing[0].id));
    } else {
      await db
        .insert(catedraExceptions)
        .values({ studentId: data.studentId, activeUntil, grantedBy: session.id });
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
  studentId: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.id || (session.role !== "teacher" && session.role !== "admin")) {
    return { success: false, error: "No autorizado" };
  }

  try {
    await db.delete(catedraExceptions).where(eq(catedraExceptions.studentId, data.studentId));

    revalidatePath("/catedra");
    revalidatePath("/teacher/catedra");
    return { success: true };
  } catch (error) {
    console.error("Error eliminando excepción Cátedra:", error);
    return { success: false, error: "Error interno al eliminar la excepción" };
  }
}

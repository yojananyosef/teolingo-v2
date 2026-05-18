"use server";

import { db } from "@/infrastructure/database/db";
import { quizzes, quizQuestions, quizAssignments } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

export async function createQuizAction(data: { title: string; description: string; exerciseIds: string[] }) {
  const session = await getSession();
  if (!session?.id || session.role !== "teacher") {
    return { success: false, error: "No autorizado" };
  }

  if (!data.title || data.exerciseIds.length === 0) {
    return { success: false, error: "El título y al menos una pregunta son requeridos" };
  }

  try {
    const result = await db.transaction(async (trx) => {
      const [quiz] = await trx.insert(quizzes).values({
        teacherId: session.id,
        title: data.title,
        description: data.description,
      }).returning();

      const questionsToInsert = data.exerciseIds.map((exId, idx) => ({
        quizId: quiz.id,
        exerciseId: exId,
        order: idx,
      }));

      await trx.insert(quizQuestions).values(questionsToInsert);

      return quiz;
    });

    revalidatePath("/teacher/quizzes");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return { success: false, error: "Error interno al crear el quiz" };
  }
}

export async function updateQuizAction(data: { id: string; title: string; description: string }) {
  const session = await getSession();
  if (!session?.id || session.role !== "teacher") {
    return { success: false, error: "No autorizado" };
  }

  if (!data.title || !data.title.trim()) {
    return { success: false, error: "El título es obligatorio" };
  }

  try {
    const result = await db.transaction(async (trx) => {
      const updated = await trx
        .update(quizzes)
        .set({ title: data.title.trim(), description: data.description || null })
        .where(and(eq(quizzes.id, data.id), eq(quizzes.teacherId, session.id)));

      return updated;
    });

    if (result.rows.length === 0) {
      return { success: false, error: "Quiz no encontrado o no autorizado" };
    }

    revalidatePath("/teacher/quizzes");
    revalidatePath(`/teacher/quizzes/${data.id}`);
    return { success: true };
  } catch (error) {
    console.error("Error actualizando quiz:", error);
    return { success: false, error: "Error interno al actualizar el quiz" };
  }
}

export async function deleteQuizAction(data: { id: string }) {
  const session = await getSession();
  if (!session?.id || session.role !== "teacher") {
    return { success: false, error: "No autorizado" };
  }

  try {
    await db.transaction(async (trx) => {
      await trx.delete(quizAssignments).where(eq(quizAssignments.quizId, data.id));
      await trx.delete(quizQuestions).where(eq(quizQuestions.quizId, data.id));
      await trx.delete(quizzes).where(and(eq(quizzes.id, data.id), eq(quizzes.teacherId, session.id)));
    });

    revalidatePath("/teacher/quizzes");
    return { success: true };
  } catch (error) {
    console.error("Error eliminando quiz:", error);
    return { success: false, error: "Error interno al eliminar el quiz" };
  }
}

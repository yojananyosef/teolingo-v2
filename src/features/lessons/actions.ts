"use server";

import {
  CompleteLessonUseCase,
  CompletePracticeUseCase,
  GetAlphabetUseCase,
  GetFlashcardsUseCase,
  GetLessonsUseCase,
  GetRhythmParadigmsUseCase,
  ListAnchorTextsUseCase,
  UpdateFlashcardProgressUseCase,
} from "@/features/lessons/use-case";
import { encrypt, getSession } from "@/infrastructure/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Why: Server actions for lesson management.

export async function getLessonsAction() {
  const session = await getSession();
  const userId = session?.userId;

  const useCase = new GetLessonsUseCase();
  const result = await useCase.execute(userId);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  return { success: true, data: result.value };
}

export async function completeLessonAction(lessonId: string, accuracy = 100) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompleteLessonUseCase();
  const result = await useCase.execute(session.userId, lessonId, accuracy);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  // Update session cookie so server components see the new values immediately
  try {
    const data = result.value;
    const newSession = {
      ...session,
      points: data.newPoints,
      streak: data.newStreak,
      level: data.newLevel,
    };
    const token = await encrypt(newSession);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
    });
  } catch (e) {
    console.error("Failed to update session cookie after completing lesson:", e);
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return { success: true, data: result.value };
}

export async function getFlashcardsAction() {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado" };

  const useCase = new GetFlashcardsUseCase();
  const result = await useCase.execute(session.userId);

  if (result.isFailure()) return { success: false, error: result.error.message };
  return { success: true, data: result.value };
}

export async function updateFlashcardProgressAction(flashcardId: string, quality: number) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado" };

  const useCase = new UpdateFlashcardProgressUseCase();
  const result = await useCase.execute(session.userId, flashcardId, quality);

  if (result.isFailure()) return { success: false, error: result.error.message };

  revalidatePath("/practice/flashcards");
  return { success: true };
}

export async function getAlphabetAction() {
  const useCase = new GetAlphabetUseCase();
  const result = await useCase.execute();

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  return { success: true, data: result.value };
}

export async function getRhythmParadigmsAction() {
  const useCase = new GetRhythmParadigmsUseCase();
  const result = await useCase.execute();

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  return { success: true, data: result.value };
}

export async function listAnchorTextsAction() {
  const useCase = new ListAnchorTextsUseCase();
  const result = await useCase.execute();

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  return { success: true, data: result.value };
}

export async function completePracticeAction(
  accuracy = 100,
  modality?: "rhythm" | "blurting" | "air-writing" | "build",
) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompletePracticeUseCase();
  const result = await useCase.execute(session.userId, accuracy, modality);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  // Update session cookie so server components see the new values immediately
  try {
    const data = result.value;
    const newSession = {
      ...session,
      points: data.newPoints,
      streak: data.newStreak,
      level: data.newLevel,
    };
    const token = await encrypt(newSession);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
    });
  } catch (e) {
    console.error("Failed to update session cookie after completing practice:", e);
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return { success: true, data: result.value };
}

"use server";

import { getSession, encrypt } from "@/infrastructure/lib/auth";
import { cookies } from "next/headers";
import {
  GetLessonsUseCase,
  CompleteLessonUseCase,
  CompletePracticeUseCase,
} from "@/features/lessons/use-case";
import { revalidatePath } from "next/cache";

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

export async function completeLessonAction(lessonId: string) {
  const session = await getSession();
  if (!session?.userId)
    return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompleteLessonUseCase();
  const result = await useCase.execute(session.userId, lessonId);

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
      ...(session as any),
      points: (session?.points ?? 0) + (data.pointsEarned ?? 0),
      streak: data.streak,
      level: data.level,
    };
    const token = await encrypt(newSession);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
    });
  } catch (e) {
    console.error(
      "Failed to update session cookie after completing lesson:",
      e,
    );
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return { success: true, data: result.value };
}

export async function completePracticeAction() {
  const session = await getSession();
  if (!session?.userId)
    return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompletePracticeUseCase();
  const result = await useCase.execute(session.userId);

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
      ...(session as any),
      points: (session?.points ?? 0) + (data.pointsEarned ?? 0),
      streak: data.streak,
      level: data.level,
    };
    const token = await encrypt(newSession);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2,
    });
  } catch (e) {
    console.error(
      "Failed to update session cookie after completing practice:",
      e,
    );
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return { success: true, data: result.value };
}

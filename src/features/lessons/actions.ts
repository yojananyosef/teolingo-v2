"use server";

import { AchievementService } from "@/domain/lessons/services/achievement.service";
import { StreakService } from "@/domain/lessons/services/streak.service";
import {
  CompleteLessonUseCase,
  CompletePracticeUseCase,
  GetAlphabetUseCase,
  GetFlashcardsUseCase,
  GetLessonsUseCase,
  GetRhythmParadigmsUseCase,
  ListAnchorTextsUseCase,
  UpdateFlashcardProgressUseCase,
} from "@/features/lessons/use-cases";
import {
  DrizzleLessonRepository,
  DrizzleProgressRepository,
  DrizzleUserRepository,
} from "@/infrastructure/database/repositories";
import { encrypt, getSession } from "@/infrastructure/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Why: Server actions for lesson management.

export async function getLessonsAction() {
  const session = await getSession();
  const userId = session?.id;

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

export async function completeLessonAction(
  lessonId: string,
  accuracy = 100,
  failedExerciseIds: string[] = [],
  quizMeta?: {
    timeSpentSeconds?: number;
    timeLimitSeconds?: number;
    correctExerciseIds?: string[];
    timedOut?: boolean;
  },
) {
  const session = await getSession();
  if (!session?.id) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const userRepository = new DrizzleUserRepository();
  const lessonRepository = new DrizzleLessonRepository();
  const progressRepository = new DrizzleProgressRepository();
  const streakService = new StreakService();
  const achievementService = new AchievementService(progressRepository);

  const useCase = new CompleteLessonUseCase(
    userRepository,
    lessonRepository,
    progressRepository,
    streakService,
    achievementService,
  );
  const result = await useCase.execute(session.id, lessonId, accuracy, failedExerciseIds, quizMeta);

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

export async function getFlashcardsAction(category?: string, course = "hebrew") {
  const session = await getSession();
  if (!session?.id) return { success: false, error: "No autorizado" };

  const useCase = new GetFlashcardsUseCase();
  const result = await useCase.execute(session.id, category, course);

  if (result.isFailure()) return { success: false, error: result.error.message };
  return { success: true, data: result.value };
}

export async function updateFlashcardProgressAction(flashcardId: string, quality: number) {
  const session = await getSession();
  if (!session?.id) return { success: false, error: "No autorizado" };

  const useCase = new UpdateFlashcardProgressUseCase();
  const result = await useCase.execute(session.id, flashcardId, quality);

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
  failedExerciseIds: string[] = [],
) {
  const session = await getSession();
  if (!session?.id) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const userRepository = new DrizzleUserRepository();
  const progressRepository = new DrizzleProgressRepository();
  const streakService = new StreakService();
  const achievementService = new AchievementService(progressRepository);

  const useCase = new CompletePracticeUseCase(
    userRepository,
    progressRepository,
    streakService,
    achievementService,
  );
  const result = await useCase.execute(session.id, accuracy, modality, failedExerciseIds);

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

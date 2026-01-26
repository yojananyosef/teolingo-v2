"use server";

import { getSession } from "@/infrastructure/lib/auth";
import { GetLessonsUseCase, CompleteLessonUseCase, CompletePracticeUseCase } from "@/features/lessons/use-case";
import { revalidatePath } from "next/cache";

// Why: Server actions for lesson management.

export async function getLessonsAction() {
  const session = await getSession();
  const userId = session?.userId;
  
  const useCase = new GetLessonsUseCase();
  const result = await useCase.execute(userId);
  
  if (result.isFailure()) {
    return { success: false, error: result.error.message, code: result.error.code };
  }
  
  return { success: true, data: result.value };
}

export async function completeLessonAction(lessonId: string) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompleteLessonUseCase();
  const result = await useCase.execute(session.userId, lessonId);
  
  if (result.isFailure()) {
    return { 
      success: false, 
      error: result.error.message, 
      code: result.error.code 
    };
  }
  
  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");
  
  return { success: true, data: result.value };
}

export async function completePracticeAction() {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompletePracticeUseCase();
  const result = await useCase.execute(session.userId);
  
  if (result.isFailure()) {
    return { 
      success: false, 
      error: result.error.message, 
      code: result.error.code 
    };
  }
  
  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");
  
  return { success: true, data: result.value };
}

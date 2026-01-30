"use server";

import {
  CompleteIsraeliUnitUseCase,
  GetIsraeliUnitUseCase,
  ListIsraeliUnitsUseCase,
} from "@/features/israeli-mode/use-case";
import { encrypt, getSession } from "@/infrastructure/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Why: Server actions for Israeli Mode (ILC).

export async function listIsraeliUnitsAction() {
  const useCase = new ListIsraeliUnitsUseCase();
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

export async function getIsraeliUnitAction(unitId: string) {
  const useCase = new GetIsraeliUnitUseCase();
  const result = await useCase.execute(unitId);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  return { success: true, data: result.value };
}

export async function completeIsraeliUnitAction(unitId: string, accuracy = 100) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new CompleteIsraeliUnitUseCase();
  const result = await useCase.execute(session.userId, unitId, accuracy);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  // Update session cookie
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
    console.error("Failed to update session cookie after completing Israeli unit:", e);
  }

  revalidatePath("/learn");
  revalidatePath("/leaderboard");
  revalidatePath("/profile");

  return { success: true, data: result.value };
}

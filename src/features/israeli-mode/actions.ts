"use server";

import { cache } from "react";
import {
  CompleteIsraeliUnitUseCase,
  GetIsraeliUnitUseCase,
  ListIsraeliUnitsUseCase,
} from "@/features/israeli-mode/use-case";
import { encrypt, getSession } from "@/infrastructure/lib/auth";
import { safeAction } from "@/lib/action-handler";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Why: Server actions for Israeli Mode (ILC).

export const listIsraeliUnitsAction = cache(async () => {
  return await safeAction(async () => {
    const session = await getSession();
    if (!session?.id) throw new Error("No autorizado");

    const useCase = new ListIsraeliUnitsUseCase();
    const result = await useCase.execute(session.id);

    if (result.isFailure()) {
      throw new Error(result.error.message);
    }

    return result.value;
  });
});

export const getIsraeliUnitAction = cache(async (unitId: string) => {
  return await safeAction(async () => {
    const useCase = new GetIsraeliUnitUseCase();
    const result = await useCase.execute(unitId);

    if (result.isFailure()) {
      throw new Error(result.error.message);
    }

    return result.value;
  });
});

export async function completeIsraeliUnitAction(unitId: string) {
  return await safeAction(async () => {
    const session = await getSession();
    if (!session?.id) throw new Error("No autorizado");

    const useCase = new CompleteIsraeliUnitUseCase();
    const result = await useCase.execute(session.id, unitId);

    if (result.isFailure()) {
      throw new Error(result.error.message);
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
    revalidatePath("/modes/israeli");
    revalidatePath("/leaderboard");
    revalidatePath("/profile");

    return result.value;
  });
}

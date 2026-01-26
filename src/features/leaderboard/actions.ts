"use server";

import { GetLeaderboardUseCase } from "./use-case";

export async function getLeaderboardAction() {
  const useCase = new GetLeaderboardUseCase();
  const data = await useCase.execute();
  return { ok: true, data };
}

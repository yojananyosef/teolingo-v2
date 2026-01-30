import { and, eq } from "drizzle-orm";
import { DomainError, Result } from "../../domain/shared/result";
import { db } from "../../infrastructure/database/db";
import { achievements, userAchievements } from "../../infrastructure/database/schema";

// Why: Application layer logic for user-related data like achievements.
export class GetAchievementsUseCase {
  async execute(userId: string): Promise<Result<any[]>> {
    try {
      const allAchievements = await db.select().from(achievements);
      const unlockedAchievements = await db
        .select()
        .from(userAchievements)
        .where(eq(userAchievements.userId, userId));

      const unlockedIds = new Set(unlockedAchievements.map((ua) => ua.achievementId));

      const result = allAchievements.map((a) => ({
        ...a,
        isUnlocked: unlockedIds.has(a.id),
        unlockedAt: unlockedAchievements.find((ua) => ua.achievementId === a.id)?.unlockedAt,
      }));

      return Result.ok(result);
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : "Error desconocido",
          "INTERNAL_ERROR",
        ),
      );
    }
  }
}

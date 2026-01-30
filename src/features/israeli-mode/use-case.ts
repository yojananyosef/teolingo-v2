import { and, asc, count, eq } from "drizzle-orm";
import { DomainError, Result } from "../../domain/shared/result";
import { db } from "../../infrastructure/database/db";
import {
  achievements,
  flashcards,
  israeliSentences,
  israeliUnits,
  israeliVocabulary,
  userAchievements,
  userProgress,
  users,
} from "../../infrastructure/database/schema";

// Why: Application layer logic for Israeli Mode (Closed Lexical Immersion).
export class ListIsraeliUnitsUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db.select().from(israeliUnits).orderBy(asc(israeliUnits.order));
      return Result.ok(results);
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

export class GetIsraeliUnitUseCase {
  async execute(unitId: string): Promise<Result<any>> {
    try {
      const [unit] = await db
        .select()
        .from(israeliUnits)
        .where(eq(israeliUnits.id, unitId))
        .limit(1);
      if (!unit) return Result.fail(new DomainError("Unidad no encontrada", "UNIT_NOT_FOUND"));

      const vocabulary = await db
        .select({
          id: flashcards.id,
          frontContent: flashcards.frontContent,
          backContent: flashcards.backContent,
          imeMetadata: flashcards.imeMetadata,
          order: israeliVocabulary.order,
        })
        .from(israeliVocabulary)
        .innerJoin(flashcards, eq(israeliVocabulary.flashcardId, flashcards.id))
        .where(eq(israeliVocabulary.unitId, unitId))
        .orderBy(asc(israeliVocabulary.order));

      const sentences = await db
        .select()
        .from(israeliSentences)
        .where(eq(israeliSentences.unitId, unitId))
        .orderBy(asc(israeliSentences.order));

      return Result.ok({
        ...unit,
        vocabulary: vocabulary.map((v) => ({
          ...v,
          frontContent: JSON.parse(v.frontContent),
          backContent: JSON.parse(v.backContent),
          imeMetadata: v.imeMetadata ? JSON.parse(v.imeMetadata) : null,
        })),
        sentences,
      });
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

export class CompleteIsraeliUnitUseCase {
  async execute(userId: string, _unitId: string, accuracy = 100): Promise<Result<any>> {
    try {
      const isPassed = accuracy >= 50;
      const isPerfect = accuracy === 100;

      const result = await db.transaction(async (trx) => {
        // 1. Get user
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData)
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        // 2. Update user points, level, and streak
        let pointsEarned = 0;
        if (isPassed) {
          pointsEarned = Math.round(30 * (accuracy / 100)); // Israeli mode gives more base points
          if (isPerfect) pointsEarned += 10;
        }

        const newPoints = userData.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 100) + 1;

        // Streak logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let newStreak = userData.streak;
        let lastStreakDate = userData.lastStreakDate;

        if (isPassed) {
          if (!lastStreakDate) {
            newStreak = 1;
            lastStreakDate = today;
          } else {
            const lastDate = new Date(
              lastStreakDate.getFullYear(),
              lastStreakDate.getMonth(),
              lastStreakDate.getDate(),
            );
            const diffInDays = Math.floor(
              (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            if (diffInDays === 1) {
              newStreak += 1;
              lastStreakDate = today;
            } else if (diffInDays > 1) {
              newStreak = 1;
              lastStreakDate = today;
            }
          }
        }

        await trx
          .update(users)
          .set({
            points: newPoints,
            level: newLevel,
            streak: newStreak,
            lastStreakDate,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        // 3. Check achievements
        const newAchievements: any[] = [];
        if (isPassed) {
          const allAchievements = await trx.select().from(achievements);
          const userAchs = await trx
            .select()
            .from(userAchievements)
            .where(eq(userAchievements.userId, userId));
          const unlockedIds = new Set(userAchs.map((ua) => ua.achievementId));

          const [countResult] = await trx
            .select({ value: count() })
            .from(userProgress)
            .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)));

          const totalCompleted = countResult.value;

          for (const ach of allAchievements) {
            if (unlockedIds.has(ach.id)) continue;

            let met = false;
            if (ach.requirementType === "points" && newPoints >= ach.requirementValue) met = true;
            if (ach.requirementType === "streak" && newStreak >= ach.requirementValue) met = true;
            if (ach.requirementType === "lessons" && totalCompleted >= ach.requirementValue)
              met = true;

            if (met) {
              await trx.insert(userAchievements).values({
                userId,
                achievementId: ach.id,
                unlockedAt: new Date(),
              });
              newAchievements.push(ach);
            }
          }
        }

        return Result.ok({
          pointsEarned,
          newPoints,
          newStreak,
          newLevel,
          accuracy,
          isPerfect,
          achievements: newAchievements,
        });
      });

      return result;
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

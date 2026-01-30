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
  userIsraeliProgress,
  userProgress,
  users,
} from "../../infrastructure/database/schema";

// Why: Application layer logic for Israeli Mode (Closed Lexical Immersion).
export class ListIsraeliUnitsUseCase {
  async execute(userId: string): Promise<Result<any[]>> {
    try {
      const results = await db
        .select({
          id: israeliUnits.id,
          title: israeliUnits.title,
          description: israeliUnits.description,
          grammarScope: israeliUnits.grammarScope,
          maxWords: israeliUnits.maxWords,
          order: israeliUnits.order,
          isCompleted: userIsraeliProgress.isCompleted,
        })
        .from(israeliUnits)
        .leftJoin(
          userIsraeliProgress,
          and(eq(userIsraeliProgress.unitId, israeliUnits.id), eq(userIsraeliProgress.userId, userId)),
        )
        .orderBy(asc(israeliUnits.order));

      return Result.ok(
        results.map((r) => ({
          ...r,
          isCompleted: !!r.isCompleted,
        })),
      );
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
  async execute(userId: string, unitId: string): Promise<Result<any>> {
    try {
      const result = await db.transaction(async (trx) => {
        // 1. Get user
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData)
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        // 2. Update user points, level, and streak
        // 3. Update Israeli Unit Progress
        const [existingProgress] = await trx
          .select()
          .from(userIsraeliProgress)
          .where(and(eq(userIsraeliProgress.userId, userId), eq(userIsraeliProgress.unitId, unitId)))
          .limit(1);

        const isFirstTime = !existingProgress || !existingProgress.isCompleted;
        const pointsEarned = isFirstTime ? 30 : 15;

        const newPoints = userData.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 100) + 1;

        // Streak logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let newStreak = userData.streak;
        let lastStreakDate = userData.lastStreakDate;

        if (!lastStreakDate) {
          newStreak = 1;
          lastStreakDate = today;
        } else {
          const lastDate = new Date(
            lastStreakDate.getFullYear(),
            lastStreakDate.getMonth(),
            lastStreakDate.getDate(),
          );
          const diffInDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffInDays === 1) {
            newStreak += 1;
            lastStreakDate = today;
          } else if (diffInDays > 1) {
            newStreak = 1;
            lastStreakDate = today;
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

        if (existingProgress) {
          await trx
            .update(userIsraeliProgress)
            .set({
              isCompleted: true,
              completedAt: new Date(),
            })
            .where(and(eq(userIsraeliProgress.userId, userId), eq(userIsraeliProgress.unitId, unitId)));
        } else {
          await trx.insert(userIsraeliProgress).values({
            userId,
            unitId,
            isCompleted: true,
            completedAt: new Date(),
          });
        }

        // 4. Check achievements
        const newAchievements: any[] = [];
        const allAchievements = await trx.select().from(achievements);
        const userAchs = await trx
          .select()
          .from(userAchievements)
          .where(eq(userAchievements.userId, userId));
        const unlockedIds = new Set(userAchs.map((ua) => ua.achievementId));

        // Get count of completed Israeli units
        const [israeliCountResult] = await trx
          .select({ value: count() })
          .from(userIsraeliProgress)
          .where(and(eq(userIsraeliProgress.userId, userId), eq(userIsraeliProgress.isCompleted, true)));

        const totalIsraeliCompleted = israeliCountResult.value;

        // Get total completed lessons
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
          if (ach.requirementType === "lessons" && totalCompleted >= ach.requirementValue) met = true;
          if (ach.requirementType === "israeli_units" && totalIsraeliCompleted >= ach.requirementValue)
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

        return Result.ok({
          pointsEarned,
          newPoints,
          newStreak,
          newLevel,
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

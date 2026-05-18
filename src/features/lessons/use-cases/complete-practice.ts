import { DomainError, Result } from "@/domain/shared/result";
import { db } from "@/infrastructure/database/db";
import {
  achievements,
  alphabet,
  anchorTexts,
  exercises,
  flashcards,
  lessons,
  rhythmParadigms,
  userAchievements,
  userFlashcardProgress,
  userMistakes,
  userProgress,
  users,
} from "@/infrastructure/database/schema";
import { and, asc, count, eq, inArray, lte, sql } from "drizzle-orm";
import { calculateNextReview } from "../srs-logic";
import { normalizePercent } from "./shared";

export class CompletePracticeUseCase {
  async execute(
    userId: string,
    accuracy = 100,
    modality?: "rhythm" | "blurting" | "air-writing" | "build",
    failedExerciseIds: string[] = [],
  ): Promise<
    Result<{
      pointsEarned: number;
      newPoints: number;
      newStreak: number;
      newLevel: number;
      accuracy: number;
      isPerfect: boolean;
      achievements: any[];
    }>
  > {
    try {
      const safeAccuracy = normalizePercent(accuracy);
      const isPassed = safeAccuracy >= 50;
      const isPerfect = safeAccuracy === 100;

      const result = await db.transaction(async (trx) => {
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData)
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        // Base points for practice
        let pointsEarned = 0;
        if (isPassed) {
          pointsEarned = Math.round(15 * (safeAccuracy / 100));
        }

        // IME Modality Bonus XP
        if (modality === "rhythm") pointsEarned += 10;
        if (modality === "blurting") pointsEarned += 15;
        if (modality === "air-writing") pointsEarned += 5;
        if (modality === "build") pointsEarned += 10;

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

        // Check achievements
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
            .innerJoin(lessons, eq(lessons.id, userProgress.lessonId))
            .where(
              and(
                eq(userProgress.userId, userId),
                eq(userProgress.isCompleted, true),
                sql`${lessons.id} NOT LIKE '%-opt'`,
              ),
            );

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

        // Registrar Errores (Mistakes Tracking)
        if (failedExerciseIds.length > 0) {
          const uniqueFailedIds = Array.from(new Set(failedExerciseIds));
          const existingMistakes = await trx
            .select()
            .from(userMistakes)
            .where(
              and(
                eq(userMistakes.userId, userId),
                inArray(userMistakes.exerciseId, uniqueFailedIds),
              ),
            );

          const existingIdsMap = new Map(existingMistakes.map((m) => [m.exerciseId, m]));

          const toInsert = [];
          for (const exId of uniqueFailedIds) {
            const existing = existingIdsMap.get(exId);
            if (existing) {
              await trx
                .update(userMistakes)
                .set({
                  mistakeCount: existing.mistakeCount + 1,
                  lastMistakeAt: new Date(),
                })
                .where(eq(userMistakes.id, existing.id));
            } else {
              toInsert.push({
                userId,
                exerciseId: exId,
                mistakeCount: 1,
                lastMistakeAt: new Date(),
              });
            }
          }

          if (toInsert.length > 0) {
            await trx.insert(userMistakes).values(toInsert);
          }
        }

        return Result.ok({
          pointsEarned,
          newPoints,
          newStreak,
          newLevel,
          accuracy: safeAccuracy,
          isPerfect,
          achievements: newAchievements,
        });
      });

      return result as unknown as Result<{
        pointsEarned: number;
        newPoints: number;
        newStreak: number;
        newLevel: number;
        accuracy: number;
        isPerfect: boolean;
        achievements: any[];
      }>;
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

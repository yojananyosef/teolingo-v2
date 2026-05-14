import { and, asc, count, eq, inArray, lte, sql } from "drizzle-orm";
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
  userProgress,
  users,
} from "@/infrastructure/database/schema";
import { calculateNextReview } from "../srs-logic";
import { normalizePercent } from "./shared";


export class CompleteLessonUseCase {
  async execute(
    userId: string,
    lessonId: string,
    accuracy = 100,
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
        // 1. Get lesson
        const [lesson] = await trx.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
        if (!lesson)
          return Result.fail(new DomainError("Lección no encontrada", "LESSON_NOT_FOUND"));

        // 2. Get user
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData)
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        // 3. Mark as completed ONLY if passed
        const [existingProgress] = await trx
          .select()
          .from(userProgress)
          .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
          .limit(1);

        let isFirstTime = false;
        if (isPassed) {
          if (!existingProgress) {
            isFirstTime = true;
            await trx.insert(userProgress).values({
              userId,
              lessonId,
              isCompleted: true,
              accuracy: safeAccuracy,
              isPerfect,
              completedAt: new Date(),
            });
          } else {
            // Update if accuracy is higher
            const shouldUpdate =
              !existingProgress.isCompleted || safeAccuracy > (existingProgress.accuracy ?? 0);

            if (shouldUpdate) {
              if (!existingProgress.isCompleted) isFirstTime = true;

              await trx
                .update(userProgress)
                .set({
                  isCompleted: true,
                  accuracy: Math.max(safeAccuracy, existingProgress.accuracy ?? 0),
                  isPerfect: isPerfect || !!existingProgress.isPerfect,
                  completedAt: new Date(),
                })
                .where(eq(userProgress.id, existingProgress.id));
            }
          }
        }

        // 4. Update user points, level, and streak
        // If not passed, points earned is 0. If perfect, bonus points.
        let pointsEarned = 0;
        if (isPassed) {
          const basePoints = isFirstTime ? lesson.xpReward : 5;
          const accuracyMultiplier = safeAccuracy / 100;
          pointsEarned = Math.round(basePoints * accuracyMultiplier);

          // Bonus for perfect score
          if (isPerfect && isFirstTime) {
            pointsEarned += 10;
          }
        }

        const newPoints = userData.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 100) + 1;

        // Streak logic (Only if passed)
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

        // 5. Check achievements (Only if passed)
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

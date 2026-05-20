import { DomainError, Result } from "@/domain/shared/result";
import { db } from "@/infrastructure/database/db";
import {
  achievements,
  alphabet,
  anchorTexts,
  exercises,
  flashcards,
  lessons,
  quizAssignments,
  quizAttempts,
  quizQuestions,
  quizzes,
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

export class CompleteLessonUseCase {
  async execute(
    userId: string,
    lessonId: string,
    accuracy = 100,
    failedExerciseIds: string[] = [],
    quizMeta?: {
      timeSpentSeconds?: number;
      timeLimitSeconds?: number;
      correctExerciseIds?: string[];
      timedOut?: boolean;
    },
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
      let isPassed = safeAccuracy >= 50;
      let isPerfect = safeAccuracy === 100;

      const result = await db.transaction(async (trx) => {
        // 1. Get user
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData)
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        let basePoints = 5;
        let isFirstTime = false;

        // 2 & 3. Handle Quiz vs Lesson
        if (lessonId.startsWith("quiz-")) {
          const quizId = lessonId.replace("quiz-", "");
          const [quiz] = await trx.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
          if (!quiz) return Result.fail(new DomainError("Quiz no encontrado", "LESSON_NOT_FOUND"));

          const timeLimitSeconds = Math.max(1, Math.round(quizMeta?.timeLimitSeconds ?? 300));
          const rawTimeSpent = quizMeta?.timeSpentSeconds ?? timeLimitSeconds;
          const timeSpentSeconds = Math.min(
            timeLimitSeconds,
            Math.max(0, Math.round(rawTimeSpent)),
          );
          const timedOut = Boolean(quizMeta?.timedOut);

          if (timedOut) {
            isPassed = false;
            isPerfect = false;
          }

          const quizExerciseRows = await trx
            .select({ exerciseId: quizQuestions.exerciseId })
            .from(quizQuestions)
            .where(eq(quizQuestions.quizId, quizId));
          const allowedExerciseIds = new Set(quizExerciseRows.map((row) => row.exerciseId));

          const normalizedFailed = Array.from(
            new Set(failedExerciseIds.filter((id) => allowedExerciseIds.has(id))),
          );
          const rawCorrect = quizMeta?.correctExerciseIds ?? [];
          const normalizedCorrectFromMeta = Array.from(
            new Set(
              rawCorrect.filter(
                (id) => allowedExerciseIds.has(id) && !normalizedFailed.includes(id),
              ),
            ),
          );
          const normalizedCorrect =
            normalizedCorrectFromMeta.length > 0
              ? normalizedCorrectFromMeta
              : Array.from(allowedExerciseIds).filter((id) => !normalizedFailed.includes(id));

          const existingAttempts = await trx
            .select({ id: quizAttempts.id, completedAt: quizAttempts.completedAt })
            .from(quizAttempts)
            .where(and(eq(quizAttempts.studentId, userId), eq(quizAttempts.quizId, quizId)))
            .orderBy(asc(quizAttempts.completedAt));

          const maxAttempts = 3;
          if (existingAttempts.length >= maxAttempts) {
            const keepCount = maxAttempts - 1;
            const deleteCount = Math.max(0, existingAttempts.length - keepCount);
            const deleteIds = existingAttempts.slice(0, deleteCount).map((attempt) => attempt.id);
            if (deleteIds.length > 0) {
              await trx.delete(quizAttempts).where(inArray(quizAttempts.id, deleteIds));
            }
          }

          const completedAt = new Date();
          const startedAt = new Date(completedAt.getTime() - timeSpentSeconds * 1000);

          await trx.insert(quizAttempts).values({
            quizId,
            studentId: userId,
            isPassed,
            score: safeAccuracy,
            timeLimitSeconds,
            timeSpentSeconds,
            timedOut,
            correctCount: normalizedCorrect.length,
            incorrectCount: normalizedFailed.length,
            correctExerciseIds: JSON.stringify(normalizedCorrect),
            incorrectExerciseIds: JSON.stringify(normalizedFailed),
            startedAt,
            completedAt,
          });

          basePoints = 100; // Recompensa base por un quiz
          const [existingAssignment] = await trx
            .select()
            .from(quizAssignments)
            .where(and(eq(quizAssignments.studentId, userId), eq(quizAssignments.quizId, quizId)))
            .limit(1);

          if (isPassed) {
            if (!existingAssignment) {
              isFirstTime = true;
              await trx.insert(quizAssignments).values({
                quizId,
                studentId: userId,
                isCompleted: true,
                score: safeAccuracy,
                completedAt: new Date(),
              });
            } else {
              const shouldUpdate =
                !existingAssignment.isCompleted || safeAccuracy > (existingAssignment.score ?? 0);
              if (shouldUpdate) {
                if (!existingAssignment.isCompleted) isFirstTime = true;
                await trx
                  .update(quizAssignments)
                  .set({
                    isCompleted: true,
                    score: Math.max(safeAccuracy, existingAssignment.score ?? 0),
                    completedAt: new Date(),
                  })
                  .where(eq(quizAssignments.id, existingAssignment.id));
              }
            }
          }
        } else {
          const [lesson] = await trx
            .select()
            .from(lessons)
            .where(eq(lessons.id, lessonId))
            .limit(1);
          if (!lesson)
            return Result.fail(new DomainError("Lección no encontrada", "LESSON_NOT_FOUND"));

          basePoints = lesson.xpReward;
          const [existingProgress] = await trx
            .select()
            .from(userProgress)
            .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
            .limit(1);

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
        }

        // 4. Update user points, level, and streak
        // If not passed, points earned is 0. If perfect, bonus points.
        let pointsEarned = 0;
        if (isPassed) {
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

        // 6. Registrar Errores (Mistakes Tracking)
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

// Why: Application Use Case for completing a lesson or quiz.
// Follows SRP, DIP (clean repositories), and DDD (domain entity and services).

import type {
  Achievement,
  ILessonRepository,
  IProgressRepository,
  IUserRepository,
} from "@/domain/lessons/repositories";
import type { AchievementService } from "@/domain/lessons/services/achievement.service";
import type { StreakService } from "@/domain/lessons/services/streak.service";
import { DomainError, Result } from "@/domain/shared/result";
import { db } from "@/infrastructure/database/db"; // Only used for SQLite transaction boundaries
import { normalizePercent } from "./shared";

export class CompleteLessonUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly lessonRepository: ILessonRepository,
    private readonly progressRepository: IProgressRepository,
    private readonly streakService: StreakService,
    private readonly achievementService: AchievementService,
  ) {}

  async execute(
    userId: string,
    lessonId: string,
    accuracy = 100,
    failedExerciseIds: string[] = [],
    quizMeta?: {
      quizId?: string;
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

      // Resolve quizId early (same logic as inside the transaction)
      const resolvedIsQuiz =
        lessonId.startsWith("quiz-") ||
        lessonId.startsWith("catedra-") ||
        Boolean(quizMeta?.quizId);

      if (resolvedIsQuiz) {
        const resolvedQuizId =
          quizMeta?.quizId ||
          (lessonId.startsWith("quiz-")
            ? lessonId.replace("quiz-", "")
            : lessonId.startsWith("catedra-lesson-")
              ? lessonId.replace("catedra-lesson-", "catedra-")
              : lessonId);

        // Must run OUTSIDE the transaction: seedCatedra uses PRAGMA foreign_keys = OFF/ON
        // which SQLite silently ignores inside an active transaction, leaving quiz rows
        // unseeded and causing a FOREIGN KEY constraint failure on quiz_attempts.
        try {
          await this.lessonRepository.ensureQuizExists(resolvedQuizId, userId);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(`[ensureQuizExists:${resolvedQuizId}] ${msg}`);
        }
      }

      const result = await db.transaction(async (trx) => {
        // 1. Get user from repository
        const user = await this.userRepository.findById(userId, trx);
        if (!user) {
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));
        }

        let basePoints = 5;
        let isFirstTime = false;

        // 2 & 3. Handle Quiz vs Lesson
        const isQuiz =
          lessonId.startsWith("quiz-") ||
          lessonId.startsWith("catedra-") ||
          Boolean(quizMeta?.quizId);

        if (isQuiz) {
          const quizId =
            quizMeta?.quizId ||
            (lessonId.startsWith("quiz-")
              ? lessonId.replace("quiz-", "")
              : lessonId.startsWith("catedra-lesson-")
                ? lessonId.replace("catedra-lesson-", "catedra-")
                : lessonId);

          let quiz = await this.lessonRepository.findQuizById(quizId, trx);
          if (!quiz && quizId.startsWith("catedra-")) {
            quiz = { id: quizId, allowedAttempts: 10 };
          }

          if (!quiz) {
            return Result.fail(new DomainError("Quiz no encontrado", "LESSON_NOT_FOUND"));
          }

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

          // Fetch valid exercise IDs from repository
          const allowedExerciseIds = await this.lessonRepository.getQuizExerciseIds(quizId, trx);

          const normalizedFailed = Array.from(
            new Set(
              allowedExerciseIds.size > 0
                ? failedExerciseIds.filter((id) => allowedExerciseIds.has(id))
                : failedExerciseIds,
            ),
          );
          const rawCorrectProvided =
            quizMeta?.correctExerciseIds && quizMeta.correctExerciseIds.length > 0;
          const rawCorrect = rawCorrectProvided
            ? (quizMeta?.correctExerciseIds as string[])
            : Array.from(allowedExerciseIds).filter((id) => !normalizedFailed.includes(id));
          const normalizedCorrect = Array.from(
            new Set(
              allowedExerciseIds.size > 0
                ? rawCorrect.filter(
                    (id) => allowedExerciseIds.has(id) && !normalizedFailed.includes(id),
                  )
                : rawCorrect,
            ),
          );

          // Retain max allowed attempts limit
          const attemptsCount = await this.progressRepository.getUserQuizAttemptsCount(
            userId,
            quizId,
            trx,
          );
          const maxAttempts = quiz.allowedAttempts ?? 3;
          if (attemptsCount >= maxAttempts) {
            const existingAttempts = await this.progressRepository.getOldestQuizAttempts(
              userId,
              quizId,
              trx,
            );
            const keepCount = maxAttempts - 1;
            const deleteCount = Math.max(0, existingAttempts.length - keepCount);
            const deleteIds = existingAttempts.slice(0, deleteCount).map((attempt) => attempt.id);
            if (deleteIds.length > 0) {
              await this.progressRepository.deleteQuizAttempts(deleteIds, trx);
            }
          }

          const completedAt = new Date();
          const startedAt = new Date(completedAt.getTime() - timeSpentSeconds * 1000);

          try {
            await this.progressRepository.saveQuizAttempt(
              {
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
              },
              trx,
            );
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            throw new Error(`[saveQuizAttempt:${quizId}] ${msg}`);
          }

          basePoints = 100; // Quiz Base Reward
          const existingAssignment = await this.progressRepository.findUserQuizAssignment(
            userId,
            quizId,
            trx,
          );

          if (isPassed) {
            try {
              if (!existingAssignment) {
                isFirstTime = true;
                await this.progressRepository.saveUserQuizAssignment(
                  {
                    userId,
                    quizId,
                    isCompleted: true,
                    score: safeAccuracy,
                    completedAt: new Date(),
                  },
                  trx,
                );
              } else {
                const shouldUpdate =
                  !existingAssignment.isCompleted || safeAccuracy > existingAssignment.score;
                if (shouldUpdate) {
                  if (!existingAssignment.isCompleted) isFirstTime = true;
                  await this.progressRepository.updateUserQuizAssignment(
                    existingAssignment.id,
                    {
                      isCompleted: true,
                      score: Math.max(safeAccuracy, existingAssignment.score),
                      completedAt: new Date(),
                    },
                    trx,
                  );
                }
              }
            } catch (e: unknown) {
              const msg = e instanceof Error ? e.message : String(e);
              throw new Error(`[quizAssignment:${quizId}] ${msg}`);
            }
          }
        } else {
          const lesson = await this.lessonRepository.findLessonById(lessonId, trx);
          if (!lesson) {
            return Result.fail(new DomainError("Lección no encontrada", "LESSON_NOT_FOUND"));
          }

          basePoints = lesson.xpReward;
          const existingProgress = await this.progressRepository.findUserLessonProgress(
            userId,
            lessonId,
            trx,
          );

          if (isPassed) {
            if (!existingProgress) {
              isFirstTime = true;
              await this.progressRepository.saveUserLessonProgress(
                {
                  userId,
                  lessonId,
                  isCompleted: true,
                  accuracy: safeAccuracy,
                  isPerfect,
                  completedAt: new Date(),
                },
                trx,
              );
            } else {
              const shouldUpdate =
                !existingProgress.isCompleted || safeAccuracy > existingProgress.accuracy;

              if (shouldUpdate) {
                if (!existingProgress.isCompleted) isFirstTime = true;
                await this.progressRepository.updateUserLessonProgress(
                  existingProgress.id,
                  {
                    isCompleted: true,
                    accuracy: Math.max(safeAccuracy, existingProgress.accuracy),
                    isPerfect: isPerfect || existingProgress.isPerfect,
                    completedAt: new Date(),
                  },
                  trx,
                );
              }
            }
          }
        }

        // 4. Calculate point rewards
        let pointsEarned = 0;
        if (isPassed) {
          const accuracyMultiplier = safeAccuracy / 100;
          pointsEarned = Math.round(basePoints * accuracyMultiplier);

          // Perfect score first time bonus
          if (isPerfect && isFirstTime) {
            pointsEarned += 10;
          }
        }

        // Update user properties via Domain Entity & Service
        user.addPoints(pointsEarned);
        this.streakService.processActivityStreak(user, isPassed);

        // Persist user properties
        try {
          await this.userRepository.update(user, trx);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(`[updateUser:${userId}] ${msg}`);
        }

        // 5. Evaluate achievements via Domain Service
        const snap = user.toSnapshot();
        let unlockedAchievements: Achievement[] = [];
        try {
          unlockedAchievements = await this.achievementService.evaluateAchievements(
            userId,
            snap.points,
            snap.streak,
            isPassed,
            trx,
          );
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(`[evaluateAchievements:${userId}] ${msg}`);
        }

        // 6. Record mistakes via User Repository
        if (failedExerciseIds.length > 0) {
          try {
            await this.userRepository.insertMistakes(userId, failedExerciseIds, trx);
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            throw new Error(`[insertMistakes:${failedExerciseIds.length}] ${msg}`);
          }
        }

        return Result.ok({
          pointsEarned,
          newPoints: snap.points,
          newStreak: snap.streak,
          newLevel: snap.level,
          accuracy: safeAccuracy,
          isPerfect,
          achievements: unlockedAchievements,
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

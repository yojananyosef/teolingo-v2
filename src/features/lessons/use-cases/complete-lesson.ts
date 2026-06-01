// Why: Application Use Case for completing a lesson or quiz.
// Follows SRP, DIP (clean repositories), and DDD (domain entity and services).

import type {
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
        // 1. Get user from repository
        const user = await this.userRepository.findById(userId, trx);
        if (!user) {
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));
        }

        let basePoints = 5;
        let isFirstTime = false;

        // 2 & 3. Handle Quiz vs Lesson
        if (lessonId.startsWith("quiz-")) {
          const quizId = lessonId.replace("quiz-", "");
          const quiz = await this.lessonRepository.findQuizById(quizId, trx);
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

          basePoints = 100; // Quiz Base Reward
          const existingAssignment = await this.progressRepository.findUserQuizAssignment(
            userId,
            quizId,
            trx,
          );

          if (isPassed) {
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
        await this.userRepository.update(user, trx);

        // 5. Evaluate achievements via Domain Service
        const snap = user.toSnapshot();
        const unlockedAchievements = await this.achievementService.evaluateAchievements(
          userId,
          snap.points,
          snap.streak,
          isPassed,
          trx,
        );

        // 6. Record mistakes via User Repository
        if (failedExerciseIds.length > 0) {
          await this.userRepository.insertMistakes(userId, failedExerciseIds, trx);
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

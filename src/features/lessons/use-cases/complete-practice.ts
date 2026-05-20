// Why: Application Use Case for completing a practice session.
// Follows SRP, DIP (clean repositories), and DDD (domain entity and services).

import type { IProgressRepository, IUserRepository } from "@/domain/lessons/repositories";
import type { AchievementService } from "@/domain/lessons/services/achievement.service";
import type { StreakService } from "@/domain/lessons/services/streak.service";
import { DomainError, Result } from "@/domain/shared/result";
import { db } from "@/infrastructure/database/db"; // Only used for SQLite transaction boundaries
import { normalizePercent } from "./shared";

export class CompletePracticeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly progressRepository: IProgressRepository,
    private readonly streakService: StreakService,
    private readonly achievementService: AchievementService,
  ) {}

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
        // 1. Get user from repository
        const user = await this.userRepository.findById(userId, trx);
        if (!user) {
          return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));
        }

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

        // Update user properties via Domain Entity & Service
        user.addPoints(pointsEarned);
        this.streakService.processActivityStreak(user, isPassed);

        // Persist user properties
        await this.userRepository.update(user, trx);

        // 2. Evaluate achievements via Domain Service
        const snap = user.toSnapshot();
        const unlockedAchievements = await this.achievementService.evaluateAchievements(
          userId,
          snap.points,
          snap.streak,
          isPassed,
          trx,
        );

        // 3. Record mistakes via User Repository
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

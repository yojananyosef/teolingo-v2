import { eq, sql } from "drizzle-orm";
import { DomainError, Result } from "../../domain/shared/result";
import { db } from "../../infrastructure/database/db";
import {
  achievements,
  userAchievements,
  userProgress,
  users,
} from "../../infrastructure/database/schema";

// Why: Application layer logic for fetching user profile details and stats.
export class GetProfileUseCase {
  async execute(userId: string): Promise<Result<any>> {
    try {
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          displayName: users.displayName,
          points: users.points,
          level: users.level,
          streak: users.streak,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

      const [progressCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userProgress)
        .where(eq(userProgress.userId, userId));

      const unlockedAchievements = await db
        .select({
          id: achievements.id,
          name: achievements.name,
          icon: achievements.icon,
          unlockedAt: userAchievements.unlockedAt,
        })
        .from(userAchievements)
        .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
        .where(eq(userAchievements.userId, userId));

      return Result.ok({
        ...user,
        lessonsCompleted: progressCount.count,
        achievements: unlockedAchievements,
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

// Why: Application layer logic for updating user profile settings.
export class UpdateProfileUseCase {
  async execute(
    userId: string,
    data: { displayName?: string; email?: string },
  ): Promise<Result<any>> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      return Result.ok(updatedUser);
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

// Why: Application layer logic for deleting a user account.
export class DeleteAccountUseCase {
  async execute(userId: string): Promise<Result<void>> {
    try {
      await db.delete(users).where(eq(users.id, userId));
      return Result.ok(undefined);
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

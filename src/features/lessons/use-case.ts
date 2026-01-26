import { db } from "../../infrastructure/database/db";
import { lessons, exercises, userProgress, users, achievements, userAchievements } from "../../infrastructure/database/schema";
import { eq, and, inArray, sql, count } from "drizzle-orm";
import { Result, DomainError } from "../../domain/shared/result";

// Why: Application layer logic for lesson completion and practice.
export class CompleteLessonUseCase {
  async execute(userId: string, lessonId: string): Promise<Result<{
    pointsEarned: number;
    streak: number;
    level: number;
    newAchievements: any[];
    isLevelUp: boolean;
  }>> {
    try {
      const result = await db.transaction(async (trx) => {
        // 1. Get lesson
        const [lesson] = await trx.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
        if (!lesson) return Result.fail(new DomainError("Lección no encontrada", "LESSON_NOT_FOUND"));

        // 2. Get user
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData) return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        // 3. Mark as completed
        const [existingProgress] = await trx
          .select()
          .from(userProgress)
          .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
          .limit(1);

        let isFirstTime = false;
        if (!existingProgress) {
          isFirstTime = true;
          await trx.insert(userProgress).values({
            userId,
            lessonId,
            isCompleted: true,
            completedAt: new Date(),
          });
        } else if (!existingProgress.isCompleted) {
          isFirstTime = true;
          await trx
            .update(userProgress)
            .set({ isCompleted: true, completedAt: new Date() })
            .where(eq(userProgress.id, existingProgress.id));
        }

        // 4. Update user points, level, and streak
        const pointsEarned = isFirstTime ? lesson.xpReward : 5; // Reduced reward if already completed
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
          const lastDate = new Date(lastStreakDate.getFullYear(), lastStreakDate.getMonth(), lastStreakDate.getDate());
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

        // 5. Check achievements (Simplified)
        const newAchievements: any[] = [];
        const allAchievements = await trx.select().from(achievements);
        const userAchs = await trx.select().from(userAchievements).where(eq(userAchievements.userId, userId));
        const unlockedIds = new Set(userAchs.map(ua => ua.achievementId));

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
          streak: newStreak,
          level: newLevel,
          newAchievements,
          isLevelUp: newLevel > userData.level,
        });
      });

      return result as Result<{
        pointsEarned: number;
        streak: number;
        level: number;
        newAchievements: any[];
        isLevelUp: boolean;
      }>;
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class CompletePracticeUseCase {
  async execute(userId: string): Promise<Result<{
    pointsEarned: number;
    streak: number;
    level: number;
    newAchievements: any[];
    isLevelUp: boolean;
  }>> {
    try {
      const result = await db.transaction(async (trx) => {
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData) return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        const pointsEarned = 15;
        const newPoints = userData.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 100) + 1;

        // Streak logic (Same as above)
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let newStreak = userData.streak;
        let lastStreakDate = userData.lastStreakDate;

        if (!lastStreakDate) {
          newStreak = 1;
          lastStreakDate = today;
        } else {
          const lastDate = new Date(lastStreakDate.getFullYear(), lastStreakDate.getMonth(), lastStreakDate.getDate());
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

        // Check achievements
        const newAchievements: any[] = [];
        const allAchievements = await trx.select().from(achievements);
        const userAchs = await trx.select().from(userAchievements).where(eq(userAchievements.userId, userId));
        const unlockedIds = new Set(userAchs.map(ua => ua.achievementId));

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
          streak: newStreak,
          level: newLevel,
          newAchievements,
          isLevelUp: newLevel > userData.level,
        });
      });

      return result as Result<{
        pointsEarned: number;
        streak: number;
        level: number;
        newAchievements: any[];
        isLevelUp: boolean;
      }>;
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class GetLessonsUseCase {
  async execute(userId?: string): Promise<Result<any[]>> {
    try {
      if (!userId) {
        const results = await db.select().from(lessons).orderBy(lessons.order);
        return Result.ok(results);
      }

      const results = await db
        .select({
          id: lessons.id,
          title: lessons.title,
          description: lessons.description,
          order: lessons.order,
          xpReward: lessons.xpReward,
          isCompleted: userProgress.isCompleted,
        })
        .from(lessons)
        .leftJoin(
          userProgress,
          and(
            eq(userProgress.lessonId, lessons.id),
            eq(userProgress.userId, userId)
          )
        )
        .orderBy(lessons.order);

      const mappedResults = results.map((r) => ({
        ...r,
        isCompleted: !!r.isCompleted
      }));

      return Result.ok(mappedResults);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class GetLessonWithExercisesUseCase {
  async execute(lessonId: string): Promise<Result<any>> {
    try {
      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
      if (!lesson) return Result.fail(new DomainError("Lección no encontrada", "LESSON_NOT_FOUND"));

      const lessonExercises = await db
        .select()
        .from(exercises)
        .where(eq(exercises.lessonId, lessonId))
        .orderBy(exercises.order);

      return Result.ok({
        ...lesson,
        exercises: lessonExercises.map(ex => ({
          ...ex,
          options: ex.options ? JSON.parse(ex.options) : []
        }))
      });
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class GetPracticeExercisesUseCase {
  async execute(userId: string): Promise<Result<any>> {
    try {
      // Get completed lessons for this user
      const completed = await db
        .select({ lessonId: userProgress.lessonId })
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)));

      let lessonIds = completed.map(c => c.lessonId);
      
      // If no lessons completed, take exercises from first 3 lessons
      if (lessonIds.length === 0) {
        const firstLessons = await db.select({ id: lessons.id }).from(lessons).orderBy(lessons.order).limit(3);
        lessonIds = firstLessons.map(l => l.id);
      }

      const practiceExercises = await db
        .select()
        .from(exercises)
        .where(inArray(exercises.lessonId, lessonIds))
        .orderBy(sql`RANDOM()`)
        .limit(10);

      return Result.ok({
        id: "practice",
        title: "Práctica Diaria",
        exercises: practiceExercises.map(ex => ({
          ...ex,
          options: ex.options ? JSON.parse(ex.options) : []
        }))
      });
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class GetVocabularyUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db
        .select({
          hebrew: exercises.hebrewText,
          spanish: exercises.correctAnswer,
        })
        .from(exercises)
        .where(and(
          eq(exercises.type, "translation"),
          sql`${exercises.hebrewText} IS NOT NULL`
        ));

      // Filter unique by hebrew text
      const unique = Array.from(new Map(results.map(item => [item.hebrew, item])).values());
      
      return Result.ok(unique);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

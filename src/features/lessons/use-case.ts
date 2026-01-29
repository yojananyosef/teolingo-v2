import { db } from "../../infrastructure/database/db";
import { lessons, exercises, userProgress, users, achievements, userAchievements, anchorTexts, alphabet, rhythmParadigms } from "../../infrastructure/database/schema";
import { eq, and, inArray, sql, count, asc } from "drizzle-orm";
import { Result, DomainError } from "../../domain/shared/result";

// Why: Application layer logic for lesson completion and practice.
export class CompleteLessonUseCase {
  async execute(userId: string, lessonId: string, accuracy: number = 100): Promise<Result<{
    pointsEarned: number;
    newPoints: number;
    newStreak: number;
    newLevel: number;
    accuracy: number;
    isPerfect: boolean;
    achievements: any[];
  }>> {
    try {
      const isPassed = accuracy >= 50;
      const isPerfect = accuracy === 100;

      const result = await db.transaction(async (trx) => {
        // 1. Get lesson
        const [lesson] = await trx.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
        if (!lesson) return Result.fail(new DomainError("Lección no encontrada", "LESSON_NOT_FOUND"));

        // 2. Get user
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData) return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

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
              accuracy,
              isPerfect,
              completedAt: new Date(),
            });
          } else {
            // Update if accuracy is higher
            const shouldUpdate = !existingProgress.isCompleted || accuracy > (existingProgress.accuracy ?? 0);

            if (shouldUpdate) {
              if (!existingProgress.isCompleted) isFirstTime = true;

              await trx
                .update(userProgress)
                .set({
                  isCompleted: true,
                  accuracy: Math.max(accuracy, existingProgress.accuracy ?? 0),
                  isPerfect: isPerfect || !!existingProgress.isPerfect,
                  completedAt: new Date()
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
          const accuracyMultiplier = accuracy / 100;
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
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class CompletePracticeUseCase {
  async execute(userId: string, accuracy: number = 100, modality?: "rhythm" | "blurting" | "air-writing" | "build"): Promise<Result<{
    pointsEarned: number;
    newPoints: number;
    newStreak: number;
    newLevel: number;
    accuracy: number;
    isPerfect: boolean;
    achievements: any[];
  }>> {
    try {
      const isPassed = accuracy >= 50;
      const isPerfect = accuracy === 100;

      const result = await db.transaction(async (trx) => {
        const [userData] = await trx.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!userData) return Result.fail(new DomainError("Usuario no encontrado", "USER_NOT_FOUND"));

        // Base points for practice
        let pointsEarned = 0;
        if (isPassed) {
          pointsEarned = Math.round(15 * (accuracy / 100));
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
          accuracy: userProgress.accuracy,
          isPerfect: userProgress.isPerfect,
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
        isCompleted: !!r.isCompleted,
        accuracy: r.accuracy ?? 0,
        isPerfect: !!r.isPerfect
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
  async execute(userId: string, mode: "quick" | "intense" = "quick"): Promise<Result<any>> {
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

      let practiceExercises;

      if (mode === "intense") {
        // Intense mode: Prioritize exercises where the user had lower accuracy in the past
        // For now, since we don't track exercise-level accuracy, we take exercises from
        // lessons where user had < 80% accuracy OR just more exercises (15 instead of 10)
        practiceExercises = await db
          .select()
          .from(exercises)
          .where(inArray(exercises.lessonId, lessonIds))
          .orderBy(sql`RANDOM()`)
          .limit(15);
      } else {
        // Quick mode: Just 5 random exercises from today/recent lessons
        practiceExercises = await db
          .select()
          .from(exercises)
          .where(inArray(exercises.lessonId, lessonIds))
          .orderBy(sql`RANDOM()`)
          .limit(5);
      }

      return Result.ok({
        id: "practice",
        title: mode === "intense" ? "Modo Intenso" : "Repaso Rápido",
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
  async execute(userId: string): Promise<Result<any[]>> {
    try {
      // Get completed lessons for this user to only show "discovered" vocabulary
      const completed = await db
        .select({ lessonId: userProgress.lessonId })
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)));

      const lessonIds = completed.map(c => c.lessonId);

      if (lessonIds.length === 0) {
        return Result.ok([]);
      }

      const results = await db
        .select({
          hebrew: exercises.hebrewText,
          spanish: exercises.correctAnswer,
          question: exercises.question,
        })
        .from(exercises)
        .where(and(
          inArray(exercises.lessonId, lessonIds),
          eq(exercises.type, "translation"),
          sql`${exercises.hebrewText} IS NOT NULL`
        ));

      // Map results to extract the real meaning and transliteration
      const mappedResults = results.map(res => {
        let meaning = res.spanish;
        let transliteration = "";
        const question = res.question || "";

        // Case 1: "¿Cómo se dice 'Padre' en hebreo?"
        // meaning = "Padre", transliteration = correctAnswer ("Ab")
        if (question.includes("¿Cómo se dice '")) {
          const match = question.match(/¿Cómo se dice '([^']+)'/);
          if (match && match[1]) {
            meaning = match[1];
            transliteration = res.spanish; // The correctAnswer is the transliteration
          }
        }
        // Case 2: "¿Qué significa 'Eretz'?" or "¿Qué significa 'Amar' (אָמַר)?"
        // meaning = correctAnswer ("Tierra"), transliteration = "Eretz"
        else if (question.includes("¿Qué significa '")) {
          const match = question.match(/¿Qué significa '([^']+)'/);
          if (match && match[1]) {
            transliteration = match[1];
            meaning = res.spanish; // The correctAnswer is the meaning
          }
        }

        // Clean transliteration: remove parentheses if any (like "Amar (אָמַר)" -> "Amar")
        if (transliteration) {
          transliteration = transliteration.split('(')[0].trim();
          // Ensure first letter is capitalized
          transliteration = transliteration.charAt(0).toUpperCase() + transliteration.slice(1);
        }

        return {
          hebrew: res.hebrew!,
          spanish: meaning.toUpperCase(),
          transliteration: transliteration
        };
      });

      // Filter unique by hebrew text
      const vocabularyMap = new Map<string, { spanish: string; transliteration: string }>();

      for (const item of mappedResults) {
        const existing = vocabularyMap.get(item.hebrew);

        if (!existing) {
          vocabularyMap.set(item.hebrew, { spanish: item.spanish, transliteration: item.transliteration });
        } else {
          // If we have multiple, prefer the one that has a transliteration if the current one doesn't
          if (!existing.transliteration && item.transliteration) {
            vocabularyMap.set(item.hebrew, { spanish: item.spanish, transliteration: item.transliteration });
          }
        }
      }

      const finalVocabulary = Array.from(vocabularyMap.entries()).map(([hebrew, data]) => ({
        hebrew,
        spanish: data.spanish,
        transliteration: data.transliteration
      }));

      return Result.ok(finalVocabulary);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class ListAnchorTextsUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db.select().from(anchorTexts).orderBy(asc(anchorTexts.order));
      return Result.ok(results);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class GetAlphabetUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db.select().from(alphabet).orderBy(alphabet.order);
      return Result.ok(results);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

export class GetRhythmParadigmsUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db.select().from(rhythmParadigms).orderBy(rhythmParadigms.order);
      const mapped = results.map(r => ({
        ...r,
        forms: JSON.parse(r.forms)
      }));
      return Result.ok(mapped);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}

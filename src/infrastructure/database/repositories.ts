// Why: Concrete Drizzle ORM implementation of domain repositories.
// Connects to Turso/SQLite database.

import { User } from "@/domain/lessons/entities/user.entity";
import type {
  Achievement,
  ILessonRepository,
  IProgressRepository,
  IUserRepository,
  LessonData,
  QuizAttemptInput,
  QuizData,
  UserLessonProgress,
  UserQuizAssignment,
} from "@/domain/lessons/repositories";
import { and, asc, count, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import {
  achievements,
  exercises,
  lessons,
  quizAssignments,
  quizAttempts,
  quizQuestions,
  quizzes,
  userAchievements,
  userMistakes,
  userProgress,
  users,
} from "./schema";

export class DrizzleUserRepository implements IUserRepository {
  async findById(userId: string, tx = db): Promise<User | null> {
    const [userData] = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!userData) return null;
    return User.create({
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
      points: userData.points,
      level: userData.level,
      streak: userData.streak,
      lastStreakDate: userData.lastStreakDate,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  }

  async update(user: User, tx = db): Promise<void> {
    const snap = user.toSnapshot();
    await tx
      .update(users)
      .set({
        points: snap.points,
        level: snap.level,
        streak: snap.streak,
        lastStreakDate: snap.lastStreakDate,
        updatedAt: snap.updatedAt,
      })
      .where(eq(users.id, snap.id));
  }

  async insertMistakes(userId: string, exerciseIds: string[], tx = db): Promise<void> {
    if (exerciseIds.length === 0) return;

    const uniqueFailedIds = Array.from(new Set(exerciseIds));

    // Verify which exercise IDs actually exist in the exercises table to prevent foreign key constraint failures
    const validExercises = await tx
      .select({ id: exercises.id })
      .from(exercises)
      .where(inArray(exercises.id, uniqueFailedIds));

    const validExerciseIds = new Set(validExercises.map((e) => e.id));
    const filteredFailedIds = uniqueFailedIds.filter((id) => validExerciseIds.has(id));

    if (filteredFailedIds.length === 0) return;

    const existingMistakes = await tx
      .select()
      .from(userMistakes)
      .where(
        and(eq(userMistakes.userId, userId), inArray(userMistakes.exerciseId, filteredFailedIds)),
      );

    const existingIdsMap = new Map(existingMistakes.map((m) => [m.exerciseId, m]));

    const toInsert = [];
    for (const exId of filteredFailedIds) {
      const existing = existingIdsMap.get(exId);
      if (existing) {
        await tx
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
      await tx.insert(userMistakes).values(toInsert);
    }
  }
}

export class DrizzleLessonRepository implements ILessonRepository {
  async findLessonById(lessonId: string, tx = db): Promise<LessonData | null> {
    const [lesson] = await tx.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    if (!lesson) return null;
    return {
      id: lesson.id,
      title: lesson.title,
      xpReward: lesson.xpReward,
    };
  }

  async findQuizById(quizId: string, tx = db): Promise<QuizData | null> {
    const [quiz] = await tx.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
    if (!quiz) {
      if (quizId.startsWith("catedra-")) {
        return { id: quizId, allowedAttempts: 10 };
      }
      return null;
    }
    return { id: quiz.id, allowedAttempts: quiz.allowedAttempts };
  }

  async ensureQuizExists(quizId: string, fallbackUserId?: string, tx = db): Promise<void> {
    if (quizId.startsWith("catedra-")) {
      const { ensureCatedraSeeded } = await import("./seed-catedra");
      await ensureCatedraSeeded(tx);
    }
  }

  async getQuizExerciseIds(quizId: string, tx = db): Promise<Set<string>> {
    const rows = await tx
      .select({ exerciseId: quizQuestions.exerciseId })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    if (rows.length === 0 && quizId.startsWith("catedra-")) {
      const catedraExercises = await tx
        .select({ id: exercises.id })
        .from(exercises)
        .where(eq(exercises.lessonId, "catedra-lesson-semana-1"));
      return new Set(catedraExercises.map((r) => r.id));
    }

    return new Set(rows.map((row) => row.exerciseId));
  }
}

export class DrizzleProgressRepository implements IProgressRepository {
  async findUserLessonProgress(
    userId: string,
    lessonId: string,
    tx = db,
  ): Promise<UserLessonProgress | null> {
    const [row] = await tx
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      isCompleted: row.isCompleted,
      accuracy: row.accuracy,
      isPerfect: row.isPerfect,
    };
  }

  async saveUserLessonProgress(
    progress: {
      userId: string;
      lessonId: string;
      isCompleted: boolean;
      accuracy: number;
      isPerfect: boolean;
      completedAt: Date;
    },
    tx = db,
  ): Promise<void> {
    await tx.insert(userProgress).values(progress);
  }

  async updateUserLessonProgress(
    id: string,
    progress: { isCompleted: boolean; accuracy: number; isPerfect: boolean; completedAt: Date },
    tx = db,
  ): Promise<void> {
    await tx.update(userProgress).set(progress).where(eq(userProgress.id, id));
  }

  async findUserQuizAssignment(
    userId: string,
    quizId: string,
    tx = db,
  ): Promise<UserQuizAssignment | null> {
    const [row] = await tx
      .select()
      .from(quizAssignments)
      .where(and(eq(quizAssignments.studentId, userId), eq(quizAssignments.quizId, quizId)))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      isCompleted: row.isCompleted,
      score: row.score ?? 0,
    };
  }

  async saveUserQuizAssignment(
    assignment: {
      userId: string;
      quizId: string;
      isCompleted: boolean;
      score: number;
      completedAt: Date;
    },
    tx = db,
  ): Promise<void> {
    await tx.insert(quizAssignments).values({
      studentId: assignment.userId,
      quizId: assignment.quizId,
      isCompleted: assignment.isCompleted,
      score: assignment.score,
      completedAt: assignment.completedAt,
    });
  }

  async updateUserQuizAssignment(
    id: string,
    assignment: { isCompleted: boolean; score: number; completedAt: Date },
    tx = db,
  ): Promise<void> {
    await tx
      .update(quizAssignments)
      .set({
        isCompleted: assignment.isCompleted,
        score: assignment.score,
        completedAt: assignment.completedAt,
      })
      .where(eq(quizAssignments.id, id));
  }

  async getUserQuizAttemptsCount(userId: string, quizId: string, tx = db): Promise<number> {
    const [row] = await tx
      .select({ value: count() })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.studentId, userId), eq(quizAttempts.quizId, quizId)));
    return row.value;
  }

  async getOldestQuizAttempts(userId: string, quizId: string, tx = db): Promise<{ id: string }[]> {
    return tx
      .select({ id: quizAttempts.id })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.studentId, userId), eq(quizAttempts.quizId, quizId)))
      .orderBy(asc(quizAttempts.completedAt));
  }

  async deleteQuizAttempts(ids: string[], tx = db): Promise<void> {
    await tx.delete(quizAttempts).where(inArray(quizAttempts.id, ids));
  }

  async saveQuizAttempt(attempt: QuizAttemptInput, tx = db): Promise<void> {
    await tx.insert(quizAttempts).values(attempt);
  }

  async countCompletedLessons(userId: string, tx = db): Promise<number> {
    const [countResult] = await tx
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
    return countResult.value;
  }

  async getAllAchievements(tx = db): Promise<Achievement[]> {
    return tx.select().from(achievements);
  }

  async getUserAchievements(userId: string, tx = db): Promise<string[]> {
    const rows = await tx
      .select({ achievementId: userAchievements.achievementId })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    return rows.map((r) => r.achievementId);
  }

  async saveUserAchievement(userId: string, achievementId: string, tx = db): Promise<void> {
    await tx.insert(userAchievements).values({
      userId,
      achievementId,
      unlockedAt: new Date(),
    });
  }
}

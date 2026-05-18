import type { Exercise } from "@/domain/lessons/exercise";
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
import { and, asc, count, eq, inArray, lte, sql } from "drizzle-orm";
import { calculateNextReview } from "../srs-logic";

export interface LessonWithExercises {
  id: string;
  title: string;
  description?: string | null;
  order?: number;
  xpReward?: number;
  exercises: Exercise[];
}

export class GetLessonWithExercisesUseCase {
  async execute(lessonId: string): Promise<Result<LessonWithExercises>> {
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
        exercises: lessonExercises.map((ex) => ({
          ...ex,
          options: ex.options ? JSON.parse(ex.options) : [],
        })) as Exercise[],
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

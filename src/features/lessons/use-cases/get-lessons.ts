import { and, eq } from "drizzle-orm";
import { DomainError, Result } from "@/domain/shared/result";
import { db } from "@/infrastructure/database/db";
import { lessons, userProgress } from "@/infrastructure/database/schema";

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
          moduleIndex: lessons.moduleIndex,
          xpReward: lessons.xpReward,
          isCompleted: userProgress.isCompleted,
          accuracy: userProgress.accuracy,
          isPerfect: userProgress.isPerfect,
        })
        .from(lessons)
        .leftJoin(
          userProgress,
          and(eq(userProgress.lessonId, lessons.id), eq(userProgress.userId, userId)),
        )
        .orderBy(lessons.order);

      const mappedResults = results.map((r) => ({
        ...r,
        isCompleted: !!r.isCompleted,
        accuracy: r.accuracy ?? 0,
        isPerfect: !!r.isPerfect,
        moduleIndex: r.moduleIndex ?? 1,
      }));

      return Result.ok(mappedResults);
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

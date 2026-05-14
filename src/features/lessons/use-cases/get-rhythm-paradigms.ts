import { and, asc, count, eq, inArray, lte, sql } from "drizzle-orm";
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
import { calculateNextReview } from "../srs-logic";

export class GetRhythmParadigmsUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db.select().from(rhythmParadigms).orderBy(rhythmParadigms.order);
      const mapped = results.map((r) => ({
        ...r,
        forms: JSON.parse(r.forms),
      }));
      return Result.ok(mapped);
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

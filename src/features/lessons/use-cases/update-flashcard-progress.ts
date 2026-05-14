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
import { normalizeQuality } from "./shared";


export class UpdateFlashcardProgressUseCase {
  async execute(userId: string, flashcardId: string, quality: number): Promise<Result<void>> {
    try {
      const safeQuality = normalizeQuality(quality);

      await db.transaction(async (trx) => {
        const [existing] = await trx
          .select()
          .from(userFlashcardProgress)
          .where(
            and(
              eq(userFlashcardProgress.userId, userId),
              eq(userFlashcardProgress.flashcardId, flashcardId),
            ),
          )
          .limit(1);

        const srsUpdate = calculateNextReview(
          safeQuality,
          existing?.interval ?? 0,
          existing?.easeFactor ?? 250,
          existing?.repetitionCount ?? 0,
        );

        if (existing) {
          await trx
            .update(userFlashcardProgress)
            .set({
              nextReview: srsUpdate.nextReview,
              interval: srsUpdate.interval,
              easeFactor: srsUpdate.easeFactor,
              repetitionCount: srsUpdate.repetitionCount,
              lastQuality: safeQuality,
              updatedAt: new Date(),
            })
            .where(eq(userFlashcardProgress.id, existing.id));
        } else {
          await trx.insert(userFlashcardProgress).values({
            userId,
            flashcardId,
            nextReview: srsUpdate.nextReview,
            interval: srsUpdate.interval,
            easeFactor: srsUpdate.easeFactor,
            repetitionCount: srsUpdate.repetitionCount,
            lastQuality: safeQuality,
          });
        }
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : "Error al actualizar progreso",
          "INTERNAL_ERROR",
        ),
      );
    }
  }
}

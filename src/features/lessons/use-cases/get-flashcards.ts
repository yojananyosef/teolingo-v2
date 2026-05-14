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

export class GetFlashcardsUseCase {
  async execute(userId: string): Promise<Result<any[]>> {
    try {
      const now = new Date();

      // 1. Obtener flashcards que necesitan revisión (DUE)
      const dueFlashcards = await db
        .select({
          flashcard: flashcards,
          progress: userFlashcardProgress,
        })
        .from(flashcards)
        .leftJoin(
          userFlashcardProgress,
          and(
            eq(userFlashcardProgress.flashcardId, flashcards.id),
            eq(userFlashcardProgress.userId, userId),
          ),
        )
        .where(lte(userFlashcardProgress.nextReview, now))
        .orderBy(asc(flashcards.order));

      // 2. Obtener flashcards nuevas (sin progreso)
      const newFlashcards = await db
        .select({
          flashcard: flashcards,
          progress: userFlashcardProgress,
        })
        .from(flashcards)
        .leftJoin(
          userFlashcardProgress,
          and(
            eq(userFlashcardProgress.flashcardId, flashcards.id),
            eq(userFlashcardProgress.userId, userId),
          ),
        )
        .where(sql`${userFlashcardProgress.nextReview} IS NULL`)
        .orderBy(asc(flashcards.order));

      // 3. Si no hay pendientes ni nuevas, obtener todas para "Repaso Libre"
      let allCards = [...dueFlashcards, ...newFlashcards];

      if (allCards.length === 0) {
        const reviewCards = await db
          .select({
            flashcard: flashcards,
            progress: userFlashcardProgress,
          })
          .from(flashcards)
          .leftJoin(
            userFlashcardProgress,
            and(
              eq(userFlashcardProgress.flashcardId, flashcards.id),
              eq(userFlashcardProgress.userId, userId),
            ),
          )
          .orderBy(asc(flashcards.order));
        allCards = reviewCards;
      }

      return Result.ok(
        allCards.map((row) => ({
          ...row.flashcard,
          frontContent: JSON.parse(row.flashcard.frontContent),
          backContent: JSON.parse(row.flashcard.backContent),
          imeMetadata: row.flashcard.imeMetadata ? JSON.parse(row.flashcard.imeMetadata) : null,
          progress: row.progress,
        })),
      );
    } catch (error) {
      return Result.fail(
        new DomainError(
          error instanceof Error ? error.message : "Error al obtener flashcards",
          "INTERNAL_ERROR",
        ),
      );
    }
  }
}

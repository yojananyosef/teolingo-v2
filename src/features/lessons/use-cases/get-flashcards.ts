import { DomainError, Result } from "@/domain/shared/result";
import { db } from "@/infrastructure/database/db";
import { flashcards, userFlashcardProgress } from "@/infrastructure/database/schema";
import { and, asc, eq, lte, sql } from "drizzle-orm";

export class GetFlashcardsUseCase {
  async execute(userId: string, category?: string): Promise<Result<any[]>> {
    try {
      const now = new Date();

      const conditions = [category ? eq(flashcards.category, category) : undefined].filter(Boolean);

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
        .where(and(lte(userFlashcardProgress.nextReview, now), ...(conditions as any)))
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
        .where(and(sql`${userFlashcardProgress.nextReview} IS NULL`, ...(conditions as any)))
        .orderBy(asc(flashcards.order));

      // 3. Si no hay pendientes ni nuevas, obtener todas de esa categoría para "Repaso Libre"
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
          .where(and(...(conditions as any)))
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

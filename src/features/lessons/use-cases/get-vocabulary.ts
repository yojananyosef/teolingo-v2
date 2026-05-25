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

export class GetVocabularyUseCase {
  async execute(userId: string, course = "hebrew"): Promise<Result<any[]>> {
    try {
      // Get completed lessons for this user and this course to only show "discovered" vocabulary
      const completed = await db
        .select({ lessonId: userProgress.lessonId })
        .from(userProgress)
        .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.isCompleted, true),
            eq(lessons.course, course),
          ),
        );

      const lessonIds = completed.map((c) => c.lessonId);

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
        .where(
          and(
            inArray(exercises.lessonId, lessonIds),
            eq(exercises.type, "translation"),
            sql`${exercises.hebrewText} IS NOT NULL`,
          ),
        );

      // Map results to extract the real meaning and transliteration
      const mappedResults = results.map((res) => {
        let meaning = res.spanish;
        let transliteration = "";
        const question = res.question || "";

        // Case 1: "¿Cómo se dice 'Padre' en hebreo?"
        // meaning = "Padre", transliteration = correctAnswer ("Ab")
        if (question.includes("¿Cómo se dice '")) {
          const match = question.match(/¿Cómo se dice '([^']+)'/);
          if (match?.[1]) {
            meaning = match[1];
            transliteration = res.spanish; // The correctAnswer is the transliteration
          }
        }
        // Case 2: "¿Qué significa 'Eretz'?" or "¿Qué significa 'Amar' (אָמַר)?"
        // meaning = correctAnswer ("Tierra"), transliteration = "Eretz"
        else if (question.includes("¿Qué significa '")) {
          const match = question.match(/¿Qué significa '([^']+)'/);
          if (match?.[1]) {
            transliteration = match[1];
            meaning = res.spanish; // The correctAnswer is the meaning
          }
        }

        // Clean transliteration: remove parentheses if any (like "Amar (אָמַר)" -> "Amar")
        if (transliteration) {
          transliteration = transliteration.split("(")[0].trim();
          // Ensure first letter is capitalized
          transliteration = transliteration.charAt(0).toUpperCase() + transliteration.slice(1);
        }

        return {
          hebrew: res.hebrew!,
          spanish: meaning.toUpperCase(),
          transliteration: transliteration,
        };
      });

      // Filter unique by hebrew text
      const vocabularyMap = new Map<string, { spanish: string; transliteration: string }>();

      for (const item of mappedResults) {
        const existing = vocabularyMap.get(item.hebrew);

        if (!existing) {
          vocabularyMap.set(item.hebrew, {
            spanish: item.spanish,
            transliteration: item.transliteration,
          });
        } else {
          // If we have multiple, prefer the one that has a transliteration if the current one doesn't
          if (!existing.transliteration && item.transliteration) {
            vocabularyMap.set(item.hebrew, {
              spanish: item.spanish,
              transliteration: item.transliteration,
            });
          }
        }
      }

      const finalVocabulary = Array.from(vocabularyMap.entries()).map(([hebrew, data]) => ({
        hebrew,
        spanish: data.spanish,
        transliteration: data.transliteration,
      }));

      return Result.ok(finalVocabulary);
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

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
import type { LessonWithExercises } from "./get-lesson-with-exercises";

export class GetPracticeExercisesUseCase {
  async execute(
    userId: string,
    mode:
      | "quick"
      | "intense"
      | "freq"
      | "nouns"
      | "adjectives"
      | "verbs"
      | "imperfect"
      | "verb-suffixes"
      | "prefixes"
      | "pronouns"
      | "suffixes" = "quick",
    range?: string,
    randomOrder = false,
  ): Promise<Result<LessonWithExercises>> {
    try {
      let practiceExercises;

      // --- Modo Frecuencia Bíblica ---
      if (mode === "freq" && range) {
        let lessonId = "";
        if (range === "5000-2200" || range === "2200-5000") lessonId = "freq-2200-5000";
        else if (range === "2199-1000" || range === "1000-2199") lessonId = "freq-1000-2199";
        else if (range === "999-730" || range === "730-999") lessonId = "freq-730-999";
        else if (range === "729-500" || range === "500-729") lessonId = "freq-500-729";
        else if (range === "499-400" || range === "400-499" || range === "500-400") {
          lessonId = "freq-400-499";
        } else if (range === "399-310" || range === "310-399") {
          lessonId = "freq-310-399";
        } else if (range === "309-270" || range === "270-309") {
          lessonId = "freq-270-309";
        }

        if (lessonId) {
          const freqQuery = db.select().from(exercises).where(eq(exercises.lessonId, lessonId));

          practiceExercises = randomOrder
            ? await freqQuery.orderBy(sql`RANDOM()`) // Todos los ejercicios de este rango de frecuencia
            : await freqQuery.orderBy(asc(exercises.order));

          return Result.ok({
            id: `practice-freq-${range}`,
            title: `Frecuencia: ${range}`,
            exercises: practiceExercises.map((ex) => ({
              ...ex,
              options: ex.options ? JSON.parse(ex.options) : [],
            })) as Exercise[],
          });
        }
      }

      // --- Modo Sustantivos ---
      if (mode === "nouns") {
        const nounQuery = db
          .select()
          .from(exercises)
          .where(and(eq(exercises.lessonId, "practice-nouns"), eq(exercises.type, "noun-parsing")));

        practiceExercises = randomOrder
          ? await nounQuery.orderBy(sql`RANDOM()`).limit(10)
          : await nounQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-nouns",
          title: "Clasificación de Sustantivos",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Adjetivos ---
      if (mode === "adjectives") {
        const adjectiveQuery = db
          .select()
          .from(exercises)
          .where(
            and(
              eq(exercises.lessonId, "practice-adjectives"),
              inArray(exercises.type, ["adjective-parsing", "word-bank"]),
            ),
          );

        practiceExercises = randomOrder
          ? await adjectiveQuery.orderBy(sql`RANDOM()`).limit(15)
          : await adjectiveQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-adjectives",
          title: "Adjetivos: Clasificación y Armado",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Verbos ---
      if (mode === "verbs") {
        const verbQuery = db
          .select()
          .from(exercises)
          .where(and(eq(exercises.lessonId, "practice-verbs"), eq(exercises.type, "verb-parsing")));

        practiceExercises = randomOrder
          ? await verbQuery.orderBy(sql`RANDOM()`).limit(15)
          : await verbQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-verbs",
          title: "Verbos: Qal perfecto",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Qal Imperfecto ---
      if (mode === "imperfect") {
        const imperfectQuery = db
          .select()
          .from(exercises)
          .where(
            and(
              eq(exercises.lessonId, "practice-qal-imperfect"),
              eq(exercises.type, "verb-parsing"),
            ),
          );

        practiceExercises = randomOrder
          ? await imperfectQuery.orderBy(sql`RANDOM()`).limit(15)
          : await imperfectQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-qal-imperfect",
          title: "Verbos: Qal imperfecto",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Sufijos Verbales ---
      if (mode === "verb-suffixes") {
        const verbSuffixQuery = db
          .select()
          .from(exercises)
          .where(
            and(
              eq(exercises.lessonId, "practice-verb-suffixes"),
              eq(exercises.type, "verb-parsing"),
            ),
          );

        practiceExercises = randomOrder
          ? await verbSuffixQuery.orderBy(sql`RANDOM()`).limit(15)
          : await verbSuffixQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-verb-suffixes",
          title: "Sufijos Verbales Qal",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Prefijos ---
      if (mode === "prefixes") {
        const prefixQuery = db
          .select()
          .from(exercises)
          .where(
            and(eq(exercises.lessonId, "practice-prefixes"), eq(exercises.type, "prefix-parsing")),
          );

        practiceExercises = randomOrder
          ? await prefixQuery.orderBy(sql`RANDOM()`).limit(15)
          : await prefixQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-prefixes",
          title: "Uso de Prefijos",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Pronombres ---
      if (mode === "pronouns") {
        const pronounQuery = db
          .select()
          .from(exercises)
          .where(
            and(eq(exercises.lessonId, "practice-pronouns"), eq(exercises.type, "pronoun-parsing")),
          );

        practiceExercises = randomOrder
          ? await pronounQuery.orderBy(sql`RANDOM()`).limit(15)
          : await pronounQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-pronouns",
          title: "Pronombres: Identificación por Persona",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modo Sufijos Pronominales ---
      if (mode === "suffixes") {
        const suffixQuery = db
          .select()
          .from(exercises)
          .where(
            and(eq(exercises.lessonId, "practice-suffixes"), eq(exercises.type, "suffix-parsing")),
          );

        practiceExercises = randomOrder
          ? await suffixQuery.orderBy(sql`RANDOM()`).limit(15)
          : await suffixQuery.orderBy(asc(exercises.order));

        return Result.ok({
          id: "practice-suffixes",
          title: "Sufijos Pronominales",
          exercises: practiceExercises.map((ex) => ({
            ...ex,
            options: ex.options ? JSON.parse(ex.options) : [],
          })) as Exercise[],
        });
      }

      // --- Modos Normales (Quick / Intense) ---
      // Get completed lessons for this user
      const completed = await db
        .select({ lessonId: userProgress.lessonId })
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)));

      let lessonIds = completed.map((c) => c.lessonId);

      // If no lessons completed, take exercises from first 3 lessons
      if (lessonIds.length === 0) {
        const firstLessons = await db
          .select({ id: lessons.id })
          .from(lessons)
          .orderBy(lessons.order)
          .limit(3);
        lessonIds = firstLessons.map((l) => l.id);
      }

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
        const quickQuery = db
          .select()
          .from(exercises)
          .where(inArray(exercises.lessonId, lessonIds));

        practiceExercises = randomOrder
          ? await quickQuery.orderBy(sql`RANDOM()`).limit(5)
          : await quickQuery.orderBy(asc(exercises.lessonId), asc(exercises.order)).limit(5);
      }

      return Result.ok({
        id: "practice",
        title: mode === "intense" ? "Modo Intenso" : "Repaso Rápido",
        exercises: practiceExercises.map((ex) => ({
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

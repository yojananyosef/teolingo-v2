import { db } from "@/infrastructure/database/db";
import {
  exercises,
  flashcards,
  lessons,
  userFlashcardProgress,
  userIsraeliProgress,
  userMistakes,
  userProgress,
  users,
} from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { count, desc, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import TeacherStudentDetailsClientContent from "./TeacherStudentDetailsClientContent";

export default async function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/learn");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const [student] = await db.select().from(users).where(eq(users.id, id));

  if (!student) {
    notFound();
  }

  // Métricas de Lecciones
  const completedLessons = await db
    .select({
      id: userProgress.id,
      accuracy: userProgress.accuracy,
      isPerfect: userProgress.isPerfect,
      completedAt: userProgress.completedAt,
      lessonTitle: lessons.title,
      moduleIndex: lessons.moduleIndex,
    })
    .from(userProgress)
    .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
    .where(eq(userProgress.userId, id))
    .orderBy(desc(userProgress.completedAt));

  const averageAccuracy =
    completedLessons.length > 0
      ? Math.round(
          completedLessons.reduce((acc, curr) => acc + curr.accuracy, 0) / completedLessons.length,
        )
      : 0;

  const perfectLessons = completedLessons.filter((l) => l.isPerfect).length;

  // Métricas de Flashcards (SRS) y Frecuencia
  const flashcardsData = await db
    .select({
      interval: userFlashcardProgress.interval,
      easeFactor: userFlashcardProgress.easeFactor,
      category: flashcards.category,
    })
    .from(userFlashcardProgress)
    .innerJoin(flashcards, eq(userFlashcardProgress.flashcardId, flashcards.id))
    .where(eq(userFlashcardProgress.userId, id));

  const cardsLearned = flashcardsData.length;
  const cardsInReview = flashcardsData.filter((f) => f.interval > 0).length;

  // Estadísticas de frecuencia
  const frequencyStats = flashcardsData.reduce(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const freq1Count = frequencyStats["freq-1"] || 0;
  const freq2Count = frequencyStats["freq-2"] || 0;
  const freq3Count = frequencyStats["freq-3"] || 0;

  // Promedio de retención (basado en repeticiones exitosas vs fallidas, o easeFactor)
  // easeFactor > 250 significa buena retención.
  const averageEase =
    flashcardsData.length > 0
      ? flashcardsData.reduce((acc, curr) => acc + curr.easeFactor, 0) / flashcardsData.length
      : 250;

  const retentionQualityKey =
    averageEase > 260
      ? ("retentionExcellent" as const)
      : averageEase > 240
        ? ("retentionGood" as const)
        : ("retentionNeedsReinforcement" as const);

  // Modo Israelí
  const [israeliProgress] = await db
    .select({ count: count() })
    .from(userIsraeliProgress)
    .where(eq(userIsraeliProgress.userId, id));

  // Top 5 Errores (Conceptos a reforzar)
  const topMistakes = await db
    .select({
      mistakeCount: userMistakes.mistakeCount,
      lastMistakeAt: userMistakes.lastMistakeAt,
      question: exercises.question,
      correctAnswer: exercises.correctAnswer,
      type: exercises.type,
      lessonTitle: lessons.title,
    })
    .from(userMistakes)
    .innerJoin(exercises, eq(userMistakes.exerciseId, exercises.id))
    .innerJoin(lessons, eq(exercises.lessonId, lessons.id))
    .where(eq(userMistakes.userId, id))
    .orderBy(desc(userMistakes.mistakeCount))
    .limit(5);

  // Serialize objects for Next.js boundary
  const serializedStudent = {
    id: student.id,
    displayName: student.displayName,
    email: student.email,
    points: student.points,
    level: student.level,
    streak: student.streak,
  };

  const serializedLessons = completedLessons.map((l) => ({
    id: l.id,
    accuracy: l.accuracy,
    isPerfect: l.isPerfect,
    completedAt: l.completedAt ? l.completedAt.toISOString() : null,
    lessonTitle: l.lessonTitle,
    moduleIndex: l.moduleIndex,
  }));

  const serializedMistakes = topMistakes.map((m) => ({
    mistakeCount: m.mistakeCount,
    lastMistakeAt: m.lastMistakeAt.toISOString(),
    question: m.question,
    correctAnswer: m.correctAnswer,
    type: m.type,
    lessonTitle: m.lessonTitle,
  }));

  return (
    <TeacherStudentDetailsClientContent
      student={serializedStudent}
      completedLessons={serializedLessons}
      averageAccuracy={averageAccuracy}
      perfectLessons={perfectLessons}
      cardsLearned={cardsLearned}
      cardsInReview={cardsInReview}
      retentionQualityKey={retentionQualityKey}
      israeliCount={israeliProgress.count}
      topMistakes={serializedMistakes}
      freq1Count={freq1Count}
      freq2Count={freq2Count}
      freq3Count={freq3Count}
    />
  );
}

import { db } from "@/infrastructure/database/db";
import {
  quizzes,
  quizQuestions,
  quizAttempts,
  exercises,
  lessons,
  users,
} from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { and, asc, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { QuizDetails } from "./QuizDetails";

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default async function QuizDetailPage({ params }: QuizPageProps) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    redirect("/learn");
  }

  const resolvedParams = await params;
  const quizId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
  if (!quizId || typeof quizId !== "string") {
    redirect("/teacher/quizzes");
  }

  const [quiz] = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      isActive: quizzes.isActive,
      updatedByName: quizzes.updatedByName,
      updatedAt: quizzes.updatedAt,
      createdAt: quizzes.createdAt,
      teacherName: users.displayName,
    })
    .from(quizzes)
    .innerJoin(users, eq(quizzes.teacherId, users.id))
    .where(eq(quizzes.id, quizId))
    .limit(1);

  if (!quiz) {
    redirect("/teacher/quizzes");
  }

  const questions = await db
    .select({
      id: exercises.id,
      question: exercises.question,
      correctAnswer: exercises.correctAnswer,
      type: exercises.type,
      lessonTitle: lessons.title,
    })
    .from(quizQuestions)
    .innerJoin(exercises, eq(quizQuestions.exerciseId, exercises.id))
    .innerJoin(lessons, eq(exercises.lessonId, lessons.id))
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.order));

  const allExercises = await db
    .select({
      id: exercises.id,
      question: exercises.question,
      correctAnswer: exercises.correctAnswer,
      type: exercises.type,
      lessonTitle: lessons.title,
    })
    .from(exercises)
    .innerJoin(lessons, eq(exercises.lessonId, lessons.id));

  const rawAttempts = await db
    .select({
      id: quizAttempts.id,
      studentId: quizAttempts.studentId,
      studentName: users.displayName,
      score: quizAttempts.score,
      isPassed: quizAttempts.isPassed,
      timeLimitSeconds: quizAttempts.timeLimitSeconds,
      timeSpentSeconds: quizAttempts.timeSpentSeconds,
      timedOut: quizAttempts.timedOut,
      correctExerciseIds: quizAttempts.correctExerciseIds,
      incorrectExerciseIds: quizAttempts.incorrectExerciseIds,
      completedAt: quizAttempts.completedAt,
    })
    .from(quizAttempts)
    .innerJoin(users, eq(quizAttempts.studentId, users.id))
    .where(eq(quizAttempts.quizId, quizId))
    .orderBy(desc(quizAttempts.completedAt));

  const parseIds = (value: string | null) => {
    if (!value) return [] as string[];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((entry): entry is string => typeof entry === "string")
        : [];
    } catch {
      return [] as string[];
    }
  };

  const attempts = rawAttempts.map((attempt) => ({
    ...attempt,
    correctExerciseIds: parseIds(attempt.correctExerciseIds),
    incorrectExerciseIds: parseIds(attempt.incorrectExerciseIds),
  }));

  return (
    <QuizDetails
      quiz={quiz}
      questions={questions}
      allExercises={allExercises}
      attempts={attempts}
    />
  );
}

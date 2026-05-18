import { db } from "@/infrastructure/database/db";
import { quizzes, quizQuestions, exercises, lessons, users } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { and, eq, asc } from "drizzle-orm";
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

  return <QuizDetails quiz={quiz} questions={questions} />;
}

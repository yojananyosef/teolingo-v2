import { db } from "@/infrastructure/database/db";
import { exercises, lessons } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { redirect } from "next/navigation";
import { QuizBuilder } from "./QuizBuilder";
import { eq } from "drizzle-orm";

export default async function CreateQuizPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/learn");
  }

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

  return <QuizBuilder initialExercises={allExercises} />;
}


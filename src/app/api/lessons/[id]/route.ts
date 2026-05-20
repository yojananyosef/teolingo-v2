import { GetLessonWithExercisesUseCase } from "@/features/lessons/use-cases";
import { getSession } from "@/infrastructure/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (id.startsWith("quiz-")) {
    const quizId = id.replace("quiz-", "");
    const { db } = await import("@/infrastructure/database/db");
    const { quizzes, quizQuestions, exercises } = await import("@/infrastructure/database/schema");
    const { eq, asc } = await import("drizzle-orm");

    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    const questions = await db
      .select({
        id: exercises.id,
        lessonId: exercises.lessonId,
        type: exercises.type,
        question: exercises.question,
        correctAnswer: exercises.correctAnswer,
        options: exercises.options,
        hebrewText: exercises.hebrewText,
        audioUrl: exercises.audioUrl,
        hint: exercises.hint,
        order: quizQuestions.order,
      })
      .from(quizQuestions)
      .innerJoin(exercises, eq(quizQuestions.exerciseId, exercises.id))
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.order));

    const formattedExercises = questions.map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : [],
    }));

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      exercises: formattedExercises,
    });
  }

  const useCase = new GetLessonWithExercisesUseCase();
  const result = await useCase.execute(id);

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: result.error.code === "LESSON_NOT_FOUND" ? 404 : 400 },
    );
  }

  const data = result.value;
  return NextResponse.json(data);
}

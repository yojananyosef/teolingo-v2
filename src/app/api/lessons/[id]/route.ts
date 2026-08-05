import { GetLessonWithExercisesUseCase } from "@/features/lessons/use-cases";
import { getSession } from "@/infrastructure/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (id.startsWith("quiz-") || id.startsWith("catedra-")) {
    const rawQuizId = id.replace("quiz-", "");
    const { db } = await import("@/infrastructure/database/db");
    const { quizzes, quizQuestions, exercises, quizAttempts } = await import(
      "@/infrastructure/database/schema"
    );
    const { eq, asc, and, or } = await import("drizzle-orm");

    const candidateIds = Array.from(
      new Set([rawQuizId, `catedra-${rawQuizId}`, `quiz-${rawQuizId}`, id]),
    );

    const allMatchingQuizzes = await db
      .select()
      .from(quizzes)
      .where(or(...candidateIds.map((cId) => eq(quizzes.id, cId))));

    let quiz = allMatchingQuizzes[0];

    if (!quiz && (id.startsWith("catedra-") || rawQuizId.startsWith("catedra-"))) {
      quiz = {
        id: id.startsWith("catedra-") ? id : `catedra-${rawQuizId}`,
        teacherId: "system",
        title: "Semana 1: Vocabulario (Frecuencia 159-144)",
        description: "Evaluación formativa semestral - 10 intentos máximo",
        isActive: true,
        timeLimitSeconds: 600,
        allowedAttempts: 10,
        updatedByName: "Docente Cátedra UNACH",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    // Control de pausa del módulo Cátedra (docentes siempre pueden acceder)
    if (
      (quiz.id.startsWith("catedra-") || id.startsWith("catedra-")) &&
      session.role !== "teacher"
    ) {
      const { getCatedraAccessState } = await import("@/features/catedra/pause-service");
      const access = await getCatedraAccessState(session.id);
      if (access.isPaused && !access.accessGranted) {
        return NextResponse.json(
          {
            error: "El módulo de Cátedra está pausado por el docente",
            code: "MODULE_PAUSED",
            pausedAt: access.pausedAt,
          },
          { status: 403 },
        );
      }
    }

    // Control seguro de límite de intentos (omitido para profesores)
    if (session.role !== "teacher") {
      const userAttempts = await db
        .select()
        .from(quizAttempts)
        .where(and(eq(quizAttempts.quizId, quiz.id), eq(quizAttempts.studentId, session.id)));

      if (userAttempts.length >= quiz.allowedAttempts) {
        return NextResponse.json(
          {
            error: "Límite de intentos alcanzado para este quiz",
            code: "ATTEMPTS_EXHAUSTED",
            allowedAttempts: quiz.allowedAttempts,
          },
          { status: 403 },
        );
      }
    }

    let questions = await db
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
      .where(eq(quizQuestions.quizId, quiz.id))
      .orderBy(asc(quizQuestions.order));

    // Fallback: Si no hay quizQuestions asociadas, buscar directo en exercises por lessonId
    if (questions.length === 0 && (quiz.id.startsWith("catedra-") || id.startsWith("catedra-"))) {
      const catedraLessonId = quiz.id.replace("catedra-", "catedra-lesson-");
      const directExercises = await db
        .select()
        .from(exercises)
        .where(eq(exercises.lessonId, catedraLessonId))
        .orderBy(asc(exercises.order));

      questions = directExercises.map((ex, index) => ({
        id: ex.id,
        lessonId: ex.lessonId,
        type: ex.type,
        question: ex.question,
        correctAnswer: ex.correctAnswer,
        options: ex.options,
        hebrewText: ex.hebrewText,
        audioUrl: ex.audioUrl,
        hint: ex.hint,
        order: index + 1,
      }));
    }

    const formattedExercises = questions.map((q) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : [],
    }));

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      timeLimitSeconds: quiz.timeLimitSeconds,
      allowedAttempts: quiz.allowedAttempts,
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

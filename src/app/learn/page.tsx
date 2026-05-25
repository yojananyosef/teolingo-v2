import { GetLessonsUseCase } from "@/features/lessons/use-cases";
import { getSession } from "@/infrastructure/lib/auth";
import { LearnClientContent } from "./LearnClientContent";

interface PageProps {
  searchParams: Promise<{ course?: string }>;
}

export default async function LearnPage({ searchParams }: PageProps) {
  const session = await getSession();
  const userId = session?.id;

  const resolvedParams = await searchParams;
  const course = resolvedParams.course === "greek" ? "greek" : "hebrew";

  const useCase = new GetLessonsUseCase();
  const result = await useCase.execute(userId, course);

  if (result.isFailure()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar las lecciones</h1>
        <p className="text-gray-500">{result.error.message}</p>
      </div>
    );
  }

  const lessons = result.value;

  const user = session
    ? {
        displayName: session.displayName,
        streak: session.streak || 0,
        points: session.points || 0,
        level: session.level || 1,
      }
    : null;

  const { db } = await import("@/infrastructure/database/db");
  const { quizzes, quizAssignments } = await import("@/infrastructure/database/schema");
  const { eq, desc } = await import("drizzle-orm");

  const allQuizzes = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.isActive, true))
    .orderBy(desc(quizzes.createdAt));
  const userAssignments = userId
    ? await db.select().from(quizAssignments).where(eq(quizAssignments.studentId, userId))
    : [];

  const quizzesWithStatus = allQuizzes.map((q) => {
    const assignment = userAssignments.find((a) => a.quizId === q.id);
    return {
      ...q,
      isCompleted: assignment?.isCompleted || false,
      score: assignment?.score || null,
    };
  });

  return <LearnClientContent lessons={lessons} user={user} quizzes={quizzesWithStatus} />;
}

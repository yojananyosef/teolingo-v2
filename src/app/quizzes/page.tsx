import { getSession } from "@/infrastructure/lib/auth";
import { redirect } from "next/navigation";
import { QuizzesClientContent } from "./QuizzesClientContent";

export default async function QuizzesPage() {
  const session = await getSession();
  const userId = session?.id;

  if (!session) {
    redirect("/auth/login");
  }

  const user = {
    displayName: session.displayName,
    streak: session.streak || 0,
    points: session.points || 0,
    level: session.level || 1,
  };

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
      score: assignment?.score !== undefined ? assignment.score : null,
    };
  });

  return <QuizzesClientContent user={user} quizzes={quizzesWithStatus} />;
}

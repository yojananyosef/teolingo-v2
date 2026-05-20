import { getSession } from "@/infrastructure/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const userId = session?.id;

  if (!session || !userId) {
    return NextResponse.json({ count: 0 });
  }

  try {
    const { db } = await import("@/infrastructure/database/db");
    const { quizzes, quizAssignments } = await import("@/infrastructure/database/schema");
    const { eq } = await import("drizzle-orm");

    const allQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(eq(quizzes.isActive, true));

    const userAssignments = await db
      .select({ quizId: quizAssignments.quizId, isCompleted: quizAssignments.isCompleted })
      .from(quizAssignments)
      .where(eq(quizAssignments.studentId, userId));

    const completedQuizIds = new Set(
      userAssignments.filter((a) => a.isCompleted).map((a) => a.quizId),
    );

    const pendingCount = allQuizzes.filter((q) => !completedQuizIds.has(q.id)).length;

    return NextResponse.json({ count: pendingCount });
  } catch (error) {
    console.error("Error fetching pending quizzes count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

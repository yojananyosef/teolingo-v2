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
    const { quizzes, quizAssignments, quizAttempts } = await import(
      "@/infrastructure/database/schema"
    );
    const { eq, and, sql } = await import("drizzle-orm");

    const normalQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(and(eq(quizzes.isActive, true), sql`${quizzes.id} NOT LIKE 'catedra-%'`));

    const userAssignments = await db
      .select({ quizId: quizAssignments.quizId, isCompleted: quizAssignments.isCompleted })
      .from(quizAssignments)
      .where(eq(quizAssignments.studentId, userId));

    const completedQuizIds = new Set(
      userAssignments.filter((a) => a.isCompleted).map((a) => a.quizId),
    );

    const pendingCount = normalQuizzes.filter((q) => !completedQuizIds.has(q.id)).length;

    // Fetch user attempts for Cátedra quizzes
    const catedraAttempts = await db
      .select({
        quizId: quizAttempts.quizId,
        score: quizAttempts.score,
      })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.studentId, userId), sql`${quizAttempts.quizId} LIKE 'catedra-%'`));

    const catedraStats: Record<string, { count: number; bestScore: number | null }> = {};

    for (const attempt of catedraAttempts) {
      if (!catedraStats[attempt.quizId]) {
        catedraStats[attempt.quizId] = { count: 0, bestScore: null };
      }
      catedraStats[attempt.quizId].count += 1;
      const currentBest = catedraStats[attempt.quizId].bestScore;
      if (attempt.score !== null) {
        if (currentBest === null || attempt.score > currentBest) {
          catedraStats[attempt.quizId].bestScore = attempt.score;
        }
      }
    }

    const catedraQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(and(eq(quizzes.isActive, true), sql`${quizzes.id} LIKE 'catedra-%'`));

    const catedraCompletedIds = new Set(
      Object.keys(catedraStats).filter(
        (qId) => catedraStats[qId].count > 0 && (catedraStats[qId].bestScore || 0) >= 70,
      ),
    );

    const pendingCatedraCount = catedraQuizzes.filter((q) => !catedraCompletedIds.has(q.id)).length;

    return NextResponse.json({
      count: pendingCount,
      catedraCount: pendingCatedraCount,
      catedraStats,
    });
  } catch (error) {
    console.error("Error fetching pending quizzes count:", error);
    return NextResponse.json({ count: 0, catedraCount: 0, catedraStats: {} }, { status: 500 });
  }
}

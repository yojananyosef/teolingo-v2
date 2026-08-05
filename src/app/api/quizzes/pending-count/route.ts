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
    const { ensureCatedraSeeded } = await import("@/infrastructure/database/seed-catedra");

    await ensureCatedraSeeded(db);

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

    const catedraStats: Record<
      string,
      { count: number; bestScore: number | null; avgScore: number | null; scoresSum: number }
    > = {};

    for (const attempt of catedraAttempts) {
      if (!catedraStats[attempt.quizId]) {
        catedraStats[attempt.quizId] = { count: 0, bestScore: null, avgScore: null, scoresSum: 0 };
      }
      const st = catedraStats[attempt.quizId];
      st.count += 1;
      if (attempt.score !== null) {
        st.scoresSum += attempt.score;
        st.avgScore = Math.round(st.scoresSum / st.count);
        if (st.bestScore === null || attempt.score > st.bestScore) {
          st.bestScore = attempt.score;
        }
      }
    }

    const catedraQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(and(eq(quizzes.isActive, true), sql`${quizzes.id} LIKE 'catedra-%'`));

    const catedraQuizIds =
      catedraQuizzes.length > 0 ? catedraQuizzes.map((q) => q.id) : ["catedra-semana-1"];

    const catedraCompletedIds = new Set(
      Object.keys(catedraStats).filter(
        (qId) => catedraStats[qId].count >= 6 && (catedraStats[qId].avgScore || 0) >= 90,
      ),
    );

    const pendingCatedraCount = catedraQuizIds.filter(
      (qId) => !catedraCompletedIds.has(qId),
    ).length;

    // Estado de pausa del módulo Cátedra por semana para el estudiante
    const { getAllCatedraAccessStates } = await import("@/features/catedra/pause-service");
    const catedraAccessByWeek = await getAllCatedraAccessStates(userId);

    return NextResponse.json({
      count: pendingCount,
      catedraCount: pendingCatedraCount,
      catedraStats,
      catedraAccess: catedraAccessByWeek,
    });
  } catch (error) {
    console.error("Error fetching pending quizzes count:", error);
    const fallbackAccess: Record<
      number,
      {
        isPaused: boolean;
        pausedAt: string | null;
        exceptionActiveUntil: string | null;
        accessGranted: boolean;
      }
    > = {};
    for (let i = 1; i <= 16; i++) {
      fallbackAccess[i] = {
        isPaused: false,
        pausedAt: null,
        exceptionActiveUntil: null,
        accessGranted: true,
      };
    }
    return NextResponse.json(
      {
        count: 0,
        catedraCount: 0,
        catedraStats: {},
        catedraAccess: fallbackAccess,
      },
      { status: 500 },
    );
  }
}

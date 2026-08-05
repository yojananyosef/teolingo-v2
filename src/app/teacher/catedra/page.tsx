import { db } from "@/infrastructure/database/db";
import { quizAttempts, quizzes, users } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { desc, eq, ne, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import TeacherCatedraClientContent from "./TeacherCatedraClientContent";

export default async function TeacherCatedraPage() {
  const session = await getSession();

  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    redirect("/learn");
  }

  // Fetch all students
  const students = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
    })
    .from(users)
    .where(ne(users.role, "teacher"))
    .orderBy(users.displayName);

  // Fetch all attempts for Cátedra quizzes
  const catedraAttempts = await db
    .select({
      id: quizAttempts.id,
      studentId: quizAttempts.studentId,
      quizId: quizAttempts.quizId,
      score: quizAttempts.score,
      isPassed: quizAttempts.isPassed,
      timeSpentSeconds: quizAttempts.timeSpentSeconds,
      correctCount: quizAttempts.correctCount,
      incorrectCount: quizAttempts.incorrectCount,
      completedAt: quizAttempts.completedAt,
      studentName: users.displayName,
      studentEmail: users.email,
    })
    .from(quizAttempts)
    .innerJoin(users, eq(quizAttempts.studentId, users.id))
    .where(sql`${quizAttempts.quizId} LIKE 'catedra-%'`)
    .orderBy(desc(quizAttempts.completedAt));

  return (
    <TeacherCatedraClientContent
      students={students}
      attempts={catedraAttempts.map((a) => ({
        ...a,
        completedAtStr: a.completedAt
          ? new Date(a.completedAt).toISOString()
          : new Date().toISOString(),
      }))}
    />
  );
}

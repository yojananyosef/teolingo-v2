import { db } from "@/infrastructure/database/db";
import { exercises, quizAttempts, quizzes, users } from "@/infrastructure/database/schema";
import { ensureCatedraSeeded } from "@/infrastructure/database/seed-catedra";
import { getSession } from "@/infrastructure/lib/auth";
import { desc, eq, ne, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import TeacherCatedraClientContent from "./TeacherCatedraClientContent";

export default async function TeacherCatedraPage() {
  const session = await getSession();

  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    redirect("/learn");
  }

  // Ensure Cátedra active weeks are seeded in DB
  await ensureCatedraSeeded(db);

  // Fetch all users/students
  const students = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .orderBy(users.displayName);

  // Fetch all exercises for Cátedra lessons (Semana 1 to 16)
  const catedraExercises = await db
    .select({
      id: exercises.id,
      lessonId: exercises.lessonId,
      hebrewText: exercises.hebrewText,
      question: exercises.question,
      correctAnswer: exercises.correctAnswer,
    })
    .from(exercises)
    .where(sql`${exercises.lessonId} LIKE 'catedra-%'`);

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
      correctExerciseIds: quizAttempts.correctExerciseIds,
      incorrectExerciseIds: quizAttempts.incorrectExerciseIds,
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
      exercisesList={catedraExercises}
      attempts={catedraAttempts.map((a) => ({
        ...a,
        completedAtStr: a.completedAt
          ? new Date(a.completedAt).toISOString()
          : new Date().toISOString(),
      }))}
    />
  );
}

import {
  ensureCatedraPauseTables,
  getWeekNumberFromCatedraId,
} from "@/features/catedra/pause-service";
import { db } from "@/infrastructure/database/db";
import {
  catedraControl,
  catedraExceptions,
  exercises,
  quizAttempts,
  quizzes,
  users,
} from "@/infrastructure/database/schema";
import { ensureCatedraSeeded } from "@/infrastructure/database/seed-catedra";
import { getSession } from "@/infrastructure/lib/auth";
import { asc, desc, eq, gt, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import TeacherCatedraClientContent from "./TeacherCatedraClientContent";

export default async function TeacherCatedraPage() {
  const session = await getSession();

  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    redirect("/learn");
  }

  // Ensure Cátedra active weeks are seeded in DB
  await ensureCatedraSeeded(db);

  // Ensure Cátedra pause tables exist (create if missing)
  await ensureCatedraPauseTables(db);

  // Estado de pausa por semana del módulo Cátedra
  const controlRows = await db
    .select()
    .from(catedraControl)
    .where(sql`${catedraControl.id} LIKE 'semana-%'`)
    .all();

  const controlByWeek = new Map<number, { isPaused: boolean; pausedAt: string | null }>();
  for (const row of controlRows) {
    const week = getWeekNumberFromCatedraId(row.id);
    if (week !== null) {
      controlByWeek.set(week, {
        isPaused: row.isPaused,
        pausedAt: row.pausedAt ? new Date(row.pausedAt).toISOString() : null,
      });
    }
  }

  const now = new Date();
  const exceptions = await db
    .select()
    .from(catedraExceptions)
    .where(gt(catedraExceptions.activeUntil, now))
    .orderBy(asc(catedraExceptions.createdAt));

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
      catedraControlByWeek={Object.fromEntries(controlByWeek)}
      catedraExceptions={exceptions.map((e) => ({
        weekNumber: e.weekNumber ?? 1,
        studentId: e.studentId,
        activeUntil: new Date(e.activeUntil).toISOString(),
      }))}
    />
  );
}

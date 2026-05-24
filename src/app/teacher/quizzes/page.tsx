import { db } from "@/infrastructure/database/db";
import { quizzes, users } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import TeacherQuizzesClientContent from "./TeacherQuizzesClientContent";

export default async function TeacherQuizzesPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/learn");
  }

  const allQuizzes = await db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      isActive: quizzes.isActive,
      updatedByName: quizzes.updatedByName,
      updatedAt: quizzes.updatedAt,
      createdAt: quizzes.createdAt,
      teacherName: users.displayName,
    })
    .from(quizzes)
    .innerJoin(users, eq(quizzes.teacherId, users.id))
    .orderBy(desc(quizzes.createdAt));

  // Serialize Date objects before passing them to the Client Component
  const serializedQuizzes = allQuizzes.map((quiz) => ({
    ...quiz,
    createdAt: quiz.createdAt ? quiz.createdAt.toISOString() : null,
    updatedAt: quiz.updatedAt ? quiz.updatedAt.toISOString() : null,
  }));

  return <TeacherQuizzesClientContent quizzesList={serializedQuizzes} />;
}

import { db } from "@/infrastructure/database/db";
import { users } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { desc, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import TeacherDashboardClientContent from "./TeacherDashboardClientContent";

// Why: Dashboard Docente para monitoreo de alumnos y estadísticas.

export default async function TeacherDashboard() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/learn");
  }

  const students = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
      points: users.points,
      level: users.level,
      streak: users.streak,
    })
    .from(users)
    .where(ne(users.role, "teacher"))
    .orderBy(desc(users.points));

  return <TeacherDashboardClientContent students={students} />;
}

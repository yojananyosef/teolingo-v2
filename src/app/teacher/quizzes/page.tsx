import { db } from "@/infrastructure/database/db";
import { quizzes, users } from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { cn } from "@/lib/utils";
import { formatTimestamp } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/teacher"
          className="p-3 bg-white rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors"
        >
          <ArrowLeft className="text-[#AFAFAF]" size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Gestión de Quizzes
          </h1>
          <p className="text-[#777777] font-bold">Crea y asigna evaluaciones a tus alumnos.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/teacher/quizzes/create"
          className="bg-[#1CB0F6] px-6 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Crear Nuevo Quiz
        </Link>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="p-6 border-b-2 border-[#E5E5E5]">
          <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Listado de Quizzes
          </h2>
        </div>
        <div className="p-6">
          {allQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-[#E5E5E5] mx-auto mb-4" />
              <p className="text-[#AFAFAF] font-bold text-lg">Aún no hay quizzes creados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-6 rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F7F7]"
                >
                  <h3 className="text-xl font-black text-[#4B4B4B] mb-2">{quiz.title}</h3>
                  <p className="text-[#777777] font-bold mb-4 line-clamp-2">
                    {quiz.description || "Sin descripción"}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#AFAFAF]">
                    <span>Creado: {formatTimestamp(quiz.createdAt)}</span>
                    <div className="space-y-1">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center",
                          quiz.isActive
                            ? "bg-[#DDF4FF] text-[#1CB0F6]"
                            : "bg-[#FFF0F0] text-[#D22D2D]",
                        )}
                      >
                        {quiz.isActive ? "Activo" : "Desactivado"}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] block">
                        Creado por {quiz.teacherName}
                      </span>
                      {quiz.updatedByName &&
                        quiz.updatedAt &&
                        formatTimestamp(quiz.updatedAt) !== formatTimestamp(quiz.createdAt) && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] block">
                            Modificado por {quiz.updatedByName} el {formatTimestamp(quiz.updatedAt)}
                          </span>
                        )}
                    </div>
                  </div>
                  {/* Aquí a futuro se puede agregar un Link para ver los resultados o asignarlo */}
                  <div className="mt-4 pt-4 border-t-2 border-[#E5E5E5]">
                    <Link
                      href={`/teacher/quizzes/${quiz.id}`}
                      className="block w-full text-center bg-white px-4 py-2 rounded-xl text-[#1CB0F6] font-black uppercase tracking-widest text-xs border-2 border-[#E5E5E5] hover:bg-[#FDFBF7]"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

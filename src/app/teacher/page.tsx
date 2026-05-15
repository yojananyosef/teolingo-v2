import { db } from "@/infrastructure/database/db";
import { users } from "@/infrastructure/database/schema";
import { eq, ne, desc } from "drizzle-orm";
import { getSession } from "@/infrastructure/lib/auth";
import { redirect } from "next/navigation";
import { Trophy, Users, BarChart3, Clock } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Panel Docente</h1>
          <p className="text-[#777777] font-bold">Monitoreo de progreso de alumnos en TeoLingo.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-[#DDF4FF] p-4 rounded-2xl border-2 border-[#84D8FF] flex items-center gap-3">
                <Users className="text-[#1CB0F6]" size={24} />
                <div>
                    <p className="text-[10px] font-black text-[#1CB0F6] uppercase tracking-widest">Total Alumnos</p>
                    <p className="text-xl font-black text-[#4B4B4B]">{students.length}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Alumnos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-[#E5E5E5] flex items-center justify-between">
              <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
                <Users size={20} /> Lista de Alumnos
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F7F7F7] text-[#AFAFAF] text-xs font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Alumno</th>
                    <th className="px-6 py-4">Nivel</th>
                    <th className="px-6 py-4">Puntos</th>
                    <th className="px-6 py-4">Racha</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#E5E5E5]">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-[#FDFCF0] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#E5E5E5] rounded-full flex items-center justify-center font-black text-[#777777]">
                            {student.displayName[0]}
                          </div>
                          <div>
                            <p className="font-black text-[#4B4B4B]">{student.displayName}</p>
                            <p className="text-xs text-[#AFAFAF] font-bold">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-3 py-1 bg-[#DDF4FF] text-[#1CB0F6] rounded-full text-xs font-black">
                            Lvl {student.level}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-black text-[#FFD900]">
                          <BarChart3 size={16} />
                          {student.points}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-black text-[#FF9600]">
                          <Clock size={16} />
                          {student.streak} d
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] font-black uppercase tracking-widest text-[#1CB0F6] hover:underline">
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resumen Global */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#4B4B4B] uppercase tracking-tight mb-4 flex items-center gap-2">
                <Trophy className="text-[#FFD900]" size={20} /> Ranking del Curso
              </h3>
              <div className="space-y-4">
                {students.slice(0, 3).map((student, i) => (
                  <div key={student.id} className="flex items-center gap-4 p-3 rounded-2xl bg-[#F7F7F7]">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-white shadow-sm",
                      i === 0 ? "bg-[#FFD900]" : i === 1 ? "bg-[#E5E5E5]" : "bg-[#CD7F32]"
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-[#4B4B4B] text-sm">{student.displayName}</p>
                      <p className="text-[10px] text-[#AFAFAF] font-bold uppercase">{student.points} XP</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-[#F0F9FF] rounded-3xl border-2 border-[#BEE3F8] p-6">
              <h3 className="text-lg font-black text-[#1899D6] uppercase tracking-tight mb-2">Próxima Función</h3>
              <p className="text-sm text-[#1899D6] font-bold leading-relaxed">
                Pronto podrás crear Quizzes personalizados y asignarlos a tus alumnos directamente desde aquí.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

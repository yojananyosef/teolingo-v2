"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { BarChart3, Clock, GraduationCap, Trophy, Users } from "lucide-react";
import Link from "next/link";

interface Student {
  id: string;
  displayName: string;
  email: string | null;
  points: number;
  level: number;
  streak: number;
}

interface TeacherDashboardClientContentProps {
  students: Student[];
}

export default function TeacherDashboardClientContent({
  students,
}: TeacherDashboardClientContentProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("teacher.title")}
          </h1>
          <p className="text-[#777777] font-bold">{t("teacher.subtitle")}</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/teacher/catedra"
            className="bg-[#1CB0F6] px-6 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
          >
            <GraduationCap size={20} />
            Gestionar Cátedra UNACH
          </Link>
          <Link
            href="/teacher/quizzes"
            className="bg-[#CE82FF] px-6 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm border-b-4 border-[#A568CC] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
          >
            {t("teacher.manageQuizzes")}
          </Link>
          <div className="bg-[#DDF4FF] p-4 rounded-2xl border-2 border-[#84D8FF] flex items-center gap-3">
            <Users className="text-[#1CB0F6]" size={24} />
            <div>
              <p className="text-[10px] font-black text-[#1CB0F6] uppercase tracking-widest">
                {t("teacher.totalStudents")}
              </p>
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
                <Users size={20} /> {t("teacher.studentsList")}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F7F7F7] text-[#AFAFAF] text-xs font-black uppercase tracking-widest">
                    <th className="px-6 py-4">{t("teacher.studentCol")}</th>
                    <th className="px-6 py-4">{t("teacher.level")}</th>
                    <th className="px-6 py-4">{t("teacher.points")}</th>
                    <th className="px-6 py-4">{t("teacher.streak")}</th>
                    <th className="px-6 py-4 text-right">{t("teacher.actionCol")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#E5E5E5]">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-[#FDFCF0] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#E5E5E5] rounded-full flex items-center justify-center font-black text-[#777777] shrink-0">
                            {student.displayName ? student.displayName[0] : "?"}
                          </div>
                          <p className="font-black text-[#4B4B4B]">{student.displayName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-[#DDF4FF] text-[#1CB0F6] rounded-full text-xs font-black">
                          Lvl {student.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-black text-[#FFD900]">
                          <BarChart3 size={16} />
                          {student.points}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-black text-[#FF9600]">
                          <Clock size={16} />
                          {student.streak} d
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/teacher/student/${student.id}`}
                          className="text-[10px] font-black uppercase tracking-widest text-[#1CB0F6] hover:underline"
                        >
                          {t("teacher.viewDetails")}
                        </Link>
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
              <Trophy className="text-[#FFD900]" size={20} /> {t("teacher.rankingTitle")}
            </h3>
            <div className="space-y-4">
              {students.slice(0, 3).map((student, i) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-[#F7F7F7]"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-white shadow-sm shrink-0",
                      i === 0 ? "bg-[#FFD900]" : i === 1 ? "bg-[#E5E5E5]" : "bg-[#CD7F32]",
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#4B4B4B] text-sm truncate">
                      {student.displayName}
                    </p>
                    <p className="text-[10px] text-[#AFAFAF] font-bold uppercase">
                      {student.points} {t("teacher.xpLabel")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

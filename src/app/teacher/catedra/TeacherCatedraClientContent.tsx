"use client";

import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  GraduationCap,
  RotateCcw,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface StudentItem {
  id: string;
  displayName: string;
  email: string | null;
}

interface AttemptItem {
  id: string;
  studentId: string;
  quizId: string;
  score: number | null;
  isPassed: boolean | null;
  timeSpentSeconds: number | null;
  correctCount: number | null;
  incorrectCount: number | null;
  completedAtStr: string;
  studentName: string;
  studentEmail: string | null;
}

interface Props {
  students: StudentItem[];
  attempts: AttemptItem[];
}

export default function TeacherCatedraClientContent({ students, attempts }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Group attempts per student
  const studentStatsMap = useMemo(() => {
    const map: Record<
      string,
      {
        attemptsCount: number;
        bestScore: number | null;
        attemptsList: AttemptItem[];
      }
    > = {};

    for (const student of students) {
      map[student.id] = {
        attemptsCount: 0,
        bestScore: null,
        attemptsList: [],
      };
    }

    for (const att of attempts) {
      if (!map[att.studentId]) {
        map[att.studentId] = { attemptsCount: 0, bestScore: null, attemptsList: [] };
      }
      map[att.studentId].attemptsCount += 1;
      map[att.studentId].attemptsList.push(att);
      const currentBest = map[att.studentId].bestScore;
      if (att.score !== null) {
        if (currentBest === null || att.score > currentBest) {
          map[att.studentId].bestScore = att.score;
        }
      }
    }

    return map;
  }, [students, attempts]);

  // Filter students by search
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  // Export CSV for Sacint / UNACH
  const exportToCSV = () => {
    const headers = [
      "ID Estudiante",
      "Nombre Estudiante",
      "Email",
      "Unidad",
      "Intentos Realizados",
      "Mejor Porcentaje %",
      "Estado",
    ];

    const rows = students.map((s) => {
      const stats = studentStatsMap[s.id] || { attemptsCount: 0, bestScore: null };
      const status =
        stats.bestScore !== null && stats.bestScore >= 70
          ? "Aprobado / Cumplido"
          : stats.attemptsCount > 0
            ? "En Progreso"
            : "Sin Intentos";

      return [
        `"${s.id}"`,
        `"${s.displayName}"`,
        `"${s.email || ""}"`,
        '"Semana 1: Vocabulario (159-144)"',
        stats.attemptsCount,
        stats.bestScore !== null ? `${stats.bestScore}%` : "0%",
        `"${status}"`,
      ].join(",");
    });

    const csvContent = `data:text/csv;charset=utf-8,${[headers.join(","), ...rows].join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Reporte_Catedra_UNACH_Semana_1_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#FDFBF7] min-h-screen">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-6">
        <div>
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-xs font-black text-[#AFAFAF] hover:text-[#4B4B4B] uppercase tracking-wider mb-2"
          >
            <ArrowLeft size={16} /> Volver al Panel Docente
          </Link>
          <h1 className="text-2xl lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-3">
            <div className="p-2 bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-2xl text-[#1CB0F6]">
              <GraduationCap size={28} />
            </div>
            Gestión Cátedra UNACH: Vocabulario Semestral
          </h1>
          <p className="text-xs lg:text-sm font-bold text-[#777777] mt-1">
            Monitoreo exclusivo del cumplimiento de repasos semanales de la Prof.ª Jennifer Coleman.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportToCSV}
            className="bg-[#58CC02] hover:bg-[#61E002] border-2 border-[#58CC02] text-white px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_0_#46A302] flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download size={18} /> Exportar Reporte CSV
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3.5 bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-2xl text-[#1CB0F6]">
            <Users size={28} />
          </div>
          <div>
            <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">
              Alumnos Registrados
            </span>
            <p className="text-2xl font-black text-[#4B4B4B]">{students.length}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3.5 bg-[#FFF9E5] border-2 border-[#FFC800] rounded-2xl text-[#FF9600]">
            <RotateCcw size={28} />
          </div>
          <div>
            <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">
              Total Intentos Realizados
            </span>
            <p className="text-2xl font-black text-[#4B4B4B]">{attempts.length}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3.5 bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-2xl text-[#58CC02]">
            <Award size={28} />
          </div>
          <div>
            <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">
              Unidad Actual Activa
            </span>
            <p className="text-lg font-black text-[#4B4B4B]">Semana 1 (159-144)</p>
          </div>
        </div>
      </div>

      {/* Search & Student List Table */}
      <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_5px_0_0_#E5E5E5] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#4B4B4B] uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="text-[#1CB0F6]" size={20} />
            Libro de Calificaciones Cátedra (Semana 1)
          </h2>

          <div className="relative max-w-xs w-full">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-2xl text-xs font-bold text-[#4B4B4B] focus:outline-none focus:border-[#1CB0F6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#E5E5E5] text-[11px] font-black text-[#AFAFAF] uppercase tracking-wider">
                <th className="pb-3 px-4">Estudiante</th>
                <th className="pb-3 px-4">Intentos Realizados</th>
                <th className="pb-3 px-4">Mejor Porcentaje %</th>
                <th className="pb-3 px-4">Estado Semanal</th>
                <th className="pb-3 px-4 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[#E5E5E5] text-xs font-bold">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#AFAFAF]">
                    No se encontraron estudiantes para la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const stats = studentStatsMap[student.id] || {
                    attemptsCount: 0,
                    bestScore: null,
                    attemptsList: [],
                  };
                  const isExpanded = expandedStudentId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-[#FFFDF5] transition">
                      <td className="py-4 px-4">
                        <div className="font-black text-[#4B4B4B]">{student.displayName}</div>
                        <div className="text-[11px] font-bold text-[#AFAFAF]">
                          {student.email || "Sin correo"}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-black text-[#1CB0F6] bg-[#DDF4FF] px-3 py-1 rounded-full border border-[#84D8FF]">
                          {stats.attemptsCount} / 10
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-black text-[#FF9600]">
                          {stats.bestScore !== null ? `${stats.bestScore}%` : "Sin intentos"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {stats.bestScore !== null && stats.bestScore >= 70 ? (
                          <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#58CC02] border border-[#C8E6C9] px-2.5 py-1 rounded-full font-black text-[11px]">
                            <CheckCircle size={14} /> Cumplido
                          </span>
                        ) : stats.attemptsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-[#FFF9E5] text-[#FF9600] border border-[#FFE082] px-2.5 py-1 rounded-full font-black text-[11px]">
                            En progreso
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            Sin intentos
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] px-3 py-1.5 rounded-xl font-black text-xs text-[#4B4B4B] cursor-pointer transition shadow-[0_2px_0_0_#E5E5E5]"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              Ver Historial ({stats.attemptsCount}) <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Expanded Student Attempt Timeline */}
        {expandedStudentId && (
          <div className="bg-[#FFFDF5] border-2 border-[#1CB0F6] rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] pb-3">
              <h3 className="font-black text-[#4B4B4B] text-sm flex items-center gap-2">
                <User size={16} className="text-[#1CB0F6]" />
                Historial de Intentos:{" "}
                {students.find((s) => s.id === expandedStudentId)?.displayName}
              </h3>
              <button
                type="button"
                onClick={() => setExpandedStudentId(null)}
                className="text-xs font-bold text-[#AFAFAF] hover:text-[#4B4B4B]"
              >
                Cerrar ✕
              </button>
            </div>

            {studentStatsMap[expandedStudentId]?.attemptsList.length === 0 ? (
              <p className="text-xs font-bold text-[#AFAFAF] py-3">
                Este estudiante aún no ha realizado ningún intento en la Semana 1.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {studentStatsMap[expandedStudentId]?.attemptsList.map((att, idx) => (
                  <div
                    key={att.id}
                    className="bg-white border-2 border-[#E5E5E5] rounded-xl p-3.5 shadow-sm space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center font-black">
                      <span className="text-[#1CB0F6]">Intento #{idx + 1}</span>
                      <span className="text-[#FF9600] text-sm">{att.score}%</span>
                    </div>
                    <div className="flex justify-between text-[#777777] font-bold">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {Math.floor((att.timeSpentSeconds || 0) / 60)}m{" "}
                        {(att.timeSpentSeconds || 0) % 60}s
                      </span>
                      <span>
                        {new Date(att.completedAtStr).toLocaleDateString()} •{" "}
                        {new Date(att.completedAtStr).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  HelpCircle,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface StudentItem {
  id: string;
  displayName: string;
  email: string | null;
  role?: string;
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
  correctExerciseIds?: string | null;
  incorrectExerciseIds?: string | null;
  completedAtStr: string;
  studentName: string;
  studentEmail: string | null;
}

interface ExerciseItem {
  id: string;
  hebrewText: string | null;
  question: string | null;
  correctAnswer: string | null;
}

interface Props {
  students: StudentItem[];
  attempts: AttemptItem[];
  exercisesList: ExerciseItem[];
}

export default function TeacherCatedraClientContent({ students, attempts, exercisesList }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"resumen" | "palabras" | "intentos">("resumen");

  // Fast map of exercise details
  const exerciseMap = useMemo(() => {
    const map = new Map<string, ExerciseItem>();
    for (const ex of exercisesList) {
      map.set(ex.id, ex);
    }
    return map;
  }, [exercisesList]);

  // Group attempts per student
  const studentStatsMap = useMemo(() => {
    const map: Record<
      string,
      {
        attemptsCount: number;
        bestScore: number | null;
        avgScore: number | null;
        totalTimeSpentSeconds: number;
        attemptsList: AttemptItem[];
        failedExercisesFrequency: Record<string, number>;
        passedExerciseIds: Set<string>;
      }
    > = {};

    for (const student of students) {
      map[student.id] = {
        attemptsCount: 0,
        bestScore: null,
        avgScore: null,
        totalTimeSpentSeconds: 0,
        attemptsList: [],
        failedExercisesFrequency: {},
        passedExerciseIds: new Set<string>(),
      };
    }

    for (const att of attempts) {
      if (!map[att.studentId]) {
        map[att.studentId] = {
          attemptsCount: 0,
          bestScore: null,
          avgScore: null,
          totalTimeSpentSeconds: 0,
          attemptsList: [],
          failedExercisesFrequency: {},
          passedExerciseIds: new Set<string>(),
        };
      }

      const st = map[att.studentId];
      st.attemptsCount += 1;
      st.attemptsList.push(att);
      st.totalTimeSpentSeconds += att.timeSpentSeconds || 0;

      if (att.score !== null) {
        if (st.bestScore === null || att.score > st.bestScore) {
          st.bestScore = att.score;
        }
      }

      // Parse exercise IDs
      try {
        if (att.incorrectExerciseIds) {
          const failed: string[] = JSON.parse(att.incorrectExerciseIds);
          for (const exId of failed) {
            st.failedExercisesFrequency[exId] = (st.failedExercisesFrequency[exId] || 0) + 1;
          }
        }
      } catch {}

      try {
        if (att.correctExerciseIds) {
          const correct: string[] = JSON.parse(att.correctExerciseIds);
          for (const exId of correct) {
            st.passedExerciseIds.add(exId);
          }
        }
      } catch {}
    }

    // Calculate averages
    for (const st of Object.values(map)) {
      if (st.attemptsList.length > 0) {
        const totalScore = st.attemptsList.reduce((acc, curr) => acc + (curr.score || 0), 0);
        st.avgScore = Math.round(totalScore / st.attemptsList.length);
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

  // Overall class stats
  const classStats = useMemo(() => {
    const totalStudents = students.length;
    let completedStudents = 0;
    let totalScoreSum = 0;
    let scoredCount = 0;

    for (const s of students) {
      const stats = studentStatsMap[s.id];
      if (stats && stats.bestScore !== null) {
        scoredCount++;
        totalScoreSum += stats.bestScore;
        if (stats.bestScore >= 70) {
          completedStudents++;
        }
      }
    }

    const avgClassScore = scoredCount > 0 ? Math.round(totalScoreSum / scoredCount) : 0;
    const approvalPercentage =
      totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0;

    return {
      totalStudents,
      completedStudents,
      avgClassScore,
      approvalPercentage,
      totalAttempts: attempts.length,
    };
  }, [students, studentStatsMap, attempts]);

  // Export CSV for SACINT / UNACH
  const exportToCSV = () => {
    const headers = [
      "ID Estudiante",
      "Nombre Estudiante",
      "Email",
      "Rol",
      "Unidad Cátedra",
      "Intentos Usados (Max 10)",
      "Mejor Porcentaje %",
      "Promedio Porcentaje %",
      "Tiempo Total (Minutos)",
      "Estado Evaluación SACINT",
      "Palabras con Mayor Dificultad",
      "Fecha Último Intento",
    ];

    const rows = students.map((s) => {
      const stats = studentStatsMap[s.id] || {
        attemptsCount: 0,
        bestScore: null,
        avgScore: null,
        totalTimeSpentSeconds: 0,
        attemptsList: [],
        failedExercisesFrequency: {},
      };

      const status =
        stats.bestScore !== null && stats.bestScore >= 90
          ? "Cumplido Excelente (≥90%)"
          : stats.bestScore !== null && stats.bestScore >= 70
            ? "Aprobado (70%-89%)"
            : stats.attemptsCount > 0
              ? "Requiere Refuerzo (<70%)"
              : "Sin Entregas";

      const topFailed = Object.entries(stats.failedExercisesFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, count]) => {
          const ex = exerciseMap.get(id);
          return ex ? `${ex.hebrewText || id} (${count} fallos)` : `${id} (${count})`;
        })
        .join(" | ");

      const lastAttemptDate =
        stats.attemptsList.length > 0
          ? new Date(stats.attemptsList[0].completedAtStr).toLocaleDateString()
          : "N/A";

      return [
        `"${s.id}"`,
        `"${s.displayName}"`,
        `"${s.email || ""}"`,
        `"${s.role === "teacher" ? "DOCENTE" : "ESTUDIANTE"}"`,
        '"Semana 1: Vocabulario Semestral (159-144)"',
        stats.attemptsCount,
        stats.bestScore !== null ? `${stats.bestScore}%` : "0%",
        stats.avgScore !== null ? `${stats.avgScore}%` : "0%",
        Math.round(stats.totalTimeSpentSeconds / 60),
        `"${status}"`,
        `"${topFailed || "Ninguna"}"`,
        `"${lastAttemptDate}"`,
      ].join(",");
    });

    const csvContent = `data:text/csv;charset=utf-8,\uFEFF${[headers.join(","), ...rows].join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Expediente_Catedra_UNACH_Semana_1_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedStudentStats = expandedStudentId ? studentStatsMap[expandedStudentId] : null;
  const selectedStudent = expandedStudentId
    ? students.find((s) => s.id === expandedStudentId)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-[#FDFBF7] min-h-screen">
      {/* Header Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-6">
        <div>
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-xs font-black text-[#AFAFAF] hover:text-[#4B4B4B] uppercase tracking-wider mb-2 transition"
          >
            <ArrowLeft size={16} /> Volver al Panel Docente
          </Link>
          <h1 className="text-2xl lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-2xl text-[#1CB0F6] shadow-sm">
              <GraduationCap size={30} />
            </div>
            Gestión Pedagógica Cátedra UNACH
          </h1>
          <p className="text-xs lg:text-sm font-bold text-[#777777] mt-1">
            Expediente académico de repasos semanales de la Prof.ª Jennifer Coleman (Semana 1:
            Frecuencia 159-144).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportToCSV}
            className="bg-[#58CC02] hover:bg-[#61E002] border-2 border-[#58CC02] text-white px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_0_#46A302] flex items-center gap-2 cursor-pointer transition-all"
          >
            <FileSpreadsheet size={18} /> Exportar Reporte SACINT (CSV)
          </button>
        </div>
      </div>

      {/* Class Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3 bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-2xl text-[#1CB0F6]">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
              Alumnos Registrados
            </span>
            <p className="text-2xl font-black text-[#4B4B4B]">{classStats.totalStudents}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3 bg-[#E8F5E9] border-2 border-[#C8E6C9] rounded-2xl text-[#58CC02]">
            <Award size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
              Tasa de Aprobación (≥70%)
            </span>
            <p className="text-2xl font-black text-[#58CC02]">
              {classStats.approvalPercentage}%{" "}
              <span className="text-xs text-[#777777] font-bold">
                ({classStats.completedStudents}/{classStats.totalStudents})
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3 bg-[#FFF9E5] border-2 border-[#FFC800] rounded-2xl text-[#FF9600]">
            <RotateCcw size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
              Total Intentos Realizados
            </span>
            <p className="text-2xl font-black text-[#4B4B4B]">{classStats.totalAttempts}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-5 shadow-[0_4px_0_0_#E5E5E5] flex items-center gap-4">
          <div className="p-3 bg-[#F3E5F5] border-2 border-[#E1BEE7] rounded-2xl text-[#CE82FF]">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
              Promedio General Curso
            </span>
            <p className="text-2xl font-black text-[#CE82FF]">{classStats.avgClassScore}%</p>
          </div>
        </div>
      </div>

      {/* Main Roster & Gradebook Section */}
      <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-6 shadow-[0_5px_0_0_#E5E5E5] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#4B4B4B] uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="text-[#1CB0F6]" size={22} />
              Expediente Académico de Cátedra
            </h2>
            <p className="text-xs font-bold text-[#777777]">
              Selecciona cualquier estudiante para abrir su diagnóstico individual de vocabulario y
              racha.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AFAFAF]"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-2xl text-xs font-bold text-[#4B4B4B] focus:outline-none focus:border-[#1CB0F6] transition"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#E5E5E5] text-[11px] font-black text-[#AFAFAF] uppercase tracking-wider">
                <th className="pb-3 px-4">Estudiante</th>
                <th className="pb-3 px-4">Intentos Usados</th>
                <th className="pb-3 px-4">Mejor Nota</th>
                <th className="pb-3 px-4">Promedio</th>
                <th className="pb-3 px-4">Estado SACINT</th>
                <th className="pb-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[#E5E5E5] text-xs font-bold">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#AFAFAF]">
                    No se encontraron estudiantes registrados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const stats = studentStatsMap[student.id] || {
                    attemptsCount: 0,
                    bestScore: null,
                    avgScore: null,
                    attemptsList: [],
                  };
                  const isExpanded = expandedStudentId === student.id;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-[#FFFDF5] transition ${isExpanded ? "bg-[#F4F9FF]" : ""}`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-black text-[#4B4B4B] flex items-center gap-2">
                          {student.displayName}
                          {student.role === "teacher" && (
                            <span className="bg-[#FFF5E5] text-[#FF9600] border border-[#FFE082] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              DOCENTE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-[#AFAFAF]">
                          {student.email || "Sin correo"}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#1CB0F6] bg-[#DDF4FF] px-2.5 py-1 rounded-full border border-[#84D8FF] text-[11px]">
                            {stats.attemptsCount} / 10
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`font-black text-sm ${
                            stats.bestScore === null
                              ? "text-slate-400"
                              : stats.bestScore >= 90
                                ? "text-[#58CC02]"
                                : stats.bestScore >= 70
                                  ? "text-[#1CB0F6]"
                                  : "text-[#FF9600]"
                          }`}
                        >
                          {stats.bestScore !== null ? `${stats.bestScore}%` : "—"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[#777777] font-black">
                        {stats.avgScore !== null ? `${stats.avgScore}%` : "—"}
                      </td>

                      <td className="py-4 px-4">
                        {stats.bestScore !== null && stats.bestScore >= 90 ? (
                          <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#58CC02] border border-[#C8E6C9] px-2.5 py-1 rounded-full font-black text-[11px]">
                            <Sparkles size={13} /> Excelente
                          </span>
                        ) : stats.bestScore !== null && stats.bestScore >= 70 ? (
                          <span className="inline-flex items-center gap-1 bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF] px-2.5 py-1 rounded-full font-black text-[11px]">
                            <CheckCircle size={13} /> Aprobado
                          </span>
                        ) : stats.attemptsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-[#FFF9E5] text-[#FF9600] border border-[#FFE082] px-2.5 py-1 rounded-full font-black text-[11px]">
                            <AlertCircle size={13} /> Requiere Refuerzo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 border border-slate-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                            Sin Intentos
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedStudentId(null);
                            } else {
                              setExpandedStudentId(student.id);
                              setActiveTab("resumen");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] px-3.5 py-2 rounded-2xl font-black text-xs text-[#4B4B4B] cursor-pointer transition shadow-[0_2px_0_0_#E5E5E5] active:translate-y-[1px]"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              Diagnóstico <ChevronDown size={14} />
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

        {/* Detailed Student Diagnostic Drawer */}
        {expandedStudentId && selectedStudent && selectedStudentStats && (
          <div className="bg-[#FFFDF5] border-2 border-[#1CB0F6] rounded-3xl p-6 shadow-[0_6px_0_0_#84D8FF] space-y-6 animate-in fade-in duration-200">
            {/* Header Drawer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#1CB0F6] text-white rounded-2xl font-black text-lg">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-black text-[#4B4B4B] text-base lg:text-lg flex items-center gap-2">
                    {selectedStudent.displayName}
                    {selectedStudent.role === "teacher" && (
                      <span className="bg-[#FFF5E5] text-[#FF9600] border border-[#FFE082] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        DOCENTE
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-bold text-[#777777]">
                    {selectedStudent.email || "Sin correo registrado"} • ID: {selectedStudent.id}
                  </p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-2 bg-white border-2 border-[#E5E5E5] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab("resumen")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition cursor-pointer ${
                    activeTab === "resumen"
                      ? "bg-[#1CB0F6] text-white shadow-sm"
                      : "text-[#777777] hover:text-[#4B4B4B]"
                  }`}
                >
                  Resumen
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("palabras")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition cursor-pointer ${
                    activeTab === "palabras"
                      ? "bg-[#1CB0F6] text-white shadow-sm"
                      : "text-[#777777] hover:text-[#4B4B4B]"
                  }`}
                >
                  Palabras ({exercisesList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("intentos")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition cursor-pointer ${
                    activeTab === "intentos"
                      ? "bg-[#1CB0F6] text-white shadow-sm"
                      : "text-[#777777] hover:text-[#4B4B4B]"
                  }`}
                >
                  Intentos ({selectedStudentStats.attemptsCount})
                </button>
              </div>
            </div>

            {/* TAB 1: RESUMEN */}
            {activeTab === "resumen" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                      Mejor Porcentaje
                    </span>
                    <p className="text-xl font-black text-[#58CC02]">
                      {selectedStudentStats.bestScore !== null
                        ? `${selectedStudentStats.bestScore}%`
                        : "—"}
                    </p>
                  </div>

                  <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                      Promedio de Intentos
                    </span>
                    <p className="text-xl font-black text-[#1CB0F6]">
                      {selectedStudentStats.avgScore !== null
                        ? `${selectedStudentStats.avgScore}%`
                        : "—"}
                    </p>
                  </div>

                  <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                      Tiempo Total Invertido
                    </span>
                    <p className="text-xl font-black text-[#4B4B4B]">
                      {Math.floor(selectedStudentStats.totalTimeSpentSeconds / 60)}m{" "}
                      {selectedStudentStats.totalTimeSpentSeconds % 60}s
                    </p>
                  </div>

                  <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                    <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                      Dominio del Vocabulario
                    </span>
                    <p className="text-xl font-black text-[#CE82FF]">
                      {selectedStudentStats.passedExerciseIds.size} / {exercisesList.length}{" "}
                      <span className="text-xs text-[#777777]">palabras</span>
                    </p>
                  </div>
                </div>

                {/* Critical Words Alert Box */}
                {Object.keys(selectedStudentStats.failedExercisesFrequency).length > 0 && (
                  <div className="bg-white border-2 border-[#FFD9D9] rounded-2xl p-5 space-y-3">
                    <h4 className="font-black text-[#FF4B4B] text-xs uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle size={16} /> Palabras con Mayor Frecuencia de Error para{" "}
                      {selectedStudent.displayName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(selectedStudentStats.failedExercisesFrequency)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([exId, count]) => {
                          const ex = exerciseMap.get(exId);
                          return (
                            <div
                              key={exId}
                              className="bg-[#FFF5F5] border border-[#FFC1C1] rounded-xl p-3 text-xs space-y-1"
                            >
                              <div className="flex justify-between items-center font-black">
                                <span className="text-base text-[#4B4B4B] font-serif">
                                  {ex?.hebrewText || "Palabra"}
                                </span>
                                <span className="text-[#FF4B4B] bg-white px-2 py-0.5 rounded-full border border-[#FFC1C1] text-[10px]">
                                  {count} {count === 1 ? "fallo" : "fallos"}
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-[#777777]">
                                {ex?.correctAnswer || ex?.question}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PALABRAS DE CÁTEDRA */}
            {activeTab === "palabras" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-black text-[#777777]">
                  <span>Semana 1 — Listado completo de 26 palabras de Cátedra</span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[#58CC02]">
                      <CheckCircle2 size={14} /> Dominada
                    </span>
                    <span className="flex items-center gap-1 text-[#FF4B4B]">
                      <XCircle size={14} /> Fallada
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {exercisesList.map((ex) => {
                    const isPassed = selectedStudentStats.passedExerciseIds.has(ex.id);
                    const failCount = selectedStudentStats.failedExercisesFrequency[ex.id] || 0;

                    return (
                      <div
                        key={ex.id}
                        className={`bg-white border-2 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs shadow-sm ${
                          isPassed
                            ? "border-[#C8E6C9]"
                            : failCount > 0
                              ? "border-[#FFC1C1] bg-[#FFF8F8]"
                              : "border-[#E5E5E5]"
                        }`}
                      >
                        <div>
                          <p className="font-serif text-lg font-black text-[#4B4B4B]">
                            {ex.hebrewText}
                          </p>
                          <p className="font-bold text-[#777777] text-[11px]">{ex.correctAnswer}</p>
                        </div>

                        <div>
                          {isPassed ? (
                            <span className="bg-[#E8F5E9] text-[#58CC02] border border-[#C8E6C9] p-1.5 rounded-full inline-block">
                              <CheckCircle2 size={16} />
                            </span>
                          ) : failCount > 0 ? (
                            <span className="bg-[#FFF5F5] text-[#FF4B4B] border border-[#FFC1C1] px-2 py-0.5 rounded-full text-[10px] font-black">
                              {failCount} {failCount === 1 ? "fallo" : "fallos"}
                            </span>
                          ) : (
                            <span className="text-slate-300">
                              <HelpCircle size={16} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: INTENTOS */}
            {activeTab === "intentos" && (
              <div className="space-y-4">
                {selectedStudentStats.attemptsList.length === 0 ? (
                  <p className="text-xs font-bold text-[#AFAFAF] py-4 text-center">
                    Este estudiante aún no ha realizado intentos registrados.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedStudentStats.attemptsList.map((att, idx) => (
                      <div
                        key={att.id}
                        className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-sm space-y-3 text-xs"
                      >
                        <div className="flex justify-between items-center font-black">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF] px-3 py-1 rounded-full text-xs">
                              Intento #{selectedStudentStats.attemptsList.length - idx}
                            </span>
                            <span className="text-[#777777] text-[11px]">
                              {new Date(att.completedAtStr).toLocaleDateString()} •{" "}
                              {new Date(att.completedAtStr).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[#777777] font-bold flex items-center gap-1">
                              <Clock size={14} /> {Math.floor((att.timeSpentSeconds || 0) / 60)}m{" "}
                              {(att.timeSpentSeconds || 0) % 60}s
                            </span>
                            <span
                              className={`text-base font-black px-3 py-0.5 rounded-full ${
                                (att.score || 0) >= 70
                                  ? "bg-[#E8F5E9] text-[#58CC02] border border-[#C8E6C9]"
                                  : "bg-[#FFF9E5] text-[#FF9600] border border-[#FFE082]"
                              }`}
                            >
                              {att.score}%
                            </span>
                          </div>
                        </div>

                        {/* Breakdown of correct vs incorrect */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E5E5] text-[11px] font-bold">
                          <div className="text-[#58CC02]">
                            Correctas: {att.correctCount || 0} / {exercisesList.length}
                          </div>
                          <div className="text-[#FF4B4B]">
                            Incorrectas: {att.incorrectCount || 0} / {exercisesList.length}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

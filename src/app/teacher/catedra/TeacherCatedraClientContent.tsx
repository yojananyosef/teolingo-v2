"use client";

import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

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
  lessonId?: string | null;
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
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"resumen" | "palabras" | "intentos">("resumen");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWeekDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Multi-week: Filter active exercises for the selected week
  const activeExercises = useMemo(() => {
    const targetLessonId = `catedra-lesson-semana-${selectedWeekNumber}`;
    return exercisesList.filter((ex) => ex.lessonId === targetLessonId || !ex.lessonId);
  }, [exercisesList, selectedWeekNumber]);

  // Multi-week: Filter active attempts for the selected week
  const activeAttempts = useMemo(() => {
    const targetQuizId = `catedra-semana-${selectedWeekNumber}`;
    const targetLessonId = `catedra-lesson-semana-${selectedWeekNumber}`;
    return attempts.filter((att) => att.quizId === targetQuizId || att.quizId === targetLessonId);
  }, [attempts, selectedWeekNumber]);

  // Fast map of exercise details
  const exerciseMap = useMemo(() => {
    const map = new Map<string, ExerciseItem>();
    for (const ex of activeExercises) {
      map.set(ex.id, ex);
    }
    return map;
  }, [activeExercises]);

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

    for (const att of activeAttempts) {
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

      // Parse exercise IDs with 100% precision
      let parsedCorrect: string[] = [];
      let parsedIncorrect: string[] = [];

      try {
        if (att.incorrectExerciseIds) {
          parsedIncorrect = JSON.parse(att.incorrectExerciseIds);
          for (const exId of parsedIncorrect) {
            st.failedExercisesFrequency[exId] = (st.failedExercisesFrequency[exId] || 0) + 1;
          }
        }
      } catch {}

      try {
        if (att.correctExerciseIds) {
          parsedCorrect = JSON.parse(att.correctExerciseIds);
          for (const exId of parsedCorrect) {
            st.passedExerciseIds.add(exId);
          }
        }
      } catch {}

      // Robust check: Any exercise in activeExercises that was NOT in parsedIncorrect for ANY attempt is MARKED AS PASSED / DOMINADA!
      for (const ex of activeExercises) {
        if (parsedCorrect.includes(ex.id)) {
          st.passedExerciseIds.add(ex.id);
        } else if (parsedIncorrect.length > 0 && !parsedIncorrect.includes(ex.id)) {
          st.passedExerciseIds.add(ex.id);
        } else if (parsedIncorrect.length === 0 && (att.score || 0) > 0) {
          st.passedExerciseIds.add(ex.id);
        }
      }
    }

    // Calculate averages
    for (const st of Object.values(map)) {
      if (st.attemptsList.length > 0) {
        const totalScore = st.attemptsList.reduce((acc, curr) => acc + (curr.score || 0), 0);
        st.avgScore = Math.round(totalScore / st.attemptsList.length);
      }
    }

    return map;
  }, [students, activeAttempts, activeExercises]);

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
      if (stats && stats.avgScore !== null) {
        scoredCount++;
        totalScoreSum += stats.avgScore;
        if (stats.attemptsCount >= 6 && stats.avgScore >= 90) {
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
      totalAttempts: activeAttempts.length,
    };
  }, [students, studentStatsMap, activeAttempts]);

  // Toggle student expansion with auto-scroll
  const toggleStudent = (studentId: string) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
    } else {
      setExpandedStudentId(studentId);
      setActiveTab("resumen");
      setTimeout(() => {
        const el = document.getElementById(`diagnostic-panel-${studentId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  // Export CSV for UNACH
  const exportToCSV = () => {
    const headers = [
      "ID Estudiante",
      "Nombre Estudiante",
      "Email",
      "Rol",
      "Semana Cátedra",
      "Intentos Usados (Obligatorio 6, Max 10)",
      "Mejor Porcentaje %",
      "Promedio Porcentaje %",
      "Tiempo Total (Minutos)",
      "Estado Evaluación",
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
        stats.attemptsCount >= 6 && (stats.avgScore || 0) >= 90
          ? "Cumplido (≥6 intentos, Prom ≥90%)"
          : stats.attemptsCount > 0 && stats.attemptsCount < 6
            ? `Incompleto (Solo ${stats.attemptsCount}/6 intentos obligatorios)`
            : stats.attemptsCount >= 6 && (stats.avgScore || 0) < 90
              ? `Promedio Insuficiente (${stats.avgScore}% < 90%)`
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
        `"Semana ${selectedWeekNumber}: Vocabulario Semestral"`,
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
      `Expediente_Catedra_UNACH_Semana_${selectedWeekNumber}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            Expediente académico de repasos semanales de la Prof.ª Jennifer Coleman (Plan 16
            Semanas).
          </p>
        </div>

        {/* Custom 3D Duolingo Week Selector & Export */}
        <div className="flex flex-wrap items-center gap-3 relative" ref={dropdownRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsWeekDropdownOpen((prev) => !prev)}
              className="bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#4B4B4B] px-4 py-3 rounded-2xl shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5] flex items-center gap-3 cursor-pointer transition-all font-black text-xs uppercase"
            >
              <div className="p-1.5 bg-[#DDF4FF] border border-[#84D8FF] rounded-xl text-[#1CB0F6]">
                <Calendar size={16} />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-[#AFAFAF] uppercase tracking-wider font-black">
                  Unidad Seleccionada
                </span>
                <span className="text-xs font-black text-[#4B4B4B] flex items-center gap-1.5">
                  Semana {selectedWeekNumber}
                  {selectedWeekNumber === 1 && (
                    <span className="text-[10px] font-bold text-[#777777]">(159-144)</span>
                  )}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-[#1CB0F6] transition-transform duration-200 ${
                  isWeekDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Custom 3D Popover Dropdown Menu */}
            {isWeekDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-[480px] bg-white border-2 border-[#1CB0F6] rounded-3xl p-4.5 shadow-[0_12px_30px_-5px_rgba(28,176,246,0.35)] z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                <div className="flex items-center justify-between border-b-2 border-[#E5E5E5] pb-2.5">
                  <span className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider flex items-center gap-2">
                    <BookOpen size={16} className="text-[#1CB0F6]" />
                    Plan Semestral Cátedra (16 Semanas)
                  </span>
                  <span className="text-[10px] font-black bg-[#DDF4FF] text-[#1CB0F6] px-2.5 py-1 rounded-full border border-[#84D8FF]">
                    Semana {selectedWeekNumber} de 16
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#1CB0F6] scrollbar-track-[#F7F7F7]">
                  {Array.from({ length: 16 }, (_, i) => i + 1).map((weekNum) => {
                    const isSelected = selectedWeekNumber === weekNum;

                    return (
                      <button
                        key={weekNum}
                        type="button"
                        onClick={() => {
                          setSelectedWeekNumber(weekNum);
                          setIsWeekDropdownOpen(false);
                          setExpandedStudentId(null);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left font-black transition-all flex flex-col justify-between cursor-pointer active:translate-y-[1px] ${
                          isSelected
                            ? "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] shadow-[0_3px_0_0_#1899D6]"
                            : "bg-white hover:bg-[#F7F7F7] border-[#E5E5E5] text-[#4B4B4B] shadow-[0_3px_0_0_#E5E5E5]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Semana {weekNum}</span>
                          {isSelected && <CheckCircle2 size={14} className="text-[#1CB0F6]" />}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-1 ${
                            isSelected ? "text-[#1899D6]" : "text-[#AFAFAF]"
                          }`}
                        >
                          {weekNum === 1 ? "Frecuencia 159-144" : `Unidad Semestral #${weekNum}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={exportToCSV}
            className="bg-[#58CC02] hover:bg-[#61E002] border-2 border-[#58CC02] text-white px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_0_#46A302] flex items-center gap-2 cursor-pointer transition-all"
          >
            <FileSpreadsheet size={18} /> Exportar (CSV)
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
          <div className="p-3 bg-[#D7FFB7] border-2 border-[#58CC02] rounded-2xl text-[#58A700]">
            <Award size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
              Cumplimiento (≥6 int, Prom ≥90%)
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
              Intentos Semana {selectedWeekNumber}
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
              Promedio General Semana {selectedWeekNumber}
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
              Expediente Académico — Semana {selectedWeekNumber}
            </h2>
            <p className="text-xs font-bold text-[#777777]">
              Selecciona cualquier estudiante para desplegar su diagnóstico individual de
              vocabulario y racha.
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
                <th className="pb-3 px-4">Estado</th>
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
                    <React.Fragment key={student.id}>
                      <tr
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
                            <span
                              className={`font-black px-2.5 py-1 rounded-full border text-[11px] ${
                                stats.attemptsCount >= 6
                                  ? "bg-[#D7FFB7] text-[#58A700] border-[#58CC02]"
                                  : stats.attemptsCount > 0
                                    ? "bg-[#FFF9E5] text-[#FF9600] border-[#FFE082]"
                                    : "bg-[#DDF4FF] text-[#1CB0F6] border-[#84D8FF]"
                              }`}
                            >
                              {stats.attemptsCount} / 6
                            </span>
                            {stats.attemptsCount > 6 && (
                              <span className="text-[10px] font-bold text-[#777777]">
                                (+{stats.attemptsCount - 6} opcional)
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`font-black text-sm ${
                              stats.bestScore === null
                                ? "text-slate-400"
                                : stats.bestScore >= 90
                                  ? "text-[#58CC02]"
                                  : "text-[#FF9600]"
                            }`}
                          >
                            {stats.bestScore !== null ? `${stats.bestScore}%` : "—"}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`font-black text-sm ${
                              stats.avgScore === null
                                ? "text-slate-400"
                                : stats.avgScore >= 90
                                  ? "text-[#58CC02]"
                                  : "text-[#FF9600]"
                            }`}
                          >
                            {stats.avgScore !== null ? `${stats.avgScore}%` : "—"}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {stats.attemptsCount >= 6 && (stats.avgScore || 0) >= 90 ? (
                            <span className="inline-flex items-center gap-1 bg-[#D7FFB7] text-[#58A700] border border-[#58CC02] px-2.5 py-1 rounded-full font-black text-[11px]">
                              <Sparkles size={13} /> Cumplido
                            </span>
                          ) : stats.attemptsCount > 0 && stats.attemptsCount < 6 ? (
                            <span className="inline-flex items-center gap-1 bg-[#FFF9E5] text-[#FF9600] border border-[#FFE082] px-2.5 py-1 rounded-full font-black text-[11px]">
                              <AlertCircle size={13} /> Faltan Intentos ({stats.attemptsCount}/6)
                            </span>
                          ) : stats.attemptsCount >= 6 && (stats.avgScore || 0) < 90 ? (
                            <span className="inline-flex items-center gap-1 bg-[#FFDADC] text-[#EA2B2B] border border-[#FF4B4B] px-2.5 py-1 rounded-full font-black text-[11px]">
                              <AlertCircle size={13} /> Promedio Bajo ({stats.avgScore}%)
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
                            onClick={() => toggleStudent(student.id)}
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

                      {/* INLINE DIAGNOSTIC DRAWER DIRECTLY UNDER STUDENT ROW */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="p-0 border-b-2 border-[#1CB0F6]">
                            <div
                              id={`diagnostic-panel-${student.id}`}
                              className="bg-[#FFFDF5] border-x-2 border-b-2 border-[#1CB0F6] p-6 shadow-[0_6px_0_0_#84D8FF] space-y-6 my-2 rounded-b-3xl"
                            >
                              {/* Header Drawer */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#E5E5E5] pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-[#1CB0F6] text-white rounded-2xl font-black text-lg">
                                    <User size={22} />
                                  </div>
                                  <div>
                                    <h3 className="font-black text-[#4B4B4B] text-base lg:text-lg flex items-center gap-2">
                                      Expediente: {student.displayName}
                                      {student.role === "teacher" && (
                                        <span className="bg-[#FFF5E5] text-[#FF9600] border border-[#FFE082] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                          DOCENTE
                                        </span>
                                      )}
                                    </h3>
                                    <p className="text-xs font-bold text-[#777777]">
                                      {student.email || "Sin correo registrado"} • ID: {student.id}
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
                                    Palabras ({activeExercises.length})
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
                                    Intentos ({stats.attemptsCount})
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
                                        {stats.bestScore !== null ? `${stats.bestScore}%` : "—"}
                                      </p>
                                    </div>

                                    <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                                      <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                                        Promedio de Intentos
                                      </span>
                                      <p className="text-xl font-black text-[#1CB0F6]">
                                        {stats.avgScore !== null ? `${stats.avgScore}%` : "—"}
                                      </p>
                                    </div>

                                    <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                                      <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                                        Tiempo Total Invertido
                                      </span>
                                      <p className="text-xl font-black text-[#4B4B4B]">
                                        {Math.floor(stats.totalTimeSpentSeconds / 60)}m{" "}
                                        {stats.totalTimeSpentSeconds % 60}s
                                      </p>
                                    </div>

                                    <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 space-y-1">
                                      <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-wider block">
                                        Dominio del Vocabulario
                                      </span>
                                      <p className="text-xl font-black text-[#CE82FF]">
                                        {stats.passedExerciseIds.size} / {activeExercises.length}{" "}
                                        <span className="text-xs text-[#777777]">palabras</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Critical Words Alert Box */}
                                  {Object.keys(stats.failedExercisesFrequency).length > 0 && (
                                    <div className="bg-white border-2 border-[#FFD9D9] rounded-2xl p-5 space-y-3">
                                      <h4 className="font-black text-[#FF4B4B] text-xs uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle size={16} /> Palabras con Mayor Frecuencia de
                                        Errores para {student.displayName}
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.entries(stats.failedExercisesFrequency)
                                          .sort((a, b) => b[1] - a[1])
                                          .slice(0, 6)
                                          .map(([exId, count]) => {
                                            const ex = exerciseMap.get(exId);
                                            return (
                                              <div
                                                key={exId}
                                                className="bg-[#FFDADC] border border-[#FF4B4B] rounded-xl p-3 text-xs space-y-1"
                                              >
                                                <div className="flex justify-between items-center font-black">
                                                  <span className="text-base text-[#4B4B4B] font-serif">
                                                    {ex?.hebrewText || "Palabra"}
                                                  </span>
                                                  <span className="text-[#EA2B2B] bg-white px-2 py-0.5 rounded-full border border-[#FF4B4B] text-[10px]">
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
                                    <span>
                                      Semana {selectedWeekNumber} — Listado de{" "}
                                      {activeExercises.length} palabras de Cátedra
                                    </span>
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
                                    {activeExercises.map((ex) => {
                                      const isPassed = stats.passedExerciseIds.has(ex.id);
                                      const failCount = stats.failedExercisesFrequency[ex.id] || 0;

                                      return (
                                        <div
                                          key={ex.id}
                                          className={`bg-white border-2 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs shadow-sm ${
                                            isPassed
                                              ? "border-[#58CC02]"
                                              : failCount > 0
                                                ? "border-[#FF4B4B] bg-[#FFDADC]"
                                                : "border-[#E5E5E5]"
                                          }`}
                                        >
                                          <div>
                                            <p className="font-serif text-lg font-black text-[#4B4B4B]">
                                              {ex.hebrewText}
                                            </p>
                                            <p className="font-bold text-[#777777] text-[11px]">
                                              {ex.correctAnswer}
                                            </p>
                                          </div>

                                          <div>
                                            {isPassed ? (
                                              <span className="bg-[#D7FFB7] text-[#58A700] border border-[#58CC02] px-2.5 py-1 rounded-full inline-flex items-center gap-1 text-[11px] font-black">
                                                <CheckCircle2 size={14} /> Dominada
                                              </span>
                                            ) : failCount > 0 ? (
                                              <span className="bg-[#FFDADC] text-[#EA2B2B] border border-[#FF4B4B] px-2.5 py-1 rounded-full text-[10px] font-black">
                                                {failCount} {failCount === 1 ? "fallo" : "fallos"}
                                              </span>
                                            ) : (
                                              <span className="text-slate-400 font-bold text-[11px]">
                                                Sin evaluar
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
                                  {stats.attemptsList.length === 0 ? (
                                    <p className="text-xs font-bold text-[#AFAFAF] py-4 text-center">
                                      Este estudiante aún no ha realizado intentos registrados.
                                    </p>
                                  ) : (
                                    <div className="space-y-3">
                                      {stats.attemptsList.map((att, idx) => {
                                        const cCount =
                                          att.correctCount && att.correctCount > 0
                                            ? att.correctCount
                                            : att.score === 100
                                              ? activeExercises.length
                                              : Math.round(
                                                  ((att.score || 0) / 100) * activeExercises.length,
                                                );

                                        const iCount =
                                          att.incorrectCount !== null &&
                                          att.incorrectCount !== undefined &&
                                          att.incorrectCount > 0
                                            ? att.incorrectCount
                                            : Math.max(0, activeExercises.length - cCount);

                                        return (
                                          <div
                                            key={att.id}
                                            className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 shadow-sm space-y-3 text-xs"
                                          >
                                            <div className="flex justify-between items-center font-black">
                                              <div className="flex items-center gap-2">
                                                <span className="bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF] px-3 py-1 rounded-full text-xs">
                                                  Intento #{stats.attemptsList.length - idx}
                                                </span>
                                                <span className="text-[#777777] text-[11px]">
                                                  {new Date(
                                                    att.completedAtStr,
                                                  ).toLocaleDateString()}{" "}
                                                  •{" "}
                                                  {new Date(att.completedAtStr).toLocaleTimeString(
                                                    [],
                                                    {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                    },
                                                  )}
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-3">
                                                <span className="text-[#777777] font-bold flex items-center gap-1">
                                                  <Clock size={14} />{" "}
                                                  {Math.floor((att.timeSpentSeconds || 0) / 60)}m{" "}
                                                  {(att.timeSpentSeconds || 0) % 60}s
                                                </span>
                                                <span
                                                  className={`text-base font-black px-3 py-0.5 rounded-full ${
                                                    (att.score || 0) >= 70
                                                      ? "bg-[#D7FFB7] text-[#58A700] border border-[#58CC02]"
                                                      : "bg-[#FFF9E5] text-[#FF9600] border border-[#FFE082]"
                                                  }`}
                                                >
                                                  {att.score}%
                                                </span>
                                              </div>
                                            </div>

                                            {/* Breakdown of correct vs incorrect */}
                                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E5E5] text-[11px] font-bold">
                                              <div className="text-[#58CC02] flex items-center gap-1 font-black">
                                                <CheckCircle2 size={14} /> Correctas: {cCount} /{" "}
                                                {activeExercises.length}
                                              </div>
                                              <div className="text-[#FF4B4B] flex items-center gap-1 font-black">
                                                <XCircle size={14} /> Incorrectas: {iCount} /{" "}
                                                {activeExercises.length}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

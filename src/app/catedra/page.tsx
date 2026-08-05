"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getSessionAction } from "@/features/auth/actions";
import {
  Award,
  BookOpen,
  CheckCircle,
  Flame,
  GraduationCap,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CatedraWeek {
  id: string;
  number: number;
  title: string;
  range: string;
  wordCount: number;
  allowedAttempts: number;
  available: boolean;
}

const WEEKS_DATA: CatedraWeek[] = [
  {
    id: "catedra-semana-1",
    number: 1,
    title: "Vocabulario Semana 1",
    range: "Frecuencia 159-144",
    wordCount: 26,
    allowedAttempts: 10,
    available: true,
  },
  {
    id: "catedra-semana-2",
    number: 2,
    title: "Vocabulario Semana 2",
    range: "Frecuencia 143-134",
    wordCount: 26,
    allowedAttempts: 10,
    available: true,
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `catedra-semana-${i + 3}`,
    number: i + 3,
    title: `Vocabulario Semana ${i + 3}`,
    range: "Programado según silabo",
    wordCount: 25,
    allowedAttempts: 10,
    available: false,
  })),
];

export default function CatedraDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Estudiante");
  const [streak, setStreak] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [attemptsMap, setAttemptsMap] = useState<
    Record<string, { count: number; bestScore: number | null }>
  >({});

  useEffect(() => {
    async function loadUserData() {
      try {
        const session = await getSessionAction();
        if (session) {
          if (session.displayName) setUserName(session.displayName);
          setStreak(session.streak || 0);
          setPoints(session.points || 0);
          setLevel(session.level || 1);
        }

        const res = await fetch("/api/quizzes/pending-count");
        if (res.ok) {
          const data = await res.json();
          if (data.catedraStats) {
            setAttemptsMap(data.catedraStats);
          }
        }
      } catch (err) {
        console.error("Error loading catedra user stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#FDFBF7] pb-24">
      {/* Sticky Header Duolingo-like */}
      <header className="flex items-center justify-between bg-[#FFFDF5] p-4 lg:p-6 sticky top-0 z-20 border-b-2 border-[#E5E5E5] px-4 lg:px-8 shrink-0">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="p-2.5 bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-2xl text-[#1CB0F6] shadow-[0_2px_0_0_#84D8FF]">
            <GraduationCap size={26} />
          </div>
          <div>
            <h1 className="text-base lg:text-2xl font-black text-[#4B4B4B] tracking-wide uppercase">
              Cátedra UNACH
            </h1>
            <p className="text-xs font-extrabold text-[#AFAFAF] hidden sm:block">
              Vocabulario Semestral • Facultad de Teología
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div
            className="flex items-center gap-1.5 font-black text-[#FF9600] text-sm lg:text-xl"
            title="Racha actual"
          >
            <Flame size={20} className="fill-[#FF9600]" />
            <span>{streak}</span>
          </div>
          <div
            className="flex items-center gap-1.5 font-black text-[#1CB0F6] text-sm lg:text-xl"
            title="Puntos de experiencia"
          >
            <Star size={20} className="fill-[#1CB0F6]" />
            <span>{points}</span>
          </div>
          <div
            className="flex items-center gap-1.5 font-black text-[#FFC800] text-sm lg:text-xl"
            title="Nivel alcanzado"
          >
            <Trophy size={20} className="fill-[#FFC800]" />
            <span>{level}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-4 lg:px-8 py-8 space-y-10">
        {/* Duolingo Banner */}
        <div className="bg-gradient-to-r from-[#1CB0F6] to-[#00C2A8] text-white p-6 lg:p-8 rounded-3xl shadow-[0_6px_0_0_#1899D6] border-2 border-[#1CB0F6] relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <GraduationCap size={220} />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-black uppercase tracking-wider text-white">
              <Sparkles size={14} />
              Cátedra de Hebreo I & II
            </div>
            <h2 className="text-2xl lg:text-4xl font-black tracking-tight">
              Bienvenido/a, {userName} 🎓
            </h2>
            <p className="text-white/95 text-sm lg:text-base font-bold max-w-2xl leading-relaxed">
              Este módulo reemplaza la sección de vocabulario en los quizzes semanales. Completa los
              repasos diarios (máximo 10 intentos por unidad) para afianzar tu léxico mediante
              repetición activa.
            </p>

            <div className="flex flex-wrap gap-2 pt-2 text-xs font-black">
              <span className="bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Prof.ª Jennifer Coleman
              </span>
              <span className="bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 flex items-center gap-1.5">
                <RotateCcw size={14} /> Máx. 10 Intentos por Unidad
              </span>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="space-y-1 border-b-2 border-[#E5E5E5] pb-4">
          <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="text-[#1CB0F6]" size={24} />
            Unidades del Semestre (16 Semanas)
          </h2>
          <p className="text-xs lg:text-sm font-bold text-[#777777]">
            Selecciona la unidad activa de esta semana para realizar tus intentos de
            familiarización.
          </p>
        </div>

        {/* 16 Weeks Grid (Duolingo Card Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEEKS_DATA.map((week) => {
            const stats = attemptsMap[week.id] || { count: 0, bestScore: null };
            const attemptsLeft = week.allowedAttempts - stats.count;

            return (
              <div
                key={week.id}
                className={`bg-white border-2 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between ${
                  week.available
                    ? "border-[#1CB0F6] shadow-[0_5px_0_0_#1899D6] hover:-translate-y-1"
                    : "border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] opacity-60 bg-slate-50"
                }`}
              >
                <div className="space-y-4">
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        week.available
                          ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"
                          : "bg-slate-100 border-slate-200 text-slate-400"
                      }`}
                    >
                      Semana {week.number}
                    </span>

                    {week.available ? (
                      <span className="flex items-center gap-1 text-xs font-black text-[#58CC02] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                        <CheckCircle size={14} /> Activo
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                        Bloqueada
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#4B4B4B]">{week.title}</h3>
                    <p className="text-xs font-bold text-[#AFAFAF] flex items-center gap-1.5 mt-1">
                      <BookOpen size={14} className="text-[#1CB0F6]" />
                      {week.range} • {week.wordCount} Palabras
                    </p>
                  </div>

                  {/* Student Stats Box */}
                  {week.available && (
                    <div className="bg-[#FFFDF5] border-2 border-[#E5E5E5] rounded-2xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-[#4B4B4B]">
                        <span className="flex items-center gap-1 text-[#777777]">
                          <RotateCcw size={14} className="text-[#1CB0F6]" />
                          Intentos:
                        </span>
                        <span className="font-black text-[#1CB0F6]">
                          {stats.count} / {week.allowedAttempts}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-bold text-[#4B4B4B]">
                        <span className="flex items-center gap-1 text-[#777777]">
                          <Award size={14} className="text-[#FFC800]" />
                          Mejor Nota:
                        </span>
                        <span className="font-black text-[#FF9600]">
                          {stats.bestScore !== null ? `${stats.bestScore}%` : "Sin intentos"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Duolingo Action Button */}
                <div className="pt-6">
                  {week.available ? (
                    attemptsLeft > 0 ? (
                      <Link
                        href={`/catedra/semana/${week.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#1CB0F6] hover:bg-[#24B7F8] border-2 border-[#1CB0F6] text-white font-black py-3.5 px-4 rounded-2xl transition-all text-sm uppercase tracking-wider shadow-[0_4px_0_0_#1899D6] active:translate-y-[2px] active:shadow-[0_2px_0_0_#1899D6] cursor-pointer"
                      >
                        <Play size={16} className="fill-white" />
                        {stats.count > 0 ? "Nuevo Intento" : "Iniciar Intento 1"}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3.5 px-4 bg-[#E5E5E5] text-[#AFAFAF] border-2 border-[#E5E5E5] rounded-2xl font-black text-xs uppercase tracking-wider text-center cursor-not-allowed"
                      >
                        Límite de 10 intentos alcanzado
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 px-4 bg-[#E5E5E5] text-[#AFAFAF] border-2 border-[#E5E5E5] rounded-2xl font-black text-xs uppercase tracking-wider text-center cursor-not-allowed"
                    >
                      Semana Bloqueada
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

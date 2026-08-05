"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getSessionAction } from "@/features/auth/actions";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Play,
  RotateCcw,
  ShieldCheck,
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
  userAttemptsCount?: number;
  userBestScore?: number | null;
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
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `catedra-semana-${i + 2}`,
    number: i + 2,
    title: `Vocabulario Semana ${i + 2}`,
    range: "Programado según silabo",
    wordCount: 25,
    allowedAttempts: 10,
    available: false,
  })),
];

export default function CatedraDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Estudiante");
  const [attemptsMap, setAttemptsMap] = useState<
    Record<string, { count: number; bestScore: number | null }>
  >({});

  useEffect(() => {
    async function loadUserData() {
      try {
        const session = await getSessionAction();
        if (session?.displayName) {
          setUserName(session.displayName);
        }

        // Fetch user attempts count & scores
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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24">
      {/* Top Banner Académico UNACH */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-6 shadow-md border-b-4 border-indigo-500">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-3 text-indigo-400 font-bold uppercase tracking-widest text-xs">
            <GraduationCap className="w-5 h-5" />
            <span>Facultad de Teología • Universidad Adventista de Chile</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Cátedra de Hebreo I & II: Vocabulario Semestral
          </h1>
          <p className="text-slate-300 max-w-3xl text-sm lg:text-base leading-relaxed">
            Bienvenido/a, <span className="text-indigo-300 font-bold">{userName}</span>. Este módulo
            reemplaza la sección de vocabulario en los quizzes semanales. Completa los repasos
            diarios (máximo 10 intentos por unidad) para afianzar tu léxico mediante repetición
            activa.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Docente: Prof.ª Jennifer Coleman</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>Máximo 10 Intentos por Semana</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Evaluación Formativa Continua</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de las 16 Semanas */}
      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#4B4B4B]">
              Unidades del Semestre (16 Semanas)
            </h2>
            <p className="text-sm font-medium text-[#777777]">
              Selecciona la unidad de la semana actual para realizar tus intentos de
              familiarización.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WEEKS_DATA.map((week) => {
            const stats = attemptsMap[week.id] || { count: 0, bestScore: null };
            const attemptsLeft = week.allowedAttempts - stats.count;

            return (
              <div
                key={week.id}
                className={`bg-white border-2 rounded-3xl p-6 transition duration-200 flex flex-col justify-between ${
                  week.available
                    ? "border-[#E5E5E5] hover:border-indigo-500 shadow-sm hover:shadow-md"
                    : "border-slate-200 opacity-60 bg-slate-50"
                }`}
              >
                <div className="space-y-4">
                  {/* Header de la Tarjeta */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                      Semana {week.number}
                    </span>
                    {week.available ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle className="w-3.5 h-3.5" /> Activo
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                        Próximamente
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#4B4B4B]">{week.title}</h3>
                    <p className="text-xs font-semibold text-[#777777] flex items-center gap-1 mt-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      {week.range} • {week.wordCount} Palabras
                    </p>
                  </div>

                  {/* Estadísticas de Intentos del Estudiante */}
                  {week.available && (
                    <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-2xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-[#4B4B4B]">
                        <span className="flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          Intentos Realizados:
                        </span>
                        <span className="font-extrabold text-indigo-600">
                          {stats.count} / {week.allowedAttempts}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-bold text-[#4B4B4B]">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          Mejor Porcentaje:
                        </span>
                        <span className="font-extrabold text-amber-600">
                          {stats.bestScore !== null ? `${stats.bestScore}%` : "Sin intentos"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de Acción */}
                <div className="pt-6">
                  {week.available ? (
                    attemptsLeft > 0 ? (
                      <Link
                        href={`/catedra/semana/${week.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-4 rounded-2xl transition duration-200 text-sm uppercase tracking-wider shadow-sm active:translate-y-0.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {stats.count > 0 ? "Nuevo Intento" : "Iniciar Intento 1"}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-3 px-4 bg-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase text-center"
                      >
                        Límite de 10 intentos alcanzado
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 px-4 bg-slate-100 text-slate-400 rounded-2xl font-bold text-xs uppercase text-center"
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

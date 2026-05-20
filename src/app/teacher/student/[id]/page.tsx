import { db } from "@/infrastructure/database/db";
import {
  exercises,
  flashcards,
  lessons,
  userFlashcardProgress,
  userIsraeliProgress,
  userMistakes,
  userProgress,
  users,
} from "@/infrastructure/database/schema";
import { getSession } from "@/infrastructure/lib/auth";
import { avg, count, desc, eq } from "drizzle-orm";
import { AlertCircle } from "lucide-react";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Flame,
  GraduationCap,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/learn");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const [student] = await db.select().from(users).where(eq(users.id, id));

  if (!student) {
    notFound();
  }

  // Métricas de Lecciones
  const completedLessons = await db
    .select({
      id: userProgress.id,
      accuracy: userProgress.accuracy,
      isPerfect: userProgress.isPerfect,
      completedAt: userProgress.completedAt,
      lessonTitle: lessons.title,
      moduleIndex: lessons.moduleIndex,
    })
    .from(userProgress)
    .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
    .where(eq(userProgress.userId, id))
    .orderBy(desc(userProgress.completedAt));

  const averageAccuracy =
    completedLessons.length > 0
      ? Math.round(
          completedLessons.reduce((acc, curr) => acc + curr.accuracy, 0) / completedLessons.length,
        )
      : 0;

  const perfectLessons = completedLessons.filter((l) => l.isPerfect).length;

  // Métricas de Flashcards (SRS) y Frecuencia
  const flashcardsData = await db
    .select({
      interval: userFlashcardProgress.interval,
      easeFactor: userFlashcardProgress.easeFactor,
      category: flashcards.category,
    })
    .from(userFlashcardProgress)
    .innerJoin(flashcards, eq(userFlashcardProgress.flashcardId, flashcards.id))
    .where(eq(userFlashcardProgress.userId, id));

  const cardsLearned = flashcardsData.length;
  const cardsInReview = flashcardsData.filter((f) => f.interval > 0).length;

  // Estadísticas de frecuencia
  const frequencyStats = flashcardsData.reduce(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const freq1Count = frequencyStats["freq-1"] || 0;
  const freq2Count = frequencyStats["freq-2"] || 0;
  const freq3Count = frequencyStats["freq-3"] || 0;

  // Promedio de retención (basado en repeticiones exitosas vs fallidas, o easeFactor)
  // easeFactor > 250 significa buena retención.
  const averageEase =
    flashcardsData.length > 0
      ? flashcardsData.reduce((acc, curr) => acc + curr.easeFactor, 0) / flashcardsData.length
      : 250;

  const retentionQuality =
    averageEase > 260 ? "Excelente" : averageEase > 240 ? "Buena" : "Necesita Refuerzo";

  // Modo Israelí
  const [israeliProgress] = await db
    .select({ count: count() })
    .from(userIsraeliProgress)
    .where(eq(userIsraeliProgress.userId, id));

  // Top 5 Errores (Conceptos a reforzar)
  const topMistakes = await db
    .select({
      mistakeCount: userMistakes.mistakeCount,
      lastMistakeAt: userMistakes.lastMistakeAt,
      question: exercises.question,
      correctAnswer: exercises.correctAnswer,
      type: exercises.type,
      lessonTitle: lessons.title,
    })
    .from(userMistakes)
    .innerJoin(exercises, eq(userMistakes.exerciseId, exercises.id))
    .innerJoin(lessons, eq(exercises.lessonId, lessons.id))
    .where(eq(userMistakes.userId, id))
    .orderBy(desc(userMistakes.mistakeCount))
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-2 text-[#AFAFAF] hover:text-[#4B4B4B] font-black uppercase tracking-widest text-xs transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Volver al Panel
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#DDF4FF] text-[#1CB0F6] rounded-full flex items-center justify-center text-2xl font-black shadow-sm">
            {student.displayName[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {student.displayName}
            </h1>
            <p className="text-[#777777] font-bold">{student.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            Nivel
          </p>
          <p className="text-2xl font-black text-[#1CB0F6] flex items-center gap-2">
            <GraduationCap size={24} /> {student.level}
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            Puntos Totales
          </p>
          <p className="text-2xl font-black text-[#FFD900] flex items-center gap-2">
            <Zap size={24} /> {student.points} XP
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            Racha Actual
          </p>
          <p className="text-2xl font-black text-[#FF9600] flex items-center gap-2">
            <Flame size={24} /> {student.streak} días
          </p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] p-4 flex flex-col justify-center shadow-sm">
          <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
            Lecciones Perfectas
          </p>
          <p className="text-2xl font-black text-[#58CC02] flex items-center gap-2">
            <Target size={24} /> {perfectLessons}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Neurocognitive & Learning Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-[#E5E5E5]">
              <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
                <Brain className="text-[#CE82FF]" size={24} /> Perfil Neurocognitivo
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-[#777777] uppercase">
                    Precisión Media
                  </span>
                  <span className="text-lg font-black text-[#58CC02]">{averageAccuracy}%</span>
                </div>
                <div className="w-full h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#58CC02] rounded-full"
                    style={{ width: `${averageAccuracy}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-[#E5E5E5]">
                <div>
                  <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">
                    Tarjetas SRS Aprendidas
                  </p>
                  <p className="text-xl font-black text-[#4B4B4B]">{cardsLearned}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">
                    Tarjetas en Repaso
                  </p>
                  <p className="text-xl font-black text-[#4B4B4B]">{cardsInReview}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">
                    Calidad de Retención
                  </p>
                  <p className="text-lg font-black text-[#1CB0F6]">{retentionQuality}</p>
                </div>
              </div>

              {/* Dominio por Frecuencia Bíblica */}
              <div className="pt-4 border-t-2 border-[#E5E5E5]">
                <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-3">
                  Dominio de Vocabulario (Frecuencia)
                </p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#777] mb-1">
                      <span>Freq 1 (Top 100)</span>
                      <span>{freq1Count} palabras</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1CB0F6]"
                        style={{ width: `${Math.min((freq1Count / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#777] mb-1">
                      <span>Freq 2 (101-200)</span>
                      <span>{freq2Count} palabras</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#CE82FF]"
                        style={{ width: `${Math.min((freq2Count / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#777] mb-1">
                      <span>Freq 3 (201-300)</span>
                      <span>{freq3Count} palabras</span>
                    </div>
                    <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF9600]"
                        style={{ width: `${Math.min((freq3Count / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-[#E5E5E5]">
              <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
                <BookOpen className="text-[#FF4B4B]" size={24} /> Modo Israelí
              </h2>
            </div>
            <div className="p-6">
              <p className="text-[#777777] font-bold">
                Unidades completadas en inmersión comunicativa:
              </p>
              <p className="text-3xl font-black text-[#4B4B4B] mt-2">{israeliProgress.count}</p>
            </div>
          </div>
        </div>

        {/* Lecciones Completadas Historial */}
        <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm h-fit">
          <div className="p-6 border-b-2 border-[#E5E5E5]">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight flex items-center gap-2">
              <CheckCircle className="text-[#58CC02]" size={24} /> Historial de Lecciones
            </h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
            {completedLessons.length === 0 ? (
              <p className="text-center text-[#AFAFAF] font-bold py-8">
                El estudiante aún no ha completado ninguna lección.
              </p>
            ) : (
              completedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors"
                >
                  <div>
                    <span className="text-[10px] text-[#1CB0F6] font-black uppercase tracking-widest bg-[#DDF4FF] px-2 py-0.5 rounded-full mb-2 inline-block">
                      Módulo {lesson.moduleIndex}
                    </span>
                    <h3 className="font-black text-[#4B4B4B] text-sm">{lesson.lessonTitle}</h3>
                    <p className="text-xs text-[#AFAFAF] font-bold flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {lesson.completedAt
                        ? new Date(lesson.completedAt).toLocaleDateString()
                        : "Completado"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-black ${
                        lesson.accuracy >= 80 ? "text-[#58CC02]" : "text-[#FF9600]"
                      }`}
                    >
                      {lesson.accuracy}%
                    </p>
                    {lesson.isPerfect && (
                      <span className="text-[10px] text-[#FFD900] font-black uppercase tracking-widest flex items-center justify-end gap-0.5">
                        <Target size={10} /> Perfecta
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Conceptos a Reforzar */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm mt-8">
        <div className="p-6 border-b-2 border-[#E5E5E5] flex items-center gap-2">
          <AlertCircle className="text-[#FF4B4B]" size={24} />
          <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Conceptos a Reforzar (Top Errores)
          </h2>
        </div>
        <div className="p-6">
          {topMistakes.length === 0 ? (
            <p className="text-center text-[#AFAFAF] font-bold py-8">
              No hay registro de errores frecuentes para este alumno.
            </p>
          ) : (
            <div className="space-y-4">
              {topMistakes.map((mistake, index) => (
                <div key={index} className="p-4 rounded-2xl border-2 border-[#FFEBEB] bg-[#FFF5F5]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-[#FF4B4B] font-black uppercase tracking-widest bg-[#FFEBEB] px-2 py-0.5 rounded-full">
                      Falló {mistake.mistakeCount} veces
                    </span>
                    <span className="text-xs text-[#AFAFAF] font-bold">
                      Última vez: {new Date(mistake.lastMistakeAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#777] mb-1">
                    Lección: {mistake.lessonTitle}
                  </p>
                  <p className="text-lg font-black text-[#4B4B4B] mb-2">{mistake.question}</p>
                  <div className="p-2 bg-white rounded-xl border border-[#E5E5E5]">
                    <span className="text-[10px] text-[#58CC02] font-black uppercase tracking-widest block mb-1">
                      Respuesta Correcta
                    </span>
                    <span className="font-bold text-[#4B4B4B]">{mistake.correctAnswer}</span>
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

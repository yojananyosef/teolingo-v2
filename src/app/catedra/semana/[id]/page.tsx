"use client";

import { HebrewWordIME } from "@/components/HebrewWordIME";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { completeLessonAction } from "@/features/lessons/actions";
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Clock,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

interface QuizQuestionItem {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  hebrewText?: string;
  hint?: string;
}

// Mezcla aleatoria Fisher-Yates
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function CatedraQuizExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [failedExerciseIds, setFailedExerciseIds] = useState<string[]>([]);
  const [correctExerciseIds, setCorrectExerciseIds] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);

  useEffect(() => {
    async function loadQuizData() {
      try {
        const res = await fetch(
          `/api/lessons/quiz-${quizId.replace("quiz-", "").replace("catedra-", "")}`,
        );
        if (!res.ok) {
          // Fallback fetch if direct api fails
          const fallbackRes = await fetch("/api/lessons/catedra-semana-1");
          if (!fallbackRes.ok) {
            toast.error("No se pudieron cargar las preguntas del cuestionario.");
            setLoading(false);
            return;
          }
          const data = await fallbackRes.json();
          processQuestions(data.exercises || []);
          return;
        }
        const data = await res.json();
        processQuestions(data.exercises || []);
      } catch (err) {
        console.error("Error loading catedra quiz:", err);
        toast.error("Error de conexión al cargar la unidad.");
      } finally {
        setLoading(false);
      }
    }

    function processQuestions(rawExercises: Record<string, unknown>[]) {
      const mapped: QuizQuestionItem[] = rawExercises.map((ex) => {
        let opts: string[] = [];
        try {
          opts =
            typeof ex.options === "string"
              ? JSON.parse(ex.options)
              : (ex.options as string[]) || [];
        } catch {
          opts = [ex.correctAnswer as string];
        }
        return {
          id: ex.id as string,
          question: ex.question as string,
          correctAnswer: ex.correctAnswer as string,
          options: opts,
          hebrewText: ex.hebrewText as string | undefined,
          hint: ex.hint as string | undefined,
        };
      });

      // Aleatorizar preguntas en cada nuevo intento
      const randomizedQuestions = shuffleArray(mapped).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

      setQuestions(randomizedQuestions);
    }

    loadQuizData();
  }, [quizId]);

  // Cronómetro de tiempo transcurrido
  useEffect(() => {
    if (loading || isCompleted) return;
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, isCompleted]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswered) return;

    const currentQuestion = questions[currentIndex];
    const correct = selectedOption === currentQuestion.correctAnswer;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      setCorrectExerciseIds((prev) => [...prev, currentQuestion.id]);
    } else {
      setFailedExerciseIds((prev) => [...prev, currentQuestion.id]);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Final del intento
      await finishQuizAttempt();
    }
  };

  const finishQuizAttempt = async () => {
    setIsSubmitting(true);
    const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
    const total = questions.length;
    const scorePct = total > 0 ? Math.round((finalCorrect / total) * 100) : 0;
    setScorePercentage(scorePct);

    try {
      const result = await completeLessonAction(
        "catedra-lesson-semana-1",
        scorePct,
        failedExerciseIds,
        {
          timeSpentSeconds: timeSpent,
          timeLimitSeconds: 600,
          correctExerciseIds: correctExerciseIds,
          timedOut: false,
        },
      );

      if (!result.success) {
        toast.error(result.error || "No se pudo registrar el intento.");
      } else {
        toast.success("¡Intento registrado exitosamente!");
      }
    } catch (err) {
      console.error("Error submitting attempt:", err);
    } finally {
      setIsSubmitting(false);
      setIsCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <LoadingSpinner />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] p-6">
        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-black text-[#4B4B4B]">No se encontraron preguntas</h2>
          <p className="text-sm text-[#777777]">
            No pudimos cargar los ejercicios para esta semana de Cátedra.
          </p>
          <Link
            href="/catedra"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase"
          >
            Volver a Cátedra
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla de Resumen de Intento Completado
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-6">
        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-md">
          <div className="w-20 h-20 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#4B4B4B]">¡Intento Finalizado!</h2>
            <p className="text-sm font-bold text-[#777777]">Cátedra UNACH - Vocabulario Semana 1</p>
          </div>

          <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-2xl p-6 space-y-4">
            <div className="text-4xl font-extrabold text-indigo-600">{scorePercentage}%</div>
            <p className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Porcentaje de Aciertos Obtenido
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5E5E5] text-left text-xs font-bold">
              <div>
                <span className="text-[#777777] block">Respuestas Correctas:</span>
                <span className="text-emerald-600 text-sm">
                  {correctCount} / {questions.length}
                </span>
              </div>
              <div>
                <span className="text-[#777777] block">Tiempo Transcurrido:</span>
                <span className="text-slate-700 text-sm">
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-3 bg-[#F7F7F7] hover:bg-[#EEEEEE] text-[#4B4B4B] rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#E5E5E5] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Realizar Nuevo Intento
            </button>
            <Link
              href="/catedra"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Volver a Cátedra
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-between p-6">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6">
        <Link
          href="/catedra"
          className="flex items-center gap-2 text-sm font-black text-[#777777] hover:text-[#4B4B4B] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Salir de la evaluación
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="w-full bg-[#E5E5E5] h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* Main Exercise View */}
      <main className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>

          {currentQ.hebrewText && (
            <div className="py-4">
              <HebrewWordIME fallbackText={currentQ.hebrewText} textSize="text-5xl lg:text-6xl" />
            </div>
          )}

          <h2 className="text-xl font-extrabold text-[#4B4B4B]">{currentQ.question}</h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option;
            let btnClass = "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-slate-50";

            if (isAnswered) {
              if (option === currentQ.correctAnswer) {
                btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800 font-black";
              } else if (isSelected && !isCorrect) {
                btnClass = "bg-rose-50 border-rose-500 text-rose-800 font-black";
              }
            } else if (isSelected) {
              btnClass = "bg-indigo-50 border-indigo-500 text-indigo-900 font-black";
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-base transition-all duration-150 flex items-center justify-between cursor-pointer ${btnClass}`}
              >
                <span>{option}</span>
                {isAnswered && option === currentQ.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="max-w-2xl mx-auto w-full pt-6">
        {!isAnswered ? (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={!selectedOption}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition ${
              selectedOption
                ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Comprobar Respuesta
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white transition flex items-center justify-center gap-2 cursor-pointer ${
              isCorrect
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isSubmitting ? (
              <LoadingSpinner />
            ) : currentIndex + 1 < questions.length ? (
              "Siguiente Pregunta ➔"
            ) : (
              "Finalizar e Inscribir Intento 🏆"
            )}
          </button>
        )}
      </footer>
    </div>
  );
}

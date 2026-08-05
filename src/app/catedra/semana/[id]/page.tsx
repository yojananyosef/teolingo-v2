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
        // Direct endpoint fetch
        const res = await fetch(`/api/lessons/${quizId}`);
        if (!res.ok) {
          // Alternative lookup with quiz- prefix
          const altRes = await fetch(`/api/lessons/quiz-${quizId}`);
          if (!altRes.ok) {
            toast.error("No se pudieron cargar las preguntas del cuestionario.");
            setLoading(false);
            return;
          }
          const altData = await altRes.json();
          processQuestions(altData.exercises || []);
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
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <LoadingSpinner />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-6">
        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-[0_6px_0_0_#E5E5E5]">
          <div className="w-16 h-16 bg-[#FFF9E5] border-2 border-[#FFC800] rounded-2xl flex items-center justify-center mx-auto text-[#FF9600]">
            <ShieldAlert size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#4B4B4B]">No se encontraron preguntas</h2>
            <p className="text-xs font-bold text-[#777777]">
              No pudimos cargar los ejercicios para esta semana de Cátedra.
            </p>
          </div>
          <Link
            href="/catedra"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1CB0F6] hover:bg-[#24B7F8] text-white font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#1899D6] border-2 border-[#1CB0F6]"
          >
            Volver a Cátedra
          </Link>
        </div>
      </div>
    );
  }

  // Final State
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-[0_6px_0_0_#E5E5E5]">
          <div className="w-20 h-20 bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-full flex items-center justify-center mx-auto text-[#1CB0F6]">
            <Award size={42} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#4B4B4B]">¡Intento Finalizado!</h2>
            <p className="text-xs font-bold text-[#777777] uppercase tracking-wider">
              Cátedra UNACH • Vocabulario Semana 1
            </p>
          </div>

          <div className="bg-[#FFFDF5] border-2 border-[#E5E5E5] rounded-2xl p-6 space-y-3">
            <div className="text-5xl font-black text-[#1CB0F6]">{scorePercentage}%</div>
            <p className="text-xs font-black text-[#AFAFAF] uppercase tracking-wider">
              Porcentaje de Aciertos Obtenido
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-[#E5E5E5] text-left text-xs font-bold">
              <div>
                <span className="text-[#777777] block">Respuestas Correctas:</span>
                <span className="text-[#58CC02] font-black text-sm">
                  {correctCount} / {questions.length}
                </span>
              </div>
              <div>
                <span className="text-[#777777] block">Tiempo Transcurrido:</span>
                <span className="text-[#4B4B4B] font-black text-sm">
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-3.5 bg-white hover:bg-[#F7F7F7] text-[#4B4B4B] rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw size={16} /> Reintentar
            </button>
            <Link
              href="/catedra"
              className="flex-1 py-3.5 bg-[#1CB0F6] hover:bg-[#24B7F8] text-white rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-[#1CB0F6] shadow-[0_4px_0_0_#1899D6] active:translate-y-[2px] active:shadow-[0_2px_0_0_#1899D6] flex items-center justify-center gap-2 transition-all"
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
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between p-6">
      {/* Duolingo Progress Header */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-6">
        <Link
          href="/catedra"
          className="flex items-center gap-2 text-sm font-black text-[#AFAFAF] hover:text-[#4B4B4B] transition"
        >
          <ArrowLeft size={18} /> Salir
        </Link>

        {/* Progress Bar Duolingo Style */}
        <div className="flex-1 max-w-md mx-6">
          <div className="w-full bg-[#E5E5E5] h-4 rounded-full overflow-hidden p-0.5 border border-[#E5E5E5]">
            <div
              className="bg-[#58CC02] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black text-[#4B4B4B] bg-white border-2 border-[#E5E5E5] px-3 py-1.5 rounded-2xl shadow-[0_2px_0_0_#E5E5E5]">
          <Clock size={16} className="text-[#1CB0F6]" />
          <span>
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* Main Exercise Box */}
      <main className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4">
          <span className="text-xs font-black text-[#1CB0F6] uppercase tracking-widest bg-[#DDF4FF] border border-[#84D8FF] px-3.5 py-1 rounded-full">
            Pregunta {currentIndex + 1} de {questions.length}
          </span>

          {currentQ.hebrewText && (
            <div className="py-4">
              <HebrewWordIME fallbackText={currentQ.hebrewText} textSize="text-5xl lg:text-6xl" />
            </div>
          )}

          <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B]">{currentQ.question}</h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3.5">
          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option;
            let btnClass =
              "bg-white border-[#E5E5E5] text-[#4B4B4B] shadow-[0_4px_0_0_#E5E5E5] hover:bg-[#F7F7F7]";

            if (isAnswered) {
              if (option === currentQ.correctAnswer) {
                btnClass =
                  "bg-[#E8F5E9] border-[#58CC02] text-[#2E7D32] shadow-[0_4px_0_0_#46A302] font-black";
              } else if (isSelected && !isCorrect) {
                btnClass =
                  "bg-[#FFEBEE] border-[#FF4B4B] text-[#C62828] shadow-[0_4px_0_0_#CC3C3C] font-black";
              }
            } else if (isSelected) {
              btnClass =
                "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] shadow-[0_4px_0_0_#1899D6] font-black";
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border-2 text-left font-black text-base lg:text-lg transition-all duration-150 flex items-center justify-between cursor-pointer active:translate-y-[2px] ${btnClass}`}
              >
                <span>{option}</span>
                {isAnswered && option === currentQ.correctAnswer && (
                  <CheckCircle size={22} className="text-[#58CC02]" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle size={22} className="text-[#FF4B4B]" />
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer Controls Duolingo 3D Button */}
      <footer className="max-w-2xl mx-auto w-full pt-6">
        {!isAnswered ? (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={!selectedOption}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
              selectedOption
                ? "bg-[#58CC02] hover:bg-[#61E002] border-[#58CC02] text-white shadow-[0_4px_0_0_#46A302] active:translate-y-[2px] active:shadow-[0_2px_0_0_#46A302] cursor-pointer"
                : "bg-[#E5E5E5] border-[#E5E5E5] text-[#AFAFAF] cursor-not-allowed"
            }`}
          >
            Comprobar Respuesta
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white border-2 transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-[2px] ${
              isCorrect
                ? "bg-[#58CC02] hover:bg-[#61E002] border-[#58CC02] shadow-[0_4px_0_0_#46A302] active:shadow-[0_2px_0_0_#46A302]"
                : "bg-[#1CB0F6] hover:bg-[#24B7F8] border-[#1CB0F6] shadow-[0_4px_0_0_#1899D6] active:shadow-[0_2px_0_0_#1899D6]"
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

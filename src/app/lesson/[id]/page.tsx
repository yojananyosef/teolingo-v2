"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { HebrewMultisensorial } from "@/features/lessons/components/HebrewMultisensorial";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { completeLessonAction, completePracticeAction } from "@/features/lessons/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const SOUNDS = {
  CORRECT: "/sounds/correct.mp3",
  INCORRECT: "/sounds/incorrect.mp3",
  FINISHED: "/sounds/finished.mp3",
};

interface Exercise {
  id: string;
  type: string;
  question: string;
  correctAnswer: string;
  options: string[];
  hebrewText?: string;
  audioUrl?: string;
}

interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}

// Función para barajar un array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, setAuth, token } = useAuthStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [, setEarnedLevel] = useState(1);
  const [earnedStreak, setEarnedStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Si ya terminó, si ya cargó, o si ya estamos cargando, no hacer nada.
    if (isFinished || lesson || !isLoading) return;

    const fetchLesson = async () => {
      try {
        let url = params.id === "practice" ? "/api/lessons/practice" : `/api/lessons/${params.id}`;

        // Manejar query params para el modo de práctica
        if (params.id === "practice") {
          const searchParams = new URLSearchParams(window.location.search);
          const mode = searchParams.get("mode");
          if (mode) url += `?mode=${mode}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch lesson");
        const rawData = await response.json();

        if (rawData && rawData.exercises) {
          const processedExercises = rawData.exercises.map((ex: Exercise) => ({
            ...ex,
            options: shuffleArray(ex.options)
          }));

          const finalLesson = {
            ...rawData,
            exercises: processedExercises
          };

          setLesson(finalLesson);
          setCurrentExerciseIndex(0);
          setCorrectAnswersCount(0);
          setSelectedOption(null);
          setIsAnswerChecked(false);
        }
      } catch (error) {
        console.error("Fetch lesson error:", error);
        toast.error("Error al cargar la lección");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };

    fetchLesson();
  }, [user?.id, params.id, isFinished]); // Reducimos dependencias al ID del usuario y estado crítico

  const playSound = (soundPath: string) => {
    const audio = new Audio(soundPath);
    audio.volume = 0.4; // Reducimos el volumen al 40%
    audio.play().catch(err => console.error("Error playing sound:", err));
  };

  const onCheck = () => {
    if (!lesson) return;
    const currentExercise = lesson.exercises[currentExerciseIndex];
    const correct = selectedOption === currentExercise.correctAnswer;

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      playSound(SOUNDS.CORRECT);
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      playSound(SOUNDS.INCORRECT);
    }
  };

  const onNext = async () => {
    if (!lesson) return;

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      await onFinish();
    }
  };

  const onFinish = async () => {
    setIsSubmitting(true);
    try {
      const accuracy = lesson ? Math.round((correctAnswersCount / lesson.exercises.length) * 100) : 100;

      const result = params.id === "practice"
        ? await completePracticeAction(accuracy)
        : await completeLessonAction(params.id as string, accuracy);

      if (result.success && result.data) {
        const data = result.data;
        setEarnedPoints(data.pointsEarned);
        setEarnedLevel(data.newLevel);
        setEarnedStreak(data.newStreak);

        const isPassed = accuracy >= 50;
        const isPerfect = accuracy === 100;
        setIsPassed(isPassed);
        setIsPerfect(isPerfect);

        if (user && isPassed) {
          setAuth({
            ...user,
            points: data.newPoints,
            streak: data.newStreak,
            level: data.newLevel,
          }, token!);
        }

        // Show toasts with delay
        let delay = 500;
        if (data.achievements && data.achievements.length > 0) {
          data.achievements.forEach((achievement: any) => {
            setTimeout(() => {
              toast.success(`¡Logro Desbloqueado: ${achievement.name}!`, {
                description: achievement.description,
                icon: <span className="text-xl">{achievement.icon}</span>,
                duration: 4000,
              });
            }, delay);
            delay += 2000; // Dos segundos entre cada uno para dar tiempo a verlos
          });
        }

        const isLevelUp = data.newLevel > (user?.level ?? 1);
        if (isLevelUp) {
          setTimeout(() => {
            toast.info(`¡Subiste de Nivel!`, {
              description: `Ahora eres nivel ${data.newLevel}`,
              icon: "🚀",
              duration: 5000,
            });
          }, delay);
        }

        setIsFinished(true);
        playSound(SOUNDS.FINISHED);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#58CC02", "#1CB0F6", "#FF4B4B", "#FFC800"]
        });
      } else {
        toast.error("Error al guardar el progreso");
      }
    } catch (error) {
      toast.error("Error al finalizar la lección");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <LoadingSpinner size="lg" className="mb-6" />
        <p className="text-[#777777] font-black uppercase tracking-widest text-xs">Cargando lección...</p>
      </div>
    );
  }

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-white">
        <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B] mb-6 uppercase tracking-tight">La lección no tiene ejercicios</h2>
        <button
          onClick={() => router.push("/learn")}
          className="px-8 py-3 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = lesson ? Math.round((correctAnswersCount / lesson.exercises.length) * 100) : 0;

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-white overflow-y-auto no-scrollbar">
        <div className="max-w-md w-full text-center py-8">
          <div className="mb-6 lg:mb-8 relative inline-block">
            <div className={cn(
              "w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mx-auto mb-4 border-2 transition-colors",
              isPerfect ? "bg-[#FFF4D1] border-[#FFC800]" :
                isPassed ? "bg-[#E7F3FF] border-[#1CB0F6]" :
                  "bg-[#FFEBEB] border-[#FF4B4B]"
            )}>
              {isPerfect ? (
                <CheckCircle2 className="w-12 h-12 lg:w-16 lg:h-16 text-[#FFC800]" />
              ) : isPassed ? (
                <CheckCircle2 className="w-12 h-12 lg:w-16 lg:h-16 text-[#1CB0F6]" />
              ) : (
                <XCircle className="w-12 h-12 lg:w-16 lg:h-16 text-[#FF4B4B]" />
              )}
            </div>
            {isPassed && (
              <div className="absolute -top-2 -right-2 min-w-[2.5rem] h-10 px-2 bg-[#1CB0F6] rounded-full flex items-center justify-center text-white font-black border-2 border-white shadow-sm">
                +{earnedPoints}
              </div>
            )}
          </div>

          <h1 className={cn(
            "text-2xl lg:text-3xl font-black mb-2 uppercase tracking-tight",
            isPerfect ? "text-[#FFC800]" : isPassed ? "text-[#1CB0F6]" : "text-[#FF4B4B]"
          )}>
            {isPerfect ? "¡Lección Perfecta!" : isPassed ? "¡Lección completada!" : "Necesitas practicar más"}
          </h1>

          <p className="text-[#777777] font-bold text-sm lg:text-base mb-8">
            {isPerfect ? "Has demostrado un dominio total de este tema bíblico." :
              isPassed ? "Has ganado puntos de experiencia y has reforzado tus conocimientos bíblicos." :
                `Has acertado ${correctAnswersCount} de ${lesson.exercises.length} preguntas (${accuracy}%). Necesitas al menos 50% para aprobar.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest mb-1">XP Ganados</div>
              <div className={cn("text-xl lg:text-2xl font-black", isPassed ? "text-[#58CC02]" : "text-[#777777]")}>
                +{earnedPoints}
              </div>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest mb-1">Racha</div>
              <div className="text-xl lg:text-2xl font-black text-[#FF9600]">{earnedStreak}</div>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest mb-1">Precisión</div>
              <div className={cn(
                "text-xl lg:text-2xl font-black",
                isPerfect ? "text-[#FFC800]" : isPassed ? "text-[#1CB0F6]" : "text-[#FF4B4B]"
              )}>
                {accuracy}%
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              router.push("/learn");
            }}
            className={cn(
              "w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest text-sm lg:text-lg border-b-4 lg:border-b-8 transition-all active:translate-y-1 active:border-b-0",
              isPerfect ? "bg-[#FFC800] border-[#E5A500] hover:bg-[#FFD433]" :
                isPassed ? "bg-[#58CC02] border-[#46A302] hover:bg-[#61E002]" :
                  "bg-[#FF4B4B] border-[#CC3C3C] hover:bg-[#FF5C5C]"
            )}
          >
            {isPassed ? "Continuar" : "Volver a intentar"}
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex) / lesson.exercises.length) * 100;

  return (
    <div className="h-[100dvh] bg-white flex flex-col overflow-hidden fixed inset-0">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-4 lg:pt-12 pb-2 lg:pb-4 flex items-center gap-4 lg:gap-6 shrink-0">
        <button
          onClick={() => router.push("/learn")}
          className="p-1 lg:p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
        >
          <X className="w-6 h-6 lg:w-8 lg:h-8 text-[#AFAFAF] hover:text-[#4B4B4B]" />
        </button>
        <div className="flex-1 h-3 lg:h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#58CC02] transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0.5 lg:top-1 left-1 right-1 h-0.5 lg:h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4 py-4 overflow-y-auto">
        <h2 className="text-xl lg:text-3xl font-black text-[#4B4B4B] mb-6 lg:mb-10 text-center leading-tight shrink-0">
          {currentExercise.question}
        </h2>

        {currentExercise.hebrewText && (
          <HebrewMultisensorial
            text={currentExercise.hebrewText}
            className="mb-6 lg:mb-10"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 w-full max-w-2xl mx-auto">
          {currentExercise.options.map((option, index) => (
            <button
              key={index}
              disabled={isAnswerChecked}
              onClick={() => setSelectedOption(option)}
              className={cn(
                "p-4 lg:p-6 text-lg lg:text-xl font-bold rounded-2xl border-2 border-b-4 lg:border-b-8 transition-all active:translate-y-1 active:border-b-2 text-center",
                selectedOption === option
                  ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6] border-b-4 lg:border-b-8 shadow-none"
                  : "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        "border-t-2 p-4 lg:p-8 transition-colors duration-300 shrink-0",
        isAnswerChecked
          ? isCorrect
            ? "bg-[#D7FFB7] border-[#A5ED6E]"
            : "bg-[#FFDADC] border-[#FF4B4B]"
          : "bg-white border-[#E5E5E5]"
      )}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            {isAnswerChecked && (
              <div className={cn(
                "w-10 h-10 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0",
                isCorrect ? "bg-white text-[#58CC02]" : "bg-white text-[#FF4B4B]"
              )}>
                {isCorrect ? <CheckCircle2 className="w-6 h-6 lg:w-10 lg:h-10" /> : <XCircle className="w-6 h-6 lg:w-10 lg:h-10" />}
              </div>
            )}
            {isAnswerChecked && (
              <div className="min-w-0">
                <h3 className={cn("text-lg lg:text-2xl font-black truncate", isCorrect ? "text-[#58A700]" : "text-[#EA2B2B]")}>
                  {isCorrect ? "¡Excelente!" : "Respuesta incorrecta"}
                </h3>
                {!isCorrect && (
                  <p className="text-[#EA2B2B] font-bold text-xs lg:text-base truncate">La respuesta correcta era: {currentExercise.correctAnswer}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={isAnswerChecked ? onNext : onCheck}
            disabled={!selectedOption || isSubmitting}
            className={cn(
              "px-6 lg:px-12 py-3 lg:py-4 rounded-2xl font-black text-sm lg:text-lg uppercase tracking-widest transition-all border-b-4 lg:border-b-8 active:translate-y-1 active:border-b-2 shrink-0",
              !selectedOption
                ? "bg-[#E5E5E5] text-[#AFAFAF] border-[#AFAFAF] cursor-not-allowed border-b-0 translate-y-0"
                : isAnswerChecked
                  ? isCorrect
                    ? "bg-[#58CC02] text-white border-[#46A302] hover:bg-[#61E002]"
                    : "bg-[#FF4B4B] text-white border-[#CC3C3C] hover:bg-[#FF5C5C]"
                  : "bg-[#58CC02] text-white border-[#46A302] hover:bg-[#61E002]"
            )}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" className="border-white border-t-white" />
            ) : isAnswerChecked ? (
              "Siguiente"
            ) : (
              "Comprobar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

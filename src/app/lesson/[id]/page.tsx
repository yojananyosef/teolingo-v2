"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { completeLessonAction, completePracticeAction } from "@/features/lessons/actions";

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

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchLesson = async () => {
      try {
        const url = params.id === "practice" ? "/api/lessons/practice" : `/api/lessons/${params.id}`;
        const response = await fetch(url);
        const data = await response.json();
        setLesson(data);
      } catch (error) {
        toast.error("Error al cargar la lección");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [user, router, params.id]);

  const playSound = (soundPath: string) => {
    const audio = new Audio(soundPath);
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
      const result = params.id === "practice" 
        ? await completePracticeAction()
        : await completeLessonAction(params.id as string);

      if (result.success && result.data) {
        const data = result.data;
        if (user) {
          setAuth({
            ...user,
            points: data.pointsEarned ? user.points + data.pointsEarned : user.points,
            streak: data.streak,
            level: data.level,
          }, token!);
        }

        // Show toasts with delay
        let delay = 500;
        if (data.newAchievements && data.newAchievements.length > 0) {
          data.newAchievements.forEach((achievement: any) => {
            setTimeout(() => {
              toast.success(`¡Logro Desbloqueado: ${achievement.name}!`, {
                description: achievement.description,
                icon: <span>{achievement.icon}</span>,
                duration: 5000,
              });
            }, delay);
            delay += 1500;
          });
        }

        if (data.isLevelUp) {
          setTimeout(() => {
            toast.info(`¡Subiste de Nivel!`, {
              description: `Ahora eres nivel ${data.level}`,
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
          colors: ["#4F46E5", "#10B981", "#F59E0B"]
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Cargando lección...</p>
      </div>
    );
  }

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">La lección no tiene ejercicios</h2>
        <button 
          onClick={() => router.push("/learn")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-16 h-16 text-yellow-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              +15
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Lección completada!</h1>
          <p className="text-gray-600 mb-8">Has ganado puntos de experiencia y has reforzado tus conocimientos bíblicos.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Puntos Ganados</div>
              <div className="text-2xl font-bold text-indigo-600">+15 XP</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Nivel Actual</div>
              <div className="text-2xl font-bold text-indigo-600">{user?.level}</div>
            </div>
          </div>

          <button
            onClick={() => router.push("/learn")}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex) / lesson.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full px-4 pt-12 pb-4 flex items-center gap-6">
        <button 
          onClick={() => router.push("/learn")}
          className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
        >
          <X className="w-8 h-8 text-[#AFAFAF] hover:text-[#4B4B4B]" />
        </button>
        <div className="flex-1 h-4 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#58CC02] transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4 py-12">
        <h2 className="text-3xl font-black text-[#4B4B4B] mb-12 text-center leading-tight">
          {currentExercise.question}
        </h2>

        {currentExercise.hebrewText && (
          <div className="mb-12 text-center">
            <div className="text-8xl font-black text-[#1CB0F6] mb-4 HebrewFont dir-rtl leading-loose" dir="rtl">
              {currentExercise.hebrewText}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {currentExercise.options.map((option, index) => (
            <button
              key={index}
              disabled={isAnswerChecked}
              onClick={() => setSelectedOption(option)}
              className={cn(
                "p-6 text-xl font-bold rounded-2xl border-2 border-b-8 transition-all active:translate-y-1 active:border-b-2 text-center",
                selectedOption === option
                  ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6] border-b-8 shadow-none"
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
        "border-t-2 p-8 transition-colors duration-300",
        isAnswerChecked 
          ? isCorrect 
            ? "bg-[#D7FFB7] border-[#A5ED6E]" 
            : "bg-[#FFDADC] border-[#FF4B4B]"
          : "bg-white border-[#E5E5E5]"
      )}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAnswerChecked && (
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                isCorrect ? "bg-white text-[#58CC02]" : "bg-white text-[#FF4B4B]"
              )}>
                {isCorrect ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
              </div>
            )}
            {isAnswerChecked && (
              <div>
                <h3 className={cn("text-2xl font-black", isCorrect ? "text-[#58A700]" : "text-[#EA2B2B]")}>
                  {isCorrect ? "¡Excelente!" : "Respuesta incorrecta"}
                </h3>
                {!isCorrect && (
                  <p className="text-[#EA2B2B] font-bold">La respuesta correcta era: {currentExercise.correctAnswer}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={isAnswerChecked ? onNext : onCheck}
            disabled={!selectedOption || isSubmitting}
            className={cn(
              "px-12 py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all border-b-8 active:translate-y-1 active:border-b-2",
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
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
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

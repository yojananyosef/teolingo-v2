"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, Shield, Sword, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { completeLessonAction } from "@/features/lessons/actions";
import { cn } from "@/lib/utils";

// This is a specialized, "Boss Fight" styled UI for end-of-module assessments.
export function ModuleAssessmentUI({ lesson, onExit }: { lesson: any; onExit: () => void }) {
  const router = useRouter();
  const { user, setAuth, token } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [health, setHealth] = useState(3); // 3 Lives
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const currentExercise = lesson.exercises[currentIndex];
  const isDead = health <= 0;

  useEffect(() => {
    if (isDead) {
      setTimeout(() => setIsFinished(true), 1500);
    }
  }, [isDead]);

  const onCheck = () => {
    if (!currentExercise) return;
    
    // For MVP Checkpoint, we treat everything as multiple-choice internally for now
    const correct = selectedOption === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      const audio = new Audio("/sounds/correct.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } else {
      setHealth((h) => h - 1);
      const audio = new Audio("/sounds/incorrect.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  };

  const onNext = async () => {
    if (isDead) return;

    if (currentIndex < lesson.exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      await finishAssessment(true);
    }
  };

  const finishAssessment = async (passed: boolean) => {
    setIsSubmitting(true);
    try {
      const accuracy = passed ? 100 : 0; // Simple binary pass/fail for checkpoint
      const result = await completeLessonAction(lesson.id, accuracy);

      if (result.success && result.data) {
        setIsPassed(passed);
        setIsFinished(true);

        if (passed) {
          const audio = new Audio("/sounds/finished.mp3");
          audio.volume = 0.4;
          audio.play().catch(() => {});
          confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#FFD700", "#FFA500", "#FF4500", "#8A2BE2"],
          });
        }
      } else {
        toast.error("Error al guardar el progreso");
      }
    } catch (e) {
      toast.error("Hubo un error al enviar tus resultados");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-[#1A0B2E] text-white">
        <div className="max-w-md w-full text-center py-8">
          <Shield className={cn("w-24 h-24 mx-auto mb-6", isPassed ? "text-[#FFD700]" : "text-[#FF4B4B]")} />
          <h1 className="text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
            {isPassed ? "¡Módulo Superado!" : "Evaluación Fallida"}
          </h1>
          <p className="text-lg font-bold text-[#AFAFAF] mb-8">
            {isPassed
              ? "Has demostrado ser digno. Tu conocimiento del hebreo bíblico se ha fortalecido."
              : "No tienes suficientes vidas. Regresa y estudia las lecciones anteriores."}
          </p>
          <button
            onClick={() => router.push("/learn")}
            className="w-full py-4 bg-[#FFD700] text-[#1A0B2E] rounded-2xl font-black uppercase tracking-widest text-lg border-b-4 border-[#CCAA00] hover:bg-[#FFE55C] active:translate-y-1 active:border-b-0 transition-all"
          >
            Volver al Mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#1A0B2E] text-white font-sans overflow-hidden">
      {/* Boss Header */}
      <header className="flex items-center justify-between p-4 lg:p-6 border-b-2 border-white/10 shrink-0 bg-[#251242]">
        <button onClick={onExit} className="p-2 text-[#AFAFAF] hover:text-white transition-colors">
          <XCircle size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Sword className="text-[#FFD700]" size={20} />
          <span className="font-black uppercase tracking-widest text-sm text-[#FFD700]">
            Evaluación Final
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2",
                i <= health
                  ? "bg-[#FF4B4B] border-[#CC3C3C] animate-pulse"
                  : "bg-white/10 border-white/20"
              )}
            />
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto no-scrollbar relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8A2BE2]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
          <span className="text-[#AFAFAF] font-black uppercase tracking-widest text-xs mb-8">
            Desafío {currentIndex + 1} de {lesson.exercises.length}
          </span>
          <h2 className="text-2xl lg:text-4xl font-black text-center mb-12 leading-tight">
            {currentExercise.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {currentExercise.options.map((option: string, i: number) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option === currentExercise.correctAnswer;
              const showCorrect = isAnswerChecked && isCorrectOption;
              const showWrong = isAnswerChecked && !isCorrect && isSelected;

              return (
                <button
                  key={i}
                  disabled={isAnswerChecked || isDead}
                  onClick={() => setSelectedOption(option)}
                  className={cn(
                    "p-6 text-xl lg:text-2xl font-bold rounded-2xl border-2 transition-all min-h-[120px]",
                    showCorrect
                      ? "bg-[#58CC02]/20 border-[#58CC02] text-[#58CC02]"
                      : showWrong
                        ? "bg-[#FF4B4B]/20 border-[#FF4B4B] text-[#FF4B4B]"
                        : isSelected
                          ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <span className={cn(option.match(/[\u0590-\u05FF]/) ? "HebrewFont" : "")}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Boss Footer */}
      <div
        className={cn(
          "border-t-2 shrink-0 p-4 lg:p-6 transition-colors duration-300",
          isAnswerChecked
            ? isCorrect
              ? "bg-[#58CC02]/20 border-[#58CC02]"
              : "bg-[#FF4B4B]/20 border-[#FF4B4B]"
            : "bg-[#251242] border-white/10"
        )}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAnswerChecked && (
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isCorrect ? "bg-[#58CC02] text-[#1A0B2E]" : "bg-[#FF4B4B] text-white"
                )}
              >
                {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
            )}
            {isAnswerChecked && !isCorrect && (
              <div>
                <p className="text-[#FF4B4B] font-black uppercase text-sm">Respuesta Correcta:</p>
                <p className="text-white font-bold">{currentExercise.correctAnswer}</p>
                {currentExercise.hint && (
                  <p className="text-[#FFD700] text-sm mt-1 flex items-center gap-2 font-bold">
                    <Shield size={14} /> Pista: {currentExercise.hint}
                  </p>
                )}
              </div>
            )}
          </div>
          <button
            onClick={isAnswerChecked ? onNext : onCheck}
            disabled={!selectedOption || isSubmitting || isDead}
            className={cn(
              "px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all",
              !selectedOption
                ? "bg-white/10 text-white/50 cursor-not-allowed"
                : isAnswerChecked
                  ? isCorrect
                    ? "bg-[#58CC02] text-[#1A0B2E] hover:bg-[#61E002]"
                    : "bg-[#FF4B4B] text-white hover:bg-[#FF5C5C]"
                  : "bg-[#FFD700] text-[#1A0B2E] hover:bg-[#FFE55C]"
            )}
          >
            {isAnswerChecked ? "Continuar" : "Atacar"}
          </button>
        </div>
      </div>
    </div>
  );
}

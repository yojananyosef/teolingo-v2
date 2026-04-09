"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { completeLessonAction, completePracticeAction } from "@/features/lessons/actions";
import { WordBankExercise } from "@/features/lessons/components/WordBankExercise";
import { HebrewMultisensorial } from "@/features/lessons/components/HebrewMultisensorial";
import { NounParsingExercise } from "@/features/lessons/components/NounParsingExercise";
import { HebrewWordIME, MorphologicalPart } from "@/components/HebrewWordIME";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import confetti from "canvas-confetti";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

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
  hebrewParts?: MorphologicalPart[];
  audioUrl?: string;
  originalIndex?: number;
}

interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}

interface NounParsingAnswer {
  gender?: "m" | "f";
  number?: "s" | "p" | "d";
  meaning?: string;
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

const hasHebrewGlyphs = (value: string) => /[\u0590-\u05FF]/.test(value);

const isStandaloneNiqqud = (value: string) => {
  const compact = value.replace(/\s+/g, "");
  if (!compact) return false;

  const hasHebrewLetter = /[\u05D0-\u05EA]/.test(compact);
  const hasNiqqud = /[\u0591-\u05C7]/.test(compact);
  const onlyNiqqud = [...compact].every((char) => /[\u0591-\u05C7]/.test(char));

  return !hasHebrewLetter && hasNiqqud && onlyNiqqud;
};

const parseOptionWithNiqqud = (value: string) => {
  const match = value.match(/^(.*?)(◌?[\u0591-\u05C7]+)(.*)$/);
  if (!match) return { hasNiqqud: false, before: value, niqqud: "", after: "" };

  const before = match[1].trim();
  const rawNiqqud = match[2];
  const after = match[3].trim();
  
  // Extract strictly the niqqud marks ignoring the circle if present
  const niqqud = rawNiqqud.replace('◌', '');
  
  return { hasNiqqud: true, before, niqqud, after };
};

const sanitizeQuestionForNiqqudQuiz = (question: string, options: string[]) => {
  const hasLeadingNiqqudOptions = options.some((opt) => parseOptionWithNiqqud(opt).hasNiqqud);
  if (!hasLeadingNiqqudOptions) return question;

  return question
    .replace(/\(\s*[^)\u05D0-\u05EAA-Za-z0-9]*[\u0591-\u05C7][^)\u05D0-\u05EAA-Za-z0-9]*\s*\)/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
};

const parseNounParsingAnswer = (value?: string | null): NounParsingAnswer => {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // Ignore malformed JSON and return empty fallback.
  }

  return {};
};

const formatNounParsingAnswer = (value: NounParsingAnswer) => {
  const genderLabel = value.gender === "m" ? "Masculino" : value.gender === "f" ? "Femenino" : "-";
  const numberLabel =
    value.number === "s" ? "Singular" : value.number === "p" ? "Plural" : value.number === "d" ? "Dual" : "-";
  const meaningLabel = value.meaning ?? "-";

  return `Género: ${genderLabel} · Número: ${numberLabel} · Significado: ${meaningLabel}`;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setAuth, token } = useAuthStore();
  const { isRandomExerciseOrder } = useUIStore();
  const isPracticeLesson = params.id === "practice";
  const returnRoute = isPracticeLesson ? "/practice" : "/learn";
  const modeParam = searchParams.get("mode") || "";
  const rangeParam = searchParams.get("range") || "";
  const randomParam = searchParams.get("random") || "";

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
  const [wbSelectedBlocks, setWbSelectedBlocks] = useState<any[]>([]);
  const lastFetchKey = useRef("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (isFinished) return;

    const fetchKey = `${params.id}-${modeParam}-${rangeParam}-${randomParam}-${isRandomExerciseOrder ? "1" : "0"}-${user.id}`;
    if (lastFetchKey.current === fetchKey) return;
    lastFetchKey.current = fetchKey;
    setIsLoading(true);

    const fetchLesson = async () => {
      try {
        let url = params.id === "practice" ? "/api/lessons/practice" : `/api/lessons/${params.id}`;

        // Manejar query params para el modo de práctica
        if (params.id === "practice") {
          const mode = modeParam || null;
          const range = rangeParam || null;
          const randomFromQuery = randomParam || null;
          const randomEnabled = randomFromQuery !== null ? randomFromQuery === "1" : isRandomExerciseOrder;
          if (mode) url += `?mode=${mode}`;
          if (range) url += `&range=${range}`;
          url += `${mode || range ? "&" : "?"}random=${randomEnabled ? "1" : "0"}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch lesson");
        const rawData = await response.json();

        if (rawData?.exercises) {
          const processedExercises = rawData.exercises.map((ex: Exercise, index: number) => {
            // Decidir si este ejercicio de opción múltiple se convierte a WordBank
            // Solo si la respuesta tiene múltiples palabras y estamos en Hebreo 1
            const words = ex.correctAnswer.split(" ");
            const canBeWordBank = words.length > 1;
            
            // Asignar un tipo aleatorio (50% word-bank, 50% multiple-choice) si es aplicable
            const type = canBeWordBank && ex.type !== "noun-parsing" && Math.random() > 0.5 ? "word-bank" : ex.type;

            return {
              ...ex,
              type,
              options: shuffleArray([...ex.options]), // Clona antes de barajar
              originalIndex: index,
            };
          });

          const orderedExercises = params.id !== "practice" && isRandomExerciseOrder
            ? shuffleArray(processedExercises)
            : processedExercises;

          const finalLesson = {
            ...rawData,
            exercises: orderedExercises,
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
  }, [user?.id, params.id, isFinished, modeParam, rangeParam, randomParam, isRandomExerciseOrder]);

  const playSound = (soundPath: string) => {
    const audio = new Audio(soundPath);
    audio.volume = 0.4; // Reducimos el volumen al 40%
    audio.play().catch((err) => console.error("Error playing sound:", err));
  };

  const onCheck = () => {
    if (!lesson) return;
    const currentExercise = lesson.exercises[currentExerciseIndex];
    const isWordBank = currentExercise.type === "word-bank";
    const isNounParsing = currentExercise.type === "noun-parsing";
    
    let correct = false;
    if (isWordBank) {
      const userAnswer = wbSelectedBlocks.map((b) => b.text).join(" ");
      correct = userAnswer === currentExercise.correctAnswer;
    } else if (isNounParsing) {
      const parsedValue = parseNounParsingAnswer(selectedOption);
      const parsedCorrect = parseNounParsingAnswer(currentExercise.correctAnswer);
      correct =
        parsedValue.gender === parsedCorrect.gender &&
        parsedValue.number === parsedCorrect.number &&
        parsedValue.meaning === parsedCorrect.meaning;
    } else {
      correct = selectedOption === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      playSound(SOUNDS.CORRECT);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      playSound(SOUNDS.INCORRECT);
    }
  };

  const onNext = async () => {
    if (!lesson) return;

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setWbSelectedBlocks([]);
    } else {
      await onFinish();
    }
  };

  const onFinish = async () => {
    setIsSubmitting(true);
    try {
      const accuracy = lesson
        ? Math.round((correctAnswersCount / lesson.exercises.length) * 100)
        : 100;

      const result =
        params.id === "practice"
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
          setAuth(
            {
              ...user,
              points: data.newPoints,
              streak: data.newStreak,
              level: data.newLevel,
            },
            token!,
          );
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
            toast.info("¡Subiste de Nivel!", {
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
          colors: ["#58CC02", "#1CB0F6", "#FF4B4B", "#FFC800"],
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7]">
        <LoadingSpinner size="lg" className="mb-6" />
        <p className="text-[#777777] font-black uppercase tracking-widest text-xs">
          Cargando lección...
        </p>
      </div>
    );
  }

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-[#FDFBF7]">
        <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B] mb-6 uppercase tracking-tight">
          La lección no tiene ejercicios
        </h2>
        <button
          onClick={() => router.push(returnRoute)}
          className="px-8 py-3 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all"
        >
          {isPracticeLesson ? "Volver a práctica" : "Volver al inicio"}
        </button>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = lesson ? Math.round((correctAnswersCount / lesson.exercises.length) * 100) : 0;

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-[#FDFBF7] overflow-y-auto no-scrollbar">
        <div className="max-w-md w-full text-center py-8">
          <div className="mb-6 lg:mb-8 relative inline-block">
            <div
              className={cn(
                "w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mx-auto mb-4 border-2 transition-colors",
                isPerfect
                  ? "bg-[#FFF4D1] border-[#FFC800]"
                  : isPassed
                    ? "bg-[#E7F3FF] border-[#1CB0F6]"
                    : "bg-[#FFEBEB] border-[#FF4B4B]",
              )}
            >
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

          <h1
            className={cn(
              "text-2xl lg:text-3xl font-black mb-2 uppercase tracking-tight",
              isPerfect ? "text-[#FFC800]" : isPassed ? "text-[#1CB0F6]" : "text-[#FF4B4B]",
            )}
          >
            {isPerfect
              ? "¡Lección Perfecta!"
              : isPassed
                ? "¡Lección completada!"
                : "Necesitas practicar más"}
          </h1>

          <p className="text-[#777777] font-bold text-sm lg:text-base mb-8">
            {isPerfect
              ? "Has demostrado un dominio total de este tema bíblico."
              : isPassed
                ? "Has ganado puntos de experiencia y has reforzado tus conocimientos bíblicos."
                : `Has acertado ${correctAnswersCount} de ${lesson.exercises.length} preguntas (${accuracy}%). Necesitas al menos 50% para aprobar.`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest mb-1">
                XP Ganados
              </div>
              <div
                className={cn(
                  "text-xl lg:text-2xl font-black",
                  isPassed ? "text-[#58CC02]" : "text-[#777777]",
                )}
              >
                +{earnedPoints}
              </div>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest mb-1">
                Racha
              </div>
              <div className="text-xl lg:text-2xl font-black text-[#FF9600]">{earnedStreak}</div>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
              <div className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest mb-1">
                Precisión
              </div>
              <div
                className={cn(
                  "text-xl lg:text-2xl font-black",
                  isPerfect ? "text-[#FFC800]" : isPassed ? "text-[#1CB0F6]" : "text-[#FF4B4B]",
                )}
              >
                {accuracy}%
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              router.push(returnRoute);
            }}
            className={cn(
              "w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest text-sm lg:text-lg border-b-4 lg:border-b-8 transition-all active:translate-y-1 active:border-b-0",
              isPerfect
                ? "bg-[#FFC800] border-[#E5A500] hover:bg-[#FFD433]"
                : isPassed
                  ? "bg-[#58CC02] border-[#46A302] hover:bg-[#61E002]"
                  : "bg-[#FF4B4B] border-[#CC3C3C] hover:bg-[#FF5C5C]",
            )}
          >
            {isPassed
              ? isPracticeLesson
                ? "Volver a práctica"
                : "Continuar"
              : isPracticeLesson
                ? "Intentar otra práctica"
                : "Volver a intentar"}
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isNounParsing = currentExercise.type === "noun-parsing";
  const parsedNounCorrectAnswer = isNounParsing
    ? parseNounParsingAnswer(currentExercise.correctAnswer)
    : undefined;
  const feedbackCorrectAnswer = isNounParsing
    ? formatNounParsingAnswer(parsedNounCorrectAnswer ?? {})
    : currentExercise.correctAnswer;
  
  const displayQuestion = sanitizeQuestionForNiqqudQuiz(
    currentExercise.question,
    currentExercise.options,
  );
  const progress = (currentExerciseIndex / lesson.exercises.length) * 100;

  // Lógica WordBank
  const isWordBank = currentExercise.type === "word-bank";
  
  // Generar bloques para WordBank si aplica
  const wbBlocks = isWordBank ? currentExercise.options.map((opt, i) => ({
    id: `opt-${i}`,
    text: opt,
    type: "default" as const
  })) : [];
  return (
    <div className="h-[100dvh] bg-[#FDFBF7] flex flex-col overflow-hidden fixed inset-0">
      {/* Header */}
      <div
        className={cn(
          "max-w-5xl mx-auto w-full px-4 flex items-center gap-4 lg:gap-6 shrink-0",
          isNounParsing ? "pt-3 lg:pt-4 pb-2 lg:pb-3" : "pt-4 lg:pt-12 pb-2 lg:pb-4",
        )}
      >
        <button
          onClick={() => router.push(returnRoute)}
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
        {isRandomExerciseOrder && (
          <div className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#BDE3FF] text-[10px] lg:text-xs font-black uppercase tracking-widest">
            Orden Aleatorio
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 flex flex-col items-center max-w-3xl mx-auto w-full px-4 overflow-y-auto",
          isNounParsing ? "justify-start py-1 lg:py-2" : "justify-center py-4",
        )}
      >
        <h2
          className={cn(
            "font-black text-[#4B4B4B] text-center leading-tight shrink-0",
            isNounParsing ? "text-lg lg:text-2xl mb-2 lg:mb-3" : "text-xl lg:text-3xl mb-6 lg:mb-10",
          )}
        >
          {displayQuestion.split(/(◌[\u0591-\u05C7]+)/g).map((part, i) => {
            if (part.startsWith('◌')) {
              return (
                <span key={i} className="HebrewFont inline-flex items-center justify-center leading-none" dir="ltr">
                  {part}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </h2>

        {currentExercise.hebrewParts && currentExercise.hebrewParts.length > 0 ? (
          <HebrewWordIME
            parts={currentExercise.hebrewParts}
            className={cn("text-center w-full", isNounParsing ? "mb-2 lg:mb-3" : "mb-6 lg:mb-10")}
          />
        ) : currentExercise.hebrewText && !isWordBank ? (
          <HebrewMultisensorial
            text={currentExercise.hebrewText}
            className={cn(isNounParsing ? "mb-2 lg:mb-3" : "mb-6 lg:mb-10")}
          />
        ) : null}

        {isWordBank ? (
          <WordBankExercise
            blocks={wbBlocks}
            selectedBlocks={wbSelectedBlocks}
            onChange={setWbSelectedBlocks}
            mode={hasHebrewGlyphs(currentExercise.correctAnswer) ? "spanish-to-hebrew" : "hebrew-to-spanish"}
            isFinished={isAnswerChecked}
          />
        ) : isNounParsing ? (
          <NounParsingExercise
            value={parseNounParsingAnswer(selectedOption)}
            onChange={(val) => setSelectedOption(JSON.stringify(val))}
            meanings={currentExercise.options}
            isFinished={isAnswerChecked}
            correctValue={parsedNounCorrectAnswer}
            compact={true}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 w-full max-w-2xl mx-auto">
            {currentExercise.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentExercise.correctAnswer;
            const showCorrectHighlight = isAnswerChecked && !isCorrect && isCorrectOption;
            const showWrongHighlight = isAnswerChecked && !isCorrect && isSelected;
            const showSuccessHighlight = isAnswerChecked && isCorrect && isSelected;
            const optionHasHebrew = hasHebrewGlyphs(option);
            const showLargeNiqqud = isStandaloneNiqqud(option);
            const parsedNiqqud = parseOptionWithNiqqud(option);

            return (
              <button
                key={index}
                disabled={isAnswerChecked}
                onClick={() => setSelectedOption(option)}
                className={cn(
                  "p-4 lg:p-6 text-lg lg:text-xl font-bold rounded-2xl border-2 border-b-4 lg:border-b-8 transition-all text-center",
                  optionHasHebrew && "HebrewFont",
                  parsedNiqqud.hasNiqqud && !parsedNiqqud.before && !parsedNiqqud.after && "text-4xl lg:text-5xl leading-none py-6 lg:py-7",
                  !isAnswerChecked && "active:translate-y-1 active:border-b-2",
                  showCorrectHighlight
                    ? "bg-[#D7FFB7] border-[#58CC02] text-[#58A700] animate-[pulse_1s_ease-in-out_2] border-b-4 lg:border-b-8"
                    : showWrongHighlight
                      ? "bg-[#FFDADC] border-[#FF4B4B] text-[#EA2B2B] border-b-4 lg:border-b-8"
                      : showSuccessHighlight
                        ? "bg-[#D7FFB7] border-[#58CC02] text-[#58A700] border-b-4 lg:border-b-8"
                        : isSelected
                          ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1899D6] border-b-4 lg:border-b-8 shadow-none"
                          : "bg-white border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]",
                )}
              >
                {parsedNiqqud.hasNiqqud ? (
                  <span className="inline-flex items-center justify-center gap-2 lg:gap-3 flex-wrap">
                    {parsedNiqqud.before && <span className="text-lg lg:text-xl">{parsedNiqqud.before}</span>}
                    <span className="HebrewFont text-4xl lg:text-5xl leading-none" dir="ltr">◌{parsedNiqqud.niqqud}</span>
                    {parsedNiqqud.after && <span className="text-lg lg:text-xl">{parsedNiqqud.after}</span>}
                  </span>
                ) : (
                  option
                )}
              </button>
            );
          })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "border-t-2 transition-colors duration-300 shrink-0",
          isNounParsing ? "p-3 lg:p-4" : "p-4 lg:p-8",
          isAnswerChecked
            ? isCorrect
              ? "bg-[#D7FFB7] border-[#A5ED6E]"
              : "bg-[#FFDADC] border-[#FF4B4B]"
            : "bg-[#FDFBF7] border-[#E5E5E5]",
        )}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            {isAnswerChecked && (
              <div
                className={cn(
                  "w-10 h-10 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0",
                  isCorrect ? "bg-white text-[#58CC02]" : "bg-white text-[#FF4B4B]",
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 lg:w-10 lg:h-10" />
                ) : (
                  <XCircle className="w-6 h-6 lg:w-10 lg:h-10" />
                )}
              </div>
            )}
            {isAnswerChecked && (
              <div className="min-w-0">
                <h3
                  className={cn(
                    "text-lg lg:text-2xl font-black truncate",
                    isCorrect ? "text-[#58A700]" : "text-[#EA2B2B]",
                  )}
                >
                  {isCorrect ? "¡Excelente!" : "Respuesta incorrecta"}
                </h3>
                {!isCorrect && (
                  <p
                    className={cn(
                      "text-[#EA2B2B] font-bold text-xs lg:text-base truncate",
                      !isNounParsing && hasHebrewGlyphs(currentExercise.correctAnswer) && "HebrewFont",
                    )}
                  >
                    La respuesta correcta era: {feedbackCorrectAnswer}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={isAnswerChecked ? onNext : onCheck}
            disabled={
              isSubmitting || 
              (isWordBank 
                ? wbSelectedBlocks.length === 0 
                : isNounParsing 
                  ? (() => {
                      try {
                        const parsed = JSON.parse(selectedOption || "{}");
                        return !parsed.gender || !parsed.number || !parsed.meaning;
                      } catch {
                        return true;
                      }
                    })()
                  : !selectedOption)
            }
            className={cn(
              "px-6 lg:px-12 py-3 lg:py-4 rounded-2xl font-black text-sm lg:text-lg uppercase tracking-widest transition-all border-b-4 lg:border-b-8 active:translate-y-1 active:border-b-2 shrink-0",
              (isWordBank 
                ? wbSelectedBlocks.length === 0 
                : isNounParsing 
                  ? (() => {
                      try {
                        const parsed = JSON.parse(selectedOption || "{}");
                        return !parsed.gender || !parsed.number || !parsed.meaning;
                      } catch {
                        return true;
                      }
                    })()
                  : !selectedOption)
                ? "bg-[#E5E5E5] text-[#AFAFAF] border-[#AFAFAF] cursor-not-allowed border-b-0 translate-y-0"
                : isAnswerChecked
                  ? isCorrect
                    ? "bg-[#58CC02] text-white border-[#46A302] hover:bg-[#61E002]"
                    : "bg-[#FF4B4B] text-white border-[#CC3C3C] hover:bg-[#FF5C5C]"
                  : "bg-[#58CC02] text-white border-[#46A302] hover:bg-[#61E002]",
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

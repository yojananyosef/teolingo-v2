"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { completePracticeAction } from "@/features/lessons/actions";
import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { ArrowLeft, CheckCircle2, Mic, MicOff, RefreshCw, Volume2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Block {
  id: string;
  text: string;
  type: "p" | "r" | "s" | "default"; // prefix, root, suffix
}

export default function PracticeBuildPage() {
  const router = useRouter();
  const { isLowEnergyMode } = useUIStore();

  const [targetWord] = useState({
    hebrew: "בְּרֵאשִׁית",
    meaning: "En el principio",
    explanation: "בְּ (Prefijo) + רֵאשִׁ (Raíz: cabeza) + ית (Sufijo)",
  });

  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      await playHebrewText(text);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  // Feynman Oral State
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Simulación de carga de una palabra para construir
    const blocks: Block[] = [
      { id: "1", text: "בְּ", type: "p" },
      { id: "2", text: "רֵאשִׁ", type: "r" },
      { id: "3", text: "ית", type: "s" },
      { id: "4", text: "הַ", type: "p" },
      { id: "5", text: "אָרֶץ", type: "r" },
    ];
    // Shuffle blocks
    setAvailableBlocks(blocks.sort(() => Math.random() - 0.5));

    // Initialize Speech Recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "es-ES"; // Default to Spanish for explanations

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscription((prev) => `${prev + event.results[i][0].transcript} `);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // Could show interim transcript too if needed
      };

      setRecognition(rec);
    }
  }, []);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setTranscription(""); // Clear previous transcription

        if (recognition) {
          recognition.start();
        }
      } catch (err) {
        console.error("No se pudo acceder al micrófono", err);
        toast.error("No se pudo acceder al micrófono");
      }
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
      setHasRecorded(true);

      if (recognition) {
        recognition.stop();
      }

      // Stop stream tracks
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleBlockClick = (block: Block, fromSelected: boolean) => {
    if (isFinished) return;

    // Tactile feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }

    if (fromSelected) {
      setSelectedBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setAvailableBlocks((prev) => [...prev, block]);
    } else {
      setAvailableBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setSelectedBlocks((prev) => [...prev, block]);
    }
  };

  const handleCheck = () => {
    const constructed = selectedBlocks.map((b) => b.text).join("");
    const target = targetWord.hebrew;
    const correct = constructed === target;

    setIsCorrect(correct);
    setIsFinished(true);

    if (correct) {
      handlePlayAudio(target);
      // Multisensorial feedback
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } else {
      if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const onContinue = async () => {
    if (!isCorrect) {
      // Si no fue correcto, simplemente reiniciamos
      setIsFinished(false);
      setIsCorrect(null);
      setSelectedBlocks([]);
      setAvailableBlocks([...availableBlocks, ...selectedBlocks].sort(() => Math.random() - 0.5));
      return;
    }

    setIsSubmitting(true);
    try {
      // Si grabó una explicación, le damos el bono de blurting (+15 XP)
      // Si no, solo el bono de construcción (+10 XP)
      const modality = hasRecorded ? "blurting" : "build";
      const result = await completePracticeAction(100, modality);
      if (result.success) {
        toast.success("¡Práctica completada!", {
          description: hasRecorded
            ? "Has ganado el bono máximo (+15 XP) por usar Oral Feynman."
            : "Has ganado puntos extra por usar la modalidad IME Build.",
        });
        router.push("/learn");
      } else {
        toast.error("Error al guardar el progreso");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="p-4 lg:p-6 flex items-center justify-between bg-white border-b-2 border-[#E5E5E5]">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#AFAFAF]" />
          </button>
          <h1 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Construye la Palabra
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
        {!isFinished ? (
          <>
            <div className="mb-12 text-center space-y-4">
              <h2 className="text-2xl lg:text-3xl font-black text-[#4B4B4B]">
                Construye: "{targetWord.meaning}"
              </h2>
              {!isLowEnergyMode && (
                <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] inline-block">
                  <p className="text-[#1CB0F6] font-bold">Pista: Prefijo + Raíz + Sufijo</p>
                </div>
              )}
            </div>

            {/* Selected Area */}
            <div
              className={cn(
                "w-full min-h-[120px] p-6 border-4 rounded-3xl flex flex-wrap items-center justify-center gap-4 mb-12 bg-[#F7F7F7] transition-all",
                isLowEnergyMode
                  ? "border-solid border-[#E5E5E5]"
                  : "border-dashed border-[#E5E5E5]",
              )}
            >
              {selectedBlocks.length === 0 && (
                <p className="text-[#AFAFAF] font-bold uppercase tracking-widest text-sm">
                  Arrastra o toca bloques aquí
                </p>
              )}
              {selectedBlocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(block, true)}
                  className={cn(
                    "px-6 py-4 text-3xl font-black rounded-2xl border-2 border-b-4 transition-all HebrewFont",
                    !isLowEnergyMode && "hover:scale-105 active:translate-y-1",
                    block.type === "p" && "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]",
                    block.type === "r" && "bg-[#FFDADC] border-[#FF4B4B] text-[#FF4B4B]",
                    block.type === "s" && "bg-[#D7FFB7] border-[#A5ED6E] text-[#58CC02]",
                  )}
                >
                  {block.text}
                </button>
              ))}
            </div>

            {/* Available Blocks */}
            <div className="w-full flex flex-wrap items-center justify-center gap-4">
              {availableBlocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(block, false)}
                  className={cn(
                    "px-6 py-4 text-3xl font-black bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl text-[#4B4B4B] transition-all HebrewFont",
                    !isLowEnergyMode && "hover:bg-[#F7F7F7] hover:scale-105 active:translate-y-1",
                  )}
                >
                  {block.text}
                </button>
              ))}
            </div>
          </>
        ) : isCorrect ? (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-[#58CC02]">¡Palabra Construida!</h2>
              <div className="flex justify-center gap-2">
                {selectedBlocks.map((block, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "text-6xl font-black HebrewFont",
                      block.type === "p" && "text-[#1CB0F6]",
                      block.type === "r" && "text-[#FF4B4B]",
                      block.type === "s" && "text-[#58CC02]",
                    )}
                  >
                    {block.text}
                  </span>
                ))}
              </div>
              <p className="text-2xl font-bold text-[#4B4B4B]">{targetWord.meaning}</p>
            </div>

            <div className="bg-[#F7F7F7] p-8 rounded-3xl border-2 border-[#E5E5E5] max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#4B4B4B] flex items-center justify-center gap-2">
                  <Mic className="text-[#1CB0F6]" />
                  Explicación Oral (Blurting)
                </h3>
                <p className="text-[#777777]">
                  Explica en voz alta la estructura de la palabra para fijar el conocimiento.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg",
                    isRecording ? "bg-[#FF4B4B] animate-pulse" : "bg-[#1CB0F6] hover:bg-[#1899D6]",
                  )}
                >
                  {isRecording ? (
                    <MicOff className="text-white w-10 h-10" />
                  ) : (
                    <Mic className="text-white w-10 h-10" />
                  )}
                </button>

                <p
                  className={cn(
                    "font-bold transition-colors",
                    isRecording
                      ? "text-[#FF4B4B]"
                      : hasRecorded
                        ? "text-[#58CC02]"
                        : "text-[#1CB0F6]",
                  )}
                >
                  {isRecording
                    ? "Grabando..."
                    : hasRecorded
                      ? "¡Grabado! (Opcional)"
                      : "Pulsa para explicar"}
                </p>

                {transcription && (
                  <div className="mt-4 p-4 bg-white rounded-xl border-2 border-[#E5E5E5] w-full max-w-sm animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-[#4B4B4B] italic">"{transcription}"</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] text-left">
                <p className="text-sm font-bold text-[#AFAFAF] uppercase tracking-widest mb-2">
                  Estructura:
                </p>
                <p className="text-[#4B4B4B] font-medium italic">{targetWord.explanation}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-[#FFDADC] rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-[#FF4B4B] w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#FF4B4B]">¡Casi lo logras!</h2>
              <p className="text-xl text-[#777777]">
                Inténtalo de nuevo para perfeccionar la estructura.
              </p>
            </div>
            <button
              onClick={() => {
                setIsFinished(false);
                setIsCorrect(null);
                setSelectedBlocks([]);
                setAvailableBlocks(
                  [...availableBlocks, ...selectedBlocks].sort(() => Math.random() - 0.5),
                );
              }}
              className="flex items-center gap-2 mx-auto bg-white border-2 border-[#E5E5E5] border-b-4 px-8 py-3 rounded-2xl font-black text-[#4B4B4B] hover:bg-[#F7F7F7] transition-all active:translate-y-1"
            >
              <RefreshCw size={20} />
              Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "border-t-2 p-6 lg:p-10 transition-colors duration-300",
          isCorrect === true
            ? "bg-[#D7FFB7] border-[#A5ED6E]"
            : isCorrect === false
              ? "bg-[#FFDADC] border-[#FF4B4B]"
              : "bg-white border-[#E5E5E5]",
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isCorrect !== null && (
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center">
                {isCorrect ? (
                  <CheckCircle2 className="text-[#58CC02] w-8 h-8 lg:w-10 lg:h-10" />
                ) : (
                  <XCircle className="text-[#FF4B4B] w-8 h-8 lg:w-10 lg:h-10" />
                )}
              </div>
            )}
            {isCorrect !== null && (
              <div>
                <h3
                  className={cn(
                    "text-xl lg:text-2xl font-black",
                    isCorrect ? "text-[#58A700]" : "text-[#EA2B2B]",
                  )}
                >
                  {isCorrect ? "¡Excelente construcción!" : "Casi lo tienes"}
                </h3>
                {isCorrect && (
                  <button
                    onClick={() => handlePlayAudio(targetWord.hebrew)}
                    disabled={isPlayingAudio}
                    className={cn(
                      "p-3 rounded-2xl bg-white border-2 border-[#E5E5E5] text-[#1CB0F6] hover:bg-[#F7F7F7] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                      isPlayingAudio && "animate-pulse border-[#1CB0F6]",
                    )}
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={isFinished ? onContinue : handleCheck}
            disabled={selectedBlocks.length === 0 || isSubmitting}
            className={cn(
              "px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all border-b-4 active:translate-y-1 active:border-b-0 flex items-center gap-2",
              selectedBlocks.length === 0 || isSubmitting
                ? "bg-[#E5E5E5] text-[#AFAFAF] border-[#AFAFAF] cursor-not-allowed"
                : isCorrect === true
                  ? "bg-[#58CC02] text-white border-[#46A302]"
                  : isCorrect === false
                    ? "bg-[#FF4B4B] text-white border-[#CC3C3C]"
                    : "bg-[#58CC02] text-white border-[#46A302]",
            )}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" variant="white" />
            ) : isFinished ? (
              "Continuar"
            ) : (
              "Comprobar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

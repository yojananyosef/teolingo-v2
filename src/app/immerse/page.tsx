"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  completePracticeAction,
  getAlphabetAction,
  getRhythmParadigmsAction,
} from "@/features/lessons/actions";
import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import {
  ArrowLeft,
  CheckCircle2,
  Music,
  Pause,
  PencilLine,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Letter = {
  id: string;
  char: string;
  name: string;
  order: number;
};

type RhythmParadigm = {
  id: string;
  name: string;
  root: string;
  forms: {
    hebrew: string;
    translit: string;
    meaning: string;
  }[];
  order: number;
};

export default function ImmersePage() {
  const router = useRouter();
  const { isLowEnergyMode } = useUIStore();

  const [activeTab, setActiveTab] = useState<"air-writing" | "rhythm">("air-writing");
  const [alphabet, setAlphabet] = useState<Letter[]>([]);
  const [paradigms, setParadigms] = useState<RhythmParadigm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const [currentParadigmIdx, setCurrentParadigmIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(35);
  const [beat, setBeat] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Fetch data from DB
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [alphabetResult, paradigmsResult] = await Promise.all([
          getAlphabetAction(),
          getRhythmParadigmsAction(),
        ]);

        if (alphabetResult.success && alphabetResult.data) {
          setAlphabet(alphabetResult.data);
        }
        if (paradigmsResult.success && paradigmsResult.data) {
          setParadigms(paradigmsResult.data);
        }
      } catch (error) {
        toast.error("Error al cargar datos de inmersión");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const currentLetter = alphabet[currentLetterIdx];
  const currentParadigm = paradigms[currentParadigmIdx];

  const onFinish = async () => {
    setIsSubmitting(true);
    try {
      const modality = activeTab === "air-writing" ? "air-writing" : "rhythm";
      const result = await completePracticeAction(100, modality);

      if (result.success) {
        toast.success("¡Práctica IME Completada!", {
          description: `Has ganado puntos extra por usar la modalidad ${modality === "air-writing" ? "Air Writing" : "Ritmo"}.`,
        });
        setIsFinished(true);
        setTimeout(() => router.push("/learn"), 2000);
      } else {
        toast.error("Error al guardar el progreso");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Canvas logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== "air-writing") return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Solo actualizamos si el tamaño ha cambiado significativamente para evitar limpiezas innecesarias
      const newWidth = Math.floor(rect.width * dpr);
      const newHeight = Math.floor(rect.height * dpr);

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.strokeStyle = "#1CB0F6";
          ctx.lineWidth = 14 * dpr;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      }
    };

    // Usar un pequeño delay para asegurar que el DOM se ha asentado
    const timeoutId = setTimeout(updateCanvasSize, 100);

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(canvas);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [activeTab]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      // Usar clientX/Y que son relativos al viewport
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Factor de escala entre resolución interna y tamaño visual CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.strokeStyle = "#1CB0F6";
    ctx.lineWidth = 14 * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Asegurar propiedades en cada trazo para evitar que se pierdan
    const dpr = window.devicePixelRatio || 1;
    ctx.strokeStyle = "#1CB0F6";
    ctx.lineWidth = 14 * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Metronome logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeTab === "rhythm") {
      interval = setInterval(
        () => {
          setBeat((prev) => {
            const nextBeat = (prev + 1) % currentParadigm.forms.length;
            // Tactile feedback on each beat
            if (window.navigator.vibrate) {
              window.navigator.vibrate(nextBeat === 0 ? 20 : 10);
            }
            return nextBeat;
          });
        },
        (60 / bpm) * 1000,
      );
    }
    return () => clearInterval(interval);
  }, [isPlaying, bpm, activeTab, currentParadigm]);

  // Audio playback on beat
  useEffect(() => {
    if (isPlaying && activeTab === "rhythm" && currentParadigm) {
      // Limpiar audio anterior antes de reproducir el siguiente para evitar colisiones en móviles
      playHebrewText("");
      const textToPlay = currentParadigm.forms[beat].hebrew;
      playHebrewText(textToPlay);
    }
  }, [beat, isPlaying, activeTab, currentParadigm]);

  const playSound = async (text: string) => {
    // Limpiar audio anterior
    playHebrewText("");
    await playHebrewText(text);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#777777] font-bold">Cargando experiencia de inmersión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white no-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="p-4 lg:p-6 flex items-center gap-x-4 bg-white border-b-2 border-[#E5E5E5]">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#AFAFAF] hover:text-[#4B4B4B]" />
        </button>
        <h1 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight">
          Inmersión IME: Escuchar & Mover
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center p-4 gap-x-2">
        <button
          onClick={() => {
            setActiveTab("air-writing");
            setIsPlaying(false);
          }}
          className={cn(
            "px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-b-4 active:translate-y-1 active:border-b-0",
            activeTab === "air-writing"
              ? "bg-[#1CB0F6] text-white border-[#1899D6]"
              : "bg-white text-[#AFAFAF] border-[#E5E5E5] hover:bg-[#F7F7F7]",
          )}
        >
          <div className="flex items-center gap-x-2">
            <PencilLine size={18} />
            <span>Air Writing</span>
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab("rhythm");
            setIsPlaying(false);
          }}
          className={cn(
            "px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-b-4 active:translate-y-1 active:border-b-0",
            activeTab === "rhythm"
              ? "bg-[#58CC02] text-white border-[#46A302]"
              : "bg-white text-[#AFAFAF] border-[#E5E5E5] hover:bg-[#F7F7F7]",
          )}
        >
          <div className="flex items-center gap-x-2">
            <Music size={18} />
            <span>Ritmo</span>
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-10">
        <div className="max-w-4xl w-full bg-white rounded-3xl border-2 border-[#E5E5E5] p-8 lg:p-12 shadow-sm min-h-[550px] flex flex-col items-center justify-between">
          {isFinished ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-[#D7FFB7] rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-[#58CC02] w-16 h-16" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#4B4B4B]">¡Excelente Trabajo!</h2>
                <p className="text-xl text-[#777777] font-bold">
                  Tu cerebro ahora es más fuerte en Hebreo.
                </p>
              </div>
            </div>
          ) : activeTab === "air-writing" ? (
            <div className="space-y-6 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#4B4B4B]">Escucha y Traza</h2>
                <p className="text-[#777777] font-bold">
                  Sigue la forma de la letra{" "}
                  <span className="text-[#1CB0F6]">{currentLetter.name}</span>
                </p>
              </div>

              <div
                className={cn(
                  "relative w-72 h-72 lg:w-96 lg:h-96 border-4 rounded-3xl bg-[#F7F7F7] overflow-hidden transition-colors",
                  isLowEnergyMode ? "border-[#E5E5E5]" : "border-[#F0F9FF]",
                )}
              >
                {/* Background Letter Guide */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center text-[15rem] lg:text-[20rem] font-black HebrewFont select-none pointer-events-none transition-opacity",
                    isLowEnergyMode ? "text-[#D1D1D1] opacity-60" : "text-[#E5E5E5] opacity-40",
                  )}
                >
                  {currentLetter.char}
                </div>

                {/* Drawing Canvas */}
                <canvas
                  ref={canvasRef}
                  width={1000}
                  height={1000}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />

                <button
                  onClick={clearCanvas}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors"
                  title="Limpiar"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <button
                  onClick={() => playSound(currentLetter.char)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-x-3 px-6 py-3 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest border-b-4 border-[#1899D6] hover:bg-[#1fa9e6] active:translate-y-1 active:border-b-0 transition-all text-sm sm:text-base"
                >
                  <Volume2 size={20} />
                  <span>Escuchar</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentLetterIdx((prev) => (prev + 1) % alphabet.length);
                    clearCanvas();
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-x-3 px-6 py-3 bg-white text-[#4B4B4B] rounded-2xl font-black uppercase tracking-widest border-2 border-[#E5E5E5] border-b-4 hover:bg-[#F7F7F7] active:translate-y-1 active:border-b-0 transition-all text-sm sm:text-base"
                >
                  <span>Siguiente</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#4B4B4B]">Ritmo del Paradigma</h2>
                <p className="text-[#777777] font-bold">Canta las formas siguiendo el pulso</p>
              </div>

              {/* Paradigm Selection */}
              <div className="flex gap-x-2 overflow-x-auto pb-4 max-w-full w-full no-scrollbar px-2">
                {paradigms.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentParadigmIdx(idx);
                      setIsPlaying(false);
                      setBeat(0);
                    }}
                    className={cn(
                      "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-tight whitespace-nowrap transition-all border-b-4 active:translate-y-1 active:border-b-0 shrink-0",
                      currentParadigmIdx === idx
                        ? "bg-[#58CC02] text-white border-[#46A302]"
                        : "bg-white text-[#AFAFAF] border-[#E5E5E5] hover:bg-[#F7F7F7]",
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Metronome Visualizer */}
              <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 h-24 lg:h-32 px-4 w-full">
                {currentParadigm.forms.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 lg:w-4 rounded-full transition-all duration-150",
                      beat === i && isPlaying
                        ? "bg-[#58CC02] h-16 lg:h-20 shadow-[0_0_20px_rgba(88,204,2,0.6)]"
                        : "bg-[#E5E5E5] h-8 lg:h-10",
                      isLowEnergyMode && "duration-300",
                    )}
                  />
                ))}
              </div>

              {/* Paradigm Display */}
              <div className="w-full max-w-md bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-3xl p-4 lg:p-6 space-y-4">
                <div className="flex justify-between items-center border-b-2 border-[#58CC02]/10 pb-2">
                  <span className="font-black text-[#46A302] uppercase tracking-widest text-xs lg:text-sm">
                    {currentParadigm.name}
                  </span>
                  <span className="font-bold text-[#777777] HebrewFont text-lg lg:text-xl">
                    {currentParadigm.root}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:gap-3">
                  {currentParadigm.forms.map((form, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex justify-between items-center p-2 lg:p-3 rounded-xl font-bold transition-all cursor-pointer",
                        beat === i && isPlaying
                          ? "bg-white text-[#58CC02] shadow-sm scale-105"
                          : "text-[#4B4B4B] hover:bg-white/50",
                      )}
                      onClick={() => playSound(form.hebrew)}
                    >
                      <div className="flex flex-col">
                        <span className="HebrewFont text-lg lg:text-xl">{form.hebrew}</span>
                        <div className="flex gap-x-2">
                          <span className="text-[9px] lg:text-[10px] text-[#AFAFAF] uppercase tracking-tighter">
                            {form.translit}
                          </span>
                          <span className="text-[9px] lg:text-[10px] text-[#58CC02] font-bold uppercase tracking-tighter">
                            • {form.meaning}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] lg:text-[10px] text-[#AFAFAF] font-black uppercase">
                        pulso {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-x-12 w-full justify-center">
                <div className="flex flex-col items-center gap-y-2 w-full max-w-[200px]">
                  <div className="flex justify-between w-full px-1">
                    <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-tighter">
                      Velocidad
                    </span>
                    <span className="text-[10px] font-black text-[#58CC02] uppercase tracking-tighter">
                      {bpm} BPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="35"
                    value={bpm}
                    onChange={(e) => setBpm(Number.parseInt(e.target.value))}
                    className="w-full accent-[#58CC02] h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex flex-col items-center gap-y-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                      "flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full text-white transition-all border-b-4 active:translate-y-1 active:border-b-0",
                      isPlaying ? "bg-[#FF4B4B] border-[#D33131]" : "bg-[#58CC02] border-[#46A302]",
                    )}
                  >
                    {isPlaying ? (
                      <Pause size={32} fill="currentColor" />
                    ) : (
                      <Play size={32} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                  <span className="text-[10px] font-black text-[#AFAFAF] uppercase tracking-widest">
                    {isPlaying ? "Pausar" : "Iniciar"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!isFinished && (
            <button
              onClick={onFinish}
              disabled={isSubmitting}
              className="mt-8 w-full max-w-xs bg-[#58CC02] text-white rounded-2xl py-4 font-black uppercase tracking-widest border-b-4 border-[#46A302] hover:bg-[#61e002] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <LoadingSpinner size="sm" variant="white" /> : "Finalizar Sesión"}
            </button>
          )}
        </div>

        {/* Tips Footer */}
        <div className="mt-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-x-4">
            <div className="w-10 h-10 rounded-full bg-[#1CB0F6]/10 flex items-center justify-center text-[#1CB0F6]">
              <PencilLine size={20} />
            </div>
            <p className="text-sm text-[#777777] font-medium">
              <strong>Orton-Gillingham:</strong> El trazado activa la memoria kinestésica vinculada
              al sonido.
            </p>
          </div>
          <div className="bg-white/50 border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-x-4">
            <div className="w-10 h-10 rounded-full bg-[#58CC02]/10 flex items-center justify-center text-[#58CC02]">
              <Music size={20} />
            </div>
            <p className="text-sm text-[#777777] font-medium">
              <strong>Ritmo:</strong> La sincronización rítmica facilita la memorización de
              paradigmas gramaticales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

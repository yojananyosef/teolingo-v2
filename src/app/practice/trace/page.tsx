"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { completePracticeAction } from "@/features/lessons/actions";
import { playHebrewText } from "@/lib/tts";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TRACE_LETTERS = [
  {
    char: "ש",
    name: "Shin",
    points: [
      [100, 100],
      [100, 300],
      [200, 300],
      [200, 150],
      [300, 300],
      [300, 100],
    ],
  },
  {
    char: "מ",
    name: "Mem",
    points: [
      [300, 100],
      [100, 100],
      [100, 300],
      [300, 300],
      [300, 200],
    ],
  },
];

export default function TactileTracePage() {
  const router = useRouter();
  const { isLowEnergyMode } = useUIStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isTracing, setIsTracing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentLetter = TRACE_LETTERS[currentIdx];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background guide
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the "ghost" path
    ctx.beginPath();
    ctx.strokeStyle = "#E5E5E5";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const points = currentLetter.points;
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();

    // Draw start point
    ctx.beginPath();
    ctx.fillStyle = "#1CB0F6";
    ctx.arc(points[0][0], points[0][1], 15, 0, Math.PI * 2);
    ctx.fill();
  }, [currentIdx]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsTracing(true);
    setProgress(0);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTracing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    // Check distance to path points
    const points = currentLetter.points;
    // This is a simplified progress check
    // In a real app, we'd check distance to the nearest segment

    // For now, let's just draw the user's path
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#1CB0F6";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Tactile feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
  };

  const handleEnd = () => {
    setIsTracing(false);
    // Logic to check if tracing was successful enough
    // For now, let's assume success after any tracing
    setProgress(100);
  };

  const onFinish = async () => {
    setIsSubmitting(true);
    try {
      const result = await completePracticeAction(100, "air-writing"); // Using air-writing modality for now
      if (result.success) {
        toast.success("¡Trazado Tactil Completado!", {
          description: "Has reforzado tu memoria kinestésica.",
        });
        setIsFinished(true);
        setTimeout(() => router.push("/learn"), 2000);
      }
    } catch (error) {
      toast.error("Error al guardar el progreso");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF0]">
      <div className="p-4 lg:p-6 flex items-center gap-x-4 bg-white border-b-2 border-[#E5E5E5]">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#F7F7F7] rounded-full">
          <ArrowLeft className="w-6 h-6 text-[#AFAFAF]" />
        </button>
        <h1 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
          Tactile Trace
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-[#E5E5E5] p-8 shadow-sm flex flex-col items-center gap-y-8">
          {isFinished ? (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-[#D7FFB7] rounded-full flex items-center justify-center">
                <CheckCircle2 className="text-[#58CC02] w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-[#4B4B4B]">¡Excelente!</h2>
            </div>
          ) : (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-[#4B4B4B]">
                  Traza la letra {currentLetter.name}
                </h2>
                <p className="text-[#777777] font-bold italic">Sigue el camino azul</p>
              </div>

              <div className="relative bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] overflow-hidden cursor-crosshair touch-none">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full h-full"
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={handleEnd}
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                />

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext("2d");
                        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                      setCurrentIdx(currentIdx); // Trigger effect
                    }}
                    className="p-2 bg-white rounded-full shadow-sm text-[#AFAFAF]"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>

              <div className="w-full space-y-4">
                <button
                  onClick={() => playHebrewText(currentLetter.char)}
                  className="w-full py-3 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  Escuchar & Trazar
                </button>

                <button
                  onClick={onFinish}
                  disabled={isSubmitting || progress < 100}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-widest border-b-4 transition-all active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2",
                    progress < 100
                      ? "bg-[#E5E5E5] text-[#AFAFAF] border-[#AFAFAF]"
                      : "bg-[#58CC02] text-white border-[#46A302]",
                  )}
                >
                  {isSubmitting ? <LoadingSpinner size="sm" variant="white" /> : "Completar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

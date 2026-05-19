"use client";

import { useUIStore } from "@/store/useUIStore";
import { Check, Lock, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LessonNodeProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    isLocked?: boolean;
    isPerfect?: boolean;
    isOptional?: boolean;
    type?: "gold" | "normal" | "checkpoint"; // Diferentes tipos de nodo visual
  };
  index: number;
  totalNodes: number;
  isLastInModule?: boolean;
}

export function LessonNode({ lesson, index, totalNodes, isLastInModule }: LessonNodeProps) {
  const { isLowEnergyMode } = useUIStore();

  // Cálculos matemáticos para la trayectoria ondulada (El "Camino")
  // Utilizamos una función seno para generar la curva.
  const amplitude = 40; // Desplazamiento máximo en px (izquierda/derecha)
  const frequency = 0.5; // Qué tan rápido oscila
  const offset = Math.sin(index * frequency) * amplitude;
  const nextOffset = Math.sin((index + 1) * frequency) * amplitude;
  const relativeNextOffset = nextOffset - offset;

  const isRight = offset > 0;
  const tooltipSide = isRight ? "left" : "right";

  // Estilos del nodo basados en su estado (NAAS Cognitive Engine)
  let nodeColors = "";
  let icon = null;

  if (lesson.isLocked) {
    nodeColors = "bg-[#E5E5E5] border-[#AFAFAF] text-[#AFAFAF]";
    icon = <Lock className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={3} />;
  } else if (lesson.isCompleted) {
    if (lesson.isPerfect) {
      nodeColors = "bg-[#FFC800] border-[#E5A500] text-white";
      icon = <Star className="w-8 h-8 lg:w-10 lg:h-10 fill-current" />;
    } else {
      nodeColors = "bg-[#58CC02] border-[#46A302] text-white";
      icon = <Check className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={4} />;
    }
  } else {
    // Nodo Activo (Siguiente lección a completar)
    nodeColors = "bg-[#1CB0F6] border-[#1899D6] text-white animate-bounce-subtle";
    icon = <Star className="w-8 h-8 lg:w-10 lg:h-10 fill-current" />;
  }

  // Si es un nodo de "Punto de Control" (ej. fin de unidad)
  const isCheckpoint = lesson.type === "checkpoint";
  const sizeClasses = isCheckpoint ? "w-24 h-24 lg:w-28 lg:h-28" : "w-20 h-20 lg:w-24 lg:h-24";

  const content = (
    <div
      className={`relative z-10 ${sizeClasses} rounded-full flex items-center justify-center border-b-[8px] transition-transform active:translate-y-2 active:border-b-0 ${nodeColors}`}
      style={{
        boxShadow: isLowEnergyMode ? "none" : "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
      {icon}

      {/* Anillo de progreso exterior si está activo */}
      {!lesson.isLocked && !lesson.isCompleted && !isLowEnergyMode && (
        <div className="absolute -inset-4 border-4 border-[#1CB0F6] rounded-full opacity-30 animate-ping" />
      )}
    </div>
  );

  return (
    <div
      className="relative flex items-center justify-center w-full py-4 lg:py-6 group"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {/* SVG Path Connector (Conecta este nodo con el siguiente) */}
      {index < totalNodes - 1 && (
        <>
          <svg
            className="absolute top-1/2 left-1/2 w-[200px] -z-10 pointer-events-none lg:hidden"
            style={{
              height: isLastInModule ? "400px" : "160px",
              transform: "translate(-50%, 0)",
              overflow: "visible",
            }}
          >
            <path
              d={`M 100,0 C 100,${isLastInModule ? 200 : 80} ${100 + relativeNextOffset},${isLastInModule ? 200 : 80} ${100 + relativeNextOffset},${isLastInModule ? 400 : 160}`}
              fill="none"
              stroke={lesson.isCompleted ? "#58CC02" : "#E5E5E5"}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="0 24"
            />
          </svg>
          <svg
            className="absolute top-1/2 left-1/2 w-[200px] -z-10 pointer-events-none hidden lg:block"
            style={{
              height: isLastInModule ? "500px" : "208px",
              transform: "translate(-50%, 0)",
              overflow: "visible",
            }}
          >
            <path
              d={`M 100,0 C 100,${isLastInModule ? 250 : 104} ${100 + relativeNextOffset},${isLastInModule ? 250 : 104} ${100 + relativeNextOffset},${isLastInModule ? 500 : 208}`}
              fill="none"
              stroke={lesson.isCompleted ? "#58CC02" : "#E5E5E5"}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="0 24"
            />
          </svg>
        </>
      )}

      {lesson.isLocked ? (
        <div className="cursor-not-allowed">{content}</div>
      ) : (
        <Link
          href={isCheckpoint ? `/lesson/${lesson.id}?isCheckpoint=true` : `/lesson/${lesson.id}`}
          className="relative block"
        >
          {content}
        </Link>
      )}

      {/* Tooltip (Aparece al hacer hover) */}
      <div
        className={`absolute w-48 sm:w-64 transition-all duration-200 pointer-events-none opacity-0 group-hover:opacity-100 z-50 hidden md:block ${
          tooltipSide === "left" ? "right-full mr-6 text-right" : "left-full ml-6 text-left"
        }`}
      >
        <div className="bg-[#FFFDF5] px-6 py-4 rounded-2xl border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] relative">
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FFFDF5] border-t-2 border-l-2 border-[#E5E5E5] rotate-45 ${
              tooltipSide === "left"
                ? "-right-2.5 border-t-0 border-l-0 border-r-2 border-b-2"
                : "-left-2.5 rotate-[225deg]"
            }`}
          />
          <h3 className="font-black text-[#4B4B4B] text-lg leading-tight uppercase tracking-wide">
            {lesson.title}
          </h3>
          <p className="text-sm text-[#777777] font-bold leading-snug mt-2">{lesson.description}</p>
        </div>
      </div>
    </div>
  );
}

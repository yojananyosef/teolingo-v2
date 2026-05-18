import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SOUNDS = {
  CORRECT: "/sounds/correct.mp3",
  INCORRECT: "/sounds/incorrect.mp3",
  FINISHED: "/sounds/finished.mp3",
};

export const playCorrect = () => {
  const audio = new Audio(SOUNDS.CORRECT);
  audio.volume = 0.4;
  audio.play().catch((err) => console.error("Error playing sound:", err));
};

export const playIncorrect = () => {
  const audio = new Audio(SOUNDS.INCORRECT);
  audio.volume = 0.4;
  audio.play().catch((err) => console.error("Error playing sound:", err));
};

export const playFinished = () => {
  const audio = new Audio(SOUNDS.FINISHED);
  audio.volume = 0.4;
  audio.play().catch((err) => console.error("Error playing sound:", err));
};

export function formatTimestamp(value: string | number | Date | null | undefined) {
  if (value === null || value === undefined) return "";

  const normalized =
    typeof value === "string"
      ? value.replace(" ", "T")
      : typeof value === "number"
      ? new Date(value)
      : value;

  const date = normalized instanceof Date ? normalized : new Date(normalized);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
}

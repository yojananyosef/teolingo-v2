// Why: Implementación del algoritmo SM-2 adaptado para IME.
// En IME, el intervalo no solo depende de Correcto/Incorrecto, sino de la calidad de recuperación (VAKT).

interface SRSResult {
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitionCount: number;
}

/**
 * Calcula el siguiente intervalo de revisión basado en SM-2 modificado para IME.
 * @param quality 0-5 (1: Dudé mucho/VAKT pobre, 3: Bien, 5: ¡Perfecto/VAKT fluido!)
 * @param prevInterval Intervalo anterior en días
 * @param prevEaseFactor Factor de facilidad anterior (default 2.5 o 250)
 * @param repetitionCount Número de repeticiones exitosas previas
 */
export function calculateNextReview(
  quality: number,
  prevInterval: number,
  prevEaseFactor: number,
  repetitionCount: number
): SRSResult {
  let interval: number;
  let easeFactor = prevEaseFactor;
  let nextRepetitionCount = repetitionCount;

  // Calidad mínima para considerar "aprobado" en IME es 3
  if (quality >= 3) {
    if (repetitionCount === 0) {
      interval = 1;
    } else if (repetitionCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * (easeFactor / 100));
    }

    nextRepetitionCount++;

    // Ajustar factor de facilidad (Ease Factor)
    // easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    // Multiplicamos por 100 para manejar enteros en SQLite
    const efChange = Math.round((0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) * 100);
    easeFactor = Math.max(130, easeFactor + efChange);
  } else {
    // Si falló o la recuperación fue muy pobre (IME quality < 3)
    interval = 1;
    nextRepetitionCount = 0;
    // Penalización leve al factor de facilidad por mala recuperación VAKT
    easeFactor = Math.max(130, easeFactor - 20);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    nextReview,
    interval,
    easeFactor,
    repetitionCount: nextRepetitionCount,
  };
}

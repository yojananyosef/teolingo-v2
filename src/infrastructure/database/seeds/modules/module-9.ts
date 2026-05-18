import type { ModuleData } from "./types";

export const module9: ModuleData = {
  lessons: [
    {
      id: "lesson-24",
      title: "Lección 24: El Tronco Hifil",
      description: "El tronco causativo activo: morfología e identificación.",
      order: 24,
      moduleIndex: 9,
      xpReward: 45,
    },
    {
      id: "lesson-25",
      title: "Lección 25: El Tronco Hofal",
      description: "El tronco causativo pasivo del Hifil.",
      order: 25,
      moduleIndex: 9,
      xpReward: 45,
    },
    {
      id: "lesson-26",
      title: "Lección 26: El Tronco Hitpael",
      description: "El tronco reflexivo-intensivo y sus variaciones.",
      order: 26,
      moduleIndex: 9,
      xpReward: 50,
    },
  ],
  exercises: [
    // --- LECCIÓN 24: Hifil ---
    {
      lessonId: "lesson-24",
      type: "multiple-choice",
      question: "¿Cuál es la función principal del tronco Hifil?",
      correctAnswer: "Causativo activo: 'hizo que X hiciera algo', 'causó', 'produjo'.",
      options: JSON.stringify([
        "Causativo activo: 'hizo que X hiciera algo', 'causó', 'produjo'.",
        "Pasiva del Qal: 'fue hecho'.",
        "Intensivo activo: 'hizo completamente'.",
        "Reflexivo: 'se hizo a sí mismo'.",
      ]),
      hint: "Qal: 'aprendió' (למד). Piel: 'enseñó' (לִמֵּד). Hifil: 'hizo aprender / instruyó' (הִלְמִיד). El Hifil añade un agente causante.",
      order: 1,
    },
    {
      lessonId: "lesson-24",
      type: "multiple-choice",
      question: "¿Cuál es el elemento más característico del Hifil Perfecto 3ms?",
      correctAnswer: "El prefijo הִ (He con Hireq) antes del primer radical.",
      options: JSON.stringify([
        "El prefijo הִ (He con Hireq) antes del primer radical.",
        "El Daghesh Forte en el segundo radical.",
        "El prefijo Nun con Hireq.",
        "La vocal Qubbuts bajo el primer radical.",
      ]),
      hint: "הִקְטִיל: He + Hireq es la firma del Hifil Perfecto. La vocal interna larga (Tsere o Hireq-Yod) es característica.",
      order: 2,
    },
    {
      lessonId: "lesson-24",
      type: "multiple-choice",
      question: "¿Cómo se identifica el Imperfecto Hifil (ej. יַקְטִיל)?",
      correctAnswer:
        "El prefijo normal del Imperfecto + Pathach + Hireq-Yod (tsere largo) interno.",
      options: JSON.stringify([
        "El prefijo normal del Imperfecto + Pathach + Hireq-Yod (tsere largo) interno.",
        "He con Hireq antes de los radicales.",
        "Daghesh Forte en el radical 2.",
        "Prefijo Nun que se asimila.",
      ]),
      hint: "יַקְטִיל vs. יִקְטֹל (Qal). La vocal Pathach bajo el prefijo y el Hireq-Yod interno son las marcas del Hifil en el Imperfecto.",
      order: 3,
    },
    {
      lessonId: "lesson-24",
      type: "multiple-choice",
      question: "Analiza: הֶעֱלָה (de עלה = subir)",
      correctAnswer: "Hifil Perfecto 3ms: 'hizo subir', 'llevó arriba'",
      options: JSON.stringify([
        "Hifil Perfecto 3ms: 'hizo subir', 'llevó arriba'",
        "Qal Perfecto 3ms: 'subió'",
        "Nifal Perfecto 3ms: 'fue llevado arriba'",
        "Piel Perfecto 3ms: 'subió completamente'",
      ]),
      hint: "הֶ + gutural Ayin = He con Seghol (ajuste por gutural). La Yod final de la raíz III-He también afecta la forma.",
      order: 4,
    },

    // --- LECCIÓN 25: Hofal ---
    {
      lessonId: "lesson-25",
      type: "multiple-choice",
      question: "¿Qué relación tiene el Hofal con el Hifil?",
      correctAnswer: "El Hofal es la voz pasiva del Hifil: 'fue hecho X' / 'fue causado a X'.",
      options: JSON.stringify([
        "El Hofal es la voz pasiva del Hifil: 'fue hecho X' / 'fue causado a X'.",
        "El Hofal es el reflexivo del Hifil.",
        "El Hofal es más intenso que el Hifil.",
        "El Hofal es la forma de negación del Hifil.",
      ]),
      hint: "Hifil: 'hizo subir' (הֶעֱלָה). Hofal: 'fue hecho subir' (הָעֳלָה). Es la pasiva causativa.",
      order: 1,
    },
    {
      lessonId: "lesson-25",
      type: "multiple-choice",
      question: "¿Cuál es el elemento diagnóstico del Hofal Perfecto (ej. הָקְטַל)?",
      correctAnswer:
        "El prefijo He + Qamets/Holem (vocal larga 'o' o 'a') antes del primer radical.",
      options: JSON.stringify([
        "El prefijo He + Qamets/Holem (vocal larga 'o' o 'a') antes del primer radical.",
        "He + Hireq (como el Hifil Perfecto).",
        "Nun + Hireq (como el Nifal).",
        "Mem + Qubbuts (como el Pual Participio).",
      ]),
      hint: "Hifil: הִקְטִיל (He + Hireq). Hofal: הָקְטַל (He + Qamets/Qubbuts). La vocal del prefijo es la diferencia.",
      order: 2,
    },
    {
      lessonId: "lesson-25",
      type: "multiple-choice",
      question: "Analiza: הוּבָא (de בוא = venir)",
      correctAnswer: "Hofal Perfecto 3ms: 'fue traído'",
      options: JSON.stringify([
        "Hofal Perfecto 3ms: 'fue traído'",
        "Hifil Perfecto 3ms: 'trajo'",
        "Qal Perfecto 3ms: 'vino'",
        "Nifal Perfecto 3ms: 'fue visto'",
      ]),
      hint: "הוּ = He + Shureq (Holem en raíces Ayin-Waw). Hofal de verbos Ayin-Waw usa Shureq en lugar de Qamets.",
      order: 3,
    },

    // --- LECCIÓN 26: Hitpael (Checkpoint) ---
    {
      lessonId: "lesson-26",
      type: "multiple-choice",
      question: "¿Cuál es la función del tronco Hitpael?",
      correctAnswer:
        "Reflexivo-intensivo: 'se guardó a sí mismo', 'se santificó'. También recíproco y tolerativo.",
      options: JSON.stringify([
        "Reflexivo-intensivo: 'se guardó a sí mismo', 'se santificó'. También recíproco y tolerativo.",
        "Causativo pasivo: 'fue hecho guardar'.",
        "Solo pasivo del Piel.",
        "Intensivo activo sin reflexividad.",
      ]),
      hint: "הִתְקַדֵּשׁ = 'se santificó / se consagró' (reflexivo). También puede ser iterativo (acción repetida) o tolerativo ('se dejó ser guardado').",
      order: 1,
    },
    {
      lessonId: "lesson-26",
      type: "multiple-choice",
      question: "¿Cuál es el prefijo diagnóstico del Hitpael Perfecto (ej. הִתְקַטֵּל)?",
      correctAnswer: "הִתְ — He con Hireq + Tav con Shewa, antes del primer radical.",
      options: JSON.stringify([
        "הִתְ — He con Hireq + Tav con Shewa, antes del primer radical.",
        "הִ — He con Hireq solo.",
        "נִ — Nun con Hireq.",
        "מְ — Mem con Shewa.",
      ]),
      hint: "El Hitpael es el único tronco con prefijo de dos consonantes: הִתְ. Además tiene Daghesh Forte en el segundo radical (como el Piel).",
      order: 2,
    },
    {
      lessonId: "lesson-26",
      type: "multiple-choice",
      question:
        "¿Qué le ocurre al prefijo הִתְ cuando la raíz empieza con una sibilante (שׁ, שׂ, ס, צ)?",
      correctAnswer:
        "La Tav del prefijo y la sibilante intercambian posiciones (metatesis): הִשְׁתַּמֵּר en vez de הִתְשַׁמֵּר.",
      options: JSON.stringify([
        "La Tav del prefijo y la sibilante intercambian posiciones (metatesis): הִשְׁתַּמֵּר en vez de הִתְשַׁמֵּר.",
        "La sibilante absorbe la Tav del prefijo.",
        "Se añade un Daghesh Forte a la sibilante.",
        "No ocurre ningún cambio.",
      ]),
      hint: "La metatesis (intercambio de posición) es una característica única del Hitpael con sibilantes. Ejemplo: הִשְׁתַּחֲוָה (adorar) = הִתְ + שׁחה.",
      order: 3,
    },
    {
      lessonId: "lesson-26",
      type: "module-assessment",
      question: "Desafío Final: Identifica el tronco y analiza: יִתְקַדֵּשׁ",
      correctAnswer: "Hitpael Imperfecto 3ms: 'él se santificará / que él se santifique'",
      options: JSON.stringify([
        "Hitpael Imperfecto 3ms: 'él se santificará / que él se santifique'",
        "Piel Imperfecto 3ms: 'él santificará'",
        "Nifal Imperfecto 3ms: 'él será santificado'",
        "Hofal Imperfecto 3ms: 'él será hecho santificar'",
      ]),
      hint: "El prefijo יִ del Imperfecto + Daghesh en el segundo radical (שׁ) + la vocal Pathach + la forma interna del Piel = Hitpael Imperfecto.",
      order: 4,
    },
  ],
};

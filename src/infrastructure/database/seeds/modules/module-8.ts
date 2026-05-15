import { ModuleData } from "./types";

export const module8: ModuleData = {
  lessons: [
    {
      id: "lesson-21",
      title: "Lección 21: El Tronco Nifal",
      description: "El tronco pasivo-reflexivo: conjugación e identificación.",
      order: 21,
      moduleIndex: 8,
      xpReward: 40,
    },
    {
      id: "lesson-22",
      title: "Lección 22: El Tronco Piel",
      description: "El tronco intensivo activo y su patrón de duplicación.",
      order: 22,
      moduleIndex: 8,
      xpReward: 40,
    },
    {
      id: "lesson-23",
      title: "Lección 23: El Tronco Pual",
      description: "El tronco intensivo pasivo del Piel.",
      order: 23,
      moduleIndex: 8,
      xpReward: 50,
    },
  ],
  exercises: [
    // --- LECCIÓN 21: Nifal ---
    {
      lessonId: "lesson-21",
      type: "multiple-choice",
      question: "¿Cuál es la función principal del tronco Nifal?",
      correctAnswer: "Pasiva del Qal: 'fue guardado', 'fue escrito', 'fue creado'. También reflexivo: 'se guardó a sí mismo'.",
      options: JSON.stringify([
        "Pasiva del Qal: 'fue guardado', 'fue escrito', 'fue creado'. También reflexivo: 'se guardó a sí mismo'.",
        "Causativo activo: 'hizo que guardara'.",
        "Intensivo activo: 'guardó completamente'.",
        "Causativo pasivo: 'fue hecho guardar'."
      ]),
      hint: "El Nifal es frecuentemente la voz pasiva del Qal. La raíz נברא (Nifal de ברא) significa 'fue creado' — Génesis 1.",
      order: 1,
    },
    {
      lessonId: "lesson-21",
      type: "multiple-choice",
      question: "¿Cuál es el elemento diagnóstico que identifica el Nifal Perfecto (ej. נִקְטַל)?",
      correctAnswer: "El prefijo Nun (נִ) antes del primer radical, con Hireq.",
      options: JSON.stringify([
        "El prefijo Nun (נִ) antes del primer radical, con Hireq.",
        "El Daghesh Forte en el segundo radical.",
        "El prefijo He (הִ) con Pathach.",
        "El prefijo Mem (מְ) antes del primer radical."
      ]),
      hint: "נִקְטַל: El Nun inicial es el marcador del Nifal en el Perfecto. En el Imperfecto, el Nun se asimila: יִקָּטֵל.",
      order: 2,
    },
    {
      lessonId: "lesson-21",
      type: "multiple-choice",
      question: "Analiza: נִבְרָא (de ברא = crear)",
      correctAnswer: "Nifal Perfecto 3ms: 'fue creado'",
      options: JSON.stringify([
        "Nifal Perfecto 3ms: 'fue creado'",
        "Qal Perfecto 3ms: 'creó'",
        "Piel Perfecto 3ms: 'creó plenamente'",
        "Hifil Perfecto 3ms: 'hizo crear'"
      ]),
      hint: "El prefijo נִ + Pathach bajo el segundo radical = Nifal Perfecto. ברא solo aparece en Nifal y Qal en el AT.",
      order: 3,
    },
    {
      lessonId: "lesson-21",
      type: "multiple-choice",
      question: "¿Cuál es el Infinitivo Constructo Nifal de la raíz קטל?",
      correctAnswer: "הִקָּטֵל — prefijo He con Hireq, Nun asimilada con Daghesh.",
      options: JSON.stringify([
        "הִקָּטֵל — prefijo He con Hireq, Nun asimilada con Daghesh.",
        "נִקְטֹל — prefijo Nun con Hireq.",
        "הַקְטִיל — prefijo He + Pathach.",
        "קְטֹל — sin prefijo."
      ]),
      hint: "En el Imperfecto, Imperativo e Infinitivo del Nifal, la Nun se asimila y aparece un He: הִקָּטֵל.",
      order: 4,
    },

    // --- LECCIÓN 22: Piel ---
    {
      lessonId: "lesson-22",
      type: "multiple-choice",
      question: "¿Cuál es el elemento morfológico más característico del tronco Piel?",
      correctAnswer: "El Daghesh Forte en el segundo radical (duplicación del radical medio).",
      options: JSON.stringify([
        "El Daghesh Forte en el segundo radical (duplicación del radical medio).",
        "El prefijo Nun con Hireq.",
        "El prefijo He con Pathach.",
        "La vocal Shureq bajo el primer radical."
      ]),
      hint: "קִטֵּל: La Daguesh Forte duplica el segundo radical. Esto es la marca esencial del Piel en casi todas sus formas.",
      order: 1,
    },
    {
      lessonId: "lesson-22",
      type: "multiple-choice",
      question: "¿Qué función semántica suele tener el Piel en relación al Qal?",
      correctAnswer: "Intensifica o especifica la acción del Qal: causativa, factitiva, estimativa o pluralidad de acción.",
      options: JSON.stringify([
        "Intensifica o especifica la acción del Qal: causativa, factitiva, estimativa o pluralidad de acción.",
        "Siempre es la pasiva del Qal.",
        "Siempre es reflexiva.",
        "Expresa acción futura únicamente."
      ]),
      hint: "דִּבֶּר (Piel de דבר) = 'hablar' (plural/intensivo). שִׁבֵּר (Piel de שׁבר) = 'romper en pedazos' vs. שָׁבַר (Qal) = 'romper'.",
      order: 2,
    },
    {
      lessonId: "lesson-22",
      type: "multiple-choice",
      question: "Analiza: דִּבֶּר (de דבר = hablar)",
      correctAnswer: "Piel Perfecto 3ms: 'habló'",
      options: JSON.stringify([
        "Piel Perfecto 3ms: 'habló'",
        "Qal Perfecto 3ms: 'habló'",
        "Nifal Perfecto 3ms: 'fue hablado'",
        "Hifil Perfecto 3ms: 'hizo hablar'"
      ]),
      hint: "El Daghesh Forte en el Bet (ב) = duplicación = Piel. En Qal sería דָּבַר.",
      order: 3,
    },
    {
      lessonId: "lesson-22",
      type: "multiple-choice",
      question: "¿Cómo se identifica el Participio Piel? (ej. de קטל)",
      correctAnswer: "מְקַטֵּל — prefijo Mem (מְ) con Shewa + Pathach + Daghesh en radical 2.",
      options: JSON.stringify([
        "מְקַטֵּל — prefijo Mem (מְ) con Shewa + Pathach + Daghesh en radical 2.",
        "קֹטֵל — Holem bajo el radical 1.",
        "מִקְטֹּל — prefijo Mem con Hireq.",
        "קֻטַּל — Qubbuts bajo el radical 1."
      ]),
      hint: "El Participio Piel siempre comienza con מְ (Mem + Shewa). El Daghesh Forte en el segundo radical lo distingue del Participio Hifil.",
      order: 4,
    },

    // --- LECCIÓN 23: Pual (Checkpoint) ---
    {
      lessonId: "lesson-23",
      type: "multiple-choice",
      question: "¿Qué relación tiene el Pual con el Piel?",
      correctAnswer: "El Pual es la voz pasiva del Piel.",
      options: JSON.stringify([
        "El Pual es la voz pasiva del Piel.",
        "El Pual es el reflexivo del Piel.",
        "El Pual es más intenso que el Piel.",
        "El Pual es la forma causativa del Piel."
      ]),
      hint: "Piel → Pual como Qal → Nifal (para la pasiva). Piel: 'enseñó', Pual: 'fue enseñado'.",
      order: 1,
    },
    {
      lessonId: "lesson-23",
      type: "multiple-choice",
      question: "¿Cuál es el elemento diagnóstico del Pual Perfecto (ej. קֻטַּל)?",
      correctAnswer: "La vocal Qubbuts (ֻ) bajo el primer radical + Daghesh Forte en el segundo radical.",
      options: JSON.stringify([
        "La vocal Qubbuts (ֻ) bajo el primer radical + Daghesh Forte en el segundo radical.",
        "El prefijo Nun con Hireq.",
        "El prefijo He con Pathach.",
        "La vocal Pathach bajo el primer radical."
      ]),
      hint: "Piel = Pathach/Tsere + Daghesh. Pual = Qubbuts/Holem + Daghesh. La vocal del primer radical es la clave.",
      order: 2,
    },
    {
      lessonId: "lesson-23",
      type: "multiple-choice",
      question: "Analiza: לֻמַּד (de למד = enseñar/aprender)",
      correctAnswer: "Pual Perfecto 3ms: 'fue enseñado'",
      options: JSON.stringify([
        "Pual Perfecto 3ms: 'fue enseñado'",
        "Piel Perfecto 3ms: 'enseñó'",
        "Qal Perfecto 3ms: 'aprendió'",
        "Hifil Perfecto 3ms: 'hizo enseñar'"
      ]),
      hint: "Qubbuts bajo el Lamed (ל) + Daghesh en la Mem (מ) = Pual. Piel sería לִמֵּד.",
      order: 3,
    },
    {
      lessonId: "lesson-23",
      type: "module-assessment",
      question: "Desafío Final: En el texto 'לֹא יְדֻבַּר' (de דבר), ¿cuál es el análisis correcto?",
      correctAnswer: "Pual Imperfecto 3ms: 'no será hablado / no se hablará'",
      options: JSON.stringify([
        "Pual Imperfecto 3ms: 'no será hablado / no se hablará'",
        "Piel Imperfecto 3ms negativo: 'no hablará'",
        "Nifal Imperfecto 3ms: 'no será dicho'",
        "Qal Imperfecto 3ms negativo: 'no hablará'"
      ]),
      hint: "Imperfecto Pual tiene prefijo יְ (con Shewa en lugar de Hireq) + Qubbuts + Daghesh: יְדֻבַּר. La negación לֹא indica Indicativo, no Volitivo.",
      order: 4,
    },
  ],
};

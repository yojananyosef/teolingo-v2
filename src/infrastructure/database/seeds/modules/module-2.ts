import type { ModuleData } from "./types";

export const module2: ModuleData = {
  lessons: [
    {
      id: "lesson-4",
      title: "Lección 4: Sustantivos Hebreos",
      description: "Género y número de los sustantivos.",
      order: 4,
      moduleIndex: 2,
      xpReward: 30,
    },
    {
      id: "lesson-5",
      title: "Lección 5: Artículo Definido y Conjunción",
      description: "El artículo He y la conjunción Waw.",
      order: 5,
      moduleIndex: 2,
      xpReward: 30,
    },
    {
      id: "lesson-6",
      title: "Lección 6: Preposiciones Hebreas",
      description: "Preposiciones inseparables e independientes.",
      order: 6,
      moduleIndex: 2,
      xpReward: 50, // Checkpoint
    },
  ],
  exercises: [
    // --- LECCIÓN 4: Sustantivos ---
    {
      lessonId: "lesson-4",
      type: "noun-parsing",
      question: "Analiza el siguiente sustantivo: סוּסִים",
      correctAnswer: JSON.stringify({
        person: undefined,
        gender: "m",
        number: "p",
        meaning: "caballos",
      }),
      options: JSON.stringify([
        JSON.stringify({ gender: "m", number: "p", meaning: "caballos" }),
        JSON.stringify({ gender: "m", number: "s", meaning: "caballo" }),
        JSON.stringify({ gender: "f", number: "p", meaning: "yeguas" }),
      ]),
      hint: "La terminación -im (ִים) suele indicar plural masculino.",
      order: 1,
    },
    {
      lessonId: "lesson-4",
      type: "noun-parsing",
      question: "Analiza el siguiente sustantivo: תּוֹרָה",
      correctAnswer: JSON.stringify({
        person: undefined,
        gender: "f",
        number: "s",
        meaning: "ley/instrucción",
      }),
      options: JSON.stringify([
        JSON.stringify({ gender: "f", number: "s", meaning: "ley/instrucción" }),
        JSON.stringify({ gender: "m", number: "s", meaning: "ley/instrucción" }),
        JSON.stringify({ gender: "f", number: "p", meaning: "leyes" }),
      ]),
      hint: "La terminación Qamets He (ָה) es la marca más común del singular femenino.",
      order: 2,
    },
    {
      lessonId: "lesson-4",
      type: "noun-parsing",
      question: "Analiza el sustantivo: אָבוֹת (Padres)",
      correctAnswer: JSON.stringify({
        person: undefined,
        gender: "m",
        number: "p",
        meaning: "padres",
      }),
      options: JSON.stringify([
        JSON.stringify({ gender: "m", number: "p", meaning: "padres" }),
        JSON.stringify({ gender: "f", number: "p", meaning: "padres" }),
        JSON.stringify({ gender: "m", number: "s", meaning: "padre" }),
      ]),
      hint: "Excepción importante: 'Avot' tiene terminación femenina (-ot), pero es un sustantivo MASCULINO plural.",
      order: 3,
    },

    // --- LECCIÓN 5: Artículo y Conjunción ---
    {
      lessonId: "lesson-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma estándar del Artículo Definido en hebreo?",
      correctAnswer: "He + Pathach + Daghesh Forte",
      options: JSON.stringify([
        "He + Pathach + Daghesh Forte",
        "He + Qamets",
        "Lamed + Pathach",
        "Waw + Shewa",
      ]),
      hint: "El artículo 'El/La' suele poner una vocal corta 'a' (Pathach) bajo la He y duplicar la siguiente letra.",
      order: 1,
    },
    {
      lessonId: "lesson-5",
      type: "multiple-choice",
      question:
        "¿Qué ocurre cuando el artículo definido se añade a una palabra que empieza con gutural (א, ה, ח, ע, ר)?",
      correctAnswer: "Rechazo del Daghesh Forte y posible alargamiento compensatorio de la vocal.",
      options: JSON.stringify([
        "Rechazo del Daghesh Forte y posible alargamiento compensatorio de la vocal.",
        "La gutural absorbe la He del artículo.",
        "Se añade un Daghesh Lene a la gutural.",
        "El artículo cambia a Waw.",
      ]),
      hint: "Las guturales no pueden duplicarse, así que rechazan el Daghesh Forte, lo que a menudo causa que la vocal del artículo se alargue (Pathach a Qamets).",
      order: 2,
    },
    {
      lessonId: "lesson-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma estándar de la Conjunción Waw ('y')?",
      correctAnswer: "Waw + Shewa Sonoro",
      options: JSON.stringify([
        "Waw + Shewa Sonoro",
        "Waw + Pathach",
        "Waw + Shureq",
        "Waw + Qamets",
      ]),
      hint: "Normalmente, la 'y' se escribe anexada a la palabra como un prefijo con sonido 've'.",
      order: 3,
    },
    {
      lessonId: "lesson-5",
      type: "multiple-choice",
      question:
        "La regla 'BUMAF' dice que antes de las letras Bet, Waw, Mem, o Pe, la conjunción Waw cambia a:",
      correctAnswer: "Shureq (וּ)",
      options: JSON.stringify(["Shureq (וּ)", "Holem (וֹ)", "Waw + Qamets (וָ)", "Waw + Hireq (וִ)"]),
      hint: "Como los labios se juntan para pronunciar b,w,m,p, la conjunción se convierte en una 'u' vocal (Shureq).",
      order: 4,
    },

    // --- LECCIÓN 6: Preposiciones (Checkpoint) ---
    {
      lessonId: "lesson-6",
      type: "prefix-parsing",
      question: "Traduce la preposición inseparable: בְּ",
      correctAnswer: "en, por, con",
      options: JSON.stringify([
        "Traducción: en, por, con = Preposición inseparable",
        "Traducción: como, según = Preposición inseparable",
        "Traducción: a, para = Preposición inseparable",
        "Traducción: desde, de = Preposición",
      ]),
      hint: "La Bet suele indicar locación o instrumento.",
      order: 1,
    },
    {
      lessonId: "lesson-6",
      type: "prefix-parsing",
      question: "Traduce la preposición inseparable: לְ",
      correctAnswer: "a, para",
      options: JSON.stringify([
        "Traducción: a, para = Preposición inseparable",
        "Traducción: en, por, con = Preposición inseparable",
        "Traducción: como, según = Preposición inseparable",
        "Traducción: y = Conjunción",
      ]),
      hint: "La Lamed a menudo indica dirección o propósito.",
      order: 2,
    },
    {
      lessonId: "lesson-6",
      type: "multiple-choice",
      question:
        "¿Qué ocurre cuando una preposición inseparable (ב, כ, ל) se añade a una palabra que ya tiene el artículo definido (הַ)?",
      correctAnswer: "La preposición absorbe la He del artículo, y toma su vocal.",
      options: JSON.stringify([
        "La preposición absorbe la He del artículo, y toma su vocal.",
        "Se colocan una al lado de la otra (בְּהַ).",
        "La preposición toma un Shewa y la He se mantiene.",
        "El artículo desaparece y no deja rastro vocálico.",
      ]),
      hint: "Regla del eclipse: La consonante He es eclipsada, pero deja su vocal bajo la preposición.",
      order: 3,
    },
    {
      lessonId: "lesson-6",
      type: "multiple-choice",
      question: "¿Cuál es el comportamiento especial de la preposición מִן (desde, de)?",
      correctAnswer: "A menudo se asimila a la siguiente consonante, dejando un Daghesh Forte.",
      options: JSON.stringify([
        "A menudo se asimila a la siguiente consonante, dejando un Daghesh Forte.",
        "Se une siempre con un Maqqef (guion).",
        "Rechaza el artículo definido.",
        "Siempre cambia su vocal a Qamets.",
      ]),
      hint: "La Nun final tiende a asimilarse y desaparecer, endureciendo la siguiente letra con un Daghesh.",
      order: 4,
    },
    {
      lessonId: "lesson-6",
      type: "module-assessment",
      question: "Desafío Final: Traduce 'en el rey' al hebreo.",
      correctAnswer: "בַּמֶּלֶךְ",
      options: JSON.stringify(["בַּמֶּלֶךְ", "בְּמֶלֶךְ", "בְּהַמֶּלֶךְ", "הַמֶּלֶךְ"]),
      hint: "Necesitas la preposición 'en' (בְּ) unida al artículo 'el' (הַ). Recuerda la regla de absorción.",
      order: 5,
    },
  ],
};

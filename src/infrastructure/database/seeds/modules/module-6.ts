import type { ModuleData } from "./types";

export const module6: ModuleData = {
  lessons: [
    {
      id: "lesson-15",
      title: "Lección 15: El Infinitivo Constructo Qal",
      description: "El infinitivo que funciona como sustantivo verbal.",
      order: 15,
      moduleIndex: 6,
      xpReward: 35,
    },
    {
      id: "lesson-16",
      title: "Lección 16: El Infinitivo Absoluto Qal",
      description: "El infinitivo énfático y sus usos especiales.",
      order: 16,
      moduleIndex: 6,
      xpReward: 35,
    },
    {
      id: "lesson-17",
      title: "Lección 17: El Participio Qal",
      description: "El participio activo y pasivo del tronco Qal.",
      order: 17,
      moduleIndex: 6,
      xpReward: 50,
    },
  ],
  exercises: [
    // --- LECCIÓN 15: Infinitivo Constructo ---
    {
      lessonId: "lesson-15",
      type: "multiple-choice",
      question: "¿Cómo se forma el Infinitivo Constructo Qal de la raíz קטל?",
      correctAnswer: "קְטֹל — Shewa bajo el primer radical, Holem bajo el segundo.",
      options: JSON.stringify([
        "קְטֹל — Shewa bajo el primer radical, Holem bajo el segundo.",
        "קָטַל — vocal Qamets bajo el primer radical.",
        "קֹטֵל — participio activo.",
        "הִקְטִיל — forma Hifil.",
      ]),
      hint: "El Infinitivo Constructo Qal tiene el mismo patrón que el Imperativo 2ms: קְטֹל.",
      order: 1,
    },
    {
      lessonId: "lesson-15",
      type: "multiple-choice",
      question: "¿Cuál es el uso más común del Infinitivo Constructo con la preposición לְ?",
      correctAnswer: "Expresa propósito: 'para escribir', 'a fin de guardar'.",
      options: JSON.stringify([
        "Expresa propósito: 'para escribir', 'a fin de guardar'.",
        "Expresa tiempo pasado: 'habiendo escrito'.",
        "Expresa negación: 'sin escribir'.",
        "Expresa resultado: 'así que escribe'.",
      ]),
      hint: "לִכְתֹּב = 'para escribir'. La לְ con el Infinitivo Constructo es extremadamente frecuente en el AT.",
      order: 2,
    },
    {
      lessonId: "lesson-15",
      type: "multiple-choice",
      question: "¿Cuál es el uso del Infinitivo Constructo con la preposición בְּ?",
      correctAnswer: "Expresa tiempo simultáneo: 'cuando escribió', 'al escribir'.",
      options: JSON.stringify([
        "Expresa tiempo simultáneo: 'cuando escribió', 'al escribir'.",
        "Expresa propósito: 'para escribir'.",
        "Expresa causa: 'porque escribió'.",
        "Expresa consecuencia: 'entonces escribió'.",
      ]),
      hint: "בְּכָתְבוֹ = 'cuando él escribió / al escribir él'. La בְּ temporal con el Infinitivo Constructo es muy frecuente.",
      order: 3,
    },
    {
      lessonId: "lesson-15",
      type: "multiple-choice",
      question:
        "El Infinitivo Constructo puede recibir sufijos pronominales. ¿Qué indican esos sufijos?",
      correctAnswer: "El sujeto o el objeto de la acción verbal.",
      options: JSON.stringify([
        "El sujeto o el objeto de la acción verbal.",
        "Solo el tiempo de la acción.",
        "El género del infinitivo.",
        "La voz activa o pasiva.",
      ]),
      hint: "לִכְתֹּבוֹ puede significar 'cuando él escribió' (sufijo = sujeto) o 'para escribirlo' (sufijo = objeto), según el contexto.",
      order: 4,
    },

    // --- LECCIÓN 16: Infinitivo Absoluto ---
    {
      lessonId: "lesson-16",
      type: "multiple-choice",
      question: "¿Cuál es la forma del Infinitivo Absoluto Qal de la raíz קטל?",
      correctAnswer: "קָטוֹל — Qamets bajo el primer radical, Holem + Waw como Máter.",
      options: JSON.stringify([
        "קָטוֹל — Qamets bajo el primer radical, Holem + Waw como Máter.",
        "קְטֹל — Shewa bajo el primer radical.",
        "קֹטֵל — Tsere bajo el segundo radical.",
        "קָטַל — Pathach bajo el segundo radical.",
      ]),
      hint: "El Infinitivo Absoluto tiene una forma más 'pesada' que el Constructo. Termina en -ôl con Waw.",
      order: 1,
    },
    {
      lessonId: "lesson-16",
      type: "multiple-choice",
      question:
        "¿Cuál es el uso más característico del Infinitivo Absoluto cuando precede a un verbo finito de la misma raíz?",
      correctAnswer: "Énfasis o intensificación: 'ciertamente morirás', 'en verdad bendiciré'.",
      options: JSON.stringify([
        "Énfasis o intensificación: 'ciertamente morirás', 'en verdad bendiciré'.",
        "Indica acción futura lejana.",
        "Indica acción pasada perfecta.",
        "Substituye al Participio activo.",
      ]),
      hint: "מוֹת תָּמוּת (Génesis 2:17) = 'ciertamente morirás'. El Infinitivo Absoluto antes de un verbo finito = énfasis total.",
      order: 2,
    },
    {
      lessonId: "lesson-16",
      type: "multiple-choice",
      question:
        "El Infinitivo Absoluto que sigue a un verbo finito (en lugar de precederlo), ¿qué función tiene?",
      correctAnswer:
        "Indica acción continua o progresiva: 'anduvo y anduvo', 'fue haciéndose más grande'.",
      options: JSON.stringify([
        "Indica acción continua o progresiva: 'anduvo y anduvo', 'fue haciéndose más grande'.",
        "Niega el verbo.",
        "Expresa propósito.",
        "Indica resultado.",
      ]),
      hint: "Esta construcción (verbo finito + Infinitivo Absoluto de la misma raíz) enfatiza la continuidad o progresión de la acción.",
      order: 3,
    },

    // --- LECCIÓN 17: Participio Qal (Checkpoint) ---
    {
      lessonId: "lesson-17",
      type: "multiple-choice",
      question: "¿Cuál es la forma del Participio Activo Qal masculino singular?",
      correctAnswer: "קֹטֵל — Holem bajo el primer radical, Tsere bajo el segundo.",
      options: JSON.stringify([
        "קֹטֵל — Holem bajo el primer radical, Tsere bajo el segundo.",
        "קָטַל — Qamets + Pathach.",
        "קְטֹל — Shewa + Holem.",
        "מִקְטָל — con prefijo Mem.",
      ]),
      hint: "El Participio Activo Qal tiene el patrón qōṭēl: שֹׁמֵר (guardando, el que guarda).",
      order: 1,
    },
    {
      lessonId: "lesson-17",
      type: "multiple-choice",
      question: "¿Cuál es la forma del Participio Pasivo Qal masculino singular?",
      correctAnswer: "קָטוּל — Qamets bajo el primer radical, Shureq después del segundo.",
      options: JSON.stringify([
        "קָטוּל — Qamets bajo el primer radical, Shureq después del segundo.",
        "קֹטֵל — Holem + Tsere.",
        "נִקְטָל — con prefijo Nun (forma Nifal).",
        "מְקֻטָּל — forma Pual.",
      ]),
      hint: "El Participio Pasivo Qal: qāṭûl. Por ejemplo: כָּתוּב = 'escrito'.",
      order: 2,
    },
    {
      lessonId: "lesson-17",
      type: "multiple-choice",
      question: "¿Cuáles son las tres funciones del Participio hebreo?",
      correctAnswer:
        "Adjetival (describe un sustantivo), Sustantiva (funciona como sustantivo) y Predicativa (forma oraciones).",
      options: JSON.stringify([
        "Adjetival (describe un sustantivo), Sustantiva (funciona como sustantivo) y Predicativa (forma oraciones).",
        "Solo nominal y verbal.",
        "Solo verbal: activa y pasiva.",
        "Temporal, causal y consecutiva.",
      ]),
      hint: "El Participio es muy versátil: שֹׁמֵר הַבַּיִת (el que guarda la casa) = sustantivo; הָאִישׁ שֹׁמֵר (el hombre guardando) = adjetival.",
      order: 3,
    },
    {
      lessonId: "lesson-17",
      type: "multiple-choice",
      question: "Traduce: כָּתוּב בַּתּוֹרָה",
      correctAnswer: "escrito en la Ley",
      options: JSON.stringify([
        "escrito en la Ley",
        "el que escribe en la Ley",
        "escribirá en la Ley",
        "él escribió en la Ley",
      ]),
      hint: "כָּתוּב = Participio Pasivo Qal (escrito). בַּתּוֹרָה = en la Ley (preposición בְּ + artículo + תּוֹרָה).",
      order: 4,
    },
    {
      lessonId: "lesson-17",
      type: "module-assessment",
      question: "Desafío Final: ¿Cuál es la diferencia entre הַשֹּׁמֵר הַדָּבָר y הַשֹּׁמֵר אֶת הַדָּבָר?",
      correctAnswer:
        "La primera es una cadena constructa (el guardián de la palabra). La segunda es una oración (el guardián guarda la palabra).",
      options: JSON.stringify([
        "La primera es una cadena constructa (el guardián de la palabra). La segunda es una oración (el guardián guarda la palabra).",
        "Son frases sinónimas.",
        "La primera tiene objeto directo con אֵת; la segunda no tiene objeto.",
        "No hay diferencia funcional.",
      ]),
      hint: "Sin el marcador de objeto אֵת, el Participio + sustantivo = estado constructo (posesión). Con אֵת, el Participio funciona como verbo transitivo.",
      order: 5,
    },
  ],
};

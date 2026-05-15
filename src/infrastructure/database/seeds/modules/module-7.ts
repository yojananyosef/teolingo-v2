import { ModuleData } from "./types";

export const module7: ModuleData = {
  lessons: [
    {
      id: "lesson-18",
      title: "Lección 18: Verbos con Guturales",
      description: "Verbos I-Gutural, II-Gutural y III-He.",
      order: 18,
      moduleIndex: 7,
      xpReward: 40,
    },
    {
      id: "lesson-19",
      title: "Lección 19: Verbos I-Nun y Verbos Ayin-Waw",
      description: "Verbos débiles con primer radical Nun o raíz biliteral.",
      order: 19,
      moduleIndex: 7,
      xpReward: 40,
    },
    {
      id: "lesson-20",
      title: "Lección 20: Sufijos en Verbos",
      description: "Sufijos pronominales directos en formas verbales.",
      order: 20,
      moduleIndex: 7,
      xpReward: 50,
    },
  ],
  exercises: [
    // --- LECCIÓN 18: Verbos Guturales ---
    {
      lessonId: "lesson-18",
      type: "multiple-choice",
      question: "¿Por qué los verbos con guturales (א ה ח ע ר) son 'débiles'?",
      correctAnswer: "Porque las guturales rechazan el Daghesh Forte y prefieren vocales 'a'.",
      options: JSON.stringify([
        "Porque las guturales rechazan el Daghesh Forte y prefieren vocales 'a'.",
        "Porque las guturales no pueden comenzar una palabra.",
        "Porque pierden una de sus consonantes radicales.",
        "Porque siempre cambian el tronco del verbo."
      ]),
      hint: "Reglas guturales: 1) Rechazan el Daghesh Forte, 2) Prefieren la vocal Pathach (a), 3) Toman Hatef (vocal reducida) en lugar de Shewa simple.",
      order: 1,
    },
    {
      lessonId: "lesson-18",
      type: "multiple-choice",
      question: "En un verbo I-Gutural (primer radical gutural) en el Imperfecto Qal, ¿qué cambio vocal ocurre en el prefijo?",
      correctAnswer: "El prefijo cambia de Hireq (יִ) a Pathach (יַ) o Tsere (יֶ) por compensación.",
      options: JSON.stringify([
        "El prefijo cambia de Hireq (יִ) a Pathach (יַ) o Tsere (יֶ) por compensación.",
        "El prefijo desaparece completamente.",
        "El prefijo toma un Daghesh para compensar.",
        "El prefijo no cambia."
      ]),
      hint: "Ejemplo: I-Gutural con Alef o Ayin → el prefijo suele tomar Tsere: יֶאֱסֹר (atará). Con He y Het → Pathach: יַהֲרֹג (matará).",
      order: 2,
    },
    {
      lessonId: "lesson-18",
      type: "multiple-choice",
      question: "Los verbos III-He (tercer radical = He) son especiales. ¿Qué ocurre con la He final en el Perfecto Qal 3ms?",
      correctAnswer: "La He aparece como Qamets He (ָה) al final, que no se pronuncia.",
      options: JSON.stringify([
        "La He aparece como Qamets He (ָה) al final, que no se pronuncia.",
        "La He se convierte en Yod.",
        "La He desaparece completamente.",
        "La He se convierte en Alef."
      ]),
      hint: "גָּלָה (revelar), בָּנָה (construir) — la ָה final de verbos III-He es una Máter Lectionis que indica la vocal larga.",
      order: 3,
    },
    {
      lessonId: "lesson-18",
      type: "multiple-choice",
      question: "En los verbos III-He, ¿qué ocurre cuando se añaden sufijos de perfecto (como -tī, -tā)?",
      correctAnswer: "La He radical desaparece y aparece una Yod en su lugar.",
      options: JSON.stringify([
        "La He radical desaparece y aparece una Yod en su lugar.",
        "La He se mantiene y el sufijo se añade directamente.",
        "La He absorbe el sufijo.",
        "El sufijo cambia su vocal."
      ]),
      hint: "גָּלִיתִי = 'yo revelé' (de גָּלָה). La He desaparece y la raíz se ve como גל + יתי.",
      order: 4,
    },

    // --- LECCIÓN 19: Verbos I-Nun y Verbos Ayin-Waw ---
    {
      lessonId: "lesson-19",
      type: "multiple-choice",
      question: "¿Qué característica especial tienen los verbos I-Nun en el Imperfecto y el Imperativo?",
      correctAnswer: "La Nun del primer radical se asimila a la siguiente consonante, creando un Daghesh Forte.",
      options: JSON.stringify([
        "La Nun del primer radical se asimila a la siguiente consonante, creando un Daghesh Forte.",
        "La Nun se convierte en Alef.",
        "La Nun siempre se mantiene.",
        "La Nun produce un alargamiento compensatorio de la vocal."
      ]),
      hint: "Ejemplo: נָפַל (caer) → יִפֹּל (él caerá). La Nun desaparece y la Pe/Fé toma Daghesh Forte.",
      order: 1,
    },
    {
      lessonId: "lesson-19",
      type: "multiple-choice",
      question: "¿Qué son los verbos 'Ayin-Waw' (o 'verbos huecos')?",
      correctAnswer: "Verbos cuya segunda radical es Waw o Yod, que frecuentemente actúa como vocal larga en lugar de consonante.",
      options: JSON.stringify([
        "Verbos cuya segunda radical es Waw o Yod, que frecuentemente actúa como vocal larga en lugar de consonante.",
        "Verbos que siempre empiezan con Waw.",
        "Verbos que terminan en Waw.",
        "Verbos que rechazan todas las vocales."
      ]),
      hint: "Ejemplos: קוּם (levantarse), בּוֹא (venir), שִׁים (poner). En el Perfecto: קָם, בָּא, שָׁם — solo dos radicales visibles.",
      order: 2,
    },
    {
      lessonId: "lesson-19",
      type: "multiple-choice",
      question: "Analiza la forma: יָקוּם",
      correctAnswer: "Imperfecto Qal 3ms de קוּם: 'él se levantará'",
      options: JSON.stringify([
        "Imperfecto Qal 3ms de קוּם: 'él se levantará'",
        "Perfecto Qal 3ms de קוּם: 'él se levantó'",
        "Participio Qal ms de קוּם: 'el que se levanta'",
        "Imperativo Qal 2ms de קוּם: 'levántate'"
      ]),
      hint: "En verbos Ayin-Waw, el Imperfecto tiene la vocal larga del tipo de la raíz (Shureq para קום) en la posición del segundo radical.",
      order: 3,
    },

    // --- LECCIÓN 20: Sufijos en Verbos (Checkpoint) ---
    {
      lessonId: "lesson-20",
      type: "multiple-choice",
      question: "¿Qué indican los sufijos pronominales cuando se añaden a formas verbales?",
      correctAnswer: "El objeto directo del verbo: 'me guardó', 'te amó', 'los envió'.",
      options: JSON.stringify([
        "El objeto directo del verbo: 'me guardó', 'te amó', 'los envió'.",
        "El sujeto del verbo.",
        "El tiempo del verbo.",
        "La voz pasiva o activa."
      ]),
      hint: "שְׁמָרַנִי = 'él me guardó'. El sufijo -nî (נִי) es el objeto directo de primera persona singular.",
      order: 1,
    },
    {
      lessonId: "lesson-20",
      type: "multiple-choice",
      question: "¿Qué es el 'Nun Energico' (נ) que aparece a veces antes de los sufijos verbales?",
      correctAnswer: "Una Nun paragógica que enfatiza o da énfasis a la acción verbal (poético/arcaico).",
      options: JSON.stringify([
        "Una Nun paragógica que enfatiza o da énfasis a la acción verbal (poético/arcaico).",
        "La señal del objeto directo אֵת en forma prefija.",
        "El marcador del plural.",
        "Una consonante radical omitida."
      ]),
      hint: "Es más frecuente en poesía. El Nun Energico (también llamado 'nun paragogicum') se asimila frecuentemente: יִשְׁמְרֶנּוּ = 'él lo guardará'.",
      order: 2,
    },
    {
      lessonId: "lesson-20",
      type: "multiple-choice",
      question: "Traduce: אֲהֵבְךָ (de la raíz אהב = amar)",
      correctAnswer: "Te amé (yo te amé)",
      options: JSON.stringify([
        "Te amé (yo te amé)",
        "Él te ama",
        "Tú me amaste",
        "Él me amará"
      ]),
      hint: "אֲהֵב = Perfecto Qal 1cs sin sufijo sería אָהַבְתִּי. Con sufijo -kā = אֲהֵבְךָ = 'yo te amé (a ti, ms)'.",
      order: 3,
    },
    {
      lessonId: "lesson-20",
      type: "module-assessment",
      question: "Desafío Final: Analiza שְׁמָרַנִי יְהוָה (de Salmos)",
      correctAnswer: "Perfecto Qal 3ms de שׁמר + sufijo 1cs: 'YHWH me guardó'",
      options: JSON.stringify([
        "Perfecto Qal 3ms de שׁמר + sufijo 1cs: 'YHWH me guardó'",
        "Imperfecto Qal 3ms + sufijo 2ms: 'YHWH te guardará'",
        "Participio Qal + sufijo 1cp: 'YHWH nos está guardando'",
        "Imperativo Qal 2ms + sufijo 1cs: '¡YHWH, guárdame!'"
      ]),
      hint: "שְׁמָרַנִי: La vocal del primer radical (Shewa) y la forma sin sufijo serían שָׁמַר (3ms Perfecto). El sufijo -nî (נִי) = me/nos (objeto 1cs).",
      order: 4,
    },
  ],
};

import { ModuleData } from "./types";

export const module4: ModuleData = {
  lessons: [
    {
      id: "lesson-10",
      title: "Lección 10: La Cadena Constructa",
      description: "Estado absoluto y constructo, relación genitiva.",
      order: 10,
      moduleIndex: 4,
      xpReward: 30,
    },
    {
      id: "lesson-11",
      title: "Lección 11: Números Hebreos",
      description: "Números cardinales y ordinales hebreos.",
      order: 11,
      moduleIndex: 4,
      xpReward: 50,
    },
  ],
  exercises: [
    // --- LECCIÓN 10: Cadena Constructa ---
    {
      lessonId: "lesson-10",
      type: "multiple-choice",
      question: "¿Qué indica la 'Cadena Constructa' (סְמִיכוּת) en hebreo?",
      correctAnswer: "Una relación de posesión o pertenencia entre dos o más sustantivos.",
      options: JSON.stringify([
        "Una relación de posesión o pertenencia entre dos o más sustantivos.",
        "El plural de un sustantivo.",
        "Un adjetivo que califica a un sustantivo.",
        "Una preposición inseparable."
      ]),
      hint: "En castellano se traduce con 'de': 'palabra de Dios', 'hijo del rey'.",
      order: 1,
    },
    {
      lessonId: "lesson-10",
      type: "multiple-choice",
      question: "¿Puede el sustantivo en estado constructo (el primero de la cadena) llevar el artículo definido (הַ)?",
      correctAnswer: "No. Solo el sustantivo final (absoluto) puede llevar el artículo.",
      options: JSON.stringify([
        "No. Solo el sustantivo final (absoluto) puede llevar el artículo.",
        "Sí, siempre lleva el artículo para ser definido.",
        "Solo si el segundo sustantivo también lo lleva.",
        "Sí, pero en una forma abreviada."
      ]),
      hint: "Si el sustantivo absoluto (el final) lleva artículo, toda la cadena se vuelve definida. No se necesita artículo en el constructo.",
      order: 2,
    },
    {
      lessonId: "lesson-10",
      type: "multiple-choice",
      question: "Traduce la cadena constructa: דְּבַר יְהוָה",
      correctAnswer: "la palabra de YHWH",
      options: JSON.stringify([
        "la palabra de YHWH",
        "una palabra de YHWH",
        "YHWH es la palabra",
        "la gran palabra"
      ]),
      hint: "דָּבָר (palabra) en estado constructo → דְּבַר. Al ir seguido de יְהוָה (nombre propio = definido), toda la frase es definida.",
      order: 3,
    },
    {
      lessonId: "lesson-10",
      type: "multiple-choice",
      question: "¿Qué cambio morfológico suele ocurrir en los sustantivos masculinos plurales al pasar al estado constructo?",
      correctAnswer: "La terminación -îm (ִים) se convierte en -ê (ֵי).",
      options: JSON.stringify([
        "La terminación -îm (ִים) se convierte en -ê (ֵי).",
        "La terminación -îm (ִים) se mantiene igual.",
        "La terminación -îm (ִים) se elimina por completo.",
        "La terminación -îm (ִים) se convierte en -ôt (וֹת)."
      ]),
      hint: "Ejemplo: מְלָכִים (reyes) → מַלְכֵי (reyes de...)",
      order: 4,
    },
    {
      lessonId: "lesson-10",
      type: "multiple-choice",
      question: "Traduce: בֵּית הַמֶּלֶךְ",
      correctAnswer: "la casa del rey",
      options: JSON.stringify([
        "la casa del rey",
        "una casa del rey",
        "la casa y el rey",
        "el rey de la casa"
      ]),
      hint: "בַּיִת (casa) en estado constructo → בֵּית. הַמֶּלֶךְ = el rey (artículo + מֶלֶךְ).",
      order: 5,
    },

    // --- LECCIÓN 11: Números (Checkpoint) ---
    {
      lessonId: "lesson-11",
      type: "multiple-choice",
      question: "¿Cuál es la regla de 'género opuesto' en los números hebreos del 3 al 10?",
      correctAnswer: "El número concuerda en género contrario al sustantivo que cuenta.",
      options: JSON.stringify([
        "El número concuerda en género contrario al sustantivo que cuenta.",
        "El número siempre es masculino.",
        "El número siempre es femenino.",
        "El número concuerda exactamente con el género del sustantivo."
      ]),
      hint: "Si el sustantivo es masculino, el número tiene terminación femenina (-âh) y viceversa.",
      order: 1,
    },
    {
      lessonId: "lesson-11",
      type: "multiple-choice",
      question: "¿Cómo se dice 'tres hombres' en hebreo? (אִישׁ es masculino)",
      correctAnswer: "שְׁלֹשָׁה אֲנָשִׁים",
      options: JSON.stringify([
        "שְׁלֹשָׁה אֲנָשִׁים",
        "שָׁלֹשׁ אֲנָשִׁים",
        "שְׁלֹשָׁה אִישׁ",
        "שָׁלֹשׁ אִישׁ"
      ]),
      hint: "אִישׁ es masculino → el número '3' toma forma femenina שְׁלֹשָׁה. El sustantivo va en plural.",
      order: 2,
    },
    {
      lessonId: "lesson-11",
      type: "multiple-choice",
      question: "¿Cómo se dice 'primer' (ordinal masculino)?",
      correctAnswer: "רִאשׁוֹן",
      options: JSON.stringify(["רִאשׁוֹן", "אֶחָד", "שֵׁנִי", "אַחֲרוֹן"]),
      hint: "Del sustantivo רֹאשׁ (cabeza/primero). Los ordinales son como adjetivos y concuerdan con el sustantivo.",
      order: 3,
    },
    {
      lessonId: "lesson-11",
      type: "multiple-choice",
      question: "Traduce: בְּיוֹם הַשְּׁבִיעִי",
      correctAnswer: "en el séptimo día",
      options: JSON.stringify([
        "en el séptimo día",
        "en siete días",
        "el día es siete",
        "el primer día"
      ]),
      hint: "הַשְּׁבִיעִי = el séptimo (הַ + שְׁבִיעִי). יוֹם = día.",
      order: 4,
    },
    {
      lessonId: "lesson-11",
      type: "module-assessment",
      question: "Desafío Final: ¿Cómo se dice 'doce tribus'? (שֵׁבֶט es masculino)",
      correctAnswer: "שְׁנֵים עָשָׂר שְׁבָטִים",
      options: JSON.stringify([
        "שְׁנֵים עָשָׂר שְׁבָטִים",
        "שְׁתֵּים עֶשְׂרֵה שְׁבָטִים",
        "שְׁנֵים עֶשְׂרֵה שְׁבָטִים",
        "שְׁתֵּים עָשָׂר שְׁבָטִים"
      ]),
      hint: "Los números del 11-19 tienen dos partes. La parte 'unidades' (2 = שְׁנַיִם / שְׁתַּיִם) mantiene la regla de género opuesto del 3-10. שֵׁבֶט es masculino → parte unidades femenina (שְׁתֵּים), parte decena femenina (עֶשְׂרֵה)... ¡pero los números 11 y 12 son especiales!",
      order: 5,
    },
  ],
};

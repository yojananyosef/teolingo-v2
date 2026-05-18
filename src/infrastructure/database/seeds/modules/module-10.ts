import type { ModuleData } from "./types";

export const module10: ModuleData = {
  lessons: [
    {
      id: "lesson-27",
      title: "Lección 27: Sintaxis de la Cláusula",
      description: "Orden de palabras, énfasis y tipos de cláusulas.",
      order: 27,
      moduleIndex: 10,
      xpReward: 50,
    },
    {
      id: "lesson-28",
      title: "Lección 28: Vocabulario Frecuente Avanzado",
      description: "Las 200 palabras más frecuentes del Hebreo Bíblico.",
      order: 28,
      moduleIndex: 10,
      xpReward: 50,
    },
    {
      id: "lesson-29",
      title: "Lección 29: Lectura de Textos Bíblicos",
      description: "Práctica de lectura en Génesis, Salmos y Rut.",
      order: 29,
      moduleIndex: 10,
      xpReward: 100,
    },
  ],
  exercises: [
    // --- LECCIÓN 27: Sintaxis ---
    {
      lessonId: "lesson-27",
      type: "multiple-choice",
      question: "¿Cuál es el orden de palabras habitual en la narrativa hebrea (cláusula verbal)?",
      correctAnswer: "Verbo → Sujeto → Objeto (VSO)",
      options: JSON.stringify([
        "Verbo → Sujeto → Objeto (VSO)",
        "Sujeto → Verbo → Objeto (SVO) como en español",
        "Objeto → Sujeto → Verbo (OSV)",
        "El orden es completamente libre sin valor sintáctico.",
      ]),
      hint: "El Waw Consecutivo (וַיֹּאמֶר) siempre comienza la cláusula. El verbo va primero en la narrativa estándar.",
      order: 1,
    },
    {
      lessonId: "lesson-27",
      type: "multiple-choice",
      question:
        "Cuando el sujeto aparece ANTES del verbo en la narrativa (X-Qatal), ¿qué señal sintáctica da?",
      correctAnswer: "Énfasis contrastivo en el sujeto: '¡Y fue ESTE SUJETO quien lo hizo!'",
      options: JSON.stringify([
        "Énfasis contrastivo en el sujeto: '¡Y fue ESTE SUJETO quien lo hizo!'",
        "Es una cláusula nominal sin verbo.",
        "Indica tiempo futuro en lugar de pasado.",
        "No tiene valor sintáctico especial.",
      ]),
      hint: "El orden marcado (X-Qatal) enfatiza el elemento que aparece fuera de su posición normal. Es clave para interpretar el discurso hebreo.",
      order: 2,
    },
    {
      lessonId: "lesson-27",
      type: "multiple-choice",
      question: "¿Qué es una 'Cláusula de Circumstancia' (o Cláusula de Waw + Nominal)?",
      correctAnswer:
        "Una cláusula secundaria que describe el contexto o estado en el que ocurre la acción principal.",
      options: JSON.stringify([
        "Una cláusula secundaria que describe el contexto o estado en el que ocurre la acción principal.",
        "Una cláusula de mandato directo.",
        "Una cláusula que expresa consecuencia.",
        "Una cláusula relativa introducida por אֲשֶׁר.",
      ]),
      hint: "A menudo se traduce 'mientras...', 'siendo que...', 'cuando...'. Introduce información de fondo para la narración principal.",
      order: 3,
    },
    {
      lessonId: "lesson-27",
      type: "multiple-choice",
      question: "¿Cómo se introduce una cláusula relativa en hebreo clásico?",
      correctAnswer: "Con la partícula אֲשֶׁר (que, quien, el cual), que es indeclinable.",
      options: JSON.stringify([
        "Con la partícula אֲשֶׁר (que, quien, el cual), que es indeclinable.",
        "Con el artículo הַ únicamente.",
        "Con la partícula כִּי.",
        "Con el sufijo pronominal en el antecedente.",
      ]),
      hint: "אֲשֶׁר no cambia por género ni número. 'El hombre que...' = הָאִישׁ אֲשֶׁר... También existe שֶׁ (versión corta, común en Salmos/Cantar).",
      order: 4,
    },
    {
      lessonId: "lesson-27",
      type: "multiple-choice",
      question: "¿Cuándo se usa אֵת (el marcador de objeto directo)?",
      correctAnswer:
        "Antes de objetos directos definidos (con artículo, nombre propio o sufijo pronominal).",
      options: JSON.stringify([
        "Antes de objetos directos definidos (con artículo, nombre propio o sufijo pronominal).",
        "Antes de todos los objetos directos sin excepción.",
        "Solo antes de pronombres personales.",
        "Nunca — es solo una preposición de compañía.",
      ]),
      hint: "אֵת הַסֵּפֶר = 'el libro' (objeto definido). No se usa אֵת con objetos indefinidos: 'escribió un libro' = כָּתַב סֵפֶר.",
      order: 5,
    },

    // --- LECCIÓN 28: Vocabulario Avanzado ---
    {
      lessonId: "lesson-28",
      type: "multiple-choice",
      question: "¿Qué significa la partícula הִנֵּה?",
      correctAnswer: "¡He aquí!, Mira, ¡Atención! — llama la atención del oyente a algo.",
      options: JSON.stringify([
        "¡He aquí!, Mira, ¡Atención! — llama la atención del oyente a algo.",
        "Porque, ya que.",
        "Si, en caso de que.",
        "Entonces, por lo tanto.",
      ]),
      hint: "הִנֵּה es una de las palabras más frecuentes en narrativa. Introduce algo que el lector debe notar: ¡He aquí! Es deíctica y dramática.",
      order: 1,
    },
    {
      lessonId: "lesson-28",
      type: "multiple-choice",
      question: "¿Cuáles son los usos de la partícula כִּי?",
      correctAnswer:
        "Porque (causal), Que (complemento), Cuando (temporal), Ciertamente (afirmativo).",
      options: JSON.stringify([
        "Porque (causal), Que (complemento), Cuando (temporal), Ciertamente (afirmativo).",
        "Solo 'porque' causal.",
        "Solo 'si' condicional.",
        "Solo 'que' en discurso directo.",
      ]),
      hint: "כִּי es la partícula más ambigua del hebreo. El contexto determina su significado. 'כִּי טוֹב' = 'que era bueno' (Génesis 1).",
      order: 2,
    },
    {
      lessonId: "lesson-28",
      type: "multiple-choice",
      question: "¿Qué significa la expresión יְהִי אוֹר (Génesis 1:3)?",
      correctAnswer: "¡Sea la luz! / ¡Que haya luz! — Jusivo Qal 3ms de היה + sustantivo.",
      options: JSON.stringify([
        "¡Sea la luz! / ¡Que haya luz! — Jusivo Qal 3ms de היה + sustantivo.",
        "La luz existió.",
        "Habrá luz.",
        "La luz fue creada.",
      ]),
      hint: "יְהִי es el Jusivo de הָיָה (ser/existir). El Jusivo de 3ª persona expresa voluntad o mandato indirecto: 'que exista'.",
      order: 3,
    },
    {
      lessonId: "lesson-28",
      type: "multiple-choice",
      question: "¿Cuál es la diferencia entre גַּם y אַף?",
      correctAnswer:
        "Ambas significan 'también', 'incluso', 'además'. גַּם es la forma más común; אַף añade un matiz de acumulación o 'aun más'.",
      options: JSON.stringify([
        "Ambas significan 'también', 'incluso', 'además'. גַּם es la forma más común; אַף añade un matiz de acumulación o 'aun más'.",
        "גַּם = 'también'; אַף = 'nariz' solo.",
        "Son antónimas: גַּם = sí, אַף = no.",
        "גַּם se usa solo en poesía; אַף solo en prosa.",
      ]),
      hint: "אַף tiene doble significado: 'nariz' (sustantivo) y 'también/incluso/aun' (partícula). El contexto es crucial.",
      order: 4,
    },

    // --- LECCIÓN 29: Lectura (Gran Checkpoint Final) ---
    {
      lessonId: "lesson-29",
      type: "multiple-choice",
      question: "Lee y traduce: בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ",
      correctAnswer: "En el principio creó Dios los cielos y la tierra.",
      options: JSON.stringify([
        "En el principio creó Dios los cielos y la tierra.",
        "Dios creó el principio de los cielos y la tierra.",
        "Los cielos y la tierra fueron creados al principio.",
        "Dios estaba en el principio de los cielos.",
      ]),
      hint: "בְּרֵאשִׁית = en el principio. בָּרָא = creó (Qal Perfecto 3ms). אֱלֹהִים = Dios. אֵת = marcador de obj. directo definido.",
      order: 1,
    },
    {
      lessonId: "lesson-29",
      type: "multiple-choice",
      question: "Lee y traduce: יְהוָה רֹעִי לֹא אֶחְסָר (Salmos 23:1)",
      correctAnswer: "YHWH es mi pastor, nada me faltará.",
      options: JSON.stringify([
        "YHWH es mi pastor, nada me faltará.",
        "YHWH pastoreó a su pueblo, no faltó.",
        "Yo soy el pastor de YHWH, no faltaré.",
        "El pastor de YHWH no me falta.",
      ]),
      hint: "רֹעִי = mi pastor (Participio Qal ms + sufijo 1cs). לֹא אֶחְסָר = no me faltará (Qal Imperfecto 1cs de חסר = faltar).",
      order: 2,
    },
    {
      lessonId: "lesson-29",
      type: "multiple-choice",
      question: "Analiza la forma: וַיֹּאמֶר אֱלֹהִים (Génesis 1:3)",
      correctAnswer: "Waw Consecutivo + Imperfecto Qal 3ms de אמר: 'Y dijo Dios'",
      options: JSON.stringify([
        "Waw Consecutivo + Imperfecto Qal 3ms de אמר: 'Y dijo Dios'",
        "Conjunción + Perfecto Qal 3ms de אמר: 'Y había dicho Dios'",
        "Waw Consecutivo + Perfecto Qal 3ms: 'Y Dios dirá'",
        "Waw + Participio Qal ms: 'Y Dios está diciendo'",
      ]),
      hint: "El וַ con Daghesh Forte en la siguiente consonante = Waw Consecutivo con Imperfecto (narrativa pasada). אמר = decir.",
      order: 3,
    },
    {
      lessonId: "lesson-29",
      type: "multiple-choice",
      question: "Lee y traduce: וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל פְּנֵי הַמָּיִם (Génesis 1:2)",
      correctAnswer: "Y el Espíritu de Dios se movía/flotaba sobre la superficie de las aguas.",
      options: JSON.stringify([
        "Y el Espíritu de Dios se movía/flotaba sobre la superficie de las aguas.",
        "El viento de Dios sopló sobre las aguas.",
        "Y Dios envió su espíritu a las aguas.",
        "El espíritu de Dios estaba en las aguas.",
      ]),
      hint: "רוּחַ = espíritu/viento. מְרַחֶפֶת = Participio Piel femenino singular de רחף (flotar/cernirse). עַל פְּנֵי = sobre la superficie de.",
      order: 4,
    },
    {
      lessonId: "lesson-29",
      type: "module-assessment",
      question: "Gran Desafío Final: Analiza cada elemento de: שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד",
      correctAnswer:
        "¡Escucha, Israel! YHWH es nuestro Dios, YHWH es uno. (Deuteronomio 6:4 — el Shema)",
      options: JSON.stringify([
        "¡Escucha, Israel! YHWH es nuestro Dios, YHWH es uno. (Deuteronomio 6:4 — el Shema)",
        "Israel escuchó: YHWH, Dios nuestro, YHWH el uno.",
        "Escucha YHWH: Israel es nuestro Dios, el único.",
        "¡Israel! Escucha a YHWH nuestro Dios y a uno solo.",
      ]),
      hint: "שְׁמַע = Imperativo Qal 2ms (¡escucha!). יִשְׂרָאֵל = vocativo. אֱלֹהֵינוּ = nuestro Dios (sufijo 1cp). אֶחָד = uno (adjetivo predicativo). Sin verbo 'es' = cláusula nominal.",
      order: 5,
    },
  ],
};

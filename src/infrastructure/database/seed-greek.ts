import { db } from "./db";
import { lessons, exercises, flashcards } from "./schema";
import { eq, inArray } from "drizzle-orm";

async function run() {
  console.log("🇬🇷 Iniciando siembra experimental del currículum de Griego (Nancy Weber, Lecciones 1-13)...");

  // 1. Definir Lecciones y Módulos de Griego
  const greekLessons = [
    // MÓDULO 101: Fundamentos y Alfabeto
    {
      id: "greek-lesson-1",
      title: "Lección 1: El Alfabeto Griego",
      description: "Las 24 letras griegas, forma, pronunciación y vocales.",
      order: 1,
      moduleIndex: 101,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-2",
      title: "Lección 2: Espíritus, Acentos y Puntuación",
      description: "Signos diacríticos, espíritus áspero y suave, puntuación griega.",
      order: 2,
      moduleIndex: 101,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-3",
      title: "Lección 3: Sustantivos: Género y Caso",
      description: "Introducción a la declinación, el caso nominativo y acusativo.",
      order: 3,
      moduleIndex: 101,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-4",
      title: "Lección 4: Caso Genitivo y Demostrativos",
      description: "Relación de pertenencia o posesión, y adjetivos demostrativos básicos.",
      order: 4,
      moduleIndex: 101,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-5",
      title: "Lección 5: Caso Dativo, Enclíticas y Proclíticas",
      description: "El objeto indirecto y palabras sin acento propio.",
      order: 5,
      moduleIndex: 101,
      xpReward: 30,
      course: "greek",
    },

    // MÓDULO 102: Verbos y Pronombres Básicos
    {
      id: "greek-lesson-6",
      title: "Lección 6: El Verbo",
      description: "Conceptos básicos del verbo griego: tiempo, voz y modo.",
      order: 6,
      moduleIndex: 102,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-7",
      title: "Lección 7: Presente Activo del Indicativo",
      description: "El tiempo presente, desinencias primarias y el infinitivo presente.",
      order: 7,
      moduleIndex: 102,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-8",
      title: "Lección 8: Pronombres Personales",
      description: "Declinar los pronombres personales de primera, segunda y tercera persona.",
      order: 8,
      moduleIndex: 102,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-9",
      title: "Lección 9: Presente de εἰμί",
      description: "El verbo de existencia (ser/estar) en tiempo presente e infinitivo.",
      order: 9,
      moduleIndex: 102,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-10",
      title: "Lección 10: Lectura Básica",
      description: "Primeros pasajes de lectura e interpretación directa del Nuevo Testamento.",
      order: 10,
      moduleIndex: 102,
      xpReward: 30,
      course: "greek",
    },

    // MÓDULO 103: Deponentes, Adjetivos y Verbos Contractos
    {
      id: "greek-lesson-11",
      title: "Lección 11: Verbos Deponentes y Relativos",
      description: "Verbos con forma media/pasiva pero significado activo, y pronombres relativos.",
      order: 11,
      moduleIndex: 103,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-12",
      title: "Lección 12: Tiempo Imperfecto y Adjetivos",
      description: "El imperfecto indicativo activo e introducción a los adjetivos calificativos.",
      order: 12,
      moduleIndex: 103,
      xpReward: 30,
      course: "greek",
    },
    {
      id: "greek-lesson-13",
      title: "Lección 13: Verbos Contractos",
      description: "Contracción de vocales (a, e, o) en verbos con desinencias en -aw, -ew, -ow.",
      order: 13,
      moduleIndex: 103,
      xpReward: 30,
      course: "greek",
    },
  ];

  // Inserción de lecciones
  console.log("📘 Insertando lecciones de Griego (1-13)...");
  for (const lesson of greekLessons) {
    await db
      .insert(lessons)
      .values(lesson)
      .onConflictDoUpdate({
        target: lessons.id,
        set: {
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          moduleIndex: lesson.moduleIndex,
          xpReward: lesson.xpReward,
          course: lesson.course,
        },
      });
  }

  // 2. Vocabularios estructurados por lección para generar Flashcards y Ejercicios
  const vocabDataByLesson: Record<number, Array<{ g: string; s: string; t: string }>> = {
    1: [
      { g: "ἄγγελος", s: "el ángel (mensajero)", t: "ággelos" },
      { g: "ἀμήν", s: "amén (así sea)", t: "amḗn" },
      { g: "ἄνθρωπος", s: "el hombre (antropología)", t: "ánthrōpos" },
      { g: "ἀπόστολος", s: "el apóstol (enviado)", t: "apóstolos" },
      { g: "διάβολος", s: "el diablo (calumniador)", t: "diábolos" },
      { g: "ἥλιος", s: "el sol (helio)", t: "hḗlios" },
      { g: "θεός", s: "dios (teología)", t: "theós" },
      { g: "πνεῦμα", s: "el espíritu o viento (neumático)", t: "pneûma" },
      { g: "πόλις", s: "la ciudad (metrópolis)", t: "pólis" },
      { g: "προφήτης", s: "el profeta (vaticinador)", t: "prophḗtēs" },
      { g: "ὑποκριτής", s: "el hipócrita (actor)", t: "hypokritḗs" },
      { g: "φωνή", s: "la voz, sonido (fonética)", t: "phōnḗ" },
      { g: "χρόνος", s: "el tiempo (cronología)", t: "chrónos" },
      { g: "ψευδοπροφήτης", s: "el falso profeta (pseudónimo)", t: "pseudoprophḗtēs" },
      { g: "ψυχή", s: "el alma (psicología)", t: "psychḗ" },
    ],
    2: [
      { g: "ὄχλος", s: "el gentío (multitud)", t: "óchlos" },
      { g: "εἰς", s: "hacia (para, en)", t: "eis" },
      { g: "ἁμαρτία", s: "el pecado", t: "hamartía" },
      { g: "ἅγιος", s: "santo", t: "hágios" },
      { g: "αἷμα", s: "la sangre", t: "haîma" },
      { g: "υἱός", s: "el hijo", t: "huiós" },
      { g: "ῥῆμα", s: "la palabra (dicho)", t: "rhēma" },
    ],
    3: [
      { g: "καρπός", s: "la fruta (fruto)", t: "karpós" },
      { g: "κύριος", s: "el señor (Señor)", t: "kýrios" },
      { g: "ἀδελφός", s: "el hermano", t: "adelphós" },
      { g: "δοῦλος", s: "el siervo (esclavo)", t: "doûlos" },
      { g: "οἶκος", s: "la casa (hogar)", t: "oîkos" },
      { g: "καί", s: "y (también)", t: "kaí" },
      { g: "ζωή", s: "la vida", t: "zōḗ" },
      { g: "εἰρήνη", s: "la paz", t: "eirḗnē" },
      { g: "ἄρτος", s: "el pan (alimento)", t: "ártos" },
      { g: "τέκνον", s: "el niño (hijo)", t: "téknon" },
      { g: "ἔργον", s: "la obra (trabajo)", t: "érgon" },
    ],
    4: [
      { g: "Χριστός", s: "Cristo (el ungido)", t: "Christós" },
      { g: "λόγος", s: "la palabra (verbo, mensaje)", t: "lógos" },
      { g: "οὐρανός", s: "el cielo", t: "ouranós" },
      { g: "ἀγάπη", s: "el amor", t: "agápē" },
      { g: "ψυχή", s: "el alma (vida)", t: "psychḗ" },
      { g: "ἱμάτιον", s: "el manto (vestido)", t: "himátion" },
      { g: "δῶρον", s: "el regalo (don)", t: "dōron" },
      { g: "οὗτος", s: "este (pronombre)", t: "hoûtos" },
      { g: "αὕτη", s: "esta (pronombre)", t: "haútē" },
      { g: "τοῦτο", s: "esto (pronombre)", t: "toûto" },
    ],
    5: [
      { g: "ἐντολή", s: "el mandamiento", t: "entolḗ" },
      { g: "ἀρχή", s: "el principio (origen)", t: "archḗ" },
      { g: "γραφή", s: "la escritura", t: "graphḗ" },
      { g: "κόσμος", s: "el mundo", t: "kósmos" },
      { g: "χρόνος", s: "el tiempo (época)", t: "chrónos" },
      { g: "νόμος", s: "la ley", t: "nómos" },
      { g: "πλοῖον", s: "el barco (barca)", t: "ploîon" },
      { g: "ἱερόν", s: "el templo", t: "hierón" },
      { g: "ἐκεῖνος", s: "aquel", t: "ekeînos" },
      { g: "ἐκείνη", s: "aquella", t: "ekeínē" },
      { g: "ἐκεῖνο", s: "aquello", t: "ekeîno" },
    ],
    6: [
      { g: "πιστεύω", s: "creo (tengo fe)", t: "pisteúō" },
      { g: "λύω", s: "desato (destruyo)", t: "lýō" },
      { g: "σῴζω", s: "salvo (libero)", t: "sṓizō" },
      { g: "γράφω", s: "escribo", t: "gráphō" },
      { g: "ἀκούω", s: "escucho (oigo)", t: "akoúō" },
      { g: "βαπτίζω", s: "bautizo", t: "baptízō" },
      { g: "ἔχω", s: "tengo (poseo)", t: "échō" },
      { g: "διδάσκω", s: "enseño", t: "didáskō" },
      { g: "λαμβάνω", s: "recibo (tomo)", t: "lambánō" },
      { g: "δοξάζω", s: "glorifico (alabo)", t: "doxázō" },
    ],
    7: [
      { g: "βλέπω", s: "veo (miro)", t: "blépō" },
      { g: "πέμπω", s: "envío", t: "pémpō" },
      { g: "θέλω", s: "quiero (deseo)", t: "thélō" },
      { g: "εὑρίσκω", s: "encuentro", t: "heurískō" },
      { g: "λέγω", s: "digo (hablo)", t: "légō" },
      { g: "μένω", s: "permanezco (quedo)", t: "ménō" },
      { g: "δόξα", s: "la gloria", t: "dóxa" },
      { g: "οὐ", s: "no", t: "ou" },
    ],
    8: [
      { g: "γινώσκω", s: "conozco (sé)", t: "ginṓskō" },
      { g: "ἄγω", s: "guío (conduzco)", t: "ágō" },
      { g: "παραβολή", s: "la parábola", t: "parabolḗ" },
      { g: "σάρξ", s: "la carne", t: "sárx" },
      { g: "οὐδείς", s: "nadie", t: "oudeís" },
      { g: "ἐγώ", s: "yo (pronombre)", t: "egṓ" },
      { g: "σύ", s: "tú (pronombre)", t: "sý" },
      { g: "αὐτός", s: "él (mismo)", t: "autós" },
    ],
    9: [
      { g: "δέ", s: "pero (y, mas)", t: "dé" },
      { g: "ἀποστέλλω", s: "envío (como delegado)", t: "apostéllō" },
      { g: "ἐκβάλλω", s: "echo fuera (expulso)", t: "ekbállō" },
      { g: "λαός", s: "el pueblo (nación)", t: "laós" },
      { g: "πρός", s: "a (hacia - con persona)", t: "prós" },
      { g: "ἐκ", s: "procedente de (de)", t: "ek" },
      { g: "εἰμί", s: "soy (estoy)", t: "eimí" },
    ],
    10: [
      { g: "Πέτρος", s: "Pedro", t: "Pétros" },
      { g: "Ἀνδρέας", s: "Andrés", t: "Andréas" },
      { g: "γυνή", s: "la mujer (esposa)", t: "gynḗ" },
      { g: "εὐαγγέλιον", s: "el evangelio (buenas nuevas)", t: "euaggélion" },
      { g: "γῆ", s: "la tierra", t: "gê" },
      { g: "σκοτία", s: "las tinieblas", t: "skotía" },
      { g: "ἀλήθεια", s: "la verdad", t: "alheader" },
    ],
    11: [
      { g: "ἔρχομαι", s: "voy (vengo)", t: "érchomai" },
      { g: "γίνομαι", s: "llego a ser (soy, nazco)", t: "gínomai" },
      { g: "δέχομαι", s: "recibo (acepto)", t: "déchomai" },
      { g: "ἀποκρίνομαι", s: "contesto (respondo)", t: "apokrínomai" },
      { g: "δύναμαι", s: "puedo", t: "dýnamai" },
      { g: "βούλομαι", s: "quiero (deseo)", t: "boúlomai" },
      { g: "πορεύομαι", s: "ando (viajo, marcho)", t: "poreúomai" },
      { g: "ἀσπάζομαι", s: "saludo", t: "aspázomai" },
      { g: "διά", s: "por medio de (a través de)", t: "diá" },
    ],
    12: [
      { g: "καλός", s: "bueno (hermoso)", t: "kalós" },
      { g: "ἀγαθός", s: "bondadoso (bueno)", t: "agathós" },
      { g: "κακός", s: "malo", t: "kakós" },
      { g: "πιστός", s: "fiel", t: "pistós" },
      { g: "νεκρός", s: "muerto", t: "nekrós" },
      { g: "μικρός", s: "pequeño", t: "mikrós" },
      { g: "νέος", s: "nuevo (joven)", t: "néos" },
      { g: "παλαιός", s: "viejo (antiguo)", t: "palaiós" },
      { g: "δίκαιος", s: "justo", t: "díkaios" },
    ],
    13: [
      { g: "μισέω", s: "odio", t: "miséō" },
      { g: "ποιέω", s: "hago (realizo)", t: "poiéō" },
      { g: "αἰτέω", s: "pido", t: "aitéō" },
      { g: "ζητέω", s: "busco", t: "zētéō" },
      { g: "λαλέω", s: "hablo", t: "laléō" },
      { g: "τηρέω", s: "guardo (cumplo)", t: "tēréō" },
      { g: "ἀγαπάω", s: "amo", t: "agapáō" },
      { g: "μαρτυρέω", s: "doy testimonio", t: "martyréō" },
      { g: "θεωρέω", s: "observo (miro)", t: "theōréō" },
      { g: "ἐρωτάω", s: "pregunto (pido)", t: "erōtáō" },
      { g: "φανερόω", s: "manifiesto (revelo)", t: "phaneróō" },
      { g: "σύν", s: "con (preposición)", t: "sýn" },
      { g: "εἰ", s: "si", t: "ei" },
      { g: "δικαιοσύνη", s: "la justicia", t: "dikaiosýnē" },
      { g: "καθώς", s: "como (así como)", t: "kathṓs" },
      { g: "πονηρός", s: "malvado (malo, perverso)", t: "ponērós" },
      { g: "ὅτι", s: "porque (que)", t: "hóti" },
    ],
  };

  // 3. Sembrar todas las Flashcards en la base de datos (Nivel 1 al 13)
  console.log("🎴 Sembrando Flashcards SRS del Griego para los Niveles 1 al 13...");
  await db.delete(flashcards).where(eq(flashcards.course, "greek"));

  const allFlashcardsToInsert = [];
  let cardCounter = 1;

  for (let lessonIndex = 1; lessonIndex <= 13; lessonIndex++) {
    const list = vocabDataByLesson[lessonIndex];
    if (!list) continue;

    const cardsForLesson = list.map((item, idx) => ({
      id: `fc-greek-leccion-${lessonIndex}-${idx + 1}`,
      type: "vocabulary",
      category: `greek-leccion-${lessonIndex}`,
      frontContent: JSON.stringify({ text: item.g }),
      backContent: JSON.stringify({
        meaning: item.s,
        translit: item.t,
      }),
      order: cardCounter++,
      course: "greek",
    }));

    allFlashcardsToInsert.push(...cardsForLesson);
  }

  for (const card of allFlashcardsToInsert) {
    await db.insert(flashcards).values(card);
  }
  console.log(`✅ ${allFlashcardsToInsert.length} Flashcards sembradas satisfactoriamente.`);

  // 4. Limpiar ejercicios anteriores del curso de Griego
  console.log("📝 Limpiando y regenerando ejercicios de Griego...");
  const greekLessonIds = greekLessons.map((l) => l.id);
  await db.delete(exercises).where(inArray(exercises.lessonId, greekLessonIds));

  // A. Sembrar Ejercicios Especiales de Lección 1 (Alfabeto + Vocabulario)
  const alphabetLetters = [
    { char: "α", name: "Alfa", options: ["α", "β", "γ", "δ"] },
    { char: "β", name: "Beta", options: ["β", "α", "θ", "π"] },
    { char: "γ", name: "Gamma", options: ["γ", "λ", "χ", "κ"] },
    { char: "δ", name: "Delta", options: ["δ", "θ", "σ", "ο"] },
    { char: "ε", name: "Épsilon", options: ["ε", "η", "ω", "υ"] },
    { char: "ζ", name: "Zeta", options: ["ζ", "ξ", "ψ", "β"] },
    { char: "η", name: "Eta", options: ["η", "ε", "ι", "υ"] },
    { char: "θ", name: "Theta", options: ["θ", "δ", "φ", "τ"] },
    { char: "ι", name: "Iota", options: ["ι", "υ", "γ", "κ"] },
    { char: "κ", name: "Kappa", options: ["κ", "χ", "λ", "μ"] },
    { char: "λ", name: "Lamda", options: ["λ", "α", "δ", "μ"] },
    { char: "μ", name: "Mu", options: ["μ", "ν", "π", "η"] },
  ];

  const l1Exercises = alphabetLetters.map((item, index) => ({
    id: `greek-lesson-1-ex-${index + 1}`,
    lessonId: "greek-lesson-1",
    type: "multiple-choice",
    question: `Selecciona la letra griega minúscula: ${item.name}`,
    correctAnswer: item.char,
    options: JSON.stringify(item.options),
    order: index + 1,
  }));

  const l1Vocab = vocabDataByLesson[1].slice(0, 10);
  const l1VocabExercises = l1Vocab.map((item, index) => {
    // Generar distractores dinámicos
    const others = vocabDataByLesson[1].filter((v) => v.s !== item.s).map((v) => v.s);
    const options = [item.s, others[0], others[1], others[2]];
    return {
      id: `greek-lesson-1-ex-vocab-${index + 1}`,
      lessonId: "greek-lesson-1",
      type: "translation",
      question: `¿Qué significa la palabra griega '${item.g}'?`,
      correctAnswer: item.s,
      options: JSON.stringify(options),
      hebrewText: item.g,
      order: l1Exercises.length + index + 1,
    };
  });

  for (const ex of [...l1Exercises, ...l1VocabExercises]) {
    await db.insert(exercises).values(ex);
  }
  console.log("✅ Ejercicios de Lección 1 (Alfabeto + 10 Vocab) sembrados.");

  // B. Sembrar Ejercicios dinámicos de Traducción para Lecciones 2 a 13
  // Cada lección tendrá 5 preguntas basadas en su vocabulario exclusivo,
  // permitiendo que sean completamente interactivas en el Roadmap de Teolingo.
  for (let lessonIndex = 2; lessonIndex <= 13; lessonIndex++) {
    const list = vocabDataByLesson[lessonIndex];
    if (!list) continue;

    const lessonId = `greek-lesson-${lessonIndex}`;
    const exercisesToInsert = list.slice(0, 6).map((item, index) => {
      // Tomar distractores del vocabulario de la misma lección o lección 1
      const siblings = list.filter((v) => v.s !== item.s).map((v) => v.s);
      const level1Siblings = vocabDataByLesson[1].map((v) => v.s);
      const options = [
        item.s,
        siblings[0] || level1Siblings[0],
        siblings[1] || level1Siblings[1],
        siblings[2] || level1Siblings[2],
      ];

      return {
        id: `greek-lesson-${lessonIndex}-ex-${index + 1}`,
        lessonId: lessonId,
        type: "translation",
        question: `¿Qué significa la palabra griega '${item.g}'?`,
        correctAnswer: item.s,
        options: JSON.stringify(options),
        hebrewText: item.g, // se almacena aquí para reutilizar el componente de renderizado tipográfico
        order: index + 1,
      };
    });

    for (const ex of exercisesToInsert) {
      await db.insert(exercises).values(ex);
    }
  }

  console.log("✅ Ejercicios interactivos de traducción para Lecciones 2 a 13 sembrados.");
  console.log("🎉 Siembra experimental de Griego (Nancy Weber, Lecciones 1-13) completada con éxito!");
}

run().catch(console.error);

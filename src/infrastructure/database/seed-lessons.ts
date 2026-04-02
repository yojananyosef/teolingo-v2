import type { InferInsertModel } from "drizzle-orm";
import { db } from "./db";
import { exercises, lessons } from "./schema";

type LessonInsert = InferInsertModel<typeof lessons>;
type ExerciseInsert = InferInsertModel<typeof exercises>;

const sectionLessons: LessonInsert[] = [
  {
    id: "section-1-alphabet-opt",
    title: "Subsección informativa: Alfabeto",
    description:
      "Section 1: The Basics of Hebrew Writing. Panorama del alfabeto hebreo (informativa, no evaluada).",
    order: 1,
    xpReward: 0,
  },
  {
    id: "section-1-vowels-opt",
    title: "Subsección informativa: Vocales",
    description:
      "Section 1: The Basics of Hebrew Writing. Tipos de vocales y función de los signos vocálicos (informativa, no evaluada).",
    order: 2,
    xpReward: 0,
  },
  {
    id: "section-1-syllabification-opt",
    title: "Subsección informativa: Silabificación",
    description:
      "Section 1: The Basics of Hebrew Writing. Cómo se forman sílabas hebreas de forma gradual (informativa, no evaluada).",
    order: 3,
    xpReward: 0,
  },
  {
    id: "lesson-1-1",
    title: "Lección 1: Alef-Bet esencial",
    description:
      "Section 1: The Basics of Hebrew Writing. Reconocimiento base de consonantes para iniciar la lectura.",
    order: 4,
    xpReward: 30,
  },
  {
    id: "freq-2200-5000",
    title: "Frecuencia Bíblica Nivel 1",
    description: "Vocabulario más frecuente (2200-5000 apariciones).",
    order: 900,
    xpReward: 0,
  },
  {
    id: "freq-1000-2199",
    title: "Frecuencia Bíblica Nivel 2",
    description: "Vocabulario frecuente intermedio (1000-2199 apariciones).",
    order: 901,
    xpReward: 0,
  },
];

const sectionExercises: ExerciseInsert[] = [
  {
    id: "section-1-alphabet-opt-ex-1",
    lessonId: "section-1-alphabet-opt",
    type: "multiple-choice",
    question: "¿Qué objetivo tiene esta subsección del alfabeto?",
    correctAnswer: "Reconocer letras y su función básica",
    options: JSON.stringify([
      "Reconocer letras y su función básica",
      "Conjugar verbos en todos los tiempos",
      "Traducir poesía completa",
      "Memorizar todo el léxico del Tanaj",
    ]),
    order: 1,
  },
  {
    id: "section-1-vowels-opt-ex-1",
    lessonId: "section-1-vowels-opt",
    type: "multiple-choice",
    question: "¿Qué estudias aquí sobre vocales?",
    correctAnswer: "Cómo orientan la pronunciación",
    options: JSON.stringify([
      "Cómo orientan la pronunciación",
      "Solo raíces trilíteras avanzadas",
      "Solo sintaxis de cláusulas nominales",
      "Solo crítica textual",
    ]),
    order: 1,
  },
  {
    id: "section-1-syllabification-opt-ex-1",
    lessonId: "section-1-syllabification-opt",
    type: "multiple-choice",
    question: "La silabificación te ayuda principalmente a...",
    correctAnswer: "Leer con ritmo y claridad",
    options: JSON.stringify([
      "Leer con ritmo y claridad",
      "Evitar toda vocalización",
      "Eliminar preposiciones",
      "Sustituir la traducción",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-1-ex-1",
    lessonId: "lesson-1-1",
    type: "multiple-choice",
    question: "Selecciona la letra Alef",
    correctAnswer: "א",
    options: JSON.stringify(["א", "ה", "ע", "ח"]),
    order: 1,
  },
  {
    id: "lesson-1-1-ex-2",
    lessonId: "lesson-1-1",
    type: "multiple-choice",
    question: "Selecciona la letra Bet",
    correctAnswer: "ב",
    options: JSON.stringify(["ב", "כ", "מ", "נ"]),
    order: 2,
  },
  {
    id: "lesson-1-1-ex-3",
    lessonId: "lesson-1-1",
    type: "multiple-choice",
    question: "Selecciona la letra Guimel",
    correctAnswer: "ג",
    options: JSON.stringify(["ג", "ד", "ר", "ז"]),
    order: 3,
  },
  {
    id: "lesson-1-1-ex-4",
    lessonId: "lesson-1-1",
    type: "multiple-choice",
    question: "¿Qué letra suele ser silenciosa y porta vocal?",
    correctAnswer: "א",
    options: JSON.stringify(["א", "ת", "ל", "ס"]),
    order: 4,
  },
  {
    id: "lesson-1-1-ex-5",
    lessonId: "lesson-1-1",
    type: "multiple-choice",
    question: "Elige la letra que corresponde a la transliteración 'd'",
    correctAnswer: "ד",
    options: JSON.stringify(["ד", "ג", "ר", "ן"]),
    order: 5,
  },
  {
    id: "lesson-1-1-ex-6",
    lessonId: "lesson-1-1",
    type: "multiple-choice",
    question: "¿Cuál de estas es una consonante del Alef-Bet?",
    correctAnswer: "ל",
    options: JSON.stringify(["ל", "á", "é", "ó"]),
    order: 6,
  },
  {
    id: "freq1-1",
    lessonId: "freq-2200-5000",
    type: "translation",
    question: "¿Qué significa 'אֵת'?",
    correctAnswer: "marcador del objeto directo",
    options: JSON.stringify([
      "marcador del objeto directo",
      "rey",
      "casa",
      "pueblo",
    ]),
    hebrewText: "אֵת",
    order: 1,
  },
  {
    id: "freq1-2",
    lessonId: "freq-2200-5000",
    type: "translation",
    question: "¿Qué significa 'וְ'?",
    correctAnswer: "y",
    options: JSON.stringify(["y", "pero", "porque", "sobre"]),
    hebrewText: "וְ",
    order: 2,
  },
  {
    id: "freq1-3",
    lessonId: "freq-2200-5000",
    type: "translation",
    question: "¿Qué significa 'בְּ'?",
    correctAnswer: "en",
    options: JSON.stringify(["en", "con", "desde", "sin"]),
    hebrewText: "בְּ",
    order: 3,
  },
  {
    id: "freq1-4",
    lessonId: "freq-2200-5000",
    type: "translation",
    question: "¿Qué significa 'לֹא'?",
    correctAnswer: "no",
    options: JSON.stringify(["no", "sí", "ya", "todavía"]),
    hebrewText: "לֹא",
    order: 4,
  },
  {
    id: "freq1-5",
    lessonId: "freq-2200-5000",
    type: "translation",
    question: "¿Qué significa 'עַל'?",
    correctAnswer: "sobre",
    options: JSON.stringify(["sobre", "debajo", "entre", "cerca"]),
    hebrewText: "עַל",
    order: 5,
  },
  {
    id: "freq2-1",
    lessonId: "freq-1000-2199",
    type: "translation",
    question: "¿Qué significa 'מֶלֶךְ'?",
    correctAnswer: "rey",
    options: JSON.stringify(["rey", "siervo", "profeta", "sacerdote"]),
    hebrewText: "מֶלֶךְ",
    order: 1,
  },
  {
    id: "freq2-2",
    lessonId: "freq-1000-2199",
    type: "translation",
    question: "¿Qué significa 'אִשָּׁה'?",
    correctAnswer: "mujer",
    options: JSON.stringify(["mujer", "hija", "ciudad", "ley"]),
    hebrewText: "אִשָּׁה",
    order: 2,
  },
  {
    id: "freq2-3",
    lessonId: "freq-1000-2199",
    type: "translation",
    question: "¿Qué significa 'שָׁמַע'?",
    correctAnswer: "escuchar",
    options: JSON.stringify(["escuchar", "ver", "escribir", "guardar"]),
    hebrewText: "שָׁמַע",
    order: 3,
  },
  {
    id: "freq2-4",
    lessonId: "freq-1000-2199",
    type: "translation",
    question: "¿Qué significa 'דָּבָר'?",
    correctAnswer: "palabra / asunto",
    options: JSON.stringify([
      "palabra / asunto",
      "camino",
      "luz",
      "agua",
    ]),
    hebrewText: "דָּבָר",
    order: 4,
  },
  {
    id: "freq2-5",
    lessonId: "freq-1000-2199",
    type: "translation",
    question: "¿Qué significa 'יָד'?",
    correctAnswer: "mano",
    options: JSON.stringify(["mano", "pie", "ojo", "voz"]),
    hebrewText: "יָד",
    order: 5,
  },
];

export async function seedLessonsAndExercises(database: typeof db) {
  console.log("📘 Reiniciando plan de lecciones (módulo dedicado)...");

  await database.delete(exercises);
  await database.delete(lessons);

  await database.insert(lessons).values(sectionLessons);
  await database.insert(exercises).values(sectionExercises);

  console.log(
    `✅ Lecciones sembradas desde módulo dedicado: ${sectionLessons.length} lecciones, ${sectionExercises.length} ejercicios`
  );
}

const fs = require('fs');

const path = 'src/infrastructure/database/seed-lessons.ts';
let content = fs.readFileSync(path, 'utf8');

const startMarker = 'const sectionExercises: ExerciseInsert[] = [';
const endMarker = '  ...freqLevel1Exercises,';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, startIdx + startMarker.length);
    const after = content.substring(endIdx);
    
    const newExercises = `
  // MÓDULO 1: Fundamentos
  {
    id: "ex-1-1",
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: "¿Cuántas consonantes tiene el alfabeto hebreo estándar?",
    correctAnswer: "22 consonantes",
    options: JSON.stringify(["22 consonantes", "24 consonantes", "20 consonantes", "27 consonantes"]),
    order: 1,
  },
  {
    id: "ex-1-2",
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: "¿En qué dirección se lee y escribe el hebreo?",
    correctAnswer: "De derecha a izquierda",
    options: JSON.stringify(["De derecha a izquierda", "De izquierda a derecha", "De arriba hacia abajo", "No tiene dirección fija"]),
    order: 2,
  },
  {
    id: "ex-2-1",
    lessonId: "lesson-2",
    type: "multiple-choice",
    question: "¿Qué sistema se usa en hebreo para escribir las vocales?",
    correctAnswer: "Niqqud (puntos y trazos)",
    options: JSON.stringify(["Niqqud (puntos y trazos)", "Letras mayúsculas", "Acentos", "No se usan vocales en absoluto"]),
    order: 1,
  },
  {
    id: "ex-3-1",
    lessonId: "lesson-3",
    type: "multiple-choice",
    question: "¿Qué es un Daghesh Forte?",
    correctAnswer: "Un punto que duplica una consonante",
    options: JSON.stringify(["Un punto que duplica una consonante", "Una vocal larga", "Una consonante muda", "Un acento musical"]),
    order: 1,
  },
  
  // MÓDULO 2: Sustantivos y Partículas
  {
    id: "ex-4-1",
    lessonId: "lesson-4",
    type: "multiple-choice",
    question: "Los sustantivos en hebreo tienen...",
    correctAnswer: "Género y número",
    options: JSON.stringify(["Género y número", "Solo género", "Solo número", "Ninguno de los dos"]),
    order: 1,
  },
  {
    id: "ex-5-1",
    lessonId: "lesson-5",
    type: "multiple-choice",
    question: "¿Cómo se forma el artículo definido normalmente?",
    correctAnswer: "Con la letra He (ה) + vocal Pataj + Daghesh Forte",
    options: JSON.stringify(["Con la letra He (ה) + vocal Pataj + Daghesh Forte", "Añadiendo Waw (ו)", "Añadiendo Yod (י)", "El hebreo no tiene artículo definido"]),
    order: 1,
  },
  {
    id: "ex-6-1",
    lessonId: "lesson-6",
    type: "multiple-choice",
    question: "¿Qué son las preposiciones inseparables?",
    correctAnswer: "Preposiciones que se unen como prefijo a la palabra",
    options: JSON.stringify(["Preposiciones que se unen como prefijo a la palabra", "Preposiciones que siempre van solas", "Preposiciones que se sufijan", "Preposiciones largas"]),
    order: 1,
  },

  // MÓDULO 3: Calificadores y Pronombres
  {
    id: "ex-7-1",
    lessonId: "lesson-7",
    type: "multiple-choice",
    question: "Un adjetivo en uso atributivo...",
    correctAnswer: "Sigue al sustantivo y concuerda en género, número y artículo",
    options: JSON.stringify(["Sigue al sustantivo y concuerda en género, número y artículo", "Precede al sustantivo", "No concuerda con el sustantivo", "Nunca lleva artículo"]),
    order: 1,
  },
  {
    id: "ex-8-1",
    lessonId: "lesson-8",
    type: "multiple-choice",
    question: "¿Qué significa 'Añí' (אֲנִי)?",
    correctAnswer: "Yo",
    options: JSON.stringify(["Yo", "Tú", "Él", "Nosotros"]),
    order: 1,
  },
  {
    id: "ex-9-1",
    lessonId: "lesson-9",
    type: "multiple-choice",
    question: "Los sufijos pronominales en un sustantivo indican...",
    correctAnswer: "Posesión (mi, tu, su)",
    options: JSON.stringify(["Posesión (mi, tu, su)", "El sujeto del verbo", "El objeto directo", "Tiempo futuro"]),
    order: 1,
  },

  // MÓDULO 4: Relaciones de Propiedad
  {
    id: "ex-10-1",
    lessonId: "lesson-10",
    type: "multiple-choice",
    question: "En una cadena constructa, la palabra en estado absoluto está...",
    correctAnswer: "Al final de la cadena",
    options: JSON.stringify(["Al final de la cadena", "Al principio", "En el medio", "No hay estado absoluto"]),
    order: 1,
  },
  {
    id: "ex-11-1",
    lessonId: "lesson-11",
    type: "multiple-choice",
    question: "¿Qué significa 'Ejad' (אֶחָד)?",
    correctAnswer: "Uno",
    options: JSON.stringify(["Uno", "Dos", "Tres", "Diez"]),
    order: 1,
  },
\n`;

    fs.writeFileSync(path, before + newExercises + after);
    console.log("Exercises updated successfully!");
} else {
    console.log("Markers not found");
}

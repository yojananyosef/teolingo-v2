import { ModuleData } from "./types";

export const module1: ModuleData = {
  lessons: [
    {
      id: "lesson-1",
      title: "Lección 1: El Alfabeto Hebreo",
      description: "Consonantes, guturales y formas finales.",
      order: 1,
      moduleIndex: 1,
      xpReward: 30,
    },
    {
      id: "lesson-2",
      title: "Lección 2: Las Vocales Hebreas",
      description: "Vocales largas, cortas y reducidas.",
      order: 2,
      moduleIndex: 1,
      xpReward: 30,
    },
    {
      id: "lesson-3",
      title: "Lección 3: Silabificación y Pronunciación",
      description: "Shewa, Daghesh y formación de sílabas.",
      order: 3,
      moduleIndex: 1,
      xpReward: 50, // Checkpoint
    },
  ],
  exercises: [
    // --- LECCIÓN 1: Alfabeto ---
    {
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "¿Cuál es el nombre de la primera letra del alfabeto hebreo?",
      correctAnswer: "Alef",
      options: JSON.stringify(["Alef", "Bet", "Guimel", "Dalet"]),
      hint: "Esta letra es silenciosa y a menudo toma el sonido de la vocal que la acompaña.",
      order: 1,
    },
    {
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "¿Qué consonante representa el sonido 'B' y tiene una forma suave 'V' sin el punto central?",
      correctAnswer: "Bet",
      options: JSON.stringify(["Bet", "Pe", "Kaf", "Tav"]),
      hint: "Es la primera letra de la Torá en la palabra 'Bereshit'.",
      order: 2,
    },
    {
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "Identifica la letra: א",
      correctAnswer: "Alef",
      options: JSON.stringify(["Alef", "Ayin", "Tsade", "Tet"]),
      hint: "Es la letra silenciosa número 1 del alefato.",
      order: 3,
    },
    {
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "¿Cuáles de las siguientes letras son guturales?",
      correctAnswer: "Alef, He, Het, Ayin",
      options: JSON.stringify(["Alef, He, Het, Ayin", "Bet, Guimel, Dalet", "Mem, Nun, Lamed", "Shin, Sin, Tsade"]),
      hint: "Las guturales se pronuncian en la garganta y tienen reglas especiales (rechazan el Daghesh Fuerte).",
      order: 4,
    },
    {
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "¿Qué letra tiene una forma final (sofit) que se escribe ם?",
      correctAnswer: "Mem",
      options: JSON.stringify(["Mem", "Nun", "Tsade", "Pe"]),
      hint: "Su forma normal es מ y significa 'agua' (Mayim).",
      order: 5,
    },

    // --- LECCIÓN 2: Vocales ---
    {
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "Identifica la vocal Qamets (larga):",
      correctAnswer: "בָ",
      options: JSON.stringify(["בָ", "בַ", "בֵ", "בִ"]),
      hint: "Tiene forma de una pequeña 'T' debajo de la letra y suena como una 'a' larga.",
      order: 1,
    },
    {
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "¿Qué vocal produce un sonido de 'i' corta?",
      correctAnswer: "Hireq",
      options: JSON.stringify(["Hireq", "Tsere", "Seghol", "Qubbuts"]),
      hint: "Es un solo punto debajo de la consonante.",
      order: 2,
    },
    {
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "¿Cómo se llama la combinación de una vocal reducida con un Shewa (ej. Hatef-Pathach)?",
      correctAnswer: "Vocal Reducida (Hatef)",
      options: JSON.stringify(["Vocal Reducida (Hatef)", "Vocal Históricamente Larga", "Máter Lectionis", "Daghesh Lene"]),
      hint: "Se usan bajo las letras guturales porque estas rechazan el Shewa simple sonoro.",
      order: 3,
    },
    {
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "¿Qué es una 'Máter Lectionis' (Madre de lectura)?",
      correctAnswer: "Una consonante (He, Waw, Yod) que actúa como vocal.",
      options: JSON.stringify([
        "Una consonante (He, Waw, Yod) que actúa como vocal.",
        "Una regla para leer guturales.",
        "Un acento disyuntivo fuerte.",
        "El punto dentro de una letra."
      ]),
      hint: "Ayudaban a los antiguos lectores a saber qué vocal pronunciar antes de que se inventara el sistema de puntos (niqqud).",
      order: 4,
    },

    // --- LECCIÓN 3: Silabificación (Checkpoint) ---
    {
      lessonId: "lesson-3",
      type: "multiple-choice",
      question: "¿Cuál es la regla fundamental de una sílaba hebrea?",
      correctAnswer: "Debe comenzar con una consonante.",
      options: JSON.stringify([
        "Debe comenzar con una consonante.",
        "Debe terminar con una vocal.",
        "Debe contener dos vocales.",
        "Puede comenzar con una vocal si es larga."
      ]),
      hint: "En hebreo bíblico, ninguna sílaba (excepto la Waw conjuntiva especial) puede empezar con vocal.",
      order: 1,
    },
    {
      lessonId: "lesson-3",
      type: "multiple-choice",
      question: "¿Cuál es la diferencia entre un Daghesh Lene y un Daghesh Forte?",
      correctAnswer: "El Forte duplica la letra; el Lene solo endurece las letras BeGaDKeFaT.",
      options: JSON.stringify([
        "El Forte duplica la letra; el Lene solo endurece las letras BeGaDKeFaT.",
        "El Lene duplica la letra; el Forte la hace suave.",
        "Ambos duplican la letra pero en diferentes sílabas.",
        "El Forte solo aparece en guturales."
      ]),
      hint: "El Forte significa 'fuerte' (doble), el Lene significa 'suave' (endurece la pronunciación de b,g,d,k,p,t).",
      order: 2,
    },
    {
      lessonId: "lesson-3",
      type: "multiple-choice",
      question: "Si una sílaba es cerrada y no acentuada, ¿qué tipo de vocal requiere?",
      correctAnswer: "Vocal Corta",
      options: JSON.stringify(["Vocal Corta", "Vocal Larga", "Vocal Reducida", "Shewa Sonoro"]),
      hint: "Es una regla de oro de la silabificación: Sílaba Cerrada Inacentuada = Vocal Corta.",
      order: 3,
    },
    {
      lessonId: "lesson-3",
      type: "multiple-choice",
      question: "¿Cómo saber si un Shewa es Sonoro o Silencioso?",
      correctAnswer: "Si está al principio de una palabra, es Sonoro. Si cierra una sílaba, es Silencioso.",
      options: JSON.stringify([
        "Si está al principio de una palabra, es Sonoro. Si cierra una sílaba, es Silencioso.",
        "Todos los Shewas son silenciosos.",
        "Si está bajo una gutural es silencioso, de lo contrario sonoro.",
        "Solo es sonoro si tiene un Daghesh."
      ]),
      hint: "Un Shewa bajo la primera consonante de una palabra siempre se pronuncia (sonoro) como un sonido muy breve 'e'.",
      order: 4,
    },
    {
      lessonId: "lesson-3",
      type: "module-assessment",
      question: "Desafío Final: Una palabra tiene un Daghesh dentro de una letra que tiene una vocal bajo ella, precedida por otra vocal. ¿Qué Daghesh es?",
      correctAnswer: "Daghesh Forte",
      options: JSON.stringify([
        "Daghesh Forte",
        "Daghesh Lene",
        "Mappiq",
        "Meteg"
      ]),
      hint: "El Daghesh Lene nunca está precedido inmediatamente por un sonido vocálico.",
      order: 5,
    }
  ],
};

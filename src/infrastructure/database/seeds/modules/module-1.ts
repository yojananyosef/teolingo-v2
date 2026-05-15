import { ModuleData } from "./types";

// Las 22 letras del alefato hebreo con su carácter, transliteración y nombre
const ALPHABET_EXERCISES = [
  { char: "א", name: "Alef", translit: "ʾ (silenciosa)", hint: "Gutural silenciosa. Primera letra. Toma el sonido de su vocal." },
  { char: "ב", name: "Bet / Vet", translit: "b / v", hint: "Con Daghesh (בּ) = B. Sin Daghesh (ב) = V. Primera palabra de la Torá: בְּרֵאשִׁית." },
  { char: "ג", name: "Guimel", translit: "g", hint: "Sonido siempre fuerte como en 'gato'. No tiene variante suave en hebreo bíblico." },
  { char: "ד", name: "Dalet", translit: "d", hint: "Sonido como 'd' en 'dar'. Con Daghesh Lene es más oclusiva." },
  { char: "ה", name: "He", translit: "h", hint: "Gutural aspirada como 'j' suave. Al final de palabra suele ser silenciosa (Máter Lectionis)." },
  { char: "ו", name: "Waw", translit: "w / v", hint: "En hebreo bíblico se pronuncia 'w'. También funciona como Máter Lectionis para 'o' y 'u'." },
  { char: "ז", name: "Zayin", translit: "z", hint: "Sonido como 'z' en 'zapato' (zumbido). Nunca tiene Daghesh Forte." },
  { char: "ח", name: "Het", translit: "ḥ", hint: "Gutural fuerte como 'j' en 'jota'. Siempre aspirada, nunca puede tomar Daghesh." },
  { char: "ט", name: "Tet", translit: "ṭ", hint: "T enfática (faríngea). Distinta de Tav (ת). Ejemplo: טוֹב = bueno." },
  { char: "י", name: "Yod", translit: "y", hint: "La letra más pequeña del alefato. Como 'y' en 'yema'. Máter Lectionis para sonido 'i'." },
  { char: "כ / ך", name: "Kaf / Kaf-Sofit", translit: "k / kh", hint: "Con Daghesh (כּ) = K. Sin Daghesh (כ) = sonido jota suave. ך es la forma final." },
  { char: "ל", name: "Lamed", translit: "l", hint: "Sonido 'l'. Es la letra más alta del alefato. Como preposición significa 'a, para'." },
  { char: "מ / ם", name: "Mem / Mem-Sofit", translit: "m", hint: "Sonido 'm'. ם es la forma final (al fin de palabra). Raíz de מַיִם = agua." },
  { char: "נ / ן", name: "Nun / Nun-Sofit", translit: "n", hint: "Sonido 'n'. ן es la forma final. La Nun tiende a asimilarse ante otras consonantes." },
  { char: "ס", name: "Samek", translit: "s", hint: "Sonido 's'. Distinto de Shin/Sin. Letra redonda y cerrada." },
  { char: "ע", name: "Ayin", translit: "ʿ (gutural)", hint: "Gutural profunda (faríngea sonora). Silenciosa en hebreo moderno. Fundamental en palabras como עֶבֶד = siervo." },
  { char: "פ / ף", name: "Pe / Pe-Sofit", translit: "p / f / ph", hint: "Con Daghesh (פּ) = P. Sin Daghesh (פ) = F. ף es la forma final." },
  { char: "צ / ץ", name: "Tsade / Tsade-Sofit", translit: "ṣ", hint: "T+S enfática. ץ es la forma final. Como en צֶדֶק = justicia." },
  { char: "ק", name: "Qof", translit: "q", hint: "K uvular (pronunciada más atrás). Distinta de Kaf. Como en קָדוֹשׁ = santo." },
  { char: "ר", name: "Resh", translit: "r", hint: "Gutural vibrante (comportamiento similar a guturales). Nunca toma Daghesh Forte." },
  { char: "שׁ / שׂ", name: "Shin / Sin", translit: "š / ś", hint: "Con punto derecho (שׁ) = SH. Con punto izquierdo (שׂ) = S. Ejemplo: שָׁלוֹם = paz." },
  { char: "ת", name: "Tav", translit: "t / th", hint: "Con Daghesh Lene = T oclusiva. Sin Daghesh = TH aspirada (en pronunciación ashkenazí)." },
];

const VOWEL_EXERCISES = [
  { name: "Qamets", char: "בָ", sound: "ā (a larga)", type: "Larga", hint: "Tiene forma de T invertida. Aparece en sílabas abiertas acentuadas. En algunas palabras puede ser Qamets Hatuph (vocal 'o' corta — contexto lo determina)." },
  { name: "Pathach", char: "בַ", sound: "a (a corta)", type: "Corta", hint: "Una línea horizontal bajo la letra. La vocal 'a' corta más común. Pathach Furtivo aparece antes de guturales finales." },
  { name: "Tsere", char: "בֵ", sound: "ē (e larga)", type: "Larga", hint: "Dos puntos diagonales. Puede tener Yod como Máter: בֵּי. Sonido 'e' cerrada larga." },
  { name: "Seghol", char: "בֶ", sound: "e (e corta)", type: "Corta", hint: "Tres puntos en triángulo. La 'e' corta. Muy común en palabras con pausa o en sílabas cerradas." },
  { name: "Hireq", char: "בִ", sound: "i (i corta)", type: "Corta", hint: "Un solo punto bajo la letra. Con Yod como Máter (בִּי) = Hireq Gadol (i larga)." },
  { name: "Hireq Gadol", char: "בִּי", sound: "ī (i larga)", type: "Larga", hint: "Hireq + Yod como Máter Lectionis. La 'i' larga en hebreo." },
  { name: "Holem", char: "בֹ", sound: "ō (o larga)", type: "Larga", hint: "Un punto sobre la letra. Con Waw como Máter (וֹ) = Holem-Waw. Sonido 'o' larga." },
  { name: "Qubbuts", char: "בֻ", sound: "u (u corta)", type: "Corta", hint: "Tres puntos diagonales bajo la letra. La 'u' corta. Distinto de Shureq (ּו) que es u larga." },
  { name: "Shureq", char: "בּוּ", sound: "ū (u larga)", type: "Larga", hint: "Waw con Daghesh en el centro (וּ). Siempre u larga. Es la conjunción 'y' antes de labiales (BUMAF)." },
  { name: "Shewa Simple", char: "בְ", sound: "e breve o silencio", type: "Reducida", hint: "Dos puntos verticales. Sonoro al inicio de palabra o después de vocal larga. Silencioso al cerrar sílaba." },
  { name: "Hatef-Pathach", char: "בֲ", sound: "a muy breve", type: "Reducida", hint: "Shewa + Pathach. Aparece bajo guturales en lugar del Shewa simple sonoro." },
  { name: "Hatef-Seghol", char: "בֱ", sound: "e muy breve", type: "Reducida", hint: "Shewa + Seghol. La vocal reducida más frecuente bajo la Alef." },
  { name: "Hatef-Qamets", char: "בֳ", sound: "o muy breve", type: "Reducida", hint: "Shewa + Qamets. Aparece bajo guturales, especialmente Alef y Ayin." },
];

export const module1: ModuleData = {
  lessons: [
    {
      id: "lesson-1",
      title: "Lección 1: El Alfabeto Hebreo",
      description: "Las 22 consonantes hebreas, guturales y formas finales.",
      order: 1,
      moduleIndex: 1,
      xpReward: 30,
    },
    {
      id: "lesson-2",
      title: "Lección 2: Las Vocales Hebreas",
      description: "Las 13 vocales: largas, cortas y reducidas (niqqud).",
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
      xpReward: 50,
    },
  ],
  exercises: [
    // --- LECCIÓN 1: UNA pregunta por cada letra (22 letras) ---
    ...ALPHABET_EXERCISES.map((letter, i) => ({
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: `Identifica esta letra hebrea: ${letter.char}`,
      correctAnswer: letter.name,
      options: JSON.stringify(
        shuffleWithCorrect(letter.name, [
          "Alef", "Bet / Vet", "Guimel", "Dalet", "He", "Waw", "Zayin",
          "Het", "Tet", "Yod", "Kaf / Kaf-Sofit", "Lamed", "Mem / Mem-Sofit",
          "Nun / Nun-Sofit", "Samek", "Ayin", "Pe / Pe-Sofit", "Tsade / Tsade-Sofit",
          "Qof", "Resh", "Shin / Sin", "Tav",
        ])
      ),
      hint: letter.hint,
      order: i + 1,
    })),

    // --- LECCIÓN 2: UNA pregunta por cada vocal (13 vocales) ---
    ...VOWEL_EXERCISES.map((vocal, i) => ({
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: `Identifica esta vocal hebrea: ${vocal.char} — Suena como "${vocal.sound}"`,
      correctAnswer: vocal.name,
      options: JSON.stringify(
        shuffleWithCorrect(vocal.name, [
          "Qamets", "Pathach", "Tsere", "Seghol", "Hireq", "Hireq Gadol",
          "Holem", "Qubbuts", "Shureq", "Shewa Simple",
          "Hatef-Pathach", "Hatef-Seghol", "Hatef-Qamets",
        ])
      ),
      hint: vocal.hint,
      order: i + 1,
    })),

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
        "Puede comenzar con una vocal si es larga.",
      ]),
      hint: "En hebreo bíblico, ninguna sílaba puede empezar con vocal.",
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
        "El Forte solo aparece en guturales.",
      ]),
      hint: "El Forte = doble consonante. El Lene = endurece b,g,d,k,p,t.",
      order: 2,
    },
    {
      lessonId: "lesson-3",
      type: "multiple-choice",
      question: "Si una sílaba es cerrada y no acentuada, ¿qué tipo de vocal requiere?",
      correctAnswer: "Vocal Corta",
      options: JSON.stringify(["Vocal Corta", "Vocal Larga", "Vocal Reducida", "Shewa Sonoro"]),
      hint: "Regla de oro: Sílaba Cerrada Inacentuada = Vocal Corta.",
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
        "Si está bajo una gutural es silencioso.",
        "Solo es sonoro si tiene un Daghesh.",
      ]),
      hint: "Shewa al inicio de palabra = siempre sonoro.",
      order: 4,
    },
    {
      lessonId: "lesson-3",
      type: "module-assessment",
      question: "Desafío Final: Una letra tiene un punto interior precedido por una vocal. ¿Qué tipo de Daghesh es?",
      correctAnswer: "Daghesh Forte",
      options: JSON.stringify(["Daghesh Forte", "Daghesh Lene", "Mappiq", "Meteg"]),
      hint: "El Daghesh Lene NUNCA está precedido por vocal.",
      order: 5,
    },
  ],
};

/**
 * Selecciona 4 opciones: la correcta + 3 distractores aleatorios distintos
 */
function shuffleWithCorrect(correct: string, allOptions: string[]): string[] {
  const others = allOptions.filter((o) => o !== correct);
  const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const result = [correct, ...shuffled].sort(() => Math.random() - 0.5);
  return result;
}

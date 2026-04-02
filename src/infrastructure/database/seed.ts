import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  achievements,
  alphabet,
  anchorTexts,
  exercises,
  flashcards,
  israeliSentences,
  israeliUnits,
  israeliVocabulary,
  lessons,
  rhythmParadigms,
  userAchievements,
  userFlashcardProgress,
  userIsraeliProgress,
  userProgress,
  users,
} from "./schema";

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Modo seguro por defecto: conserva el avance del usuario tras resembrar contenido.
  // Overrides:
  // - --reset-progress fuerza borrado total de progreso.
  // - --preserve-progress fuerza preservación de progreso.
  // - SEED_PRESERVE_PROGRESS=false también activa reset total.
  const cliForcesReset = process.argv.includes("--reset-progress");
  const cliForcesPreserve = process.argv.includes("--preserve-progress");
  const preserveUserProgress = cliForcesReset
    ? false
    : cliForcesPreserve
      ? true
      : process.env.SEED_PRESERVE_PROGRESS !== "false";
  console.log(
    preserveUserProgress
      ? "🛡️ Modo seguro activo: se preservará el progreso del usuario."
      : "⚠️ Modo reset total: se borrará el progreso del usuario."
  );

  const toFiniteInt = (value: unknown, fallback = 0): number => {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
  };

  const toBool = (value: unknown, fallback = false): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    return fallback;
  };

  const isValidDate = (value: unknown): value is Date =>
    value instanceof Date && Number.isFinite(value.getTime());

  const toDateOrNull = (value: unknown): Date | null => {
    return isValidDate(value) ? value : null;
  };

  const toDate = (value: unknown, fallback: Date): Date => {
    return isValidDate(value) ? value : fallback;
  };

  const progressBackup = preserveUserProgress ? await db.select().from(userProgress) : [];
  const achievementsBackup = preserveUserProgress ? await db.select().from(userAchievements) : [];
  const israeliProgressBackup = preserveUserProgress ? await db.select().from(userIsraeliProgress) : [];
  const flashcardProgressBackup = preserveUserProgress
    ? await db.select().from(userFlashcardProgress)
    : [];

  // 1. Limpiar datos existentes
  console.log("🧹 Limpiando base de datos...");
  await db.delete(userProgress);
  await db.delete(userAchievements);
  await db.delete(userIsraeliProgress);
  await db.delete(exercises);
  await db.delete(lessons);
  await db.delete(achievements);
  await db.delete(anchorTexts);
  await db.delete(alphabet);
  await db.delete(rhythmParadigms);
  await db.delete(userFlashcardProgress);
  await db.delete(israeliVocabulary);
  await db.delete(israeliSentences);
  await db.delete(israeliUnits);
  await db.delete(flashcards);

  // 2. Crear Usuarios Iniciales (Figuras Bíblicas)
  console.log("👥 Creando figuras bíblicas...");
  const password = await bcrypt.hash("123456", 10);

  const biblicalFigures = [
    {
      id: "user-jesus",
      email: "jesus@cielo.com",
      passwordHash: password,
      displayName: "Jesús",
      points: 4000,
      level: 40,
      streak: 100,
    },
    {
      id: "user-enoc",
      email: "enoc@cielo.com",
      passwordHash: password,
      displayName: "Enoc",
      points: 2000,
      level: 20,
      streak: 50,
    },
    {
      id: "user-moises",
      email: "moises@egipto.com",
      passwordHash: password,
      displayName: "Moisés",
      points: 1500,
      level: 15,
      streak: 40,
    },
    {
      id: "user-elias",
      email: "elias@cielo.com",
      passwordHash: password,
      displayName: "Elías",
      points: 1490,
      level: 14,
      streak: 35,
    },
  ];

  for (const figure of biblicalFigures) {
    const [existing] = await db.select().from(users).where(eq(users.email, figure.email)).limit(1);
    if (!existing) {
      await db.insert(users).values(figure);
    }
  }

  // 3. Crear Logros
  console.log("🏆 Creando logros...");
  await db.insert(achievements).values([
    {
      id: "ach-1",
      name: "Primeros Pasos",
      description: "Completa tu primera lección.",
      icon: "🚀",
      requirementType: "lessons",
      requirementValue: 1,
    },
    {
      id: "ach-2",
      name: "Estudiante Constante",
      description: "Mantén una racha de 3 días.",
      icon: "🔥",
      requirementType: "streak",
      requirementValue: 3,
    },
    {
      id: "ach-3",
      name: "Erudito en Ciernes",
      description: "Alcanza los 500 puntos de XP.",
      icon: "📚",
      requirementType: "points",
      requirementValue: 500,
    },
    {
      id: "ach-4",
      name: "Maestro del Alfabeto",
      description: "Completa todas las lecciones del Alef-Bet.",
      icon: "✍️",
      requirementType: "lessons",
      requirementValue: 5,
    },
    {
      id: "ach-5",
      name: "Gramático en Ciernes",
      description: "Completa 10 lecciones.",
      icon: "📜",
      requirementType: "lessons",
      requirementValue: 10,
    },
    {
      id: "ach-6",
      name: "Políglota Bíblico",
      description: "Alcanza los 1500 puntos de XP.",
      icon: "💎",
      requirementType: "points",
      requirementValue: 1500,
    },
    {
      id: "ach-7",
      name: "Explorador de la Unidad 3",
      description: "Completa 15 lecciones.",
      icon: "🗺️",
      requirementType: "lessons",
      requirementValue: 15,
    },
    {
      id: "ach-8",
      name: "Fuego Pentecostal",
      description: "Mantén una racha de 7 días.",
      icon: "🕊️",
      requirementType: "streak",
      requirementValue: 7,
    },
    {
      id: "ach-israeli-initiate",
      name: "Iniciado del Modo Israelí",
      description: "Completa tu primera unidad en el modo israelí.",
      icon: "📜",
      requirementType: "israeli_units",
      requirementValue: 1,
    },
    {
      id: "ach-israeli-master",
      name: "Maestro del Modo Israelí",
      description: "Completa todas las unidades del modo israelí.",
      icon: "🏆",
      requirementType: "israeli_units",
      requirementValue: 3,
    },
  ]);

  // 4. Crear Lecciones y Ejercicios
  console.log("📖 Creando lecciones y ejercicios...");

  // =============================================
  // UNIT 0: Cimientos del Hebreo (Nivel Introductorio)
  // =============================================

  // Lección 0-1: El Alef-Bet (Consonantes)
  await db.insert(lessons).values({
    id: "lesson-0-1",
    title: "El Alef-Bet: Consonantes",
    description: "Unidad 0: Aprende a reconocer las 22 consonantes del alfabeto hebreo.",
    order: 1,
    xpReward: 30,
  });

  await db.insert(exercises).values([
    {
      id: "ex-0-1-1",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Alef'",
      correctAnswer: "א",
      options: JSON.stringify(["א", "ע", "ה", "ח"]),
      order: 1,
    },
    {
      id: "ex-0-1-2",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Bet'",
      correctAnswer: "ב",
      options: JSON.stringify(["ב", "כ", "מ", "נ"]),
      order: 2,
    },
    {
      id: "ex-0-1-3",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Guímel'",
      correctAnswer: "ג",
      options: JSON.stringify(["ג", "נ", "ד", "ר"]),
      order: 3,
    },
    {
      id: "ex-0-1-4",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Dálet'",
      correctAnswer: "ד",
      options: JSON.stringify(["ד", "ר", "כ", "ב"]),
      order: 4,
    },
    {
      id: "ex-0-1-5",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'He'",
      correctAnswer: "ה",
      options: JSON.stringify(["ה", "ח", "ת", "ע"]),
      order: 5,
    },
    {
      id: "ex-0-1-6",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Vav'",
      correctAnswer: "ו",
      options: JSON.stringify(["ו", "ז", "י", "נ"]),
      order: 6,
    },
    {
      id: "ex-0-1-7",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Záyin'",
      correctAnswer: "ז",
      options: JSON.stringify(["ז", "ו", "נ", "י"]),
      order: 7,
    },
    {
      id: "ex-0-1-8",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Jet'",
      correctAnswer: "ח",
      options: JSON.stringify(["ח", "ה", "ת", "כ"]),
      order: 8,
    },
    {
      id: "ex-0-1-9",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Tet'",
      correctAnswer: "ט",
      options: JSON.stringify(["ט", "מ", "ס", "ע"]),
      order: 9,
    },
    {
      id: "ex-0-1-10",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Yod'",
      correctAnswer: "י",
      options: JSON.stringify(["י", "ו", "ז", "נ"]),
      order: 10,
    },
    {
      id: "ex-0-1-11",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Kaf'",
      correctAnswer: "כ",
      options: JSON.stringify(["כ", "ב", "ד", "ר"]),
      order: 11,
    },
    {
      id: "ex-0-1-12",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Lámed'",
      correctAnswer: "ל",
      options: JSON.stringify(["ל", "כ", "נ", "מ"]),
      order: 12,
    },
    {
      id: "ex-0-1-13",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Mem'",
      correctAnswer: "מ",
      options: JSON.stringify(["מ", "ט", "ס", "נ"]),
      order: 13,
    },
    {
      id: "ex-0-1-14",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Nun'",
      correctAnswer: "נ",
      options: JSON.stringify(["נ", "ג", "ב", "כ"]),
      order: 14,
    },
    {
      id: "ex-0-1-15",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Samej'",
      correctAnswer: "ס",
      options: JSON.stringify(["ס", "מ", "ט", "ע"]),
      order: 15,
    },
    {
      id: "ex-0-1-16",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Áyin'",
      correctAnswer: "ע",
      options: JSON.stringify(["ע", "א", "צ", "ט"]),
      order: 16,
    },
    {
      id: "ex-0-1-17",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Pe'",
      correctAnswer: "פ",
      options: JSON.stringify(["פ", "כ", "ב", "ת"]),
      order: 17,
    },
    {
      id: "ex-0-1-18",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Tsade'",
      correctAnswer: "צ",
      options: JSON.stringify(["צ", "ע", "ק", "ט"]),
      order: 18,
    },
    {
      id: "ex-0-1-19",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Qof'",
      correctAnswer: "ק",
      options: JSON.stringify(["ק", "כ", "ר", "פ"]),
      order: 19,
    },
    {
      id: "ex-0-1-20",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Resh'",
      correctAnswer: "ר",
      options: JSON.stringify(["ר", "ד", "כ", "ב"]),
      order: 20,
    },
    {
      id: "ex-0-1-21",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Shin'",
      correctAnswer: "שׁ",
      options: JSON.stringify(["שׁ", "שׂ", "ס", "ת"]),
      order: 21,
    },
    {
      id: "ex-0-1-22",
      lessonId: "lesson-0-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Tav'",
      correctAnswer: "ת",
      options: JSON.stringify(["ת", "ח", "ה", "ד"]),
      order: 22,
    },
  ]);

  // Lección 0-2: Vocales (Nikud) y Semivocales
  await db.insert(lessons).values({
    id: "lesson-0-2",
    title: "Vocales (Nikud) y Semivocales",
    description: "Unidad 0: Descubre los signos vocálicos del hebreo y cómo se colocan bajo las letras.",
    order: 2,
    xpReward: 35,
  });

  await db.insert(exercises).values([
    {
      id: "ex-0-2-1",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Qué sonido produce el Kamatz ( ָ ) debajo de una letra?",
      correctAnswer: "Sonido 'a'",
      options: JSON.stringify(["Sonido 'a'", "Sonido 'e'", "Sonido 'i'", "Sonido 'o'"]),
      order: 1,
    },
    {
      id: "ex-0-2-2",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Qué sonido produce el Jirik ( ִ ) debajo de una letra?",
      correctAnswer: "Sonido 'i'",
      options: JSON.stringify(["Sonido 'a'", "Sonido 'e'", "Sonido 'i'", "Sonido 'u'"]),
      order: 2,
    },
    {
      id: "ex-0-2-3",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Qué sonido produce el Tsere ( ֵ ) debajo de una letra?",
      correctAnswer: "Sonido 'e'",
      options: JSON.stringify(["Sonido 'a'", "Sonido 'e'", "Sonido 'o'", "Sonido 'u'"]),
      order: 3,
    },
    {
      id: "ex-0-2-4",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Qué sonido produce el Jolam ( ֹ ) encima de una letra?",
      correctAnswer: "Sonido 'o'",
      options: JSON.stringify(["Sonido 'a'", "Sonido 'i'", "Sonido 'o'", "Sonido 'u'"]),
      order: 4,
    },
    {
      id: "ex-0-2-5",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Qué sonido produce el Shuruq (וּ)?",
      correctAnswer: "Sonido 'u'",
      options: JSON.stringify(["Sonido 'a'", "Sonido 'e'", "Sonido 'o'", "Sonido 'u'"]),
      order: 5,
    },
    {
      id: "ex-0-2-6",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Cuál es la diferencia entre Kamatz ( ָ ) y Pataj ( ַ )?",
      correctAnswer: "Ambos suenan 'a', pero Kamatz es larga y Pataj es corta",
      options: JSON.stringify(["Ambos suenan 'a', pero Kamatz es larga y Pataj es corta", "Kamatz suena 'a' y Pataj suena 'e'", "Kamatz suena 'o' y Pataj suena 'a'", "Son exactamente iguales"]),
      order: 6,
    },
    {
      id: "ex-0-2-7",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "El Shva ( ְ ) es un signo vocálico especial. ¿Qué indica?",
      correctAnswer: "Una vocal ultra-corta o ausencia de vocal",
      options: JSON.stringify(["Una vocal ultra-corta o ausencia de vocal", "Siempre suena como 'e'", "Indica que la letra es muda", "Solo se usa al final de palabra"]),
      order: 7,
    },
    {
      id: "ex-0-2-8",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Qué vocal lleva la sílaba 'Ba' en בָּ?",
      correctAnswer: "Kamatz",
      options: JSON.stringify(["Kamatz", "Pataj", "Tsere", "Jirik"]),
      order: 8,
    },
    {
      id: "ex-0-2-9",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Dónde se colocan la mayoría de los signos vocálicos hebreos?",
      correctAnswer: "Debajo de la consonante",
      options: JSON.stringify(["Debajo de la consonante", "Encima de la consonante", "A la derecha", "A la izquierda"]),
      order: 9,
    },
    {
      id: "ex-0-2-10",
      lessonId: "lesson-0-2",
      type: "multiple-choice",
      question: "¿Cuál de estos es el Segol, la vocal 'e' corta?",
      correctAnswer: " ֶ (tres puntos en triángulo)",
      options: JSON.stringify([" ֶ (tres puntos en triángulo)", " ֵ (dos puntos horizontales)", " ִ (un punto debajo)", " ַ (línea horizontal)"]),
      order: 10,
    },
  ]);

  // Lección 0-3: Dagesh (Kal y Jazaq)
  await db.insert(lessons).values({
    id: "lesson-0-3",
    title: "El Dagesh: Kal y Jazaq",
    description: "Unidad 0: Aprende cómo el punto dentro de una letra cambia su pronunciación.",
    order: 3,
    xpReward: 40,
  });

  await db.insert(exercises).values([
    {
      id: "ex-0-3-1",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Qué es el Dagesh?",
      correctAnswer: "Un punto dentro de una letra que modifica su sonido",
      options: JSON.stringify(["Un punto dentro de una letra que modifica su sonido", "Una vocal debajo de una letra", "Un signo de puntuación al final", "Un acento encima de la letra"]),
      order: 1,
    },
    {
      id: "ex-0-3-2",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cómo se pronuncia בּ (con Dagesh)?",
      correctAnswer: "'B' (como en 'bueno')",
      options: JSON.stringify(["'B' (como en 'bueno')", "'V' (como en 'vaca')", "'P' (como en 'perro')", "'F' (como en 'foto')"]),
      order: 2,
    },
    {
      id: "ex-0-3-3",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cómo se pronuncia ב (sin Dagesh)?",
      correctAnswer: "'V' (como en 'vaca')",
      options: JSON.stringify(["'B' (como en 'bueno')", "'V' (como en 'vaca')", "'P' (como en 'perro')", "'F' (como en 'foto')"]),
      order: 3,
    },
    {
      id: "ex-0-3-4",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cómo se pronuncia כּ (con Dagesh)?",
      correctAnswer: "'K' (como en 'kilo')",
      options: JSON.stringify(["'K' (como en 'kilo')", "'J' (como en 'jamón')", "'G' (como en 'gato')", "'T' (como en 'toro')"]),
      order: 4,
    },
    {
      id: "ex-0-3-5",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cómo se pronuncia כ (sin Dagesh)?",
      correctAnswer: "'J' (como en 'jamón')",
      options: JSON.stringify(["'K' (como en 'kilo')", "'J' (como en 'jamón')", "'S' (como en 'sol')", "'Sh' (como en 'show')"]),
      order: 5,
    },
    {
      id: "ex-0-3-6",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cómo se pronuncia פּ (con Dagesh)?",
      correctAnswer: "'P' (como en 'perro')",
      options: JSON.stringify(["'P' (como en 'perro')", "'F' (como en 'foto')", "'B' (como en 'bueno')", "'V' (como en 'vaca')"]),
      order: 6,
    },
    {
      id: "ex-0-3-7",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cómo se pronuncia פ (sin Dagesh)?",
      correctAnswer: "'F' (como en 'foto')",
      options: JSON.stringify(["'P' (como en 'perro')", "'F' (como en 'foto')", "'B' (como en 'bueno')", "'V' (como en 'vaca')"]),
      order: 7,
    },
    {
      id: "ex-0-3-8",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cuáles son las 6 letras BeGaDKePhaT que cambian con Dagesh?",
      correctAnswer: "ב ג ד כ פ ת",
      options: JSON.stringify(["ב ג ד כ פ ת", "א ה ו י ע ר", "מ נ ס צ ק ש", "ז ח ט ל ם ן"]),
      order: 8,
    },
    {
      id: "ex-0-3-9",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿Cuál es la diferencia entre Dagesh Kal y Dagesh Jazaq?",
      correctAnswer: "Kal cambia la pronunciación, Jazaq duplica/intensifica la consonante",
      options: JSON.stringify(["Kal cambia la pronunciación, Jazaq duplica/intensifica la consonante", "Son nombres diferentes para lo mismo", "Kal es para vocales y Jazaq para consonantes", "Kal aparece al inicio y Jazaq al final"]),
      order: 9,
    },
    {
      id: "ex-0-3-10",
      lessonId: "lesson-0-3",
      type: "multiple-choice",
      question: "¿En cuál de estas opciones la letra tiene un Dagesh?",
      correctAnswer: "בּ",
      options: JSON.stringify(["בּ", "ב", "בְ", "בֵ"]),
      order: 10,
    },
  ]);

  // Lección 0-4: Maqef y Signos de Lectura
  await db.insert(lessons).values({
    id: "lesson-0-4",
    title: "Maqef y Signos de Lectura",
    description: "Unidad 0: Reconoce los signos de puntuación y lectura del texto hebreo.",
    order: 4,
    xpReward: 40,
  });

  await db.insert(exercises).values([
    {
      id: "ex-0-4-1",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Qué es el Maqef (־) en hebreo?",
      correctAnswer: "Un guión que une palabras como unidad",
      options: JSON.stringify(["Un guión que une palabras como unidad", "Un punto que marca final de oración", "Un acento que indica tono musical", "Un signo que separa dos versículos"]),
      order: 1,
    },
    {
      id: "ex-0-4-2",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "En כָּל־הָאָרֶץ (kol-haáretz), ¿qué función cumple el Maqef?",
      correctAnswer: "Une ambas palabras como una sola unidad",
      options: JSON.stringify(["Une ambas palabras como una sola unidad", "Indica que hay una pausa larga entre ellas", "Marca el final del versículo completo", "Señala un cambio de tono en la lectura"]),
      order: 2,
    },
    {
      id: "ex-0-4-3",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Qué indica el Sof Pasuk ( ׃ ) al final de un versículo?",
      correctAnswer: "El final del versículo, como un punto",
      options: JSON.stringify(["El final del versículo, como un punto", "Una pausa breve dentro del versículo", "El comienzo de un párrafo nuevo", "Una pregunta dirigida al lector"]),
      order: 3,
    },
    {
      id: "ex-0-4-4",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Qué indica el Atnaj ( ֑ ) en un versículo?",
      correctAnswer: "La pausa principal que lo divide en dos",
      options: JSON.stringify(["La pausa principal que lo divide en dos", "El final completo del versículo bíblico", "Una vocal que se coloca bajo la letra", "Que esa consonante no se pronuncia"]),
      order: 4,
    },
    {
      id: "ex-0-4-5",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Qué es el Meteg ( ֽ )?",
      correctAnswer: "Un acento secundario de pronunciación",
      options: JSON.stringify(["Un acento secundario de pronunciación", "Una vocal larga debajo de la letra", "Un signo que marca fin de oración", "Un separador entre dos párrafos"]),
      order: 5,
    },
    {
      id: "ex-0-4-6",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿En qué dirección se lee el texto hebreo?",
      correctAnswer: "De derecha a izquierda",
      options: JSON.stringify(["De derecha a izquierda", "De izquierda a derecha", "De arriba hacia abajo", "En ambas direcciones"]),
      order: 6,
    },
    {
      id: "ex-0-4-7",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Qué son los 'teamim' (טעמים) en el texto bíblico?",
      correctAnswer: "Acentos que marcan melodía y estructura",
      options: JSON.stringify(["Acentos que marcan melodía y estructura", "Las vocales principales del texto hebreo", "Las consonantes que van al final", "Los números de capítulo y versículo"]),
      order: 7,
    },
    {
      id: "ex-0-4-8",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Cuál de estos símbolos es el Maqef?",
      correctAnswer: "־ (guión horizontal elevado)",
      options: JSON.stringify(["־ (guión horizontal elevado)", "׃ (dos puntos verticales)", " ֑ (triángulo invertido)", " ֽ (línea vertical corta)"]),
      order: 8,
    },
    {
      id: "ex-0-4-9",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "En בְּרֵאשִׁית בָּרָא אֱלֹהִים (Gn 1:1), ¿cómo sabes dónde termina el versículo?",
      correctAnswer: "Por el Sof Pasuk ( ׃ ) al final",
      options: JSON.stringify(["Por el Sof Pasuk ( ׃ ) al final", "Por una mayúscula en la siguiente", "Porque hay un espacio más grande", "Por un punto y coma después"]),
      order: 9,
    },
    {
      id: "ex-0-4-10",
      lessonId: "lesson-0-4",
      type: "multiple-choice",
      question: "¿Para qué sirve aprender los signos de lectura antes del vocabulario?",
      correctAnswer: "Para leer correctamente cualquier texto",
      options: JSON.stringify(["Para leer correctamente cualquier texto", "No es necesario, son solo decoración", "Solo sirven para la música litúrgica", "Son opcionales y poco frecuentes"]),
      order: 10,
    },
  ]);

  // Lección 0-5: Formas Especiales y Lectura
  await db.insert(lessons).values({
    id: "lesson-0-5",
    title: "Formas Especiales y Lectura",
    description: "Unidad 0: Letras finales (Sofit), guturales, matres lectionis, mappiq y pataj furtivo.",
    order: 5,
    xpReward: 45,
  });

  await db.insert(exercises).values([
    // --- Letras finales (Sofit) ---
    {
      id: "ex-0-5-1",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "5 letras cambian de forma al final de palabra. ¿Cómo se llaman?",
      correctAnswer: "Letras Sofit (finales)",
      options: JSON.stringify(["Letras Sofit (finales)", "Letras guturales", "Letras BeGaDKePhaT", "Letras vocálicas"]),
      order: 1,
    },
    {
      id: "ex-0-5-2",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma final (Sofit) de la letra Kaf (כ)?",
      correctAnswer: "ך",
      options: JSON.stringify(["ך", "ן", "ם", "ף"]),
      order: 2,
    },
    {
      id: "ex-0-5-3",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma final (Sofit) de la letra Mem (מ)?",
      correctAnswer: "ם",
      options: JSON.stringify(["ם", "ך", "ן", "ץ"]),
      order: 3,
    },
    {
      id: "ex-0-5-4",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma final (Sofit) de la letra Nun (נ)?",
      correctAnswer: "ן",
      options: JSON.stringify(["ן", "ך", "ף", "ץ"]),
      order: 4,
    },
    {
      id: "ex-0-5-5",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma final (Sofit) de la letra Pe (פ)?",
      correctAnswer: "ף",
      options: JSON.stringify(["ף", "ך", "ם", "ן"]),
      order: 5,
    },
    {
      id: "ex-0-5-6",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuál es la forma final (Sofit) de la letra Tsade (צ)?",
      correctAnswer: "ץ",
      options: JSON.stringify(["ץ", "ך", "ם", "ף"]),
      order: 6,
    },
    // --- Letras guturales ---
    {
      id: "ex-0-5-7",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuáles son las 4 consonantes guturales del hebreo?",
      correctAnswer: "א ה ח ע",
      options: JSON.stringify(["א ה ח ע", "ב ג ד כ", "מ נ ס צ", "ק ר ש ת"]),
      order: 7,
    },
    {
      id: "ex-0-5-8",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Por qué son especiales las letras guturales?",
      correctAnswer: "No aceptan dagesh y afectan las vocales",
      options: JSON.stringify(["No aceptan dagesh y afectan las vocales", "Son las más fáciles de pronunciar", "Solo aparecen al final de una palabra", "Siempre son mudas y no se leen"]),
      order: 8,
    },
    // --- Matres lectionis ---
    {
      id: "ex-0-5-9",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Qué son las 'matres lectionis' (madres de lectura)?",
      correctAnswer: "Consonantes que actúan como vocales mudas",
      options: JSON.stringify(["Consonantes que actúan como vocales mudas", "Las vocales largas del sistema hebreo", "Las cuatro consonantes guturales", "Los signos de cantilación bíblica"]),
      order: 9,
    },
    {
      id: "ex-0-5-10",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "Cuando ו actúa como mater lectionis, ¿qué sonidos puede indicar?",
      correctAnswer: "Los sonidos 'o' y 'u'",
      options: JSON.stringify(["Los sonidos 'o' y 'u'", "Los sonidos 'a' y 'e'", "Solo el sonido 'v'", "Solo el sonido 'i'"]),
      order: 10,
    },
    {
      id: "ex-0-5-11",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "Cuando י actúa como mater lectionis, ¿qué sonidos puede indicar?",
      correctAnswer: "Los sonidos 'e' e 'i'",
      options: JSON.stringify(["Los sonidos 'e' e 'i'", "Los sonidos 'o' y 'u'", "Solo el sonido 'y'", "Los sonidos 'a' y 'o'"]),
      order: 11,
    },
    {
      id: "ex-0-5-12",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuándo ה actúa como mater lectionis al final de palabra?",
      correctAnswer: "Puede indicar los sonidos 'a', 'e' u 'o'",
      options: JSON.stringify(["Puede indicar los sonidos 'a', 'e' u 'o'", "Siempre suena como 'h'", "Solo indica el sonido 'a'", "Nunca es mater lectionis"]),
      order: 12,
    },
    // --- Mappiq ---
    {
      id: "ex-0-5-13",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Qué es el Mappiq?",
      correctAnswer: "Punto en ה final: indica consonante plena",
      options: JSON.stringify(["Punto en ה final: indica consonante plena", "Es exactamente lo mismo que el Dagesh", "Una vocal que se coloca bajo la letra", "Un signo de cantilación del versículo"]),
      order: 13,
    },
    {
      id: "ex-0-5-14",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuál es la diferencia entre הּ (con Mappiq) y ה (sin Mappiq) al final de palabra?",
      correctAnswer: "הּ se pronuncia, ה sin punto es muda",
      options: JSON.stringify(["הּ se pronuncia, ה sin punto es muda", "Son exactamente iguales en todo", "ה sin punto suena más fuerte", "Solo es visual, sin efecto sonoro"]),
      order: 14,
    },
    // --- Pataj furtivo ---
    {
      id: "ex-0-5-15",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Qué es el Pataj furtivo?",
      correctAnswer: "Pataj bajo gutural final, se lee ANTES",
      options: JSON.stringify(["Pataj bajo gutural final, se lee ANTES", "Una vocal larga debajo de cualquier letra", "Un signo que elimina esa consonante", "Otro nombre para la vocal Kamatz"]),
      order: 15,
    },
    {
      id: "ex-0-5-16",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "En la palabra רוּחַ (ruaj = espíritu), ¿cómo se lee el pataj bajo la ח final?",
      correctAnswer: "Se lee 'a' ANTES de la ח: ru-aj",
      options: JSON.stringify(["Se lee 'a' ANTES de la ח: ru-aj", "Se lee 'a' DESPUÉS de la ח: ru-ja", "No se pronuncia", "Se lee como 'e'"]),
      order: 16,
    },
    // --- Repaso integrador ---
    {
      id: "ex-0-5-17",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "¿Cuáles son las 5 letras que tienen forma Sofit (final)?",
      correctAnswer: "כ מ נ פ צ → ך ם ן ף ץ",
      options: JSON.stringify(["כ מ נ פ צ → ך ם ן ף ץ", "א ה ח ע ר", "ב ג ד כ פ ת", "ו י ה א ר"]),
      order: 17,
    },
    {
      id: "ex-0-5-18",
      lessonId: "lesson-0-5",
      type: "multiple-choice",
      question: "Si ves la letra ם en una palabra, ¿qué sabes con certeza?",
      correctAnswer: "Es la última letra de la palabra (Mem final)",
      options: JSON.stringify(["Es la última letra de la palabra (Mem final)", "Es la primera letra", "Es una vocal", "Es una gutural"]),
      order: 18,
    },
  ]);

  // =============================================
  // UNIT 1: Fundamentos y Alef-Bet (ahora order 6-13)
  // =============================================

  // Lección 1 (ahora order 6)
  await db.insert(lessons).values({
    id: "lesson-1",
    title: "El Alfabeto (Alef-Bet)",
    description: "Unidad 1: Aprende las primeras letras del alfabeto hebreo.",
    order: 6,
    xpReward: 50,
  });

  await db.insert(exercises).values([
    {
      id: "ex-1-1",
      lessonId: "lesson-1",
      type: "translation",
      question: "¿Cómo se dice 'Padre' en hebreo?",
      correctAnswer: "Ab",
      options: JSON.stringify(["Ab", "Ben", "Elohim", "Eretz"]),
      hebrewText: "אָב",
      order: 1,
    },
    {
      id: "ex-1-2",
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Alef'",
      correctAnswer: "א",
      options: JSON.stringify(["א", "ב", "ג", "ד"]),
      order: 2,
    },
    {
      id: "ex-1-3",
      lessonId: "lesson-1",
      type: "translation",
      question: "¿Qué significa 'Eretz'?",
      correctAnswer: "Tierra",
      options: JSON.stringify(["Tierra", "Cielo", "Mar", "Luz"]),
      hebrewText: "אֶרֶץ",
      order: 3,
    },
    {
      id: "ex-1-4",
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Bet'",
      correctAnswer: "ב",
      options: JSON.stringify(["א", "ב", "ג", "ד"]),
      order: 4,
    },
    {
      id: "ex-1-5",
      lessonId: "lesson-1",
      type: "translation",
      question: "¿Cómo se dice 'Hijo' en hebreo?",
      correctAnswer: "Ben",
      options: JSON.stringify(["Ab", "Ben", "Elohim", "Eretz"]),
      hebrewText: "בֵּן",
      order: 5,
    },
    {
      id: "ex-1-6",
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Guímel'",
      correctAnswer: "ג",
      options: JSON.stringify(["א", "ב", "ג", "ד"]),
      order: 6,
    },
    {
      id: "ex-1-7",
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'Dálet'",
      correctAnswer: "ד",
      options: JSON.stringify(["א", "ב", "ג", "ד"]),
      order: 7,
    },
    {
      id: "ex-1-8",
      lessonId: "lesson-1",
      type: "translation",
      question: "¿Qué significa 'Adam'?",
      correctAnswer: "Hombre",
      options: JSON.stringify(["Hombre", "Tierra", "Cielo", "Vida"]),
      hebrewText: "אָדָם",
      order: 8,
    },
    {
      id: "ex-1-9",
      lessonId: "lesson-1",
      type: "multiple-choice",
      question: "Selecciona la letra 'He'",
      correctAnswer: "ה",
      options: JSON.stringify(["ה", "ו", "ז", "ח"]),
      order: 9,
    },
    {
      id: "ex-1-10",
      lessonId: "lesson-1",
      type: "translation",
      question: "¿Cómo se dice 'Mujer' en hebreo?",
      correctAnswer: "Ishá",
      options: JSON.stringify(["Ish", "Ishá", "Ab", "Ben"]),
      hebrewText: "אִשָּׁה",
      order: 10,
    },
  ]);

  // Lección 2 (antes order 2, ahora order 6)
  await db.insert(lessons).values({
    id: "lesson-2",
    title: "Vocales y Sonidos",
    description: "Unidad 1: Descubre cómo suenan las letras con las vocales.",
    order: 7,
    xpReward: 70,
  });

  await db.insert(exercises).values([
    {
      id: "ex-2-1",
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "Identifica el sonido 'Ba'",
      correctAnswer: "בָּ",
      options: JSON.stringify(["בָּ", "בִּ", "בּוּ", "בֵּ"]),
      order: 1,
    },
    {
      id: "ex-2-2",
      lessonId: "lesson-2",
      type: "translation",
      question: "¿Qué significa 'Shalom'?",
      correctAnswer: "Paz",
      options: JSON.stringify(["Hola", "Paz", "Adiós", "Rey"]),
      hebrewText: "שָׁלוֹם",
      order: 2,
    },
    {
      id: "ex-2-3",
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "Identifica la vocal 'Kamatz' (sonido 'a')",
      correctAnswer: " ָ ",
      options: JSON.stringify([" ָ ", " ִ ", " ֻ ", " ֵ "]),
      order: 3,
    },
    {
      id: "ex-2-4",
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "Identifica el sonido 'Bi'",
      correctAnswer: "בִּ",
      options: JSON.stringify(["בָּ", "בִּ", "בּוּ", "בֵּ"]),
      order: 4,
    },
    {
      id: "ex-2-5",
      lessonId: "lesson-2",
      type: "translation",
      question: "¿Qué significa 'Berit'?",
      correctAnswer: "Pacto",
      options: JSON.stringify(["Pacto", "Ley", "Pueblo", "Dios"]),
      hebrewText: "בְּרִית",
      order: 5,
    },
    {
      id: "ex-2-6",
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "Identifica el sonido 'Bo'",
      correctAnswer: "בּוֹ",
      options: JSON.stringify(["בָּ", "בִּ", "בּוֹ", "בֵּ"]),
      order: 6,
    },
    {
      id: "ex-2-7",
      lessonId: "lesson-2",
      type: "translation",
      question: "¿Qué significa 'Torá'?",
      correctAnswer: "Ley/Instrucción",
      options: JSON.stringify(["Ley/Instrucción", "Profeta", "Escrito", "Cántico"]),
      hebrewText: "תּוֹרָה",
      order: 7,
    },
    {
      id: "ex-2-8",
      lessonId: "lesson-2",
      type: "multiple-choice",
      question: "Identifica la vocal 'Tsere' (sonido 'e')",
      correctAnswer: " ֵ ",
      options: JSON.stringify([" ָ ", " ִ ", " ֻ ", " ֵ "]),
      order: 8,
    },
    {
      id: "ex-2-9",
      lessonId: "lesson-2",
      type: "translation",
      question: "¿Qué significa 'Yisrael'?",
      correctAnswer: "Israel",
      options: JSON.stringify(["Israel", "Jacob", "Judá", "Sión"]),
      hebrewText: "יִשְׂרָאֵל",
      order: 9,
    },
    {
      id: "ex-2-10",
      lessonId: "lesson-2",
      type: "translation",
      question: "¿Qué significa 'Ruaj'?",
      correctAnswer: "Espíritu/Viento",
      options: JSON.stringify(["Espíritu/Viento", "Fuego", "Agua", "Tierra"]),
      hebrewText: "רוּחַ",
      order: 10,
    },
  ]);

  // Lección 3 (antes order 3, ahora order 7)
  await db.insert(lessons).values({
    id: "lesson-3",
    title: "Palabras Básicas",
    description: "Unidad 1: Primeras palabras comunes en la Biblia.",
    order: 8,
    xpReward: 100,
  });

  await db.insert(exercises).values([
    {
      id: "ex-3-1",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Elohim'?",
      correctAnswer: "Dios",
      options: JSON.stringify(["Dios", "Hombre", "Mundo", "Rey"]),
      hebrewText: "אֱלֹהִים",
      order: 1,
    },
    {
      id: "ex-3-2",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Melek'?",
      correctAnswer: "Rey",
      options: JSON.stringify(["Dios", "Hombre", "Mundo", "Rey"]),
      hebrewText: "מֶלֶךְ",
      order: 2,
    },
    {
      id: "ex-3-3",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Kadosh'?",
      correctAnswer: "Santo",
      options: JSON.stringify(["Santo", "Bueno", "Grande", "Fuerte"]),
      hebrewText: "קָדוֹשׁ",
      order: 3,
    },
    {
      id: "ex-3-4",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Am'?",
      correctAnswer: "Pueblo",
      options: JSON.stringify(["Pueblo", "Nación", "Familia", "Tribu"]),
      hebrewText: "עַם",
      order: 4,
    },
    {
      id: "ex-3-5",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Derech'?",
      correctAnswer: "Camino",
      options: JSON.stringify(["Camino", "Vida", "Verdad", "Puerta"]),
      hebrewText: "דֶּרֶךְ",
      order: 5,
    },
    {
      id: "ex-3-6",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Ba-yit'?",
      correctAnswer: "Casa",
      options: JSON.stringify(["Casa", "Templo", "Ciudad", "Campo"]),
      hebrewText: "בַּיִת",
      order: 6,
    },
    {
      id: "ex-3-7",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Yom'?",
      correctAnswer: "Día",
      options: JSON.stringify(["Día", "Noche", "Mes", "Año"]),
      hebrewText: "יוֹם",
      order: 7,
    },
    {
      id: "ex-3-8",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Lailah'?",
      correctAnswer: "Noche",
      options: JSON.stringify(["Día", "Noche", "Tarde", "Mañana"]),
      hebrewText: "לַיְלָה",
      order: 8,
    },
    {
      id: "ex-3-9",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Mayim'?",
      correctAnswer: "Agua",
      options: JSON.stringify(["Agua", "Vino", "Leche", "Aceite"]),
      hebrewText: "מַיִם",
      order: 9,
    },
    {
      id: "ex-3-10",
      lessonId: "lesson-3",
      type: "translation",
      question: "¿Qué significa 'Shem'?",
      correctAnswer: "Nombre",
      options: JSON.stringify(["Nombre", "Hombre", "Lugar", "Palabra"]),
      hebrewText: "שֵׁם",
      order: 10,
    },
  ]);

  // Lección 4
  await db.insert(lessons).values({
    id: "lesson-4",
    title: "Verbos Comunes I",
    description: "Unidad 1: Aprende acciones básicas en hebreo.",
    order: 9,
    xpReward: 120,
  });

  await db.insert(exercises).values([
    {
      id: "ex-4-1",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Amar' (אָמַר)?",
      correctAnswer: "Decir",
      options: JSON.stringify(["Decir", "Hacer", "Ver", "Ir"]),
      hebrewText: "אָמַר",
      order: 1,
    },
    {
      id: "ex-4-2",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Bará' (בָּרָא)?",
      correctAnswer: "Crear",
      options: JSON.stringify(["Crear", "Destruir", "Habitar", "Caminar"]),
      hebrewText: "בָּרָא",
      order: 2,
    },
    {
      id: "ex-4-3",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Halak' (הָלַךְ)?",
      correctAnswer: "Caminar/Ir",
      options: JSON.stringify(["Caminar/Ir", "Correr", "Sentarse", "Dormir"]),
      hebrewText: "הָלַךְ",
      order: 3,
    },
    {
      id: "ex-4-4",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Yadá' (יָדַע)?",
      correctAnswer: "Saber/Conocer",
      options: JSON.stringify(["Saber/Conocer", "Ignorar", "Olvidad", "Pensar"]),
      hebrewText: "יָדַע",
      order: 4,
    },
    {
      id: "ex-4-5",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Asá' (עָשָׂה)?",
      correctAnswer: "Hacer",
      options: JSON.stringify(["Hacer", "Pensar", "Sentir", "Mirar"]),
      hebrewText: "עָשָׂה",
      order: 5,
    },
    {
      id: "ex-4-6",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Shama' (שָׁמַע)?",
      correctAnswer: "Escuchar/Oír",
      options: JSON.stringify(["Escuchar/Oír", "Hablar", "Cantar", "Gritar"]),
      hebrewText: "שָׁמַע",
      order: 6,
    },
    {
      id: "ex-4-7",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Raá' (רָאָה)?",
      correctAnswer: "Ver",
      options: JSON.stringify(["Ver", "Cerrar", "Tocar", "Oler"]),
      hebrewText: "רָאָה",
      order: 7,
    },
    {
      id: "ex-4-8",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Lacaj' (לָקַח)?",
      correctAnswer: "Tomar/Llevar",
      options: JSON.stringify(["Tomar/Llevar", "Dejar", "Traer", "Vender"]),
      hebrewText: "לָקַח",
      order: 8,
    },
    {
      id: "ex-4-9",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Natán' (נָתַן)?",
      correctAnswer: "Dar",
      options: JSON.stringify(["Dar", "Quitar", "Pedir", "Prestar"]),
      hebrewText: "נָתַן",
      order: 9,
    },
    {
      id: "ex-4-10",
      lessonId: "lesson-4",
      type: "translation",
      question: "¿Qué significa 'Shalaj' (שָׁלַח)?",
      correctAnswer: "Enviar",
      options: JSON.stringify(["Enviar", "Recibir", "Guardar", "Perder"]),
      hebrewText: "שָׁלַח",
      order: 10,
    },
  ]);

  // Lección 5
  await db.insert(lessons).values({
    id: "lesson-5",
    title: "La Familia",
    description: "Unidad 1: Nombres de parentesco en la Biblia.",
    order: 10,
    xpReward: 150,
  });

  await db.insert(exercises).values([
    {
      id: "ex-5-1",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Em' (אֵם)?",
      correctAnswer: "Madre",
      options: JSON.stringify(["Madre", "Padre", "Hermana", "Hija"]),
      hebrewText: "אֵם",
      order: 1,
    },
    {
      id: "ex-5-2",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Bat' (בַּת)?",
      correctAnswer: "Hija",
      options: JSON.stringify(["Hija", "Hijo", "Madre", "Padre"]),
      hebrewText: "בַּת",
      order: 2,
    },
    {
      id: "ex-5-3",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Aj' (אָח)?",
      correctAnswer: "Hermano",
      options: JSON.stringify(["Hermano", "Padre", "Amigo", "Siervo"]),
      hebrewText: "אָח",
      order: 3,
    },
    {
      id: "ex-5-4",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Ajot' (אָחוֹת)?",
      correctAnswer: "Hermana",
      options: JSON.stringify(["Hermana", "Madre", "Hija", "Esposa"]),
      hebrewText: "אָחוֹת",
      order: 4,
    },
    {
      id: "ex-5-5",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Ben' (בֵּן)?",
      correctAnswer: "Hijo",
      options: JSON.stringify(["Hijo", "Padre", "Abuelo", "Nieto"]),
      hebrewText: "בֵּן",
      order: 5,
    },
    {
      id: "ex-5-6",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Saba' (סָבָא)?",
      correctAnswer: "Abuelo",
      options: JSON.stringify(["Abuelo", "Tío", "Primo", "Sobrino"]),
      hebrewText: "סָבָא",
      order: 6,
    },
    {
      id: "ex-5-7",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Sa-tá' (סָבְתָא)?",
      correctAnswer: "Abuela",
      options: JSON.stringify(["Abuela", "Tía", "Prima", "Sobrina"]),
      hebrewText: "סָבְתָא",
      order: 7,
    },
    {
      id: "ex-5-8",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Dod' (דּוֹד)?",
      correctAnswer: "Tío/Amado",
      options: JSON.stringify(["Tío/Amado", "Amigo", "Enemigo", "Extraño"]),
      hebrewText: "דּוֹד",
      order: 8,
    },
    {
      id: "ex-5-9",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Ish' (אִישׁ)?",
      correctAnswer: "Esposo/Varón",
      options: JSON.stringify(["Esposo/Varón", "Niño", "Anciano", "Joven"]),
      hebrewText: "אִישׁ",
      order: 9,
    },
    {
      id: "ex-5-10",
      lessonId: "lesson-5",
      type: "translation",
      question: "¿Qué significa 'Ishá' (אִשָּׁה)?",
      correctAnswer: "Esposa/Mujer",
      options: JSON.stringify(["Esposa/Mujer", "Niña", "Anciana", "Joven"]),
      hebrewText: "אִשָּׁה",
      order: 10,
    },
  ]);

  // Lección 6
  await db.insert(lessons).values({
    id: "lesson-6",
    title: "El Santuario",
    description: "Unidad 1: Vocabulario sobre el Templo y el Tabernáculo.",
    order: 11,
    xpReward: 160,
  });

  await db.insert(exercises).values([
    {
      id: "ex-6-1",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Heijal' (הֵיכָל)?",
      correctAnswer: "Templo/Palacio",
      options: JSON.stringify(["Templo/Palacio", "Casa", "Tienda", "Ciudad"]),
      hebrewText: "הֵיכָל",
      order: 1,
    },
    {
      id: "ex-6-2",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Mizbeaj' (מִזְבֵּחַ)?",
      correctAnswer: "Altar",
      options: JSON.stringify(["Altar", "Mesa", "Silla", "Puerta"]),
      hebrewText: "מִזְבֵּחַ",
      order: 2,
    },
    {
      id: "ex-6-3",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Kojén' (כֹּהֵן)?",
      correctAnswer: "Sacerdote",
      options: JSON.stringify(["Sacerdote", "Rey", "Profeta", "Siervo"]),
      hebrewText: "כֹּהֵן",
      order: 3,
    },
    {
      id: "ex-6-4",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Kodesh' (קֹדֶשׁ)?",
      correctAnswer: "Santidad/Lugar Santo",
      options: JSON.stringify(["Santidad/Lugar Santo", "Pecado", "Oscuridad", "Mundo"]),
      hebrewText: "קֹדֶשׁ",
      order: 4,
    },
    {
      id: "ex-6-5",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Mishkán' (מִשְׁכָּן)?",
      correctAnswer: "Tabernáculo",
      options: JSON.stringify(["Tabernáculo", "Palacio", "Campo", "Montaña"]),
      hebrewText: "מִשְׁכָּן",
      order: 5,
    },
    {
      id: "ex-6-6",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Menorá' (מְנוֹרָה)?",
      correctAnswer: "Candelabro",
      options: JSON.stringify(["Candelabro", "Mesa", "Arca", "Altar"]),
      hebrewText: "מְנוֹרָה",
      order: 6,
    },
    {
      id: "ex-6-7",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Arón' (אָרוֹן)?",
      correctAnswer: "Arca/Cofre",
      options: JSON.stringify(["Arca/Cofre", "Cama", "Silla", "Vaso"]),
      hebrewText: "אָרוֹן",
      order: 7,
    },
    {
      id: "ex-6-8",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Ojel' (אֹהֶל)?",
      correctAnswer: "Tienda",
      options: JSON.stringify(["Tienda", "Casa", "Templo", "Muro"]),
      hebrewText: "אֹהֶל",
      order: 8,
    },
    {
      id: "ex-6-9",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Leví' (לֵוִי)?",
      correctAnswer: "Levita",
      options: JSON.stringify(["Levita", "Sacerdote", "Rey", "Soldado"]),
      hebrewText: "לֵוִי",
      order: 9,
    },
    {
      id: "ex-6-10",
      lessonId: "lesson-6",
      type: "translation",
      question: "¿Qué significa 'Zébaj' (זֶבַח)?",
      correctAnswer: "Sacrificio",
      options: JSON.stringify(["Sacrificio", "Oración", "Canto", "Ayuno"]),
      hebrewText: "זֶבַח",
      order: 10,
    },
  ]);

  // Lección 7
  await db.insert(lessons).values({
    id: "lesson-7",
    title: "Animales de la Biblia",
    description: "Unidad 1: Vocabulario sobre animales en el texto bíblico.",
    order: 12,
    xpReward: 170,
  });

  await db.insert(exercises).values([
    {
      id: "ex-7-1",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Keléb' (כֶּלֶB)?",
      correctAnswer: "Perro",
      options: JSON.stringify(["Perro", "Gato", "León", "Oveja"]),
      hebrewText: "כֶּלֶב",
      order: 1,
    },
    {
      id: "ex-7-2",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Aryé' (אַרְיֵה)?",
      correctAnswer: "León",
      options: JSON.stringify(["León", "Oso", "Lobo", "Águila"]),
      hebrewText: "אַרְיֵה",
      order: 2,
    },
    {
      id: "ex-7-3",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Joná' (יוֹנָה)?",
      correctAnswer: "Paloma",
      options: JSON.stringify(["Paloma", "Cuervo", "Gorrión", "Búho"]),
      hebrewText: "יוֹנָה",
      order: 3,
    },
    {
      id: "ex-7-4",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Sús' (סוּס)?",
      correctAnswer: "Caballo",
      options: JSON.stringify(["Caballo", "Burro", "Camello", "Vaca"]),
      hebrewText: "סוּס",
      order: 4,
    },
    {
      id: "ex-7-5",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Jamór' (חֲמוֹר)?",
      correctAnswer: "Burro",
      options: JSON.stringify(["Burro", "Caballo", "Oveja", "Cabra"]),
      hebrewText: "חֲמוֹר",
      order: 5,
    },
    {
      id: "ex-7-6",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Tson' (צאֹן)?",
      correctAnswer: "Rebaño/Ovejas",
      options: JSON.stringify(["Rebaño/Ovejas", "Manada", "Aves", "Peces"]),
      hebrewText: "צאֹן",
      order: 6,
    },
    {
      id: "ex-7-7",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Baqár' (בָּקָר)?",
      correctAnswer: "Ganado/Vacas",
      options: JSON.stringify(["Ganado/Vacas", "Caballos", "Perros", "Gatos"]),
      hebrewText: "בָּקָר",
      order: 7,
    },
    {
      id: "ex-7-8",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Gamál' (גָּמָל)?",
      correctAnswer: "Camello",
      options: JSON.stringify(["Camello", "Elefante", "Jirafa", "Cebra"]),
      hebrewText: "גָּמָל",
      order: 8,
    },
    {
      id: "ex-7-9",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Najásh' (נָחָשׁ)?",
      correctAnswer: "Serpiente",
      options: JSON.stringify(["Serpiente", "Lagarto", "Rana", "Pez"]),
      hebrewText: "נָחָשׁ",
      order: 9,
    },
    {
      id: "ex-7-10",
      lessonId: "lesson-7",
      type: "translation",
      question: "¿Qué significa 'Dág' (דָּג)?",
      correctAnswer: "Pez",
      options: JSON.stringify(["Pez", "Ballena", "Tiburón", "Delfín"]),
      hebrewText: "דָּג",
      order: 10,
    },
  ]);

  // Lección 8
  await db.insert(lessons).values({
    id: "lesson-8",
    title: "Naturaleza y Creación",
    description: "Unidad 1: Elementos del mundo creado.",
    order: 13,
    xpReward: 180,
  });

  await db.insert(exercises).values([
    {
      id: "ex-8-1",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Shama-yim' (שָׁמַיִם)?",
      correctAnswer: "Cielo",
      options: JSON.stringify(["Cielo", "Tierra", "Mar", "Sol"]),
      hebrewText: "שָׁמַיִם",
      order: 1,
    },
    {
      id: "ex-8-2",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Kokab' (כּוֹכָב)?",
      correctAnswer: "Estrella",
      options: JSON.stringify(["Estrella", "Luna", "Sol", "Nube"]),
      hebrewText: "כּוֹכָב",
      order: 2,
    },
    {
      id: "ex-8-3",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Ets' (עֵץ)?",
      correctAnswer: "Árbol",
      options: JSON.stringify(["Árbol", "Flor", "Hierba", "Fruto"]),
      hebrewText: "עֵץ",
      order: 3,
    },
    {
      id: "ex-8-4",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Shémesh' (שֶׁמֶשׁ)?",
      correctAnswer: "Sol",
      options: JSON.stringify(["Sol", "Luna", "Estrella", "Planeta"]),
      hebrewText: "שֶׁמֶשׁ",
      order: 4,
    },
    {
      id: "ex-8-5",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Yaréaj' (יָרֵחַ)?",
      correctAnswer: "Luna",
      options: JSON.stringify(["Luna", "Sol", "Estrella", "Cometa"]),
      hebrewText: "יָרֵחַ",
      order: 5,
    },
    {
      id: "ex-8-6",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Yám' (יָם)?",
      correctAnswer: "Mar",
      options: JSON.stringify(["Mar", "Río", "Lago", "Fuente"]),
      hebrewText: "יָם",
      order: 6,
    },
    {
      id: "ex-8-7",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Har' (הַר)?",
      correctAnswer: "Montaña",
      options: JSON.stringify(["Montaña", "Valle", "Llanura", "Desierto"]),
      hebrewText: "הַר",
      order: 7,
    },
    {
      id: "ex-8-8",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Ésh' (אֵשׁ)?",
      correctAnswer: "Fuego",
      options: JSON.stringify(["Fuego", "Agua", "Aire", "Tierra"]),
      hebrewText: "אֵשׁ",
      order: 8,
    },
    {
      id: "ex-8-9",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Afár' (עָפָר)?",
      correctAnswer: "Polvo",
      options: JSON.stringify(["Polvo", "Arena", "Piedra", "Lodo"]),
      hebrewText: "עָפָר",
      order: 9,
    },
    {
      id: "ex-8-10",
      lessonId: "lesson-8",
      type: "translation",
      question: "¿Qué significa 'Anán' (עָנָן)?",
      correctAnswer: "Nube",
      options: JSON.stringify(["Nube", "Lluvia", "Nieve", "Viento"]),
      hebrewText: "עָנָן",
      order: 10,
    },
  ]);

  // UNIT 2: Gramática y Vocabulario Extendido

  // Lección 9 (antes order 9, ahora order 13)
  await db.insert(lessons).values({
    id: "lesson-9",
    title: "Adjetivos Básicos",
    description: "Unidad 2: Describe cosas en hebreo.",
    order: 14,
    xpReward: 200,
  });

  await db.insert(exercises).values([
    {
      id: "ex-9-1",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Tob' (טוֹב)?",
      correctAnswer: "Bueno",
      options: JSON.stringify(["Bueno", "Malo", "Grande", "Pequeño"]),
      hebrewText: "טוֹב",
      order: 1,
    },
    {
      id: "ex-9-2",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Ra' (רַע)?",
      correctAnswer: "Malo",
      options: JSON.stringify(["Bueno", "Malo", "Santo", "Fuerte"]),
      hebrewText: "רַע",
      order: 2,
    },
    {
      id: "ex-9-3",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Gadol' (גָּדוֹל)?",
      correctAnswer: "Grande",
      options: JSON.stringify(["Grande", "Pequeño", "Largo", "Corto"]),
      hebrewText: "גָּדוֹל",
      order: 3,
    },
    {
      id: "ex-9-4",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Katán' (קָטָן)?",
      correctAnswer: "Pequeño",
      options: JSON.stringify(["Pequeño", "Grande", "Ancho", "Estrecho"]),
      hebrewText: "קָטָן",
      order: 4,
    },
    {
      id: "ex-9-5",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Yafé' (יָפֶה)?",
      correctAnswer: "Hermoso/Bello",
      options: JSON.stringify(["Hermoso/Bello", "Feo", "Sucio", "Limpio"]),
      hebrewText: "יָפֶה",
      order: 5,
    },
    {
      id: "ex-9-6",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Jajám' (חָכָם)?",
      correctAnswer: "Sabio",
      options: JSON.stringify(["Sabio", "Necio", "Fuerte", "Débil"]),
      hebrewText: "חָכָם",
      order: 6,
    },
    {
      id: "ex-9-7",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Jazáq' (חָזָק)?",
      correctAnswer: "Fuerte",
      options: JSON.stringify(["Fuerte", "Débil", "Rápido", "Lento"]),
      hebrewText: "חָזָק",
      order: 7,
    },
    {
      id: "ex-9-8",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Ram' (רָם)?",
      correctAnswer: "Alto/Exaltado",
      options: JSON.stringify(["Alto/Exaltado", "Bajo", "Profundo", "Plano"]),
      hebrewText: "רָם",
      order: 8,
    },
    {
      id: "ex-9-9",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Baruk' (בָּרוּךְ)?",
      correctAnswer: "Bendito",
      options: JSON.stringify(["Bendito", "Maldito", "Triste", "Alegre"]),
      hebrewText: "בָּרוּךְ",
      order: 9,
    },
    {
      id: "ex-9-10",
      lessonId: "lesson-9",
      type: "translation",
      question: "¿Qué significa 'Yashár' (יָשָׁר)?",
      correctAnswer: "Recto/Justo",
      options: JSON.stringify(["Recto/Justo", "Torcido", "Inicuo", "Falso"]),
      hebrewText: "יָשָׁר",
      order: 10,
    },
  ]);

  // Lección 10 (antes order 10, ahora order 14)
  await db.insert(lessons).values({
    id: "lesson-10",
    title: "Verbos de Movimiento",
    description: "Unidad 2: Acciones de desplazamiento.",
    order: 15,
    xpReward: 220,
  });

  await db.insert(exercises).values([
    {
      id: "ex-10-1",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Bo' (בּוֹא)?",
      correctAnswer: "Venir/Entrar",
      options: JSON.stringify(["Venir/Entrar", "Salir", "Subir", "Bajar"]),
      hebrewText: "בּוֹא",
      order: 1,
    },
    {
      id: "ex-10-2",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Yatsá' (יָצָא)?",
      correctAnswer: "Salir",
      options: JSON.stringify(["Salir", "Entrar", "Subir", "Bajar"]),
      hebrewText: "יָצָא",
      order: 2,
    },
    {
      id: "ex-10-3",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Alá' (עָלָה)?",
      correctAnswer: "Subir",
      options: JSON.stringify(["Subir", "Bajar", "Correr", "Saltar"]),
      hebrewText: "עָלָה",
      order: 3,
    },
    {
      id: "ex-10-4",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Yarád' (יָרַד)?",
      correctAnswer: "Bajar/Descender",
      options: JSON.stringify(["Bajar/Descender", "Subir", "Quedarse", "Volver"]),
      hebrewText: "יָרַד",
      order: 4,
    },
    {
      id: "ex-10-5",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Shúb' (שׁוּב)?",
      correctAnswer: "Volver/Regresar",
      options: JSON.stringify(["Volver/Regresar", "Irse", "Perderse", "Olvidar"]),
      hebrewText: "שׁוּב",
      order: 5,
    },
    {
      id: "ex-10-6",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Qúm' (קוּם)?",
      correctAnswer: "Levantarse",
      options: JSON.stringify(["Levantarse", "Acostarse", "Sentarse", "Caer"]),
      hebrewText: "קוּם",
      order: 6,
    },
    {
      id: "ex-10-7",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Yasháb' (יָשַׁב)?",
      correctAnswer: "Sentarse/Habitar",
      options: JSON.stringify(["Sentarse/Habitar", "Correr", "Volar", "Nadar"]),
      hebrewText: "יָשַׁב",
      order: 7,
    },
    {
      id: "ex-10-8",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Abád' (עָבַר)?",
      correctAnswer: "Pasar/Cruzar",
      options: JSON.stringify(["Pasar/Cruzar", "Parar", "Retroceder", "Girar"]),
      hebrewText: "עָבַר",
      order: 8,
    },
    {
      id: "ex-10-9",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Nafál' (נָפַל)?",
      correctAnswer: "Caer",
      options: JSON.stringify(["Caer", "Levantarse", "Sostenerse", "Equilibrarse"]),
      hebrewText: "נָפַל",
      order: 9,
    },
    {
      id: "ex-10-10",
      lessonId: "lesson-10",
      type: "translation",
      question: "¿Qué significa 'Radáf' (רָדַף)?",
      correctAnswer: "Perseguir",
      options: JSON.stringify(["Perseguir", "Huir", "Esconderse", "Esperar"]),
      hebrewText: "רָדַף",
      order: 10,
    },
  ]);

  // Lección 11 (antes order 11, ahora order 15)
  await db.insert(lessons).values({
    id: "lesson-11",
    title: "Números 1-10",
    description: "Unidad 2: Aprende a contar en hebreo.",
    order: 16,
    xpReward: 230,
  });

  await db.insert(exercises).values([
    {
      id: "ex-11-1",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Uno'?",
      correctAnswer: "Ejád",
      options: JSON.stringify(["Ejád", "Shna-yim", "Shlosha", "Arba'a"]),
      hebrewText: "אֶחָד",
      order: 1,
    },
    {
      id: "ex-11-2",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Dos'?",
      correctAnswer: "Shna-yim",
      options: JSON.stringify(["Ejád", "Shna-yim", "Shlosha", "Arba'a"]),
      hebrewText: "שְׁנַיִם",
      order: 2,
    },
    {
      id: "ex-11-3",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Tres'?",
      correctAnswer: "Shlosha",
      options: JSON.stringify(["Shlosha", "Jamesh", "Sheba", "Eser"]),
      hebrewText: "שְׁלֹשָׁה",
      order: 3,
    },
    {
      id: "ex-11-4",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Cuatro'?",
      correctAnswer: "Arba'a",
      options: JSON.stringify(["Arba'a", "Shesh", "Shmona", "Tesha"]),
      hebrewText: "אַרְבָּעָה",
      order: 4,
    },
    {
      id: "ex-11-5",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Cinco'?",
      correctAnswer: "Jamesh",
      options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Eser"]),
      hebrewText: "חָמֵשׁ",
      order: 5,
    },
    {
      id: "ex-11-6",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Seis'?",
      correctAnswer: "Shesh",
      options: JSON.stringify(["Shesh", "Sheba", "Shmona", "Tesha"]),
      hebrewText: "שֵׁשׁ",
      order: 6,
    },
    {
      id: "ex-11-7",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Siete'?",
      correctAnswer: "Sheba",
      options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Shmona"]),
      hebrewText: "שֶׁBַע",
      order: 7,
    },
    {
      id: "ex-11-8",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Ocho'?",
      correctAnswer: "Shmona",
      options: JSON.stringify(["Shmona", "Tesha", "Eser", "Ejád"]),
      hebrewText: "שְׁמֹנָה",
      order: 8,
    },
    {
      id: "ex-11-9",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Nueve'?",
      correctAnswer: "Tesha",
      options: JSON.stringify(["Tesha", "Eser", "Ejád", "Shna-yim"]),
      hebrewText: "תֵּשַׁע",
      order: 9,
    },
    {
      id: "ex-11-10",
      lessonId: "lesson-11",
      type: "translation",
      question: "¿Cómo se dice 'Diez'?",
      correctAnswer: "Eser",
      options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Eser"]),
      hebrewText: "עֶשֶׂר",
      order: 10,
    },
  ]);

  // Lección 12 (antes order 12, ahora order 16)
  await db.insert(lessons).values({
    id: "lesson-12",
    title: "Partes del Cuerpo",
    description: "Unidad 2: Vocabulario anatómico en la Biblia.",
    order: 17,
    xpReward: 240,
  });

  await db.insert(exercises).values([
    {
      id: "ex-12-1",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Rosh' (רֹאשׁ)?",
      correctAnswer: "Cabeza",
      options: JSON.stringify(["Cabeza", "Mano", "Pie", "Corazón"]),
      hebrewText: "רֹאשׁ",
      order: 1,
    },
    {
      id: "ex-12-2",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Yad' (יָד)?",
      correctAnswer: "Mano",
      options: JSON.stringify(["Mano", "Brazo", "Dedo", "Uña"]),
      hebrewText: "יָד",
      order: 2,
    },
    {
      id: "ex-12-3",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Réguel' (רֶגֶל)?",
      correctAnswer: "Pie",
      options: JSON.stringify(["Pie", "Cabeza", "Ojo", "Boca"]),
      hebrewText: "רֶגֶל",
      order: 3,
    },
    {
      id: "ex-12-4",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Ayin' (עַיִן)?",
      correctAnswer: "Ojo/Fuente",
      options: JSON.stringify(["Ojo/Fuente", "Oído", "Nariz", "Diente"]),
      hebrewText: "עַיִן",
      order: 4,
    },
    {
      id: "ex-12-5",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Pé' (פֶּה)?",
      correctAnswer: "Boca",
      options: JSON.stringify(["Boca", "Lengua", "Labio", "Garganta"]),
      hebrewText: "פֶּה",
      order: 5,
    },
    {
      id: "ex-12-6",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Ozen' (אֹזֶן)?",
      correctAnswer: "Oído/Oreja",
      options: JSON.stringify(["Oído/Oreja", "Mano", "Pie", "Ojo"]),
      hebrewText: "אֹזֶן",
      order: 6,
    },
    {
      id: "ex-12-7",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Léb' (לֵב)?",
      correctAnswer: "Corazón",
      options: JSON.stringify(["Corazón", "Alma", "Mente", "Hígado"]),
      hebrewText: "לֵב",
      order: 7,
    },
    {
      id: "ex-12-8",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Paním' (פָּנִים)?",
      correctAnswer: "Rostro/Cara",
      options: JSON.stringify(["Rostro/Cara", "Espalda", "Hombro", "Pecho"]),
      hebrewText: "פָּנִים",
      order: 8,
    },
    {
      id: "ex-12-9",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Basár' (בָּשָׂר)?",
      correctAnswer: "Carne/Cuerpo",
      options: JSON.stringify(["Carne/Cuerpo", "Hueso", "Sangre", "Piel"]),
      hebrewText: "בָּשָׂר",
      order: 9,
    },
    {
      id: "ex-12-10",
      lessonId: "lesson-12",
      type: "translation",
      question: "¿Qué significa 'Dam' (דָּם)?",
      correctAnswer: "Sangre",
      options: JSON.stringify(["Sangre", "Agua", "Vino", "Aceite"]),
      hebrewText: "דָּם",
      order: 10,
    },
  ]);

  // Lección 13 (antes order 13, ahora order 17)
  await db.insert(lessons).values({
    id: "lesson-13",
    title: "El Tiempo y las Estaciones",
    description: "Unidad 2: Conceptos temporales.",
    order: 18,
    xpReward: 250,
  });

  await db.insert(exercises).values([
    {
      id: "ex-13-1",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Et' (עֵת)?",
      correctAnswer: "Tiempo/Sazón",
      options: JSON.stringify(["Tiempo/Sazón", "Hora", "Minuto", "Segundo"]),
      hebrewText: "עֵת",
      order: 1,
    },
    {
      id: "ex-13-2",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Qáyits' (קַיִץ)?",
      correctAnswer: "Verano",
      options: JSON.stringify(["Verano", "Invierno", "Otoño", "Primavera"]),
      hebrewText: "קַיִץ",
      order: 2,
    },
    {
      id: "ex-13-3",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Jóref' (חֹרֶף)?",
      correctAnswer: "Invierno",
      options: JSON.stringify(["Invierno", "Verano", "Primavera", "Otoño"]),
      hebrewText: "חֹרֶף",
      order: 3,
    },
    {
      id: "ex-13-4",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Abíb' (אָבִיב)?",
      correctAnswer: "Primavera/Espiga",
      options: JSON.stringify(["Primavera/Espiga", "Otoño", "Verano", "Invierno"]),
      hebrewText: "אָבִיב",
      order: 4,
    },
    {
      id: "ex-13-5",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Shaná' (שָׁנָה)?",
      correctAnswer: "Año",
      options: JSON.stringify(["Año", "Mes", "Semana", "Día"]),
      hebrewText: "שָׁנָה",
      order: 5,
    },
    {
      id: "ex-13-6",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Jódesh' (חֹדֶשׁ)?",
      correctAnswer: "Mes/Luna Nueva",
      options: JSON.stringify(["Mes/Luna Nueva", "Año", "Semana", "Día"]),
      hebrewText: "חֹדֶשׁ",
      order: 6,
    },
    {
      id: "ex-13-7",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Shabúa' (שָׁבוּעַ)?",
      correctAnswer: "Semana",
      options: JSON.stringify(["Semana", "Mes", "Año", "Siglo"]),
      hebrewText: "שָׁבוּעַ",
      order: 7,
    },
    {
      id: "ex-13-8",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Sha'á' (שָׁעָה)?",
      correctAnswer: "Hora",
      options: JSON.stringify(["Hora", "Minuto", "Segundo", "Momento"]),
      hebrewText: "שָׁעָה",
      order: 8,
    },
    {
      id: "ex-13-9",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Olam' (עוֹלָם)?",
      correctAnswer: "Eternidad/Mundo",
      options: JSON.stringify(["Eternidad/Mundo", "Tiempo", "Lugar", "Gente"]),
      hebrewText: "עוֹלָם",
      order: 9,
    },
    {
      id: "ex-13-10",
      lessonId: "lesson-13",
      type: "translation",
      question: "¿Qué significa 'Ma-jar' (מָחָר)?",
      correctAnswer: "Mañana (Futuro)",
      options: JSON.stringify(["Mañana (Futuro)", "Hoy", "Ayer", "Pronto"]),
      hebrewText: "מָחָר",
      order: 10,
    },
  ]);

  // UNIT 3: Gramática Intermedia y Vida Cotidiana

  // Lección 14 (antes order 14, ahora order 18)
  await db.insert(lessons).values({
    id: "lesson-14",
    title: "Pronombres Personales",
    description: "Unidad 3: Aprende a referirte a las personas.",
    order: 19,
    xpReward: 260,
  });

  await db.insert(exercises).values([
    {
      id: "ex-14-1",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Aní' (אֲנִי)?",
      correctAnswer: "Yo",
      options: JSON.stringify(["Yo", "Tú", "Él", "Nosotros"]),
      hebrewText: "אֲנִי",
      order: 1,
    },
    {
      id: "ex-14-2",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Atá' (אַתָּה)?",
      correctAnswer: "Tú (Masculino)",
      options: JSON.stringify(["Tú (Masculino)", "Yo", "Él", "Ustedes"]),
      hebrewText: "אַתָּה",
      order: 2,
    },
    {
      id: "ex-14-3",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'At' (אַתְּ)?",
      correctAnswer: "Tú (Femenino)",
      options: JSON.stringify(["Tú (Femenino)", "Yo", "Ella", "Ustedes"]),
      hebrewText: "אַתְּ",
      order: 3,
    },
    {
      id: "ex-14-4",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Hu' (הוּא)?",
      correctAnswer: "Él",
      options: JSON.stringify(["Él", "Ella", "Ellos", "Yo"]),
      hebrewText: "הוּא",
      order: 4,
    },
    {
      id: "ex-14-5",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Hi' (הִיא)?",
      correctAnswer: "Ella",
      options: JSON.stringify(["Ella", "Él", "Ellas", "Tú"]),
      hebrewText: "הִיא",
      order: 5,
    },
    {
      id: "ex-14-6",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Anajnu' (אֲנַחְנוּ)?",
      correctAnswer: "Nosotros",
      options: JSON.stringify(["Nosotros", "Ustedes", "Ellos", "Yo"]),
      hebrewText: "אֲנַחְנוּ",
      order: 6,
    },
    {
      id: "ex-14-7",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Atém' (אַתֶּם)?",
      correctAnswer: "Ustedes (Masculino)",
      options: JSON.stringify(["Ustedes (Masculino)", "Nosotros", "Ellos", "Tú"]),
      hebrewText: "אַתֶּם",
      order: 7,
    },
    {
      id: "ex-14-8",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Atén' (אַתֶּן)?",
      correctAnswer: "Ustedes (Femenino)",
      options: JSON.stringify(["Ustedes (Femenino)", "Nosotros", "Ellas", "Tú"]),
      hebrewText: "אַתֶּן",
      order: 8,
    },
    {
      id: "ex-14-9",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Hem' (הֵם)?",
      correctAnswer: "Ellos",
      options: JSON.stringify(["Ellos", "Nosotros", "Ustedes", "Él"]),
      hebrewText: "הֵם",
      order: 9,
    },
    {
      id: "ex-14-10",
      lessonId: "lesson-14",
      type: "translation",
      question: "¿Qué significa 'Hen' (הֵן)?",
      correctAnswer: "Ellas",
      options: JSON.stringify(["Ellas", "Nosotros", "Ustedes", "Ella"]),
      hebrewText: "הֵן",
      order: 10,
    },
  ]);

  // Lección 15 (antes order 15, ahora order 19)
  await db.insert(lessons).values({
    id: "lesson-15",
    title: "Preposiciones Básicas",
    description: "Unidad 3: Conecta palabras con preposiciones.",
    order: 20,
    xpReward: 270,
  });

  await db.insert(exercises).values([
    {
      id: "ex-15-1",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Im' (עִם)?",
      correctAnswer: "Con",
      options: JSON.stringify(["Con", "Sin", "Para", "En"]),
      hebrewText: "עִם",
      order: 1,
    },
    {
      id: "ex-15-2",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Le' (לְ)?",
      correctAnswer: "Para/A",
      options: JSON.stringify(["Para/A", "De", "En", "Con"]),
      hebrewText: "[לְ:p]",
      order: 2,
    },
    {
      id: "ex-15-3",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Be' (בְּ)?",
      correctAnswer: "En",
      options: JSON.stringify(["En", "Por", "Sobre", "Hacia"]),
      hebrewText: "[בְּ:p]",
      order: 3,
    },
    {
      id: "ex-15-4",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Min' (מִן)?",
      correctAnswer: "De/Desde",
      options: JSON.stringify(["De/Desde", "Hasta", "Para", "Con"]),
      hebrewText: "[מִן:p]",
      order: 4,
    },
    {
      id: "ex-15-5",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Al' (עַל)?",
      correctAnswer: "Sobre/Acerca de",
      options: JSON.stringify(["Sobre/Acerca de", "Bajo", "Dentro", "Fuera"]),
      hebrewText: "[עַל:p]",
      order: 5,
    },
    {
      id: "ex-15-6",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Ke' (כְּ)?",
      correctAnswer: "Como/Según",
      options: JSON.stringify(["Como/Según", "Más", "Menos", "Tan"]),
      hebrewText: "כְּ",
      order: 6,
    },
    {
      id: "ex-15-7",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Lifné' (לִפְנֵי)?",
      correctAnswer: "Antes/Delante de",
      options: JSON.stringify(["Antes/Delante de", "Después", "Detrás", "Encima"]),
      hebrewText: "לִפְנֵי",
      order: 7,
    },
    {
      id: "ex-15-8",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Ajarei' (אַחֲרֵי)?",
      correctAnswer: "Después/Detrás de",
      options: JSON.stringify(["Después/Detrás de", "Antes", "Al lado", "Bajo"]),
      hebrewText: "אַחֲרֵי",
      order: 8,
    },
    {
      id: "ex-15-9",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Ad' (עַד)?",
      correctAnswer: "Hasta",
      options: JSON.stringify(["Hasta", "Desde", "Para", "Por"]),
      hebrewText: "עַד",
      order: 9,
    },
    {
      id: "ex-15-10",
      lessonId: "lesson-15",
      type: "translation",
      question: "¿Qué significa 'Et' (אֵת)?",
      correctAnswer: "Marcador de objeto directo",
      options: JSON.stringify(["Marcador de objeto directo", "Y", "O", "Pero"]),
      hebrewText: "אֵת",
      order: 10,
    },
  ]);

  // Lección 16 (antes order 16, ahora order 20)
  await db.insert(lessons).values({
    id: "lesson-16",
    title: "La Ciudad y la Casa",
    description: "Unidad 3: Vocabulario de lugares y objetos cotidianos.",
    order: 21,
    xpReward: 280,
  });

  await db.insert(exercises).values([
    {
      id: "ex-16-1",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Ir' (עִיר)?",
      correctAnswer: "Ciudad",
      options: JSON.stringify(["Ciudad", "Pueblo", "Campo", "Casa"]),
      hebrewText: "עִיר",
      order: 1,
    },
    {
      id: "ex-16-2",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Sháar' (שַׁעַר)?",
      correctAnswer: "Puerta/Portón",
      options: JSON.stringify(["Puerta/Portón", "Muro", "Torre", "Plaza"]),
      hebrewText: "שַׁעַר",
      order: 2,
    },
    {
      id: "ex-16-3",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Jomá' (חוֹמָה)?",
      correctAnswer: "Muralla/Muro",
      options: JSON.stringify(["Muralla/Muro", "Puerta", "Calle", "Casa"]),
      hebrewText: "חוֹמָה",
      order: 3,
    },
    {
      id: "ex-16-4",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Juts' (חוּץ)?",
      correctAnswer: "Afuera/Calle",
      options: JSON.stringify(["Afuera/Calle", "Adentro", "Arriba", "Abajo"]),
      hebrewText: "חוּץ",
      order: 4,
    },
    {
      id: "ex-16-5",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Shulján' (שֻׁלְחָן)?",
      correctAnswer: "Mesa",
      options: JSON.stringify(["Mesa", "Silla", "Cama", "Lámpara"]),
      hebrewText: "שֻׁלְחָן",
      order: 5,
    },
    {
      id: "ex-16-6",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Kisé' (כִּסֵּא)?",
      correctAnswer: "Silla/Trono",
      options: JSON.stringify(["Silla/Trono", "Mesa", "Altar", "Arca"]),
      hebrewText: "כִּסֵּא",
      order: 6,
    },
    {
      id: "ex-16-7",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Léjem' (לֶחֶם)?",
      correctAnswer: "Pan/Comida",
      options: JSON.stringify(["Pan/Comida", "Agua", "Vino", "Carne"]),
      hebrewText: "לֶחֶם",
      order: 7,
    },
    {
      id: "ex-16-8",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Yáyin' (יַיִן)?",
      correctAnswer: "Vino",
      options: JSON.stringify(["Vino", "Agua", "Leche", "Aceite"]),
      hebrewText: "יַיִן",
      order: 8,
    },
    {
      id: "ex-16-9",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Shémen' (שֶׁמֶן)?",
      correctAnswer: "Aceite",
      options: JSON.stringify(["Aceite", "Miel", "Sal", "Harina"]),
      hebrewText: "שֶׁמֶן",
      order: 9,
    },
    {
      id: "ex-16-10",
      lessonId: "lesson-16",
      type: "translation",
      question: "¿Qué significa 'Beged' (בֶּגֶד)?",
      correctAnswer: "Ropa/Vestido",
      options: JSON.stringify(["Ropa/Vestido", "Calzado", "Manto", "Cinturón"]),
      hebrewText: "בֶּגֶד",
      order: 10,
    },
  ]);

  // Lección 17 (antes order 17, ahora order 21)
  await db.insert(lessons).values({
    id: "lesson-17",
    title: "Verbos de Comunicación",
    description: "Unidad 3: Expresa ideas y responde.",
    order: 22,
    xpReward: 290,
  });

  await db.insert(exercises).values([
    {
      id: "ex-17-1",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Qará' (קָרָא)?",
      correctAnswer: "Llamar/Leer",
      options: JSON.stringify(["Llamar/Leer", "Escribir", "Escuchar", "Hablar"]),
      hebrewText: "קָרָא",
      order: 1,
    },
    {
      id: "ex-17-2",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Katáb' (כָּתַב)?",
      correctAnswer: "Escribir",
      options: JSON.stringify(["Escribir", "Leer", "Borrar", "Dibujar"]),
      hebrewText: "כָּתַב",
      order: 2,
    },
    {
      id: "ex-17-3",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Aná' (עָנָה)?",
      correctAnswer: "Responder",
      options: JSON.stringify(["Responder", "Preguntar", "Gritar", "Callar"]),
      hebrewText: "עָנָה",
      order: 3,
    },
    {
      id: "ex-17-4",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Sifér' (סִפֵּר)?",
      correctAnswer: "Contar/Relatar",
      options: JSON.stringify(["Contar/Relatar", "Cantar", "Bailar", "Llorar"]),
      hebrewText: "סִפֵּר",
      order: 4,
    },
    {
      id: "ex-17-5",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Shal' (שָׁאַל)?",
      correctAnswer: "Preguntar/Pedir",
      options: JSON.stringify(["Preguntar/Pedir", "Dar", "Quitar", "Buscar"]),
      hebrewText: "שָׁאַל",
      order: 5,
    },
    {
      id: "ex-17-6",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Yadá' (יָדַע)?",
      correctAnswer: "Saber/Conocer",
      options: JSON.stringify(["Saber/Conocer", "Olvidar", "Ignorar", "Dudar"]),
      hebrewText: "יָדַע",
      order: 6,
    },
    {
      id: "ex-17-7",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Zajár' (זָכַר)?",
      correctAnswer: "Recordar",
      options: JSON.stringify(["Recordar", "Olvidar", "Perdonar", "Juzgar"]),
      hebrewText: "זָכַר",
      order: 7,
    },
    {
      id: "ex-17-8",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Shajáj' (שָׁכַח)?",
      correctAnswer: "Olvidar",
      options: JSON.stringify(["Olvidar", "Recordar", "Aprender", "Enseñar"]),
      hebrewText: "שָׁכַח",
      order: 8,
    },
    {
      id: "ex-17-9",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Liméd' (לִמֵּד)?",
      correctAnswer: "Enseñar",
      options: JSON.stringify(["Enseñar", "Aprender", "Estudiar", "Jugar"]),
      hebrewText: "לִמֵּד",
      order: 9,
    },
    {
      id: "ex-17-10",
      lessonId: "lesson-17",
      type: "translation",
      question: "¿Qué significa 'Lamád' (לָמַד)?",
      correctAnswer: "Aprender",
      options: JSON.stringify(["Aprender", "Enseñar", "Trabajar", "Descansar"]),
      hebrewText: "לָמַד",
      order: 10,
    },
  ]);

  // Lección 18 (antes order 18, ahora order 22)
  await db.insert(lessons).values({
    id: "lesson-18",
    title: "El Estado Constructo",
    description: "Unidad 3: Relaciona sustantivos (el 'de' posesivo).",
    order: 23,
    xpReward: 300,
  });

  await db.insert(exercises).values([
    {
      id: "ex-18-1",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Ben-Melek' (בֶּן-מֶלֶךְ)?",
      correctAnswer: "Hijo de rey",
      options: JSON.stringify(["Hijo de rey", "Hijo del rey", "Rey del hijo", "Padre del rey"]),
      hebrewText: "בֶּן-מֶלֶךְ",
      order: 1,
    },
    {
      id: "ex-18-2",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Bet-Elohim' (בֵּית-אֱלֹהִים)?",
      correctAnswer: "Casa de Dios",
      options: JSON.stringify([
        "Casa de Dios",
        "Hijo de Dios",
        "Pueblo de Dios",
        "Palabra de Dios",
      ]),
      hebrewText: "בֵּית-אֱלֹהִים",
      order: 2,
    },
    {
      id: "ex-18-3",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Debár-Adonai' (דְּבַר-יְהוָה)?",
      correctAnswer: "Palabra del Señor",
      options: JSON.stringify([
        "Palabra del Señor",
        "Ley del Señor",
        "Casa del Señor",
        "Camino del Señor",
      ]),
      hebrewText: "דְּבַר-יְהוָה",
      order: 3,
    },
    {
      id: "ex-18-4",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Eretz-Yisrael' (אֶרֶץ-יִשְׂרָאֵל)?",
      correctAnswer: "Tierra de Israel",
      options: JSON.stringify([
        "Tierra de Israel",
        "Pueblo de Israel",
        "Rey de Israel",
        "Dios de Israel",
      ]),
      hebrewText: "אֶרֶץ-יִשְׂרָאֵל",
      order: 4,
    },
    {
      id: "ex-18-5",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Sifré-Kodesh' (סִפְרֵי-קֹדֶשׁ)?",
      correctAnswer: "Libros sagrados (de santidad)",
      options: JSON.stringify([
        "Libros sagrados (de santidad)",
        "Palabras sagradas",
        "Hombres sagrados",
        "Lugares sagrados",
      ]),
      hebrewText: "סִפְרֵי-קֹדֶשׁ",
      order: 5,
    },
    {
      id: "ex-18-6",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Melek-Shalom' (מֶלֶךְ-שָׁלוֹם)?",
      correctAnswer: "Rey de paz",
      options: JSON.stringify(["Rey de paz", "Rey de justicia", "Rey de gloria", "Rey de reyes"]),
      hebrewText: "מֶלֶךְ-שָׁלוֹם",
      order: 6,
    },
    {
      id: "ex-18-7",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Bat-Tziyón' (בַּת-צִיּוֹן)?",
      correctAnswer: "Hija de Sión",
      options: JSON.stringify([
        "Hija de Sión",
        "Madre de Sión",
        "Hermana de Sión",
        "Reina de Sión",
      ]),
      hebrewText: "בַּת-צִיּוֹן",
      order: 7,
    },
    {
      id: "ex-18-8",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Anshé-ha-Ir' (אַנְשֵׁי-הָעִיר)?",
      correctAnswer: "Hombres de la ciudad",
      options: JSON.stringify([
        "Hombres de la ciudad",
        "Mujeres de la ciudad",
        "Niños de la ciudad",
        "Reyes de la ciudad",
      ]),
      hebrewText: "אַנְשֵׁי-הָעִיר",
      order: 8,
    },
    {
      id: "ex-18-9",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Torát-Moshe' (תּוֹרַת-מֹשֶׁה)?",
      correctAnswer: "Ley de Moisés",
      options: JSON.stringify([
        "Ley de Moisés",
        "Libro de Moisés",
        "Palabra de Moisés",
        "Casa de Moisés",
      ]),
      hebrewText: "תּוֹרַת-מֹשֶׁה",
      order: 9,
    },
    {
      id: "ex-18-10",
      lessonId: "lesson-18",
      type: "translation",
      question: "¿Qué significa 'Elohé-Yisrael' (אֱלֹהֵי-יִשְׂרָאֵל)?",
      correctAnswer: "Dios de Israel",
      options: JSON.stringify([
        "Dios de Israel",
        "Rey de Israel",
        "Santo de Israel",
        "Fuerte de Israel",
      ]),
      hebrewText: "אֱלֹהֵי-יִשְׂרָאֵל",
      order: 10,
    },
  ]);

  // --- Práctica por Frecuencia Bíblica ---
  console.log("📈 Creando Listas de Frecuencia Bíblica...");
  
  await db.insert(lessons).values([
    {
      id: "freq-2200-5000",
      title: "Frecuencia 2200-5000",
      description: "Palabras que aparecen entre 2200 y 5000 veces en el Tanaj.",
      order: 900,
      xpReward: 0,
    },
    {
      id: "freq-1000-2199",
      title: "Frecuencia 1000-2199",
      description: "Palabras que aparecen entre 1000 y 2199 veces en el Tanaj.",
      order: 901,
      xpReward: 0,
    }
  ]);

  const freq1_vocab = [
    { h: "אֶל", s: "hacia", o: ["hacia", "sobre", "con", "en"] },
    { h: "אֱלֹהִים", s: "Dios", o: ["Dios", "Señor", "Rey", "Hombre"] },
    { h: "אָמַר", s: "decir", o: ["decir", "hacer", "ir", "escuchar"] },
    { h: "אֶרֶץ", s: "tierra", o: ["tierra", "cielo", "ciudad", "casa"] },
    { h: "אֲשֶׁר", s: "que, el cual", o: ["que, el cual", "como", "porque", "no"] },
    { h: "אֵת", s: "señal de acusativo", o: ["señal de acusativo", "con", "hacia", "sobre"] },
    { h: "אֵת", s: "con", o: ["con", "hacia", "en", "como"] },
    { h: "בְּ", s: "en", o: ["en", "con", "hacia", "sobre"] },
    { h: "בּוֹא", s: "venir, entrar", o: ["venir, entrar", "salir", "ir", "volver"] },
    { h: "בֵּן", s: "hijo", o: ["hijo", "padre", "hermano", "rey"] },
    { h: "הַ", s: "el, la", o: ["el, la", "un, una", "este, esta", "y, también"] },
    { h: "הֲ", s: "partícula interrogativa", o: ["partícula interrogativa", "el, la", "que, el cual", "no"] },
    { h: "הָיָה", s: "ser, estar", o: ["ser, estar", "hacer", "decir", "ir"] },
    { h: "וְ", s: "y, también", o: ["y, también", "en", "como", "no"] },
    { h: "יְהוָה", s: "el Señor", o: ["el Señor", "Dios", "rey", "profeta"] },
    { h: "יוֹם", s: "día", o: ["día", "noche", "año", "tierra"] },
    { h: "יִשְׂרָאֵל", s: "Israel", o: ["Israel", "Judá", "Jerusalén", "Egipto"] },
    { h: "כְּ", s: "como", o: ["como", "en", "y", "no"] },
    { h: "כִּי", s: "porque, cuando", o: ["porque, cuando", "como", "no", "el cual"] },
    { h: "כֹּל", s: "todo, cada", o: ["todo, cada", "nada", "alguno", "mucho"] },
    { h: "לְ", s: "a, para", o: ["a, para", "en", "con", "como"] },
    { h: "לֹא", s: "no", o: ["no", "sí", "y", "porque"] },
    { h: "מֶלֶךְ", s: "rey", o: ["rey", "siervo", "sacerdote", "profeta"] },
    { h: "עַל", s: "sobre, contra", o: ["sobre, contra", "en", "hacia", "con"] },
    { h: "עָשָׂה", s: "hacer", o: ["hacer", "decir", "ir", "ser"] },
  ];

  const freq2_vocab = [
    { h: "אָב", s: "padre", o: ["padre", "hijo", "hermano", "madre"] },
    { h: "אִישׁ", s: "hombre, marido", o: ["hombre, marido", "mujer", "niño", "rey"] },
    { h: "אִם", s: "si, cuando", o: ["si, cuando", "porque", "no", "y"] },
    { h: "אֲנִי", s: "yo", o: ["yo", "tú", "él", "nosotros"] },
    { h: "בַּיִת", s: "casa", o: ["casa", "ciudad", "tierra", "templo"] },
    { h: "דָּבָר", s: "palabra, cosa", o: ["palabra, cosa", "voz", "libro", "ley"] },
    { h: "דָּבַר", s: "hablar", o: ["hablar", "decir", "escuchar", "ver"] },
    { h: "דָּוִד", s: "David", o: ["David", "Moisés", "Salomón", "Samuel"] },
    { h: "הוּא", s: "él", o: ["él", "ella", "yo", "tú"] },
    { h: "הָלַך", s: "ir, caminar", o: ["ir, caminar", "venir", "sentarse", "volver"] },
    { h: "הֵנָּה | הֵמָּה", s: "ellos, ellas", o: ["ellos, ellas", "nosotros", "vocales", "hombres"] },
    { h: "הִנֵּה", s: "he aquí", o: ["he aquí", "allí", "dónde", "cómo"] },
    { h: "זֹאת | זֶה", s: "este, esta", o: ["este, esta", "ese, aquel", "él, ella", "todo"] },
    { h: "יָד", s: "mano", o: ["mano", "pie", "cabeza", "ojo"] },
    { h: "יָצָא", s: "salir", o: ["salir", "entrar", "venir", "volver"] },
    { h: "יָשַׁב", s: "sentarse, habitar", o: ["sentarse, habitar", "caminar", "estar de pie", "ir"] },
    { h: "לִפְנֵי", s: "delante de", o: ["delante de", "detrás de", "sobre", "debajo de"] },
    { h: "מִן", s: "de, desde", o: ["de, desde", "en", "para", "con"] },
    { h: "נָתַן", s: "dar", o: ["dar", "tomar", "hacer", "decir"] },
    { h: "עַד", s: "hasta que, mientras", o: ["hasta que, mientras", "desde", "sobre", "porque"] },
    { h: "עִיר", s: "ciudad", o: ["ciudad", "pueblo", "casa", "tierra"] },
    { h: "עַם", s: "pueblo", o: ["pueblo", "nación", "multitud", "hombres"] },
    { h: "עִם", s: "con", o: ["con", "sin", "en", "sobre"] },
    { h: "פָּנִים | פָּנֶה", s: "cara", o: ["cara", "mano", "cabeza", "boca"] },
    { h: "רָאָה", s: "ver", o: ["ver", "oír", "hablar", "conocer"] },
    { h: "שׁוּב", s: "volver", o: ["volver", "salir", "ir", "venir"] },
    { h: "שָׁמַע", s: "oír, escuchar", o: ["oír, escuchar", "ver", "hablar", "decir"] },
  ];

  await db.insert(exercises).values([
    ...freq1_vocab.map((v, i) => ({
      id: `freq1-${i}`,
      lessonId: "freq-2200-5000",
      type: "translation",
      question: `¿Qué significa '${v.h}'?`,
      correctAnswer: v.s,
      options: JSON.stringify(v.o.sort(() => Math.random() - 0.5)),
      hebrewText: v.h,
      order: i + 1,
    })),
    ...freq2_vocab.map((v, i) => ({
      id: `freq2-${i}`,
      lessonId: "freq-1000-2199",
      type: "translation",
      question: `¿Qué significa '${v.h}'?`,
      correctAnswer: v.s,
      options: JSON.stringify(v.o.sort(() => Math.random() - 0.5)),
      hebrewText: v.h,
      order: i + 1,
    }))
  ]);

  // 12. Textos Ancla (Anchor Texts - IME)
  console.log("⚓ Creando Textos Ancla (IME)...");
  await db.insert(anchorTexts).values([
    {
      id: "anchor-1",
      title: "El Origen",
      reference: "Génesis 1:1",
      hebrewText:
        "[בְּ:p][רֵאשִׁ:r][ית:s] [בָּרָא:r] [אֱלֹהִ:r][ים:s] [אֵת:p] [הַ:p][שָּׁמַיִ:r][ם:s] [וְ:p][אֵת:p] [הָ:p][אָרֶץ:r]",
      translation: "En el principio creó Dios los cielos y la tierra.",
      explanation:
        "La palabra 'Bará' (crear) solo se usa con Dios como sujeto en la Biblia, indicando una acción exclusiva del Creador.",
      order: 1,
    },
    {
      id: "anchor-2",
      title: "La Declaración",
      reference: "Deuteronomio 6:4 (Shemá)",
      hebrewText: "[שְׁמַע:r] [יִשְׂרָאֵל:r] [יְהוָה:r] [אֱלֹהֵ:r][ינוּ:s] [יְהוָה:r] [אֶחָד:r]",
      translation: "Escucha, Israel: El Señor nuestro Dios, el Señor uno es.",
      explanation:
        "El 'Shemá' es la confesión de fe central del judaísmo. La palabra 'Ejad' subraya la unicidad de Dios.",
      order: 2,
    },
    {
      id: "anchor-3",
      title: "El Buen Pastor",
      reference: "Salmo 23:1",
      hebrewText: "[יְהוָה:r] [רֹעִ:r][י:s] [לֹא:p] [אֶחְסָר:r]",
      translation: "El Señor es mi pastor; nada me faltará.",
      explanation:
        "Aquí 'Roí' (mi pastor) usa un sufijo pronominal de primera persona, indicando una relación personal y cercana.",
      order: 3,
    },
  ]);

  // 13. Alfabeto Completo (IME)
  console.log("🔤 Creando Alfabeto (IME)...");
  const letters = [
    { char: "א", name: "Alef", order: 1 },
    { char: "ב", name: "Bet", order: 2 },
    { char: "ג", name: "Gimel", order: 3 },
    { char: "ד", name: "Dalet", order: 4 },
    { char: "ה", name: "He", order: 5 },
    { char: "ו", name: "Vav", order: 6 },
    { char: "ז", name: "Zayin", order: 7 },
    { char: "ח", name: "Het", order: 8 },
    { char: "ט", name: "Tet", order: 9 },
    { char: "י", name: "Yod", order: 10 },
    { char: "כ", name: "Kaf", order: 11 },
    { char: "ך", name: "Kaf Sofit", order: 12 },
    { char: "ל", name: "Lamed", order: 13 },
    { char: "מ", name: "Mem", order: 14 },
    { char: "ם", name: "Mem Sofit", order: 15 },
    { char: "נ", name: "Nun", order: 16 },
    { char: "ן", name: "Nun Sofit", order: 17 },
    { char: "ס", name: "Samej", order: 18 },
    { char: "ע", name: "Ayin", order: 19 },
    { char: "פ", name: "Pe", order: 20 },
    { char: "ף", name: "Pe Sofit", order: 21 },
    { char: "צ", name: "Tsadi", order: 22 },
    { char: "ץ", name: "Tsadi Sofit", order: 23 },
    { char: "ק", name: "Qof", order: 24 },
    { char: "ר", name: "Resh", order: 25 },
    { char: "ש", name: "Shin", order: 26 },
    { char: "ת", name: "Tav", order: 27 },
  ];
  await db.insert(alphabet).values(letters);

  // 14. Paradigmas Rítmicos (IME)
  console.log("🥁 Creando Paradigmas Rítmicos (IME)...");
  await db.insert(rhythmParadigms).values([
    {
      id: "rhythm-1",
      name: "Qatal (Perfecto)",
      root: "כתב",
      forms: JSON.stringify([
        { hebrew: "כָּתַב", translit: "katav", meaning: "él escribió" },
        { hebrew: "כָּתְבָה", translit: "katvah", meaning: "ella escribió" },
        { hebrew: "כָּתַבְתָּ", translit: "katavta", meaning: "tú (m) escribiste" },
        { hebrew: "כָּתַבְתְּ", translit: "katavt", meaning: "tú (f) escribiste" },
        { hebrew: "כָּתַבְתִּי", translit: "katavti", meaning: "yo escribí" },
        { hebrew: "כָּתְבוּ", translit: "katvu", meaning: "ellos escribieron" },
      ]),
      order: 1,
    },
    {
      id: "rhythm-2",
      name: "Yiqtol (Imperfecto)",
      root: "למד",
      forms: JSON.stringify([
        { hebrew: "יִלְמֹד", translit: "yilmod", meaning: "él aprenderá" },
        { hebrew: "תִּלְמֹד", translit: "tilmod", meaning: "ella aprenderá" },
        { hebrew: "תִּלְמְדִי", translit: "tilmedi", meaning: "tú (f) aprenderás" },
        { hebrew: "אֶלְמֹד", translit: "elmod", meaning: "yo aprenderé" },
        { hebrew: "יִלְמְדוּ", translit: "yilmedu", meaning: "ellos aprenderán" },
      ]),
      order: 2,
    },
    {
      id: "rhythm-3",
      name: "Qal Participio",
      root: "שמר",
      forms: JSON.stringify([
        { hebrew: "שׁוֹמֵר", translit: "shomer", meaning: "guardando (ms)" },
        { hebrew: "שׁוֹמֶרֶת", translit: "shomeret", meaning: "guardando (fs)" },
        { hebrew: "שׁוֹמְרִים", translit: "shomrim", meaning: "guardando (mp)" },
        { hebrew: "שׁוֹמְרוֹת", translit: "shomrot", meaning: "guardando (fp)" },
      ]),
      order: 3,
    },
    {
      id: "rhythm-4",
      name: "Hifil (Causativo)",
      root: "קדש",
      forms: JSON.stringify([
        { hebrew: "הִקְדִּישׁ", translit: "hiqdish", meaning: "él santificó" },
        { hebrew: "הִקְדִּישָׁה", translit: "hiqdishah", meaning: "ella santificó" },
        { hebrew: "הִקְדִּישׁוּ", translit: "hiqdishu", meaning: "ellos santificaron" },
      ]),
      order: 4,
    },
  ]);

  // 15. Flashcards Iniciales (IME)
  console.log("🗂️ Creando Flashcards IME...");
  await db.insert(flashcards).values([
    {
      id: "fc-1",
      type: "vocabulary",
      frontContent: JSON.stringify({
        text: "שָׁמַר",
        audioUrl: "https://www.pealim.com/media/audio/shamar.mp3",
      }),
      backContent: JSON.stringify({
        meaning: "Guardar / Observar",
        translit: "shamar",
        explanation:
          "Piensa en 'guardar' algo precioso. Esta raíz aparece cientos de veces en el Tanaj relacionada con guardar los mandamientos.",
      }),
      imeMetadata: JSON.stringify({
        root: "שמר",
        colors: { שָׁמַר: "#EF4444" }, // Rojo para raíz
        gestures: "Abrazar algo contra el pecho",
      }),
      order: 1,
    },
    {
      id: "fc-2",
      type: "morphological",
      frontContent: JSON.stringify({
        text: "שָׁמַרְתִּי",
        audioUrl: "https://www.pealim.com/media/audio/shamarti.mp3",
      }),
      backContent: JSON.stringify({
        meaning: "Yo guardé",
        translit: "shamarti",
        explanation:
          "El sufijo -ti (תִּי) siempre indica la 1ra persona común singular (Yo) en el aspecto perfecto.",
      }),
      imeMetadata: JSON.stringify({
        colors: {
          שָׁמַרְ: "#EF4444", // Raíz roja
          תִּי: "#10B981", // Sufijo verde
        },
        gestures: "Señalarse a uno mismo con el pulgar",
      }),
      order: 2,
    },
    {
      id: "fc-3",
      type: "phonetic",
      frontContent: JSON.stringify({
        text: "א",
        audioUrl: "https://www.pealim.com/media/audio/alef.mp3",
      }),
      backContent: JSON.stringify({
        meaning: "Alef (Silente)",
        translit: "'",
        explanation:
          "Es la primera letra. No tiene sonido propio, toma el de la vocal que la acompaña.",
      }),
      imeMetadata: JSON.stringify({
        gestures: "Hacer una diagonal con el brazo derecho y dos pequeños brazos con el izquierdo",
      }),
      order: 3,
    },
  ]);

  // 16. Modo Israelí (ILC)
  console.log("📜 Creando Modo Israelí (ILC)...");

  await db.insert(israeliUnits).values({
    id: "israeli-unit-1",
    title: "Sustantivos y Artículos",
    description: "Inmersión léxica cerrada con sustantivos comunes y el artículo definido.",
    grammarScope: "Sustantivos, Artículo ה (Ha)",
    maxWords: 18,
    order: 1,
  });

  const israeliWords = [
    { id: "ifc-1", text: "[בָּרָא:r]", meaning: "creó", translit: "bará" },
    { id: "ifc-2", text: "[אָמַר:r]", meaning: "dijo", translit: "amar" },
    { id: "ifc-3", text: "[בָּא:r]", meaning: "vino / entró", translit: "ba" },
    { id: "ifc-4", text: "[אֶל:p]", meaning: "a, hacia", translit: "el" },
    { id: "ifc-5", text: "[מִן:p]", meaning: "de, desde", translit: "min" },
    { id: "ifc-6", text: "[וְ:p]", meaning: "y", translit: "ve" },
    { id: "ifc-7", text: "[עִיר:r]", meaning: "ciudad", translit: "ir" },
    { id: "ifc-8", text: "[אֱלֹהַּ:r][ִים:s]", meaning: "Dios", translit: "Elohim" },
    { id: "ifc-9", text: "[עָפָר:r]", meaning: "polvo", translit: "afár" },
    { id: "ifc-10", text: "[חֹשֶׁךְ:r]", meaning: "oscuridad", translit: "jóshej" },
    { id: "ifc-11", text: "[רֹאשׁ:r]", meaning: "cabeza", translit: "rosh" },
    { id: "ifc-12", text: "[הֵיכָל:r]", meaning: "templo, palacio", translit: "heijal" },
    { id: "ifc-13", text: "[מֶלֶךְ:r]", meaning: "rey", translit: "melej" },
    { id: "ifc-14", text: "[יוֹם:r]", meaning: "día", translit: "yom" },
    { id: "ifc-15", text: "[לַיְלָה:r]", meaning: "noche", translit: "láyla" },
    { id: "ifc-16", text: "[אוֹר:r]", meaning: "luz", translit: "or" },
    { id: "ifc-17", text: "[אָדָם:r]", meaning: "hombre (Adán)", translit: "adam" },
    { id: "ifc-18", text: "[אֲדָמָה:r]", meaning: "tierra, suelo", translit: "adamá" },
  ];

  for (let i = 0; i < israeliWords.length; i++) {
    const word = israeliWords[i];
    await db.insert(flashcards).values({
      id: word.id,
      type: "vocabulary",
      frontContent: JSON.stringify({ text: word.text }),
      backContent: JSON.stringify({ meaning: word.meaning, translit: word.translit }),
      order: i + 100,
    });

    await db.insert(israeliVocabulary).values({
      unitId: "israeli-unit-1",
      flashcardId: word.id,
      order: i + 1,
    });
  }

  await db.insert(israeliSentences).values([
    {
      id: "is-1",
      unitId: "israeli-unit-1",
      hebrewText: "[מֶלֶךְ:r], [הַ:p][מֶּלֶךְ:r]",
      translation: "rey, el rey",
      order: 1,
    },
    {
      id: "is-2",
      unitId: "israeli-unit-1",
      hebrewText: "[יוֹם:r], [הַ:p][יּוֹם:r]",
      translation: "día, el día",
      order: 2,
    },
    {
      id: "is-3",
      unitId: "israeli-unit-1",
      hebrewText: "[לַיְלָה:r], [הַ:p][לַּיְלָה:r]",
      translation: "noche, la noche",
      order: 3,
    },
    {
      id: "is-4",
      unitId: "israeli-unit-1",
      hebrewText: "[אוֹר:r], [הָ:p][אוֹר:r]",
      translation: "luz, la luz",
      order: 4,
    },
    {
      id: "is-5",
      unitId: "israeli-unit-1",
      hebrewText: "[עִיר:r], [הָ:p][עִיר:r]",
      translation: "ciudad, la ciudad",
      order: 5,
    },
    {
      id: "is-6",
      unitId: "israeli-unit-1",
      hebrewText: "[רֹאשׁ:r], [הָ:p][רֹאשׁ:r]",
      translation: "cabeza, la cabeza",
      order: 6,
    },
    {
      id: "is-7",
      unitId: "israeli-unit-1",
      hebrewText: "[חֹשֶׁךְ:r], [הַ:p][חֹשֶׁךְ:r]",
      translation: "oscuridad, la oscuridad",
      order: 7,
    },
    {
      id: "is-8",
      unitId: "israeli-unit-1",
      hebrewText: "[הֵיכָל:r], [הַ:p][הֵיכָל:r]",
      translation: "templo, el templo",
      order: 8,
    },
    {
      id: "is-9",
      unitId: "israeli-unit-1",
      hebrewText: "[עָפָר:r], [הֶ:p][עָפָר:r]",
      translation: "polvo, el polvo",
      order: 9,
    },
    {
      id: "is-10",
      unitId: "israeli-unit-1",
      hebrewText: "[הַ:p][יּוֹם:r] [וְ:p][הַ:p][לַּיְלָה:r]",
      translation: "el día y la noche",
      order: 10,
    },
    {
      id: "is-11",
      unitId: "israeli-unit-1",
      hebrewText: "[הָ:p][אוֹר:r] [וְ:p] [הַ:p][חֹשֶׁךְ:r]",
      translation: "la luz y la oscuridad",
      order: 11,
    },
    {
      id: "is-12",
      unitId: "israeli-unit-1",
      hebrewText: "[מֶלֶךְ:r] [וְ:p][אָדָם:r], [הַ:p][מֶּלֶךְ:r] [וְ:p][הַ:p][אָדָם:r]",
      translation: "un rey y un hombre, el rey y el hombre",
      order: 12,
    },
    {
      id: "is-13",
      unitId: "israeli-unit-1",
      hebrewText: "[אֲדָמָה:r] [וְ:p][עָפָר:r], [הָ:p][אֲדָמָה:r] [וְ:p][הֶ:p][עָפָר:r]",
      translation: "tierra y polvo, la tierra y el polvo",
      order: 13,
    },
    {
      id: "is-14",
      unitId: "israeli-unit-1",
      hebrewText: "[עִיר:r] [וְ:p][הֵיכָל:r], [הָ:p][עִיר:r] [וְ:p][הַ:p][הֵיכָל:r]",
      translation: "ciudad y templo, la ciudad y el templo",
      order: 14,
    },
    {
      id: "is-15",
      unitId: "israeli-unit-1",
      hebrewText: "[בָּרָא:r] [אֱלֹהַּ:r][ִים:s] [אָדָם:r] [מִן:p]-[הָ:p][אֲדָמָה:r]",
      translation: "Dios creó al hombre de la tierra",
      order: 15,
    },
    {
      id: "is-16",
      unitId: "israeli-unit-1",
      hebrewText: "[בָּא:r] [הַ:p][מֶּלֶךְ:r] [מִן:p] [הַ:p][הֵיכָל:r]",
      translation: "El rey vino del templo",
      order: 16,
    },
    {
      id: "is-17",
      unitId: "israeli-unit-1",
      hebrewText: "[אָמַר:r] [אֱלֹהַּ:r][ִים:s] [אֶל:p]-[הָ:p][אָדָם:r]",
      translation: "Dios dijo al hombre",
      order: 17,
    },
    {
      id: "is-18",
      unitId: "israeli-unit-1",
      hebrewText: "[וְ:p][אֶל:p]-[הָ:p][עִיר:r] [בָּא:r] [הַ:p][מֶּלֶךְ:r]",
      translation: "Y hacia la ciudad vino el rey",
      order: 18,
    },
    {
      id: "is-19",
      unitId: "israeli-unit-1",
      hebrewText: "[בָּרָא:r] [אֱלֹהַּ:r][ִים:s] [אוֹר:r] [מִן:p]-[הַ:p][חֹשֶׁךְ:r]",
      translation: "Dios creó luz de la oscuridad",
      order: 19,
    },
  ]);

  // 17. Más Unidades del Modo Israelí (Roadmap)
  console.log("📜 Creando Roadmap del Modo Israelí...");

  await db.insert(israeliUnits).values([
    {
      id: "israeli-unit-2",
      title: "Preposiciones Inseparables",
      description: "Uso de las preposiciones ב, ל, כ con el artículo y sustantivos.",
      grammarScope: "Preposiciones Inseparables",
      maxWords: 18,
      order: 2,
    },
    {
      id: "israeli-unit-3",
      title: "Sustantivo y Adjetivo",
      description: "Concordancia de género y número entre sustantivos y adjetivos.",
      grammarScope: "Sustantivos y Adjetivos",
      maxWords: 18,
      order: 3,
    },
  ]);

  // 18. Datos de Ejemplo para Unidades 2 y 3 (Evitar errores de carga)
  console.log("📝 Añadiendo datos de la Unidad 2...");

  // Crear flashcards para el vocabulario de la unidad 2
  await db.insert(flashcards).values([
    { id: "fc-u2-1", type: "vocabulary", frontContent: JSON.stringify({ text: "[קָרָא:r]" }), backContent: JSON.stringify({ meaning: "él llamó", translit: "qara" }), order: 201 },
    { id: "fc-u2-2", type: "vocabulary", frontContent: JSON.stringify({ text: "[נָתַן:r]" }), backContent: JSON.stringify({ meaning: "él dio", translit: "natan" }), order: 202 },
    { id: "fc-u2-3", type: "vocabulary", frontContent: JSON.stringify({ text: "[רָאָה:r]" }), backContent: JSON.stringify({ meaning: "él vio", translit: "raah" }), order: 203 },
    { id: "fc-u2-4", type: "vocabulary", frontContent: JSON.stringify({ text: "[הָלַךְ:r]" }), backContent: JSON.stringify({ meaning: "él fue, caminó", translit: "halak" }), order: 204 },
    { id: "fc-u2-5", type: "vocabulary", frontContent: JSON.stringify({ text: "[שָׁמַיִם:r]" }), backContent: JSON.stringify({ meaning: "cielos", translit: "shamayim" }), order: 205 },
    { id: "fc-u2-6", type: "vocabulary", frontContent: JSON.stringify({ text: "[דָּבָר:r]" }), backContent: JSON.stringify({ meaning: "palabra, cosa", translit: "dabar" }), order: 206 },
    { id: "fc-u2-7", type: "vocabulary", frontContent: JSON.stringify({ text: "[אִשָּׁה:r]" }), backContent: JSON.stringify({ meaning: "mujer, esposa", translit: "ishah" }), order: 207 },
    { id: "fc-u2-8", type: "vocabulary", frontContent: JSON.stringify({ text: "[לֹא:r]" }), backContent: JSON.stringify({ meaning: "no", translit: "lo" }), order: 208 },
    { id: "fc-u2-9", type: "vocabulary", frontContent: JSON.stringify({ text: "[שְׁמוּאֵל:r]" }), backContent: JSON.stringify({ meaning: "Samuel", translit: "shemuel" }), order: 209 },
    { id: "fc-u2-10", type: "vocabulary", frontContent: JSON.stringify({ text: "[עַם:r]" }), backContent: JSON.stringify({ meaning: "un pueblo", translit: "am" }), order: 210 },
    { id: "fc-u2-11", type: "vocabulary", frontContent: JSON.stringify({ text: "[הָ:p][עָם:r]" }), backContent: JSON.stringify({ meaning: "el pueblo", translit: "ha'am" }), order: 211 },
    { id: "fc-u2-12", type: "vocabulary", frontContent: JSON.stringify({ text: "[יהוה:r]" }), backContent: JSON.stringify({ meaning: "Yahvé, el Señor", translit: "Adonai" }), order: 212 },
    // Flashcard para unidad 3 (mantenida)
    { id: "fc-u3-1", type: "vocabulary", frontContent: JSON.stringify({ text: "[טוֹב:r]" }), backContent: JSON.stringify({ meaning: "bueno", translit: "tob" }), order: 300 },
  ]);

  await db.insert(israeliVocabulary).values([
    { id: "iv-u2-1", unitId: "israeli-unit-2", flashcardId: "fc-u2-1", order: 1 },
    { id: "iv-u2-2", unitId: "israeli-unit-2", flashcardId: "fc-u2-2", order: 2 },
    { id: "iv-u2-3", unitId: "israeli-unit-2", flashcardId: "fc-u2-3", order: 3 },
    { id: "iv-u2-4", unitId: "israeli-unit-2", flashcardId: "fc-u2-4", order: 4 },
    { id: "iv-u2-5", unitId: "israeli-unit-2", flashcardId: "fc-u2-5", order: 5 },
    { id: "iv-u2-6", unitId: "israeli-unit-2", flashcardId: "fc-u2-6", order: 6 },
    { id: "iv-u2-7", unitId: "israeli-unit-2", flashcardId: "fc-u2-7", order: 7 },
    { id: "iv-u2-8", unitId: "israeli-unit-2", flashcardId: "fc-u2-8", order: 8 },
    { id: "iv-u2-9", unitId: "israeli-unit-2", flashcardId: "fc-u2-9", order: 9 },
    { id: "iv-u2-10", unitId: "israeli-unit-2", flashcardId: "fc-u2-10", order: 10 },
    { id: "iv-u2-11", unitId: "israeli-unit-2", flashcardId: "fc-u2-11", order: 11 },
    { id: "iv-u2-12", unitId: "israeli-unit-2", flashcardId: "fc-u2-12", order: 12 },
    { id: "iv-u3-1", unitId: "israeli-unit-3", flashcardId: "fc-u3-1", order: 1 },
  ]);

  await db.insert(israeliSentences).values([
    { id: "is-u2-1", unitId: "israeli-unit-2", hebrewText: "[מֶלֶךְ:r], [לְ:p][מֶלֶךְ:r], [מִ:p][מֶּלֶךְ:r]; [הַ:p][מֶּלֶךְ:r], [לַ:p][מֶּלֶךְ:r], [מִן:p]-[הַ:p][מֶּלֶךְ:r]", translation: "rey, para un rey, de un rey; el rey, para el rey, del rey.", order: 1 },
    { id: "is-u2-2", unitId: "israeli-unit-2", hebrewText: "[אָדָם:r], [כְּ:p][אָדָם:r], [מֵ:p][אָדָם:r]; [הָ:p][אָדָם:r], [כָּ:p][אָדָם:r], [מִן:p]-[הָ:p][אָדָם:r]", translation: "hombre, como un hombre, de un hombre; el hombre, como el hombre, del hombre.", order: 2 },
    { id: "is-u2-3", unitId: "israeli-unit-2", hebrewText: "[הֵיכָל:r], [בְּ:p][הֵיכָל:r], [מִן:p]-[הַ:p][הֵיכָל:r]", translation: "templo, en un templo, desde el templo.", order: 3 },
    { id: "is-u2-4", unitId: "israeli-unit-2", hebrewText: "[חֹשֶׁךְ:r], [לַ:p][חֹשֶׁךְ:r], [בַּ:p][חֹשֶׁךְ:r]", translation: "oscuridad, para la oscuridad, en la oscuridad.", order: 4 },
    { id: "is-u2-5", unitId: "israeli-unit-2", hebrewText: "[עָפָר:r], [מֵ:p][עָפָר:r]; [הֶ:p][עָפָר:r], [בֶּ:p][עָפָר:r], [מִן:p]-[הֶ:p][עָפָר:r]", translation: "polvo, de polvo; el polvo, en el polvo, del polvo.", order: 5 },
    { id: "is-u2-6", unitId: "israeli-unit-2", hebrewText: "[אֱלֹהִים:r], [כֵּ:p][אֱלֹהִים:r], [מֵ:p][אֱלֹהִים:r]; [הָ:p][אֱלֹהִים:r], [כָּ:p][אֱלֹהִים:r]; [מִן:p]-[הָ:p][אֱלֹהִים:r]", translation: "Dios, como Dios, de Dios; el (verdadero) Dios, como el Dios, de el Dios.", order: 6 },
    { id: "is-u2-7", unitId: "israeli-unit-2", hebrewText: "[יהוה:r], [לַ:p][יהוה:r], [מֵ:p][יהוה:r]", translation: "Yahvé, para Yahvé, de Yahvé.", order: 7 },
    { id: "is-u2-8", unitId: "israeli-unit-2", hebrewText: "[אֲדָמָה:r], [כַּ:p][אֲדָמָה:r], [הָ:p][אֲדָמָה:r], [בָּ:p][אֲדָמָה:r]", translation: "tierra, como tierra, la tierra, en la tierra.", order: 8 },
    { id: "is-u2-9", unitId: "israeli-unit-2", hebrewText: "[שְׁמוּאֵל:r], [לִ:p][שְׁמוּאֵל:r], [כִּ:p][שְׁמוּאֵל:r], [מִ:p][שְּׁמוּאֵל:r]", translation: "Samuel, para Samuel, como Samuel, de Samuel.", order: 9 },
    { id: "is-u2-10", unitId: "israeli-unit-2", hebrewText: "[קָרָא:r] [אֱלֹהִים:r] [לָ:p][אוֹר:r] [יוֹם:r] [וְ:p][לַ:p][חֹשֶׁךְ:r] [קָרָא:r] [לַיְלָה:r]", translation: "Llamó Dios a la luz día, y a la oscuridad llamó noche.", order: 10 },
    { id: "is-u2-11", unitId: "israeli-unit-2", hebrewText: "[הָלַךְ:r] [הָ:p][עָם:r] [בַּ:p][חֹשֶׁךְ:r] [וְ:p][לֹא:r] [רָאָה:r] [אוֹר:r]", translation: "Caminó el pueblo en la oscuridad y no vio luz.", order: 11 },
    { id: "is-u2-12", unitId: "israeli-unit-2", hebrewText: "[נָתַן:r] [שְׁמוּאֵל:r] [מֶלֶךְ:r] [לָ:p][עָם:r]", translation: "Dio Samuel un rey al pueblo.", order: 12 },
    { id: "is-u2-13", unitId: "israeli-unit-2", hebrewText: "[מִן:p]-[הַ:p][שָּׁמַיִם:r] [רָאָה:r] [יהוה:r]", translation: "Desde los cielos vio Yahvé.", order: 13 },
    { id: "is-u2-14", unitId: "israeli-unit-2", hebrewText: "[בָּרָא:r] [אֱלֹהִים:r] [אָדָם:r] [מֵ:p][עָפָר:r] [וְ:p][אִשָּׁה:r] [מִן:p]-[הָ:p][אָדָם:r]", translation: "Creó Dios al hombre del polvo y a una mujer del hombre.", order: 14 },
    { id: "is-u2-15", unitId: "israeli-unit-2", hebrewText: "[אָמַר:r] [שְׁמוּאֵל:r] [אֶל:p]-[הָ:p][עָם:r]: [בָּא:r] [הַ:p][מֶּלֶךְ:r] [אֶל:p]-[הָ:p][עִיר:r]", translation: "Dijo Samuel al pueblo: \"Vino el rey a la ciudad\".", order: 15 },
    { id: "is-u2-16", unitId: "israeli-unit-2", hebrewText: "[קָרָא:r] [אֱלֹהִים:r] [לִ:p][שְׁמוּאֵל:r] [בַּ:p][לַּיְלָה:r]", translation: "Llamó Dios a Samuel en la noche.", order: 16 },
    { id: "is-u2-17", unitId: "israeli-unit-2", hebrewText: "[נָתַן:r] [אֱלֹהִים:r] [אִשָּׁה:r] [לָ:p][אָדָם:r]", translation: "Dio Dios una mujer al hombre.", order: 17 },
    { id: "is-u2-18", unitId: "israeli-unit-2", hebrewText: "[יהוה:r] [מֶלֶךְ:r] [בַּ:p][שָּׁמַיִם:r]", translation: "Yahvé es rey en los cielos.", order: 18 },
    { id: "is-u2-19", unitId: "israeli-unit-2", hebrewText: "[הָלַךְ:r] [הַ:p][מֶּלֶךְ:r] [אֶל:p]-[הַ:p][הֵיכָל:r] [בַּ:p][לַּיְלָה:r]", translation: "Fue el rey al palacio por la noche.", order: 19 },
    { id: "is-u2-20", unitId: "israeli-unit-2", hebrewText: "[נָתַן:r] [אֱלֹהִים:r] [אוֹר:r] [לָ:p][אָדָם:r] [וְ:p][לָ:p][אִשָּׁה:r]", translation: "Dio Dios luz al hombre y a la mujer.", order: 20 },
    { id: "is-u2-21", unitId: "israeli-unit-2", hebrewText: "[לֹא:r] [אָמַר:r] [הַ:p][מֶּלֶךְ:r] [דָּבָר:r] [לִ:p][שְׁמוּאֵל:r]", translation: "No dijo el rey (ni una) palabra a Samuel.", order: 21 },
    { id: "is-u2-22", unitId: "israeli-unit-2", hebrewText: "[קָרָא:r] [שְׁמוּאֵל:r] [אֶל:p]-[יהוה:r]", translation: "Clamó Samuel a Yahvé.", order: 22 },
    { id: "is-u2-23", unitId: "israeli-unit-2", hebrewText: "[לֹא:r] [נָתַן:r] [יהוה:r] [אוֹר:r] [לָ:p][עָם:r]", translation: "No dio Yahvé luz al pueblo.", order: 23 },
    { id: "is-u2-24", unitId: "israeli-unit-2", hebrewText: "[הָלַךְ:r] [שְׁמוּאֵל:r] [בָּ:p][עִיר:r]", translation: "Caminó Samuel en la ciudad.", order: 24 },
    { id: "is-u2-25", unitId: "israeli-unit-2", hebrewText: "[רָאָה:r] [יהוה:r] [בִּ:p][שְׁמוּאֵל:r] [רֹאשׁ:r] [לָ:p][עָם:r]", translation: "Vio Yahvé en Samuel un jefe (cabeza) para el pueblo.", order: 25 },
    { id: "is-u3-1", unitId: "israeli-unit-3", hebrewText: "[אִישׁ:r] [טוֹב:r]", translation: "un hombre bueno", order: 1 },
  ]);

  if (preserveUserProgress) {
    console.log("♻️ Restaurando progreso de usuarios...");

    const existingLessonIds = new Set((await db.select({ id: lessons.id }).from(lessons)).map((l) => l.id));
    const existingAchievementIds = new Set(
      (await db.select({ id: achievements.id }).from(achievements)).map((a) => a.id)
    );
    const existingIsraeliUnitIds = new Set(
      (await db.select({ id: israeliUnits.id }).from(israeliUnits)).map((u) => u.id)
    );
    const existingFlashcardIds = new Set(
      (await db.select({ id: flashcards.id }).from(flashcards)).map((f) => f.id)
    );

    const now = new Date();

    const safeUserProgress = progressBackup
      .filter((row) => existingLessonIds.has(row.lessonId))
      .map((row) => ({
        id: row.id,
        userId: row.userId,
        lessonId: row.lessonId,
        isCompleted: toBool(row.isCompleted, false),
        accuracy: Math.max(0, Math.min(100, toFiniteInt(row.accuracy, 0))),
        isPerfect: toBool(row.isPerfect, false),
        completedAt: toDateOrNull(row.completedAt),
      }));

    const safeUserAchievements = achievementsBackup
      .filter((row) => existingAchievementIds.has(row.achievementId))
      .map((row) => ({
        id: row.id,
        userId: row.userId,
        achievementId: row.achievementId,
        unlockedAt: toDate(row.unlockedAt, now),
      }));

    const safeUserIsraeliProgress = israeliProgressBackup
      .filter((row) => existingIsraeliUnitIds.has(row.unitId))
      .map((row) => ({
        id: row.id,
        userId: row.userId,
        unitId: row.unitId,
        isCompleted: toBool(row.isCompleted, false),
        completedAt: toDateOrNull(row.completedAt),
      }));

    const safeUserFlashcardProgress = flashcardProgressBackup
      .filter((row) => existingFlashcardIds.has(row.flashcardId))
      .map((row) => ({
        id: row.id,
        userId: row.userId,
        flashcardId: row.flashcardId,
        nextReview: toDate(row.nextReview, now),
        interval: Math.max(0, toFiniteInt(row.interval, 0)),
        easeFactor: Math.max(130, toFiniteInt(row.easeFactor, 250)),
        repetitionCount: Math.max(0, toFiniteInt(row.repetitionCount, 0)),
        lastQuality: Math.max(0, Math.min(5, toFiniteInt(row.lastQuality, 3))),
        updatedAt: toDate(row.updatedAt, now),
      }));

    if (safeUserProgress.length > 0) {
      await db.insert(userProgress).values(safeUserProgress).onConflictDoNothing();
    }

    if (safeUserAchievements.length > 0) {
      await db.insert(userAchievements).values(safeUserAchievements).onConflictDoNothing();
    }

    if (safeUserIsraeliProgress.length > 0) {
      await db.insert(userIsraeliProgress).values(safeUserIsraeliProgress).onConflictDoNothing();
    }

    if (safeUserFlashcardProgress.length > 0) {
      await db.insert(userFlashcardProgress).values(safeUserFlashcardProgress).onConflictDoNothing();
    }

    console.log(
      `✅ Progreso restaurado: lecciones=${safeUserProgress.length}, logros=${safeUserAchievements.length}, israelí=${safeUserIsraeliProgress.length}, flashcards=${safeUserFlashcardProgress.length}`
    );
  }

  console.log("✅ Seed completado con éxito!");
}

main().catch((err) => {
  console.error("❌ Error durante el seed:");
  console.error(err);
  process.exit(1);
});

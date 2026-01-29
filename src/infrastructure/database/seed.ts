import { db } from "./db";
import { lessons, exercises, users, achievements, userProgress, userAchievements, anchorTexts, alphabet, rhythmParadigms, flashcards, userFlashcardProgress } from "./schema";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // 1. Limpiar datos existentes
  console.log("🧹 Limpiando base de datos...");
  await db.delete(userProgress);
  await db.delete(userAchievements);
  await db.delete(exercises);
  await db.delete(lessons);
  await db.delete(achievements);
  await db.delete(anchorTexts);
  await db.delete(alphabet);
  await db.delete(rhythmParadigms);
  await db.delete(userFlashcardProgress);
  await db.delete(flashcards);

  // 2. Crear Usuarios Iniciales (Figuras Bíblicas)
  console.log("👥 Creando figuras bíblicas...");
  const password = await bcrypt.hash("123456", 10);

  const biblicalFigures = [
    { id: "user-jesus", email: "jesus@cielo.com", passwordHash: password, displayName: "Jesús", points: 4000, level: 40, streak: 100 },
    { id: "user-enoc", email: "enoc@cielo.com", passwordHash: password, displayName: "Enoc", points: 2000, level: 20, streak: 50 },
    { id: "user-moises", email: "moises@egipto.com", passwordHash: password, displayName: "Moisés", points: 1500, level: 15, streak: 40 },
    { id: "user-elias", email: "elias@cielo.com", passwordHash: password, displayName: "Elías", points: 1490, level: 14, streak: 35 },
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
  ]);

  // 4. Crear Lecciones y Ejercicios
  console.log("📖 Creando lecciones y ejercicios...");

  // UNIT 1: Fundamentos y Alef-Bet

  // Lección 1
  await db.insert(lessons).values({
    id: "lesson-1",
    title: "El Alfabeto (Alef-Bet)",
    description: "Unidad 1: Aprende las primeras letras del alfabeto hebreo.",
    order: 1,
    xpReward: 50,
  });

  await db.insert(exercises).values([
    { id: "ex-1-1", lessonId: "lesson-1", type: "translation", question: "¿Cómo se dice 'Padre' en hebreo?", correctAnswer: "Ab", options: JSON.stringify(["Ab", "Ben", "Elohim", "Eretz"]), hebrewText: "אָב", order: 1 },
    { id: "ex-1-2", lessonId: "lesson-1", type: "multiple-choice", question: "Selecciona la letra 'Alef'", correctAnswer: "א", options: JSON.stringify(["א", "ב", "ג", "ד"]), order: 2 },
    { id: "ex-1-3", lessonId: "lesson-1", type: "translation", question: "¿Qué significa 'Eretz'?", correctAnswer: "Tierra", options: JSON.stringify(["Tierra", "Cielo", "Mar", "Luz"]), hebrewText: "אֶרֶץ", order: 3 },
    { id: "ex-1-4", lessonId: "lesson-1", type: "multiple-choice", question: "Selecciona la letra 'Bet'", correctAnswer: "ב", options: JSON.stringify(["א", "ב", "ג", "ד"]), order: 4 },
    { id: "ex-1-5", lessonId: "lesson-1", type: "translation", question: "¿Cómo se dice 'Hijo' en hebreo?", correctAnswer: "Ben", options: JSON.stringify(["Ab", "Ben", "Elohim", "Eretz"]), hebrewText: "בֵּן", order: 5 },
    { id: "ex-1-6", lessonId: "lesson-1", type: "multiple-choice", question: "Selecciona la letra 'Guímel'", correctAnswer: "ג", options: JSON.stringify(["א", "ב", "ג", "ד"]), order: 6 },
    { id: "ex-1-7", lessonId: "lesson-1", type: "multiple-choice", question: "Selecciona la letra 'Dálet'", correctAnswer: "ד", options: JSON.stringify(["א", "ב", "ג", "ד"]), order: 7 },
    { id: "ex-1-8", lessonId: "lesson-1", type: "translation", question: "¿Qué significa 'Adam'?", correctAnswer: "Hombre", options: JSON.stringify(["Hombre", "Tierra", "Cielo", "Vida"]), hebrewText: "אָדָם", order: 8 },
    { id: "ex-1-9", lessonId: "lesson-1", type: "multiple-choice", question: "Selecciona la letra 'He'", correctAnswer: "ה", options: JSON.stringify(["ה", "ו", "ז", "ח"]), order: 9 },
    { id: "ex-1-10", lessonId: "lesson-1", type: "translation", question: "¿Cómo se dice 'Mujer' en hebreo?", correctAnswer: "Ishá", options: JSON.stringify(["Ish", "Ishá", "Ab", "Ben"]), hebrewText: "אִשָּׁה", order: 10 },
  ]);

  // Lección 2
  await db.insert(lessons).values({
    id: "lesson-2",
    title: "Vocales y Sonidos",
    description: "Unidad 1: Descubre cómo suenan las letras con las vocales.",
    order: 2,
    xpReward: 70,
  });

  await db.insert(exercises).values([
    { id: "ex-2-1", lessonId: "lesson-2", type: "multiple-choice", question: "Identifica el sonido 'Ba'", correctAnswer: "בָּ", options: JSON.stringify(["בָּ", "בִּ", "בּוּ", "בֵּ"]), order: 1 },
    { id: "ex-2-2", lessonId: "lesson-2", type: "translation", question: "¿Qué significa 'Shalom'?", correctAnswer: "Paz", options: JSON.stringify(["Hola", "Paz", "Adiós", "Rey"]), hebrewText: "שָׁלוֹם", order: 2 },
    { id: "ex-2-3", lessonId: "lesson-2", type: "multiple-choice", question: "Identifica la vocal 'Kamatz' (sonido 'a')", correctAnswer: " ָ ", options: JSON.stringify([" ָ ", " ִ ", " ֻ ", " ֵ "]), order: 3 },
    { id: "ex-2-4", lessonId: "lesson-2", type: "multiple-choice", question: "Identifica el sonido 'Bi'", correctAnswer: "בִּ", options: JSON.stringify(["בָּ", "בִּ", "בּוּ", "בֵּ"]), order: 4 },
    { id: "ex-2-5", lessonId: "lesson-2", type: "translation", question: "¿Qué significa 'Berit'?", correctAnswer: "Pacto", options: JSON.stringify(["Pacto", "Ley", "Pueblo", "Dios"]), hebrewText: "בְּרִית", order: 5 },
    { id: "ex-2-6", lessonId: "lesson-2", type: "multiple-choice", question: "Identifica el sonido 'Bo'", correctAnswer: "בּוֹ", options: JSON.stringify(["בָּ", "בִּ", "בּוֹ", "בֵּ"]), order: 6 },
    { id: "ex-2-7", lessonId: "lesson-2", type: "translation", question: "¿Qué significa 'Torá'?", correctAnswer: "Ley/Instrucción", options: JSON.stringify(["Ley/Instrucción", "Profeta", "Escrito", "Cántico"]), hebrewText: "תּוֹרָה", order: 7 },
    { id: "ex-2-8", lessonId: "lesson-2", type: "multiple-choice", question: "Identifica la vocal 'Tsere' (sonido 'e')", correctAnswer: " ֵ ", options: JSON.stringify([" ָ ", " ִ ", " ֻ ", " ֵ "]), order: 8 },
    { id: "ex-2-9", lessonId: "lesson-2", type: "translation", question: "¿Qué significa 'Yisrael'?", correctAnswer: "Israel", options: JSON.stringify(["Israel", "Jacob", "Judá", "Sión"]), hebrewText: "יִשְׂרָאֵל", order: 9 },
    { id: "ex-2-10", lessonId: "lesson-2", type: "translation", question: "¿Qué significa 'Ruaj'?", correctAnswer: "Espíritu/Viento", options: JSON.stringify(["Espíritu/Viento", "Fuego", "Agua", "Tierra"]), hebrewText: "רוּחַ", order: 10 },
  ]);

  // Lección 3
  await db.insert(lessons).values({
    id: "lesson-3",
    title: "Palabras Básicas",
    description: "Unidad 1: Primeras palabras comunes en la Biblia.",
    order: 3,
    xpReward: 100,
  });

  await db.insert(exercises).values([
    { id: "ex-3-1", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Elohim'?", correctAnswer: "Dios", options: JSON.stringify(["Dios", "Hombre", "Mundo", "Rey"]), hebrewText: "אֱLֹהִים", order: 1 },
    { id: "ex-3-2", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Melek'?", correctAnswer: "Rey", options: JSON.stringify(["Dios", "Hombre", "Mundo", "Rey"]), hebrewText: "מֶלֶךְ", order: 2 },
    { id: "ex-3-3", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Kadosh'?", correctAnswer: "Santo", options: JSON.stringify(["Santo", "Bueno", "Grande", "Fuerte"]), hebrewText: "קָדוֹשׁ", order: 3 },
    { id: "ex-3-4", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Am'?", correctAnswer: "Pueblo", options: JSON.stringify(["Pueblo", "Nación", "Familia", "Tribu"]), hebrewText: "עַם", order: 4 },
    { id: "ex-3-5", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Derech'?", correctAnswer: "Camino", options: JSON.stringify(["Camino", "Vida", "Verdad", "Puerta"]), hebrewText: "דֶּרֶךְ", order: 5 },
    { id: "ex-3-6", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Ba-yit'?", correctAnswer: "Casa", options: JSON.stringify(["Casa", "Templo", "Ciudad", "Campo"]), hebrewText: "בַּיִת", order: 6 },
    { id: "ex-3-7", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Yom'?", correctAnswer: "Día", options: JSON.stringify(["Día", "Noche", "Mes", "Año"]), hebrewText: "יוֹם", order: 7 },
    { id: "ex-3-8", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Lailah'?", correctAnswer: "Noche", options: JSON.stringify(["Día", "Noche", "Tarde", "Mañana"]), hebrewText: "לַיְלָה", order: 8 },
    { id: "ex-3-9", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Mayim'?", correctAnswer: "Agua", options: JSON.stringify(["Agua", "Vino", "Leche", "Aceite"]), hebrewText: "מַיִם", order: 9 },
    { id: "ex-3-10", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Shem'?", correctAnswer: "Nombre", options: JSON.stringify(["Nombre", "Hombre", "Lugar", "Palabra"]), hebrewText: "שֵׁם", order: 10 },
  ]);

  // Lección 4
  await db.insert(lessons).values({
    id: "lesson-4",
    title: "Verbos Comunes I",
    description: "Unidad 1: Aprende acciones básicas en hebreo.",
    order: 4,
    xpReward: 120,
  });

  await db.insert(exercises).values([
    { id: "ex-4-1", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Amar' (אָמַר)?", correctAnswer: "Decir", options: JSON.stringify(["Decir", "Hacer", "Ver", "Ir"]), hebrewText: "אָמַר", order: 1 },
    { id: "ex-4-2", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Bará' (בָּרָא)?", correctAnswer: "Crear", options: JSON.stringify(["Crear", "Destruir", "Habitar", "Caminar"]), hebrewText: "בָּרָא", order: 2 },
    { id: "ex-4-3", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Halak' (הָלַךְ)?", correctAnswer: "Caminar/Ir", options: JSON.stringify(["Caminar/Ir", "Correr", "Sentarse", "Dormir"]), hebrewText: "הָלַךְ", order: 3 },
    { id: "ex-4-4", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Yadá' (יָדַע)?", correctAnswer: "Saber/Conocer", options: JSON.stringify(["Saber/Conocer", "Ignorar", "Olvidad", "Pensar"]), hebrewText: "יָדַע", order: 4 },
    { id: "ex-4-5", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Asá' (עָשָׂה)?", correctAnswer: "Hacer", options: JSON.stringify(["Hacer", "Pensar", "Sentir", "Mirar"]), hebrewText: "עָשָׂה", order: 5 },
    { id: "ex-4-6", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Shama' (שָׁמַע)?", correctAnswer: "Escuchar/Oír", options: JSON.stringify(["Escuchar/Oír", "Hablar", "Cantar", "Gritar"]), hebrewText: "שָׁמַע", order: 6 },
    { id: "ex-4-7", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Raá' (רָאָה)?", correctAnswer: "Ver", options: JSON.stringify(["Ver", "Cerrar", "Tocar", "Oler"]), hebrewText: "רָאָה", order: 7 },
    { id: "ex-4-8", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Lacaj' (לָקַח)?", correctAnswer: "Tomar/Llevar", options: JSON.stringify(["Tomar/Llevar", "Dejar", "Traer", "Vender"]), hebrewText: "לָקַח", order: 8 },
    { id: "ex-4-9", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Natán' (נָתַן)?", correctAnswer: "Dar", options: JSON.stringify(["Dar", "Quitar", "Pedir", "Prestar"]), hebrewText: "נָתַן", order: 9 },
    { id: "ex-4-10", lessonId: "lesson-4", type: "translation", question: "¿Qué significa 'Shalaj' (שָׁלַח)?", correctAnswer: "Enviar", options: JSON.stringify(["Enviar", "Recibir", "Guardar", "Perder"]), hebrewText: "שָׁלַח", order: 10 },
  ]);

  // Lección 5
  await db.insert(lessons).values({
    id: "lesson-5",
    title: "La Familia",
    description: "Unidad 1: Nombres de parentesco en la Biblia.",
    order: 5,
    xpReward: 150,
  });

  await db.insert(exercises).values([
    { id: "ex-5-1", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Em' (אֵם)?", correctAnswer: "Madre", options: JSON.stringify(["Madre", "Padre", "Hermana", "Hija"]), hebrewText: "אֵם", order: 1 },
    { id: "ex-5-2", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Bat' (בַּת)?", correctAnswer: "Hija", options: JSON.stringify(["Hija", "Hijo", "Madre", "Padre"]), hebrewText: "בַּת", order: 2 },
    { id: "ex-5-3", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Aj' (אָח)?", correctAnswer: "Hermano", options: JSON.stringify(["Hermano", "Padre", "Amigo", "Siervo"]), hebrewText: "אָח", order: 3 },
    { id: "ex-5-4", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Ajot' (אָחוֹת)?", correctAnswer: "Hermana", options: JSON.stringify(["Hermana", "Madre", "Hija", "Esposa"]), hebrewText: "אָחוֹת", order: 4 },
    { id: "ex-5-5", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Ben' (בֵּן)?", correctAnswer: "Hijo", options: JSON.stringify(["Hijo", "Padre", "Abuelo", "Nieto"]), hebrewText: "בֵּן", order: 5 },
    { id: "ex-5-6", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Saba' (סָבָא)?", correctAnswer: "Abuelo", options: JSON.stringify(["Abuelo", "Tío", "Primo", "Sobrino"]), hebrewText: "סָבָא", order: 6 },
    { id: "ex-5-7", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Sa-tá' (סָבְתָא)?", correctAnswer: "Abuela", options: JSON.stringify(["Abuela", "Tía", "Prima", "Sobrina"]), hebrewText: "סָבְתָא", order: 7 },
    { id: "ex-5-8", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Dod' (דּוֹד)?", correctAnswer: "Tío/Amado", options: JSON.stringify(["Tío/Amado", "Amigo", "Enemigo", "Extraño"]), hebrewText: "דּוֹד", order: 8 },
    { id: "ex-5-9", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Ish' (אִישׁ)?", correctAnswer: "Esposo/Varón", options: JSON.stringify(["Esposo/Varón", "Niño", "Anciano", "Joven"]), hebrewText: "אִישׁ", order: 9 },
    { id: "ex-5-10", lessonId: "lesson-5", type: "translation", question: "¿Qué significa 'Ishá' (אִשָּׁה)?", correctAnswer: "Esposa/Mujer", options: JSON.stringify(["Esposa/Mujer", "Niña", "Anciana", "Joven"]), hebrewText: "אִשָּׁה", order: 10 },
  ]);

  // Lección 6
  await db.insert(lessons).values({
    id: "lesson-6",
    title: "El Santuario",
    description: "Unidad 1: Vocabulario sobre el Templo y el Tabernáculo.",
    order: 6,
    xpReward: 160,
  });

  await db.insert(exercises).values([
    { id: "ex-6-1", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Heijal' (הֵיכָל)?", correctAnswer: "Templo/Palacio", options: JSON.stringify(["Templo/Palacio", "Casa", "Tienda", "Ciudad"]), hebrewText: "הֵיכָל", order: 1 },
    { id: "ex-6-2", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Mizbeaj' (מִזְבֵּחַ)?", correctAnswer: "Altar", options: JSON.stringify(["Altar", "Mesa", "Silla", "Puerta"]), hebrewText: "מִזְבֵּחַ", order: 2 },
    { id: "ex-6-3", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Kojén' (כֹּהֵן)?", correctAnswer: "Sacerdote", options: JSON.stringify(["Sacerdote", "Rey", "Profeta", "Siervo"]), hebrewText: "כֹּהֵן", order: 3 },
    { id: "ex-6-4", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Kodesh' (קֹדֶשׁ)?", correctAnswer: "Santidad/Lugar Santo", options: JSON.stringify(["Santidad/Lugar Santo", "Pecado", "Oscuridad", "Mundo"]), hebrewText: "קֹדֶשׁ", order: 4 },
    { id: "ex-6-5", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Mishkán' (מִשְׁכָּן)?", correctAnswer: "Tabernáculo", options: JSON.stringify(["Tabernáculo", "Palacio", "Campo", "Montaña"]), hebrewText: "מִשְׁכָּן", order: 5 },
    { id: "ex-6-6", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Menorá' (מְנוֹרָה)?", correctAnswer: "Candelabro", options: JSON.stringify(["Candelabro", "Mesa", "Arca", "Altar"]), hebrewText: "מְנוֹרָה", order: 6 },
    { id: "ex-6-7", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Arón' (אָרוֹן)?", correctAnswer: "Arca/Cofre", options: JSON.stringify(["Arca/Cofre", "Cama", "Silla", "Vaso"]), hebrewText: "אָרוֹן", order: 7 },
    { id: "ex-6-8", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Ojel' (אֹהֶל)?", correctAnswer: "Tienda", options: JSON.stringify(["Tienda", "Casa", "Templo", "Muro"]), hebrewText: "אֹהֶל", order: 8 },
    { id: "ex-6-9", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Leví' (לֵוִי)?", correctAnswer: "Levita", options: JSON.stringify(["Levita", "Sacerdote", "Rey", "Soldado"]), hebrewText: "לֵוִי", order: 9 },
    { id: "ex-6-10", lessonId: "lesson-6", type: "translation", question: "¿Qué significa 'Zébaj' (זֶבַח)?", correctAnswer: "Sacrificio", options: JSON.stringify(["Sacrificio", "Oración", "Canto", "Ayuno"]), hebrewText: "זֶבַח", order: 10 },
  ]);

  // Lección 7
  await db.insert(lessons).values({
    id: "lesson-7",
    title: "Animales de la Biblia",
    description: "Unidad 1: Vocabulario sobre animales en el texto bíblico.",
    order: 7,
    xpReward: 170,
  });

  await db.insert(exercises).values([
    { id: "ex-7-1", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Keléb' (כֶּלֶB)?", correctAnswer: "Perro", options: JSON.stringify(["Perro", "Gato", "León", "Oveja"]), hebrewText: "כֶּלֶב", order: 1 },
    { id: "ex-7-2", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Aryé' (אַרְיֵה)?", correctAnswer: "León", options: JSON.stringify(["León", "Oso", "Lobo", "Águila"]), hebrewText: "אַרְיֵה", order: 2 },
    { id: "ex-7-3", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Joná' (יוֹנָה)?", correctAnswer: "Paloma", options: JSON.stringify(["Paloma", "Cuervo", "Gorrión", "Búho"]), hebrewText: "יוֹנָה", order: 3 },
    { id: "ex-7-4", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Sús' (סוּס)?", correctAnswer: "Caballo", options: JSON.stringify(["Caballo", "Burro", "Camello", "Vaca"]), hebrewText: "סוּס", order: 4 },
    { id: "ex-7-5", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Jamór' (חֲמוֹר)?", correctAnswer: "Burro", options: JSON.stringify(["Burro", "Caballo", "Oveja", "Cabra"]), hebrewText: "חֲמוֹר", order: 5 },
    { id: "ex-7-6", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Tson' (צאֹן)?", correctAnswer: "Rebaño/Ovejas", options: JSON.stringify(["Rebaño/Ovejas", "Manada", "Aves", "Peces"]), hebrewText: "צאֹן", order: 6 },
    { id: "ex-7-7", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Baqár' (בָּקָר)?", correctAnswer: "Ganado/Vacas", options: JSON.stringify(["Ganado/Vacas", "Caballos", "Perros", "Gatos"]), hebrewText: "בָּקָר", order: 7 },
    { id: "ex-7-8", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Gamál' (גָּמָל)?", correctAnswer: "Camello", options: JSON.stringify(["Camello", "Elefante", "Jirafa", "Cebra"]), hebrewText: "גָּמָל", order: 8 },
    { id: "ex-7-9", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Najásh' (נָחָשׁ)?", correctAnswer: "Serpiente", options: JSON.stringify(["Serpiente", "Lagarto", "Rana", "Pez"]), hebrewText: "נָחָשׁ", order: 9 },
    { id: "ex-7-10", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Dág' (דָּג)?", correctAnswer: "Pez", options: JSON.stringify(["Pez", "Ballena", "Tiburón", "Delfín"]), hebrewText: "דָּג", order: 10 },
  ]);

  // Lección 8
  await db.insert(lessons).values({
    id: "lesson-8",
    title: "Naturaleza y Creación",
    description: "Unidad 1: Elementos del mundo creado.",
    order: 8,
    xpReward: 180,
  });

  await db.insert(exercises).values([
    { id: "ex-8-1", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Shama-yim' (שָׁמַיִם)?", correctAnswer: "Cielo", options: JSON.stringify(["Cielo", "Tierra", "Mar", "Sol"]), hebrewText: "שָׁמַיִם", order: 1 },
    { id: "ex-8-2", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Kokab' (כּוֹכָב)?", correctAnswer: "Estrella", options: JSON.stringify(["Estrella", "Luna", "Sol", "Nube"]), hebrewText: "כּוֹכָב", order: 2 },
    { id: "ex-8-3", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Ets' (עֵץ)?", correctAnswer: "Árbol", options: JSON.stringify(["Árbol", "Flor", "Hierba", "Fruto"]), hebrewText: "עֵץ", order: 3 },
    { id: "ex-8-4", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Shémesh' (שֶׁמֶשׁ)?", correctAnswer: "Sol", options: JSON.stringify(["Sol", "Luna", "Estrella", "Planeta"]), hebrewText: "שֶׁמֶשׁ", order: 4 },
    { id: "ex-8-5", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Yaréaj' (יָרֵחַ)?", correctAnswer: "Luna", options: JSON.stringify(["Luna", "Sol", "Estrella", "Cometa"]), hebrewText: "יָרֵחַ", order: 5 },
    { id: "ex-8-6", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Yám' (יָם)?", correctAnswer: "Mar", options: JSON.stringify(["Mar", "Río", "Lago", "Fuente"]), hebrewText: "יָם", order: 6 },
    { id: "ex-8-7", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Har' (הַר)?", correctAnswer: "Montaña", options: JSON.stringify(["Montaña", "Valle", "Llanura", "Desierto"]), hebrewText: "הַר", order: 7 },
    { id: "ex-8-8", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Ésh' (אֵשׁ)?", correctAnswer: "Fuego", options: JSON.stringify(["Fuego", "Agua", "Aire", "Tierra"]), hebrewText: "אֵשׁ", order: 8 },
    { id: "ex-8-9", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Afár' (עָפָר)?", correctAnswer: "Polvo", options: JSON.stringify(["Polvo", "Arena", "Piedra", "Lodo"]), hebrewText: "עָפָר", order: 9 },
    { id: "ex-8-10", lessonId: "lesson-8", type: "translation", question: "¿Qué significa 'Anán' (עָנָן)?", correctAnswer: "Nube", options: JSON.stringify(["Nube", "Lluvia", "Nieve", "Viento"]), hebrewText: "עָנָן", order: 10 },
  ]);

  // UNIT 2: Gramática y Vocabulario Extendido

  // Lección 9
  await db.insert(lessons).values({
    id: "lesson-9",
    title: "Adjetivos Básicos",
    description: "Unidad 2: Describe cosas en hebreo.",
    order: 9,
    xpReward: 200,
  });

  await db.insert(exercises).values([
    { id: "ex-9-1", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Tob' (טוֹB)?", correctAnswer: "Bueno", options: JSON.stringify(["Bueno", "Malo", "Grande", "Pequeño"]), hebrewText: "טוֹב", order: 1 },
    { id: "ex-9-2", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Ra' (רַע)?", correctAnswer: "Malo", options: JSON.stringify(["Bueno", "Malo", "Santo", "Fuerte"]), hebrewText: "רַע", order: 2 },
    { id: "ex-9-3", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Gadol' (גָּדוֹל)?", correctAnswer: "Grande", options: JSON.stringify(["Grande", "Pequeño", "Largo", "Corto"]), hebrewText: "גָּדוֹל", order: 3 },
    { id: "ex-9-4", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Katán' (קָטָן)?", correctAnswer: "Pequeño", options: JSON.stringify(["Pequeño", "Grande", "Ancho", "Estrecho"]), hebrewText: "קָטָן", order: 4 },
    { id: "ex-9-5", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Yafé' (יָפֶה)?", correctAnswer: "Hermoso/Bello", options: JSON.stringify(["Hermoso/Bello", "Feo", "Sucio", "Limpio"]), hebrewText: "יָפֶה", order: 5 },
    { id: "ex-9-6", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Jajám' (חָכָם)?", correctAnswer: "Sabio", options: JSON.stringify(["Sabio", "Necio", "Fuerte", "Débil"]), hebrewText: "חָכָם", order: 6 },
    { id: "ex-9-7", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Jazáq' (חָזָק)?", correctAnswer: "Fuerte", options: JSON.stringify(["Fuerte", "Débil", "Rápido", "Lento"]), hebrewText: "חָזָק", order: 7 },
    { id: "ex-9-8", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Ram' (רָם)?", correctAnswer: "Alto/Exaltado", options: JSON.stringify(["Alto/Exaltado", "Bajo", "Profundo", "Plano"]), hebrewText: "רָם", order: 8 },
    { id: "ex-9-9", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Baruk' (בָּרוּךְ)?", correctAnswer: "Bendito", options: JSON.stringify(["Bendito", "Maldito", "Triste", "Alegre"]), hebrewText: "בָּרוּךְ", order: 9 },
    { id: "ex-9-10", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Yashár' (יָשָׁר)?", correctAnswer: "Recto/Justo", options: JSON.stringify(["Recto/Justo", "Torcido", "Inicuo", "Falso"]), hebrewText: "יָשָׁר", order: 10 },
  ]);

  // Lección 10
  await db.insert(lessons).values({
    id: "lesson-10",
    title: "Verbos de Movimiento",
    description: "Unidad 2: Acciones de desplazamiento.",
    order: 10,
    xpReward: 220,
  });

  await db.insert(exercises).values([
    { id: "ex-10-1", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Bo' (בּוֹא)?", correctAnswer: "Venir/Entrar", options: JSON.stringify(["Venir/Entrar", "Salir", "Subir", "Bajar"]), hebrewText: "בּוֹא", order: 1 },
    { id: "ex-10-2", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Yatsá' (יָצָא)?", correctAnswer: "Salir", options: JSON.stringify(["Salir", "Entrar", "Subir", "Bajar"]), hebrewText: "יָצָא", order: 2 },
    { id: "ex-10-3", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Alá' (עָלָה)?", correctAnswer: "Subir", options: JSON.stringify(["Subir", "Bajar", "Correr", "Saltar"]), hebrewText: "עָלָה", order: 3 },
    { id: "ex-10-4", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Yarád' (יָרַד)?", correctAnswer: "Bajar/Descender", options: JSON.stringify(["Bajar/Descender", "Subir", "Quedarse", "Volver"]), hebrewText: "יָרַד", order: 4 },
    { id: "ex-10-5", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Shúb' (שׁוּב)?", correctAnswer: "Volver/Regresar", options: JSON.stringify(["Volver/Regresar", "Irse", "Perderse", "Olvidar"]), hebrewText: "שׁוּב", order: 5 },
    { id: "ex-10-6", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Qúm' (קוּם)?", correctAnswer: "Levantarse", options: JSON.stringify(["Levantarse", "Acostarse", "Sentarse", "Caer"]), hebrewText: "קוּם", order: 6 },
    { id: "ex-10-7", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Yasháb' (יָשַׁב)?", correctAnswer: "Sentarse/Habitar", options: JSON.stringify(["Sentarse/Habitar", "Correr", "Volar", "Nadar"]), hebrewText: "יָשַׁב", order: 7 },
    { id: "ex-10-8", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Abád' (עָבַר)?", correctAnswer: "Pasar/Cruzar", options: JSON.stringify(["Pasar/Cruzar", "Parar", "Retroceder", "Girar"]), hebrewText: "עָבַר", order: 8 },
    { id: "ex-10-9", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Nafál' (נָפַל)?", correctAnswer: "Caer", options: JSON.stringify(["Caer", "Levantarse", "Sostenerse", "Equilibrarse"]), hebrewText: "נָפַל", order: 9 },
    { id: "ex-10-10", lessonId: "lesson-10", type: "translation", question: "¿Qué significa 'Radáf' (רָדַף)?", correctAnswer: "Perseguir", options: JSON.stringify(["Perseguir", "Huir", "Esconderse", "Esperar"]), hebrewText: "רָדַף", order: 10 },
  ]);

  // Lección 11
  await db.insert(lessons).values({
    id: "lesson-11",
    title: "Números 1-10",
    description: "Unidad 2: Aprende a contar en hebreo.",
    order: 11,
    xpReward: 230,
  });

  await db.insert(exercises).values([
    { id: "ex-11-1", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Uno'?", correctAnswer: "Ejád", options: JSON.stringify(["Ejád", "Shna-yim", "Shlosha", "Arba'a"]), hebrewText: "אֶחָד", order: 1 },
    { id: "ex-11-2", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Dos'?", correctAnswer: "Shna-yim", options: JSON.stringify(["Ejád", "Shna-yim", "Shlosha", "Arba'a"]), hebrewText: "שְׁנַיִם", order: 2 },
    { id: "ex-11-3", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Tres'?", correctAnswer: "Shlosha", options: JSON.stringify(["Shlosha", "Jamesh", "Sheba", "Eser"]), hebrewText: "שְׁלֹשָׁה", order: 3 },
    { id: "ex-11-4", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Cuatro'?", correctAnswer: "Arba'a", options: JSON.stringify(["Arba'a", "Shesh", "Shmona", "Tesha"]), hebrewText: "אַרְבָּעָה", order: 4 },
    { id: "ex-11-5", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Cinco'?", correctAnswer: "Jamesh", options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Eser"]), hebrewText: "חָמֵשׁ", order: 5 },
    { id: "ex-11-6", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Seis'?", correctAnswer: "Shesh", options: JSON.stringify(["Shesh", "Sheba", "Shmona", "Tesha"]), hebrewText: "שֵׁשׁ", order: 6 },
    { id: "ex-11-7", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Siete'?", correctAnswer: "Sheba", options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Shmona"]), hebrewText: "שֶׁBַע", order: 7 },
    { id: "ex-11-8", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Ocho'?", correctAnswer: "Shmona", options: JSON.stringify(["Shmona", "Tesha", "Eser", "Ejád"]), hebrewText: "שְׁמֹנָה", order: 8 },
    { id: "ex-11-9", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Nueve'?", correctAnswer: "Tesha", options: JSON.stringify(["Tesha", "Eser", "Ejád", "Shna-yim"]), hebrewText: "תֵּשַׁע", order: 9 },
    { id: "ex-11-10", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Diez'?", correctAnswer: "Eser", options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Eser"]), hebrewText: "עֶשֶׂר", order: 10 },
  ]);

  // Lección 12
  await db.insert(lessons).values({
    id: "lesson-12",
    title: "Partes del Cuerpo",
    description: "Unidad 2: Vocabulario anatómico en la Biblia.",
    order: 12,
    xpReward: 240,
  });

  await db.insert(exercises).values([
    { id: "ex-12-1", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Rosh' (רֹאשׁ)?", correctAnswer: "Cabeza", options: JSON.stringify(["Cabeza", "Mano", "Pie", "Corazón"]), hebrewText: "רֹאשׁ", order: 1 },
    { id: "ex-12-2", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Yad' (יָד)?", correctAnswer: "Mano", options: JSON.stringify(["Mano", "Brazo", "Dedo", "Uña"]), hebrewText: "יָד", order: 2 },
    { id: "ex-12-3", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Réguel' (רֶגֶל)?", correctAnswer: "Pie", options: JSON.stringify(["Pie", "Cabeza", "Ojo", "Boca"]), hebrewText: "רֶגֶל", order: 3 },
    { id: "ex-12-4", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Ayin' (עַיִן)?", correctAnswer: "Ojo/Fuente", options: JSON.stringify(["Ojo/Fuente", "Oído", "Nariz", "Diente"]), hebrewText: "עַיִן", order: 4 },
    { id: "ex-12-5", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Pé' (פֶּה)?", correctAnswer: "Boca", options: JSON.stringify(["Boca", "Lengua", "Labio", "Garganta"]), hebrewText: "פֶּה", order: 5 },
    { id: "ex-12-6", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Ozen' (אֹזֶן)?", correctAnswer: "Oído/Oreja", options: JSON.stringify(["Oído/Oreja", "Mano", "Pie", "Ojo"]), hebrewText: "אֹזֶן", order: 6 },
    { id: "ex-12-7", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Léb' (לֵב)?", correctAnswer: "Corazón", options: JSON.stringify(["Corazón", "Alma", "Mente", "Hígado"]), hebrewText: "לֵב", order: 7 },
    { id: "ex-12-8", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Paním' (פָּנִים)?", correctAnswer: "Rostro/Cara", options: JSON.stringify(["Rostro/Cara", "Espalda", "Hombro", "Pecho"]), hebrewText: "פָּנִים", order: 8 },
    { id: "ex-12-9", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Basár' (בָּשָׂר)?", correctAnswer: "Carne/Cuerpo", options: JSON.stringify(["Carne/Cuerpo", "Hueso", "Sangre", "Piel"]), hebrewText: "בָּשָׂר", order: 9 },
    { id: "ex-12-10", lessonId: "lesson-12", type: "translation", question: "¿Qué significa 'Dam' (דָּם)?", correctAnswer: "Sangre", options: JSON.stringify(["Sangre", "Agua", "Vino", "Aceite"]), hebrewText: "דָּם", order: 10 },
  ]);

  // Lección 13
  await db.insert(lessons).values({
    id: "lesson-13",
    title: "El Tiempo y las Estaciones",
    description: "Unidad 2: Conceptos temporales.",
    order: 13,
    xpReward: 250,
  });

  await db.insert(exercises).values([
    { id: "ex-13-1", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Et' (עֵת)?", correctAnswer: "Tiempo/Sazón", options: JSON.stringify(["Tiempo/Sazón", "Hora", "Minuto", "Segundo"]), hebrewText: "עֵת", order: 1 },
    { id: "ex-13-2", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Qáyits' (קַיִץ)?", correctAnswer: "Verano", options: JSON.stringify(["Verano", "Invierno", "Otoño", "Primavera"]), hebrewText: "קַיִץ", order: 2 },
    { id: "ex-13-3", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Jóref' (חֹרֶף)?", correctAnswer: "Invierno", options: JSON.stringify(["Invierno", "Verano", "Primavera", "Otoño"]), hebrewText: "חֹרֶף", order: 3 },
    { id: "ex-13-4", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Abíb' (אָBִיב)?", correctAnswer: "Primavera/Espiga", options: JSON.stringify(["Primavera/Espiga", "Otoño", "Verano", "Invierno"]), hebrewText: "אָבִיב", order: 4 },
    { id: "ex-13-5", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Shaná' (שָׁנָה)?", correctAnswer: "Año", options: JSON.stringify(["Año", "Mes", "Semana", "Día"]), hebrewText: "שָׁנָה", order: 5 },
    { id: "ex-13-6", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Jódesh' (חֹדֶשׁ)?", correctAnswer: "Mes/Luna Nueva", options: JSON.stringify(["Mes/Luna Nueva", "Año", "Semana", "Día"]), hebrewText: "חֹדֶשׁ", order: 6 },
    { id: "ex-13-7", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Shabúa' (שָׁבוּעַ)?", correctAnswer: "Semana", options: JSON.stringify(["Semana", "Mes", "Año", "Siglo"]), hebrewText: "שָׁבוּעַ", order: 7 },
    { id: "ex-13-8", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Sha'á' (שָׁעָה)?", correctAnswer: "Hora", options: JSON.stringify(["Hora", "Minuto", "Segundo", "Momento"]), hebrewText: "שָׁעָה", order: 8 },
    { id: "ex-13-9", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Olam' (עוֹלָם)?", correctAnswer: "Eternidad/Mundo", options: JSON.stringify(["Eternidad/Mundo", "Tiempo", "Lugar", "Gente"]), hebrewText: "עוֹלָם", order: 9 },
    { id: "ex-13-10", lessonId: "lesson-13", type: "translation", question: "¿Qué significa 'Ma-jar' (מָחָר)?", correctAnswer: "Mañana (Futuro)", options: JSON.stringify(["Mañana (Futuro)", "Hoy", "Ayer", "Pronto"]), hebrewText: "מָחָר", order: 10 },
  ]);

  // UNIT 3: Gramática Intermedia y Vida Cotidiana

  // Lección 14
  await db.insert(lessons).values({
    id: "lesson-14",
    title: "Pronombres Personales",
    description: "Unidad 3: Aprende a referirte a las personas.",
    order: 14,
    xpReward: 260,
  });

  await db.insert(exercises).values([
    { id: "ex-14-1", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Aní' (אֲנִי)?", correctAnswer: "Yo", options: JSON.stringify(["Yo", "Tú", "Él", "Nosotros"]), hebrewText: "אֲנִי", order: 1 },
    { id: "ex-14-2", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Atá' (אַתָּה)?", correctAnswer: "Tú (Masculino)", options: JSON.stringify(["Tú (Masculino)", "Yo", "Él", "Ustedes"]), hebrewText: "אַתָּה", order: 2 },
    { id: "ex-14-3", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'At' (אַתְּ)?", correctAnswer: "Tú (Femenino)", options: JSON.stringify(["Tú (Femenino)", "Yo", "Ella", "Ustedes"]), hebrewText: "אַתְּ", order: 3 },
    { id: "ex-14-4", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Hu' (הוּא)?", correctAnswer: "Él", options: JSON.stringify(["Él", "Ella", "Ellos", "Yo"]), hebrewText: "הוּא", order: 4 },
    { id: "ex-14-5", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Hi' (הִיא)?", correctAnswer: "Ella", options: JSON.stringify(["Ella", "Él", "Ellas", "Tú"]), hebrewText: "הִיא", order: 5 },
    { id: "ex-14-6", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Anajnu' (אֲנַחְנוּ)?", correctAnswer: "Nosotros", options: JSON.stringify(["Nosotros", "Ustedes", "Ellos", "Yo"]), hebrewText: "אֲנַחְנוּ", order: 6 },
    { id: "ex-14-7", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Atém' (אַתֶּם)?", correctAnswer: "Ustedes (Masculino)", options: JSON.stringify(["Ustedes (Masculino)", "Nosotros", "Ellos", "Tú"]), hebrewText: "אַתֶּם", order: 7 },
    { id: "ex-14-8", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Atén' (אַתֶּן)?", correctAnswer: "Ustedes (Femenino)", options: JSON.stringify(["Ustedes (Femenino)", "Nosotros", "Ellas", "Tú"]), hebrewText: "אַתֶּן", order: 8 },
    { id: "ex-14-9", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Hem' (הֵם)?", correctAnswer: "Ellos", options: JSON.stringify(["Ellos", "Nosotros", "Ustedes", "Él"]), hebrewText: "הֵם", order: 9 },
    { id: "ex-14-10", lessonId: "lesson-14", type: "translation", question: "¿Qué significa 'Hen' (הֵן)?", correctAnswer: "Ellas", options: JSON.stringify(["Ellas", "Nosotros", "Ustedes", "Ella"]), hebrewText: "הֵן", order: 10 },
  ]);

  // Lección 15
  await db.insert(lessons).values({
    id: "lesson-15",
    title: "Preposiciones Básicas",
    description: "Unidad 3: Conecta palabras con preposiciones.",
    order: 15,
    xpReward: 270,
  });

  await db.insert(exercises).values([
    { id: "ex-15-1", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Im' (עִם)?", correctAnswer: "Con", options: JSON.stringify(["Con", "Sin", "Para", "En"]), hebrewText: "עִם", order: 1 },
    { id: "ex-15-2", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Le' (לְ)?", correctAnswer: "Para/A", options: JSON.stringify(["Para/A", "De", "En", "Con"]), hebrewText: "[לְ:p]", order: 2 },
    { id: "ex-15-3", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Be' (בְּ)?", correctAnswer: "En", options: JSON.stringify(["En", "Por", "Sobre", "Hacia"]), hebrewText: "[בְּ:p]", order: 3 },
    { id: "ex-15-4", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Min' (מִן)?", correctAnswer: "De/Desde", options: JSON.stringify(["De/Desde", "Hasta", "Para", "Con"]), hebrewText: "[מִן:p]", order: 4 },
    { id: "ex-15-5", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Al' (עַל)?", correctAnswer: "Sobre/Acerca de", options: JSON.stringify(["Sobre/Acerca de", "Bajo", "Dentro", "Fuera"]), hebrewText: "[עַל:p]", order: 5 },
    { id: "ex-15-6", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Ke' (כְּ)?", correctAnswer: "Como/Según", options: JSON.stringify(["Como/Según", "Más", "Menos", "Tan"]), hebrewText: "כְּ", order: 6 },
    { id: "ex-15-7", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Lifné' (לִפְנֵי)?", correctAnswer: "Antes/Delante de", options: JSON.stringify(["Antes/Delante de", "Después", "Detrás", "Encima"]), hebrewText: "לִפְנֵי", order: 7 },
    { id: "ex-15-8", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Ajarei' (אַחֲרֵי)?", correctAnswer: "Después/Detrás de", options: JSON.stringify(["Después/Detrás de", "Antes", "Al lado", "Bajo"]), hebrewText: "אַחֲרֵי", order: 8 },
    { id: "ex-15-9", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Ad' (עַד)?", correctAnswer: "Hasta", options: JSON.stringify(["Hasta", "Desde", "Para", "Por"]), hebrewText: "עַד", order: 9 },
    { id: "ex-15-10", lessonId: "lesson-15", type: "translation", question: "¿Qué significa 'Et' (אֵת)?", correctAnswer: "Marcador de objeto directo", options: JSON.stringify(["Marcador de objeto directo", "Y", "O", "Pero"]), hebrewText: "אֵת", order: 10 },
  ]);

  // Lección 16
  await db.insert(lessons).values({
    id: "lesson-16",
    title: "La Ciudad y la Casa",
    description: "Unidad 3: Vocabulario de lugares y objetos cotidianos.",
    order: 16,
    xpReward: 280,
  });

  await db.insert(exercises).values([
    { id: "ex-16-1", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Ir' (עִיר)?", correctAnswer: "Ciudad", options: JSON.stringify(["Ciudad", "Pueblo", "Campo", "Casa"]), hebrewText: "עִיר", order: 1 },
    { id: "ex-16-2", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Sháar' (שַׁעַר)?", correctAnswer: "Puerta/Portón", options: JSON.stringify(["Puerta/Portón", "Muro", "Torre", "Plaza"]), hebrewText: "שַׁעַר", order: 2 },
    { id: "ex-16-3", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Jomá' (חוֹמָה)?", correctAnswer: "Muralla/Muro", options: JSON.stringify(["Muralla/Muro", "Puerta", "Calle", "Casa"]), hebrewText: "חוֹמָה", order: 3 },
    { id: "ex-16-4", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Juts' (חוּץ)?", correctAnswer: "Afuera/Calle", options: JSON.stringify(["Afuera/Calle", "Adentro", "Arriba", "Abajo"]), hebrewText: "חוּץ", order: 4 },
    { id: "ex-16-5", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Shulján' (שֻׁלְחָן)?", correctAnswer: "Mesa", options: JSON.stringify(["Mesa", "Silla", "Cama", "Lámpara"]), hebrewText: "שֻׁלְחָן", order: 5 },
    { id: "ex-16-6", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Kisé' (כִּסֵּא)?", correctAnswer: "Silla/Trono", options: JSON.stringify(["Silla/Trono", "Mesa", "Altar", "Arca"]), hebrewText: "כִּסֵּא", order: 6 },
    { id: "ex-16-7", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Léjem' (לֶחֶם)?", correctAnswer: "Pan/Comida", options: JSON.stringify(["Pan/Comida", "Agua", "Vino", "Carne"]), hebrewText: "לֶחֶם", order: 7 },
    { id: "ex-16-8", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Yáyin' (יַיִן)?", correctAnswer: "Vino", options: JSON.stringify(["Vino", "Agua", "Leche", "Aceite"]), hebrewText: "יַיִן", order: 8 },
    { id: "ex-16-9", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Shémen' (שֶׁמֶן)?", correctAnswer: "Aceite", options: JSON.stringify(["Aceite", "Miel", "Sal", "Harina"]), hebrewText: "שֶׁמֶן", order: 9 },
    { id: "ex-16-10", lessonId: "lesson-16", type: "translation", question: "¿Qué significa 'Beged' (בֶּגֶד)?", correctAnswer: "Ropa/Vestido", options: JSON.stringify(["Ropa/Vestido", "Calzado", "Manto", "Cinturón"]), hebrewText: "בֶּגֶד", order: 10 },
  ]);

  // Lección 17
  await db.insert(lessons).values({
    id: "lesson-17",
    title: "Verbos de Comunicación",
    description: "Unidad 3: Expresa ideas y responde.",
    order: 17,
    xpReward: 290,
  });

  await db.insert(exercises).values([
    { id: "ex-17-1", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Qará' (קָרָא)?", correctAnswer: "Llamar/Leer", options: JSON.stringify(["Llamar/Leer", "Escribir", "Escuchar", "Hablar"]), hebrewText: "קָרָא", order: 1 },
    { id: "ex-17-2", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Katáb' (כָּתַב)?", correctAnswer: "Escribir", options: JSON.stringify(["Escribir", "Leer", "Borrar", "Dibujar"]), hebrewText: "כָּתַב", order: 2 },
    { id: "ex-17-3", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Aná' (עָנָה)?", correctAnswer: "Responder", options: JSON.stringify(["Responder", "Preguntar", "Gritar", "Callar"]), hebrewText: "עָנָה", order: 3 },
    { id: "ex-17-4", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Sifér' (סִפֵּר)?", correctAnswer: "Contar/Relatar", options: JSON.stringify(["Contar/Relatar", "Cantar", "Bailar", "Llorar"]), hebrewText: "סִפֵּר", order: 4 },
    { id: "ex-17-5", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Shal' (שָׁאַל)?", correctAnswer: "Preguntar/Pedir", options: JSON.stringify(["Preguntar/Pedir", "Dar", "Quitar", "Buscar"]), hebrewText: "שָׁאַל", order: 5 },
    { id: "ex-17-6", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Yadá' (יָדַע)?", correctAnswer: "Saber/Conocer", options: JSON.stringify(["Saber/Conocer", "Olvidar", "Ignorar", "Dudar"]), hebrewText: "יָדַע", order: 6 },
    { id: "ex-17-7", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Zajár' (זָכַר)?", correctAnswer: "Recordar", options: JSON.stringify(["Recordar", "Olvidar", "Perdonar", "Juzgar"]), hebrewText: "זָכַר", order: 7 },
    { id: "ex-17-8", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Shajáj' (שָׁכַח)?", correctAnswer: "Olvidar", options: JSON.stringify(["Olvidar", "Recordar", "Aprender", "Enseñar"]), hebrewText: "שָׁכַח", order: 8 },
    { id: "ex-17-9", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Liméd' (לִמֵּד)?", correctAnswer: "Enseñar", options: JSON.stringify(["Enseñar", "Aprender", "Estudiar", "Jugar"]), hebrewText: "לִמֵּד", order: 9 },
    { id: "ex-17-10", lessonId: "lesson-17", type: "translation", question: "¿Qué significa 'Lamád' (לָמַד)?", correctAnswer: "Aprender", options: JSON.stringify(["Aprender", "Enseñar", "Trabajar", "Descansar"]), hebrewText: "לָמַד", order: 10 },
  ]);

  // Lección 18
  await db.insert(lessons).values({
    id: "lesson-18",
    title: "El Estado Constructo",
    description: "Unidad 3: Relaciona sustantivos (el 'de' posesivo).",
    order: 18,
    xpReward: 300,
  });

  await db.insert(exercises).values([
    { id: "ex-18-1", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Ben-Melek' (בֶּן-מֶלֶךְ)?", correctAnswer: "Hijo de rey", options: JSON.stringify(["Hijo de rey", "Hijo del rey", "Rey del hijo", "Padre del rey"]), hebrewText: "בֶּן-מֶלֶךְ", order: 1 },
    { id: "ex-18-2", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Bet-Elohim' (בֵּית-אֱלֹהִים)?", correctAnswer: "Casa de Dios", options: JSON.stringify(["Casa de Dios", "Hijo de Dios", "Pueblo de Dios", "Palabra de Dios"]), hebrewText: "בֵּית-אֱלֹהִים", order: 2 },
    { id: "ex-18-3", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Debár-Adonai' (דְּבַר-יְהוָה)?", correctAnswer: "Palabra del Señor", options: JSON.stringify(["Palabra del Señor", "Ley del Señor", "Casa del Señor", "Camino del Señor"]), hebrewText: "דְּבַר-יְהוָה", order: 3 },
    { id: "ex-18-4", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Eretz-Yisrael' (אֶרֶץ-יִשְׂרָאֵל)?", correctAnswer: "Tierra de Israel", options: JSON.stringify(["Tierra de Israel", "Pueblo de Israel", "Rey de Israel", "Dios de Israel"]), hebrewText: "אֶרֶץ-יִשְׂרָאֵל", order: 4 },
    { id: "ex-18-5", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Sifré-Kodesh' (סִפְרֵי-קֹדֶשׁ)?", correctAnswer: "Libros sagrados (de santidad)", options: JSON.stringify(["Libros sagrados (de santidad)", "Palabras sagradas", "Hombres sagrados", "Lugares sagrados"]), hebrewText: "סִפְרֵי-קֹדֶשׁ", order: 5 },
    { id: "ex-18-6", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Melek-Shalom' (מֶלֶךְ-שָׁלוֹם)?", correctAnswer: "Rey de paz", options: JSON.stringify(["Rey de paz", "Rey de justicia", "Rey de gloria", "Rey de reyes"]), hebrewText: "מֶלֶךְ-שָׁלוֹם", order: 6 },
    { id: "ex-18-7", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Bat-Tziyón' (בַּת-צִיּוֹן)?", correctAnswer: "Hija de Sión", options: JSON.stringify(["Hija de Sión", "Madre de Sión", "Hermana de Sión", "Reina de Sión"]), hebrewText: "בַּת-צִיּוֹן", order: 7 },
    { id: "ex-18-8", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Anshé-ha-Ir' (אַנְשֵׁי-הָעִיר)?", correctAnswer: "Hombres de la ciudad", options: JSON.stringify(["Hombres de la ciudad", "Mujeres de la ciudad", "Niños de la ciudad", "Reyes de la ciudad"]), hebrewText: "אַנְשֵׁי-הָעִיר", order: 8 },
    { id: "ex-18-9", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Torát-Moshe' (תּוֹרַת-מֹשֶׁה)?", correctAnswer: "Ley de Moisés", options: JSON.stringify(["Ley de Moisés", "Libro de Moisés", "Palabra de Moisés", "Casa de Moisés"]), hebrewText: "תּוֹרַת-מֹשֶׁה", order: 9 },
    { id: "ex-18-10", lessonId: "lesson-18", type: "translation", question: "¿Qué significa 'Elohé-Yisrael' (אֱלֹהֵי-יִשְׂרָאֵל)?", correctAnswer: "Dios de Israel", options: JSON.stringify(["Dios de Israel", "Rey de Israel", "Santo de Israel", "Fuerte de Israel"]), hebrewText: "אֱלֹהֵי-יִשְׂרָאֵל", order: 10 },
  ]);

  // 12. Textos Ancla (Anchor Texts - IME)
  console.log("⚓ Creando Textos Ancla (IME)...");
  await db.insert(anchorTexts).values([
    {
      id: "anchor-1",
      title: "El Origen",
      reference: "Génesis 1:1",
      hebrewText: "[בְּ:p] [רֵא:r] [שִׁית:s] [בָּרָא:r] [אֱלֹהִים:r] [אֵת:p] [הַ:p] [שָּׁמַיִם:r] [וְ:p] [אֵת:p] [הָ:p] [אָרֶץ:r]",
      translation: "En el principio creó Dios los cielos y la tierra.",
      explanation: "La palabra 'Bará' (crear) solo se usa con Dios como sujeto en la Biblia, indicando una acción exclusiva del Creador.",
      order: 1,
    },
    {
      id: "anchor-2",
      title: "La Declaración",
      reference: "Deuteronomio 6:4 (Shemá)",
      hebrewText: "[שְׁמַע:r] [יִשְׂרָאֵל:r] [יְהוָה:r] [אֱלֹהֵינוּ:r] [יְהוָה:r] [אֶחָד:r]",
      translation: "Escucha, Israel: El Señor nuestro Dios, el Señor uno es.",
      explanation: "El 'Shemá' es la confesión de fe central del judaísmo. La palabra 'Ejad' subraya la unicidad de Dios.",
      order: 2,
    },
    {
      id: "anchor-3",
      title: "El Buen Pastor",
      reference: "Salmo 23:1",
      hebrewText: "[יְהוָה:r] [רֹעִי:r] [לֹא:p] [אֶחְסָר:r]",
      translation: "El Señor es mi pastor; nada me faltará.",
      explanation: "Aquí 'Roí' (mi pastor) usa un sufijo pronominal de primera persona, indicando una relación personal y cercana.",
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
        { hebrew: "כָּתְבוּ", translit: "katvu", meaning: "ellos escribieron" }
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
        { hebrew: "יִלְמְדוּ", translit: "yilmedu", meaning: "ellos aprenderán" }
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
        { hebrew: "שׁוֹמְרוֹת", translit: "shomrot", meaning: "guardando (fp)" }
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
        { hebrew: "הִקְדִּישׁוּ", translit: "hiqdishu", meaning: "ellos santificaron" }
      ]),
      order: 4,
    }
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
        explanation: "Piensa en 'guardar' algo precioso. Esta raíz aparece cientos de veces en el Tanaj relacionada con guardar los mandamientos."
      }),
      imeMetadata: JSON.stringify({
        root: "שמר",
        colors: { "שָׁמַר": "#EF4444" }, // Rojo para raíz
        gestures: "Abrazar algo contra el pecho"
      }),
      order: 1
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
        explanation: "El sufijo -ti (תִּי) siempre indica la 1ra persona común singular (Yo) en el aspecto perfecto."
      }),
      imeMetadata: JSON.stringify({
        colors: {
          "שָׁמַרְ": "#EF4444", // Raíz roja
          "תִּי": "#10B981"    // Sufijo verde
        },
        gestures: "Señalarse a uno mismo con el pulgar"
      }),
      order: 2
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
        explanation: "Es la primera letra. No tiene sonido propio, toma el de la vocal que la acompaña."
      }),
      imeMetadata: JSON.stringify({
        gestures: "Hacer una diagonal con el brazo derecho y dos pequeños brazos con el izquierdo"
      }),
      order: 3
    }
  ]);

  console.log("✅ Seed completado con éxito!");
}

main().catch((err) => {
  console.error("❌ Error durante el seed:");
  console.error(err);
  process.exit(1);
});

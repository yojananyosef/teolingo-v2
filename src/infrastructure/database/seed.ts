import { db } from "./db";
import { lessons, exercises, users, achievements, userProgress, userAchievements } from "./schema";
import * as bcrypt from "bcryptjs";
import { sql, eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // 1. Limpiar datos existentes
  console.log("🧹 Limpiando base de datos...");
  await db.delete(userProgress);
  await db.delete(userAchievements);
  await db.delete(exercises);
  await db.delete(lessons);
  await db.delete(achievements);

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
    { id: "ex-3-1", lessonId: "lesson-3", type: "translation", question: "¿Qué significa 'Elohim'?", correctAnswer: "Dios", options: JSON.stringify(["Dios", "Hombre", "Mundo", "Rey"]), hebrewText: "אֱלֹהִים", order: 1 },
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
    { id: "ex-7-1", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Keléb' (כֶּלֶב)?", correctAnswer: "Perro", options: JSON.stringify(["Perro", "Gato", "León", "Oveja"]), hebrewText: "כֶּלֶב", order: 1 },
    { id: "ex-7-2", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Aryé' (אַרְיֵה)?", correctAnswer: "León", options: JSON.stringify(["León", "Oso", "Lobo", "Águila"]), hebrewText: "אַרְיֵה", order: 2 },
    { id: "ex-7-3", lessonId: "lesson-7", type: "translation", question: "¿Qué significa 'Joná' (יוֹנָה)?", correctAnswer: "Paloma", options: JSON.stringify(["Paloma", "Cuervo", "Gorrión", "Búho"]), hebrewText: "יוֹנָה", order: 3 },
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
    { id: "ex-9-1", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Tob' (טוֹב)?", correctAnswer: "Bueno", options: JSON.stringify(["Bueno", "Malo", "Grande", "Pequeño"]), hebrewText: "טוֹב", order: 1 },
    { id: "ex-9-2", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Ra' (רַע)?", correctAnswer: "Malo", options: JSON.stringify(["Bueno", "Malo", "Santo", "Fuerte"]), hebrewText: "רַע", order: 2 },
    { id: "ex-9-3", lessonId: "lesson-9", type: "translation", question: "¿Qué significa 'Gadol' (גָּדוֹל)?", correctAnswer: "Grande", options: JSON.stringify(["Grande", "Pequeño", "Largo", "Corto"]), hebrewText: "גָּדוֹל", order: 3 },
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
    { id: "ex-11-2", lessonId: "lesson-11", type: "translation", question: "¿Cómo se dice 'Siete'?", correctAnswer: "Sheba", options: JSON.stringify(["Jamesh", "Shesh", "Sheba", "Shmona"]), hebrewText: "שֶׁבַע", order: 2 },
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
  ]);

  console.log("✅ Seed completado con éxito!");
}

main().catch((err) => {
  console.error("❌ Error durante el seed:");
  console.error(err);
  process.exit(1);
});

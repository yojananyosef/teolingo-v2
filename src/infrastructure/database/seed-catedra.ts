import { sql } from "drizzle-orm";
import { db } from "./db";
import { exercises, lessons, quizQuestions, quizzes, users } from "./schema";

export const WEEK_1_WORDS = [
  { hebrew: "אֲנַחְנוּ", translation: "nosotros", options: ["nosotros", "vosotros", "ellos", "yo"] },
  {
    hebrew: "אֲרָם | אֲרַמִּי",
    translation: "Aram, Siria; arameo, sirio",
    options: [
      "Aram, Siria; arameo, sirio",
      "Egipto; egipcio",
      "Babilonia; babilónico",
      "Canaán; cananeo",
    ],
  },
  {
    hebrew: "אַשּׁוּר",
    translation: "Asiria; asirio",
    options: ["Asiria; asirio", "Persia; persa", "Grecia; griego", "Roma; romano"],
  },
  {
    hebrew: "הָלַל",
    translation: "alabar; gloriarse",
    options: ["alabar; gloriarse", "temer; reverenciar", "servir; adorar", "cantar; entonar"],
  },
  {
    hebrew: "חָכְמָה",
    translation: "sabiduría, inteligencia, prudencia",
    options: [
      "sabiduría, inteligencia, prudencia",
      "fuerza, poder",
      "riqueza, gloria",
      "gracia, favor",
    ],
  },
  { hebrew: "יוֹאָב", translation: "Joab", options: ["Joab", "David", "Salomón", "Saúl"] },
  {
    hebrew: "יִרְמְיָה | יִרְמְיָהוּ",
    translation: "Jeremías",
    options: ["Jeremías", "Isaías", "Ezequiel", "Daniel"],
  },
  {
    hebrew: "כָּסָה",
    translation: "cubrir, ocultar",
    options: ["cubrir, ocultar", "revelar, mostrar", "escribir, registrar", "edificar, construir"],
  },
  {
    hebrew: "לְבַד",
    translation: "solo, aparte, fuera de",
    options: [
      "solo, aparte, fuera de",
      "juntos, en comunidad",
      "cerca, junto a",
      "lejos, distante",
    ],
  },
  { hebrew: "מָוֶת", translation: "muerte", options: ["muerte", "vida", "salud", "paz"] },
  { hebrew: "מְנַשֶּׁה", translation: "Manasés", options: ["Manasés", "Efraín", "Benjamín", "Judá"] },
  {
    hebrew: "נֶגֶד",
    translation: "delante de, conforme a",
    options: [
      "delante de, conforme a",
      "detrás de, después",
      "debajo de, inferior",
      "sobre, encima de",
    ],
  },
  {
    hebrew: "נָגַע",
    translation: "tocar, alcanzar; llegar",
    options: ["tocar, alcanzar; llegar", "huir, escapar", "escuchar, oír", "hablar, decir"],
  },
  { hebrew: "נָסַע", translation: "partir", options: ["partir", "permanecer", "volver", "entrar"] },
  {
    hebrew: "עֵדָה",
    translation: "congregación",
    options: ["congregación", "ejército", "familia", "reino"],
  },
  {
    hebrew: "פַר | פָרָה",
    translation: "toro, ternero; vaca",
    options: ["toro, ternero; vaca", "oveja, cordero", "caballo, yegua", "camello, asno"],
  },
  {
    hebrew: "פָתַח",
    translation: "abrir; desatar, dejar libre",
    options: [
      "abrir; desatar, dejar libre",
      "cerrar; sellar",
      "guardar; proteger",
      "buscar; hallar",
    ],
  },
  {
    hebrew: "צְדָקָה",
    translation: "justicia, rectitud",
    options: ["justicia, rectitud", "misericordia, amor", "maldad, iniquidad", "verdad, fidelidad"],
  },
  { hebrew: "צִיּוֹן", translation: "Sion", options: ["Sion", "Jerusalén", "Belén", "Jericó"] },
  { hebrew: "צָפוֹן", translation: "norte", options: ["norte", "sur", "este", "oeste"] },
  {
    hebrew: "רֹב",
    translation: "multitud, abundancia",
    options: ["multitud, abundancia", "escasez, falta", "pobreza, necesidad", "unidad, uno"],
  },
  {
    hebrew: "שָׂמַח",
    translation: "alegrarse; alegrar",
    options: ["alegrarse; alegrar", "llorar; lamentar", "temer; temblar", "enojarse; airarse"],
  },
  {
    hebrew: "שָׂנֵא",
    translation: "odiar; adversario, enemigo",
    options: [
      "odiar; adversario, enemigo",
      "amar; amigo",
      "perdonar; reconciliar",
      "ayudar; socorrer",
    ],
  },
  { hebrew: "שָׁבַר", translation: "romper", options: ["romper", "reparar", "sanar", "construir"] },
  {
    hebrew: "שְׁמֹנֶה | שְׁמֹנָה | שְׁמֹנִים",
    translation: "ocho; ochenta",
    options: ["ocho; ochenta", "siete; setenta", "nueve; noventa", "diez; cien"],
  },
  { hebrew: "שֵׁנִי", translation: "segundo", options: ["segundo", "primero", "tercero", "cuarto"] },
];

export async function seedCatedra(database = db) {
  console.log("🏛️ Sembrando Módulo Cátedra UNACH (Semana 1)...");

  // 1. Obtener docente por defecto (o usar id docente jennifer/johan)
  const teachers = await database
    .select()
    .from(users)
    .where(sql`role IN ('teacher', 'admin')`)
    .limit(1);
  const teacherId = teachers[0]?.id || "b11fb87d-6b57-4e60-8853-3a9568415f6a"; // Fallback docente

  // 2. Crear Lección contenedora para la Semana 1
  const lessonId = "catedra-lesson-semana-1";
  await database
    .insert(lessons)
    .values({
      id: lessonId,
      title: "Semana 1: Vocabulario (Frecuencia 159-144)",
      description: "Cátedra de Hebreo I & II - UNACH",
      order: 101,
      moduleIndex: 99,
      xpReward: 50,
      course: "hebrew",
    })
    .onConflictDoUpdate({
      target: lessons.id,
      set: {
        title: "Semana 1: Vocabulario (Frecuencia 159-144)",
        description: "Cátedra de Hebreo I & II - UNACH",
      },
    });

  // 3. Crear reactivos de ejercicios de opción múltiple para cada palabra
  const exerciseIds: string[] = [];

  for (let i = 0; i < WEEK_1_WORDS.length; i++) {
    const item = WEEK_1_WORDS[i];
    const exerciseId = `ex-catedra-s1-${i + 1}`;
    exerciseIds.push(exerciseId);

    await database
      .insert(exercises)
      .values({
        id: exerciseId,
        lessonId: lessonId,
        type: "multiple-choice",
        question: `¿Cuál es la traducción de: ${item.hebrew}?`,
        correctAnswer: item.translation,
        options: JSON.stringify(item.options),
        hebrewText: item.hebrew,
        hint: "Palabra del rango de frecuencia 159-144",
        order: i + 1,
      })
      .onConflictDoUpdate({
        target: exercises.id,
        set: {
          question: `¿Cuál es la traducción de: ${item.hebrew}?`,
          correctAnswer: item.translation,
          options: JSON.stringify(item.options),
          hebrewText: item.hebrew,
          order: i + 1,
        },
      });
  }

  // 4. Crear o Actualizar el Quiz Académico para la Semana 1
  const quizId = "catedra-semana-1";
  await database
    .insert(quizzes)
    .values({
      id: quizId,
      teacherId: teacherId,
      title: "Semana 1: Vocabulario (Frecuencia 159-144)",
      description: "Evaluación formativa semestral - 10 intentos máximo",
      isActive: true,
      timeLimitSeconds: 600, // 10 minutos por intento
      allowedAttempts: 10,
      updatedByName: "Docente Cátedra UNACH",
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: quizzes.id,
      set: {
        title: "Semana 1: Vocabulario (Frecuencia 159-144)",
        description: "Evaluación formativa semestral - 10 intentos máximo",
        allowedAttempts: 10,
        timeLimitSeconds: 600,
        isActive: true,
        updatedAt: new Date(),
      },
    });

  // 5. Vincular preguntas del Quiz
  for (let i = 0; i < exerciseIds.length; i++) {
    await database
      .insert(quizQuestions)
      .values({
        id: `qq-${quizId}-${i + 1}`,
        quizId: quizId,
        exerciseId: exerciseIds[i],
        order: i + 1,
      })
      .onConflictDoNothing();
  }

  console.log("✅ Cátedra Semana 1 sembrada con éxito: 26 palabras registradas.");
}

// Ejecutar directamente si se llama como script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCatedra()
    .then(() => {
      console.log("🎉 Seed Cátedra completado.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error en seed Cátedra:", err);
      process.exit(1);
    });
}

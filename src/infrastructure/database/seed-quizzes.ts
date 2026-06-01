import { eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { exercises, quizAssignments, quizAttempts, quizQuestions, quizzes, users } from "./schema";

const JENNIFER_TEACHER_ID = "b11fb87d-6b57-4e60-8853-3a9568415f6a";
const JOHAN_TEACHER_ID = "897186a4-388d-4bd0-8b34-804a547db16c";

const QUIZ_IDS = [
  "quiz-freq-1",
  "quiz-freq-2",
  "quiz-freq-3",
  "quiz-freq-4",
  "quiz-mixed-1",
  "quiz-mixed-2",
  "quiz-mixed-3",
  "quiz-mixed-4",
];

export async function seedQuizzes(database: typeof db = db) {
  // 1. Obtener y verificar docentes
  const [jennyUser] = await database
    .select()
    .from(users)
    .where(eq(users.id, JENNIFER_TEACHER_ID))
    .limit(1);

  const [johanUser] = await database
    .select()
    .from(users)
    .where(eq(users.id, JOHAN_TEACHER_ID))
    .limit(1);

  if (!jennyUser && !johanUser) {
    console.log("⚠️ No se encontró ninguna cuenta de docente para sembrar quizzes.");
    return;
  }

  // 2. Limpiar quizzes anteriores (solo los generados por seed)
  console.log("🧹 Limpiando quizzes anteriores del seed...");
  await database.delete(quizQuestions).where(inArray(quizQuestions.quizId, QUIZ_IDS));
  await database.delete(quizAttempts).where(inArray(quizAttempts.quizId, QUIZ_IDS));
  await database.delete(quizAssignments).where(inArray(quizAssignments.quizId, QUIZ_IDS));
  await database.delete(quizzes).where(inArray(quizzes.id, QUIZ_IDS));

  // 3. Obtener todos los ejercicios existentes para asociar
  const allExercises = await database.select().from(exercises);

  // --- SEED DE CUESTIONARIOS DE JENNY COLEMAN ---
  if (jennyUser) {
    console.log(`📝 Sembrando cuestionarios (quizzes) de la docente Jenny Coleman...`);

    // Agrupar por lección
    const exercisesByLesson: Record<string, typeof allExercises> = {};
    for (const ex of allExercises) {
      if (ex.lessonId) {
        if (!exercisesByLesson[ex.lessonId]) {
          exercisesByLesson[ex.lessonId] = [];
        }
        exercisesByLesson[ex.lessonId].push(ex);
      }
    }

    // Los 4 niveles de frecuencia bíblica
    const freqLevels = [
      { id: "freq-2200-5000", label: "2200-5000" },
      { id: "freq-1000-2199", label: "1000-2199" },
      { id: "freq-730-999", label: "730-999" },
      { id: "freq-500-729", label: "500-729" },
    ];

    // --- QUIZZES 1-4: Uno por cada nivel, con TODAS las preguntas del nivel ---
    for (let i = 0; i < freqLevels.length; i++) {
      const freq = freqLevels[i];
      const quizId = `quiz-freq-${i + 1}`;
      const lessonExs = exercisesByLesson[freq.id] || [];

      await database.insert(quizzes).values({
        id: quizId,
        teacherId: JENNIFER_TEACHER_ID,
        title: `Quiz ${i + 1}: Frecuencia Bíblica ${freq.label}`,
        description: `Todas las palabras de frecuencia bíblica ${freq.label}.`,
        isActive: true,
        updatedByName: jennyUser.displayName,
        updatedAt: new Date(),
        createdAt: new Date(),
      });

      let order = 1;
      for (const ex of lessonExs) {
        await database.insert(quizQuestions).values({
          id: `qq-${quizId}-${order}`,
          quizId,
          exerciseId: ex.id,
          order: order++,
        });
      }
      console.log(`  ✅ ${quizId}: ${lessonExs.length} preguntas (nivel ${freq.label})`);
    }

    // --- QUIZZES 5-8: Mixtos combinando niveles 1-4 (5000 a 500) ---
    const allFreqExs: typeof allExercises = [];
    for (const freq of freqLevels) {
      allFreqExs.push(...(exercisesByLesson[freq.id] || []));
    }

    const mixedQuizDefs = [
      {
        id: "quiz-mixed-1",
        title: "Quiz 5: Mixto Frecuencias 5000-500 (A)",
        desc: "Selección mixta A de vocabulario bíblico de alta frecuencia (5000 a 500).",
      },
      {
        id: "quiz-mixed-2",
        title: "Quiz 6: Mixto Frecuencias 5000-500 (B)",
        desc: "Selección mixta B de vocabulario bíblico de alta frecuencia (5000 a 500).",
      },
      {
        id: "quiz-mixed-3",
        title: "Quiz 7: Mixto Frecuencias 5000-500 (C)",
        desc: "Selección mixta C de vocabulario bíblico de alta frecuencia (5000 a 500).",
      },
      {
        id: "quiz-mixed-4",
        title: "Quiz 8: Mixto Frecuencias 5000-500 (D)",
        desc: "Selección mixta D de vocabulario bíblico de alta frecuencia (5000 a 500).",
      },
    ];

    const totalExs = allFreqExs.length;
    const chunkSize = Math.ceil(totalExs / 4);

    for (let m = 0; m < mixedQuizDefs.length; m++) {
      const def = mixedQuizDefs[m];
      const start = m * chunkSize;
      const selectedExercises = allFreqExs.slice(start, start + chunkSize);

      await database.insert(quizzes).values({
        id: def.id,
        teacherId: JENNIFER_TEACHER_ID,
        title: def.title,
        description: def.desc,
        isActive: true,
        updatedByName: jennyUser.displayName,
        updatedAt: new Date(),
        createdAt: new Date(),
      });

      let order = 1;
      for (const ex of selectedExercises) {
        await database.insert(quizQuestions).values({
          id: `qq-${def.id}-${order}`,
          quizId: def.id,
          exerciseId: ex.id,
          order: order++,
        });
      }
      console.log(`  ✅ ${def.id}: ${selectedExercises.length} preguntas (mixto ${m + 1})`);
    }

    console.log(
      `✅ Se sembraron con éxito los 8 cuestionarios (quizzes) de ${jennyUser.displayName}.`,
    );
  }
}

// Ejecutar directamente si se llama como script
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("seed-quizzes.ts")
) {
  seedQuizzes()
    .then(() => {
      console.log("✅ Seed de quizzes completado.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error en seed de quizzes:", err);
      process.exit(1);
    });
}

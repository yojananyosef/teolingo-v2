import { eq, sql } from "drizzle-orm";
import { ensureCatedraPauseTables } from "../../features/catedra/pause-service";
import { db } from "./db";
import { catedraControl, exercises, lessons, quizQuestions, quizzes, users } from "./schema";

const JENNIFER_TEACHER_ID = "b11fb87d-6b57-4e60-8853-3a9568415f6a";

export const WEEK_4_WORDS = [
  {
    hebrew: "אֱדֹום | אֱדֹומִ י",
    translation: "Edom; edomita",
    options: ["Edom; edomita", "Moab; moabita", "Amón; amonita", "Asiria; asirio"],
  },
  {
    hebrew: "אָחוֹת",
    translation: "hermana",
    options: ["hermana", "madre", "hija", "esposa"],
  },
  {
    hebrew: "בָּטַח",
    translation: "confiar, estar seguro",
    options: ["confiar, estar seguro", "temer, asustarse", "dudar, vacilar", "huir, escapar"],
  },
  {
    hebrew: "בָּכָה",
    translation: "llorar",
    options: ["llorar", "alegrarse", "cantar", "reír"],
  },
  {
    hebrew: "יָדָה",
    translation: "expulsar; alabar, confesar",
    options: [
      "expulsar; alabar, confesar",
      "maldecir, rechazar",
      "ocultar, guardar",
      "ignorar, olvidar",
    ],
  },
  {
    hebrew: "יָטַב",
    translation: "ser bueno",
    options: ["ser bueno", "ser malo", "ser fuerte", "ser sabio"],
  },
  {
    hebrew: "יִצְחָק",
    translation: "Isaac",
    options: ["Isaac", "Jacob", "Abraham", "José"],
  },
  {
    hebrew: "יָשָׁר",
    translation: "recto, derecho, llano, justo, sincero",
    options: [
      "recto, derecho, llano, justo, sincero",
      "torcido, malvado",
      "oscuro, oculto",
      "débil, quebrantado",
    ],
  },
  {
    hebrew: "כָּבֵד",
    translation: "ser pesado, honrado; honrar",
    options: [
      "ser pesado, honrado; honrar",
      "ser liviano, despreciar",
      "destruir, asolar",
      "robar, despojar",
    ],
  },
  {
    hebrew: "לָבַשׁ",
    translation: "vestir(se), cubrir",
    options: ["vestir(se), cubrir", "desnudar, quitar", "romper, rasgar", "lavar, limpiar"],
  },
  {
    hebrew: "לִקְרַאת",
    translation: "hacia, contra",
    options: ["hacia, contra", "lejos de, distante", "dentro de, interior", "debajo de, inferior"],
  },
  {
    hebrew: "לָשׁוֹן",
    translation: "lengua",
    options: ["lengua", "boca", "diente", "labio"],
  },
  {
    hebrew: "מִגְרָשׁ",
    translation: "campo de pastoreo común",
    options: ["campo de pastoreo común", "ciudad fortificada", "desierto árido", "palacio real"],
  },
  {
    hebrew: "מַמְלָכָה",
    translation: "reino",
    options: ["reino", "ejército", "familia", "pueblo"],
  },
  {
    hebrew: "נָבָא",
    translation: "profetizar",
    options: ["profetizar", "cantar", "escribir", "gobernar"],
  },
  {
    hebrew: "נָהָר",
    translation: "río, torrente, inundación",
    options: ["río, torrente, inundación", "mar, océano", "pozo, fuente", "lluvia, rocío"],
  },
  {
    hebrew: "פְּרִי",
    translation: "fruta; producto",
    options: ["fruta; producto", "hoja; rama", "semilla; grano", "flor; capullo"],
  },
  {
    hebrew: "צֶדֶק",
    translation: "justicia, derecho, liberación",
    options: [
      "justicia, derecho, liberación",
      "iniquidad, maldad",
      "temor, espanto",
      "guerra, conflicto",
    ],
  },
  {
    hebrew: "קָדוֹשׁ",
    translation: "santo",
    options: ["santo", "profano", "impuro", "común"],
  },
  {
    hebrew: "קָטַר",
    translation: "quemar, ofrecer; ofrecer incienso",
    options: [
      "quemar, ofrecer; ofrecer incienso",
      "lavar, purificar",
      "enterrar, sepultar",
      "derribar, destruir",
    ],
  },
  {
    hebrew: "רֶכֶב",
    translation: "carro, carroza, caballería",
    options: ["carro, carroza, caballería", "barco, nave", "espada, lanza", "escudo, coraza"],
  },
  {
    hebrew: "שָׁרַף",
    translation: "quemar",
    options: ["quemar", "apagar", "mojar", "construir"],
  },
  {
    hebrew: "שָׁלֵם",
    translation: "ser cumplido; terminarse; tener paz",
    options: [
      "ser cumplido; terminarse; tener paz",
      "faltar, estar incompleto",
      "luchar, pelear",
      "destruir, arruinar",
    ],
  },
  {
    hebrew: "שֹׁמְרוֹן",
    translation: "Samaria",
    options: ["Samaria", "Jerusalén", "Belén", "Jericó"],
  },
  {
    hebrew: "שָׁפַךְ",
    translation: "derramar",
    options: ["derramar", "recoger", "beber", "guardar"],
  },
  {
    hebrew: "שֶׁקֶר",
    translation: "mentira, engaño",
    options: ["mentira, engaño", "verdad, fidelidad", "paz, salud", "gracia, favor"],
  },
  {
    hebrew: "תּוֹעֵבָה",
    translation: "abominación",
    options: ["abominación", "bendición", "ofrenda agradable", "deleite"],
  },
];

export async function seedCatedraSemana4(database = db) {
  console.log("🏛️ Sembrando Módulo Cátedra UNACH (Semana 4)...");

  // 1. Asegurar tablas de pausa de catedra
  await ensureCatedraPauseTables(database);

  // 2. Resolver teacherId de forma robusta
  let teacherId: string;

  await database
    .insert(users)
    .values({
      id: JENNIFER_TEACHER_ID,
      email: "jennifer.coleman@unach.cl",
      passwordHash: "$2a$10$wN1rL9wE8jC4k5m6n7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g",
      displayName: "Prof.ª Jennifer Coleman",
      role: "teacher",
      streak: 0,
      points: 0,
      level: 1,
    })
    .onConflictDoNothing();

  const [byId] = await database
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, JENNIFER_TEACHER_ID))
    .limit(1);

  if (byId) {
    teacherId = byId.id;
  } else {
    const [byEmail] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, "jennifer.coleman@unach.cl"))
      .limit(1);

    if (byEmail) {
      teacherId = byEmail.id;
    } else {
      const [anyTeacher] = await database
        .select({ id: users.id })
        .from(users)
        .where(sql`role = 'teacher'`)
        .limit(1);

      if (anyTeacher) {
        teacherId = anyTeacher.id;
      } else {
        const [anyUser] = await database.select({ id: users.id }).from(users).limit(1);
        if (!anyUser) {
          throw new Error("No hay usuarios en la BD para asignar como docente de Cátedra.");
        }
        teacherId = anyUser.id;
      }
    }
  }

  // 3. Crear Lección contenedora para la Semana 4
  const lessonId = "catedra-lesson-semana-4";
  await database
    .insert(lessons)
    .values({
      id: lessonId,
      title: "Semana 4: Vocabulario (Frecuencia 120-112)",
      description: "Cátedra de Hebreo I & II - UNACH",
      order: 104,
      moduleIndex: 99,
      xpReward: 50,
      course: "hebrew",
    })
    .onConflictDoUpdate({
      target: lessons.id,
      set: {
        title: "Semana 4: Vocabulario (Frecuencia 120-112)",
        description: "Cátedra de Hebreo I & II - UNACH",
      },
    });

  // 4. Crear reactivos de ejercicios de opción múltiple para cada palabra
  const exerciseIds: string[] = [];

  for (let i = 0; i < WEEK_4_WORDS.length; i++) {
    const item = WEEK_4_WORDS[i];
    const exerciseId = `ex-catedra-s4-${i + 1}`;
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
        hint: "Palabra del rango de frecuencia 120-112",
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

  // 5. Crear o Actualizar el Quiz Académico para la Semana 4
  const quizId = "catedra-semana-4";
  await database
    .insert(quizzes)
    .values({
      id: quizId,
      teacherId: teacherId,
      title: "Semana 4: Vocabulario (Frecuencia 120-112)",
      description: "Evaluación formativa semestral - 10 intentos máximo",
      isActive: true,
      timeLimitSeconds: 600,
      allowedAttempts: 10,
      updatedByName: "Prof.ª Jennifer Coleman",
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: quizzes.id,
      set: {
        teacherId: teacherId,
        title: "Semana 4: Vocabulario (Frecuencia 120-112)",
        description: "Evaluación formativa semestral - 10 intentos máximo",
        allowedAttempts: 10,
        timeLimitSeconds: 600,
        isActive: true,
        updatedByName: "Prof.ª Jennifer Coleman",
        updatedAt: new Date(),
      },
    });

  // 6. Vincular preguntas del Quiz
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

  // 7. Configurar la Semana 4 para que quede PAUSADA por defecto
  await database
    .insert(catedraControl)
    .values({
      id: "semana-4",
      isPaused: true,
      pausedBy: teacherId,
      pausedAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: catedraControl.id,
      set: {
        isPaused: true,
        pausedBy: teacherId,
        pausedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  console.log("✅ Cátedra Semana 4 sembrada con éxito (estado: PAUSADA).");
}

// Permitir ejecución independiente directa
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCatedraSemana4()
    .then(() => {
      console.log("🎉 Seed Cátedra Semana 4 completado.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error en seed Cátedra Semana 4:", err);
      process.exit(1);
    });
}

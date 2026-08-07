import { eq, sql } from "drizzle-orm";
import { ensureCatedraPauseTables } from "../../features/catedra/pause-service";
import { db } from "./db";
import { catedraControl, exercises, lessons, quizQuestions, quizzes, users } from "./schema";

const JENNIFER_TEACHER_ID = "b11fb87d-6b57-4e60-8853-3a9568415f6a";

export const WEEK_3_WORDS = [
  {
    hebrew: "אֹור",
    translation: "luz",
    options: ["luz", "oscuridad", "fuego", "sol"],
  },
  {
    hebrew: "אֱמֶת",
    translation: "firmeza, fidelidad, constancia, verdad",
    options: [
      "firmeza, fidelidad, constancia, verdad",
      "mentira, engaño",
      "gracia, amor",
      "paz, bienestar",
    ],
  },
  {
    hebrew: "אַף",
    translation: "y, también, incluso, cuánto más",
    options: [
      "y, también, incluso, cuánto más",
      "pero, sin embargo",
      "porque, ya que",
      "no, tampoco",
    ],
  },
  {
    hebrew: "בּוֹשׁ",
    translation: "avergonzarse",
    options: ["avergonzarse", "alegrarse", "temer", "enojarse"],
  },
  {
    hebrew: "בְּכֹר | בְּכוֹר",
    translation: "primogénito",
    options: ["primogénito", "hijo menor", "padre, progenitor", "anciano, líder"],
  },
  {
    hebrew: "גָּדַל",
    translation: "ser grande, crecer; criar, aumentar, hacer crecer",
    options: [
      "ser grande, crecer; criar, aumentar, hacer crecer",
      "ser pequeño, disminuir",
      "destruir, asolar",
      "matar, morir",
    ],
  },
  {
    hebrew: "חוֹמָה",
    translation: "muro, muralla",
    options: ["muro, muralla", "puerta, entrada", "casa, edificación", "torre, fortaleza"],
  },
  {
    hebrew: "חִזְקִיָּה | חִזְקִיָּהוּ",
    translation: "Ezequías",
    options: ["Ezequías", "Isaías", "Josías", "Ezequiel"],
  },
  {
    hebrew: "חֵמָה",
    translation: "ira, furor, ardor; veneno",
    options: ["ira, furor, ardor; veneno", "paz, calma", "amor, afecto", "gozo, alegría"],
  },
  {
    hebrew: "חֲצִי",
    translation: "mitad",
    options: ["mitad", "todo, entero", "tercio, tercera parte", "doble, duplicado"],
  },
  {
    hebrew: "חֹק",
    translation: "límite, obligación, mandato",
    options: [
      "límite, obligación, mandato",
      "libertad, permiso",
      "pecado, transgresión",
      "gracia, favor",
    ],
  },
  {
    hebrew: "חָשַׁב",
    translation: "estimar, pensar, tener en cuenta",
    options: [
      "estimar, pensar, tener en cuenta",
      "olvidar, ignorar",
      "hablar, decir",
      "escribir, contar",
    ],
  },
  {
    hebrew: "יְהוֹנָתָן",
    translation: "Jonatán",
    options: ["Jonatán", "David", "Salomón", "Saúl"],
  },
  {
    hebrew: "כֶּבֶשׂ | כִּבְשָׂה",
    translation: "cordero",
    options: ["cordero", "cabruto, chivo", "toro, novillo", "caballo, yegua"],
  },
  {
    hebrew: "כֹּחַ",
    translation: "fuerza, capacidad, posesiones",
    options: [
      "fuerza, capacidad, posesiones",
      "debilidad, falta",
      "pobreza, miseria",
      "temor, miedo",
    ],
  },
  {
    hebrew: "כֶּשֶׂב | כִּשְׂבָּה",
    translation: "cordero",
    options: ["cordero", "buey", "asno", "camello"],
  },
  {
    hebrew: "לָכַד",
    translation: "conquistar, hacer prisionero",
    options: [
      "conquistar, hacer prisionero",
      "liberar, soltar",
      "huir, escapar",
      "defender, proteger",
    ],
  },
  {
    hebrew: "נָגַשׁ",
    translation: "acercarse, alcanzar, acudir",
    options: [
      "acercarse, alcanzar, acudir",
      "alejarse, huir",
      "detenerse, parar",
      "subir, ascender",
    ],
  },
  {
    hebrew: "נָשִׂיא",
    translation: "príncipe",
    options: ["príncipe", "siervo, esclavo", "sacerdote", "profeta"],
  },
  {
    hebrew: "עַמּוֹן | עַמּוֹנִי",
    translation: "Amón, amonitas",
    options: ["Amón, amonitas", "Moab, moabitas", "Edom, edomitas", "Filistea, filisteos"],
  },
  {
    hebrew: "עֶצֶם",
    translation: "hueso",
    options: ["hueso", "carne", "sangre", "piel"],
  },
  {
    hebrew: "פֶּן",
    translation: "para que no, de modo que no",
    options: [
      "para que no, de modo que no",
      "porque, debido a",
      "siempre que, mientras",
      "para que sí, a fin de que",
    ],
  },
  {
    hebrew: "קָבַץ",
    translation: "reunirse; reunir, convocar",
    options: [
      "reunirse; reunir, convocar",
      "dispersar, esparcir",
      "dividir, separar",
      "destruir, arruinar",
    ],
  },
  {
    hebrew: "קָבַר",
    translation: "enterrar, sepultar",
    options: [
      "enterrar, sepultar",
      "resucitar, levantar",
      "construir, edificar",
      "quemar, consumir",
    ],
  },
  {
    hebrew: "קָהָל",
    translation: "asamblea, comunidad",
    options: ["asamblea, comunidad", "desierto, soledad", "casa, hogar", "guerra, batalla"],
  },
  {
    hebrew: "שָׁאַר",
    translation: "quedar; dejar",
    options: ["quedar; dejar", "consumir, agotar", "llegar, venir", "empezar, comenzar"],
  },
  {
    hebrew: "שָׁכַן",
    translation: "instalarse, habitar, acampar, establecer",
    options: [
      "instalarse, habitar, acampar, establecer",
      "viajar, marchar",
      "huir, abandonar",
      "vender, comerciar",
    ],
  },
  {
    hebrew: "שָׁלַךְ",
    translation: "arrojar, lanzar",
    options: ["arrojar, lanzar", "recoger, juntar", "tomar, agarrar", "guardar, conservar"],
  },
];

export async function seedCatedraSemana3(database = db) {
  console.log("🏛️ Sembrando Módulo Cátedra UNACH (Semana 3)...");

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

  // 3. Crear Lección contenedora para la Semana 3
  const lessonId = "catedra-lesson-semana-3";
  await database
    .insert(lessons)
    .values({
      id: lessonId,
      title: "Semana 3: Vocabulario (Frecuencia 133-121)",
      description: "Cátedra de Hebreo I & II - UNACH",
      order: 103,
      moduleIndex: 99,
      xpReward: 50,
      course: "hebrew",
    })
    .onConflictDoUpdate({
      target: lessons.id,
      set: {
        title: "Semana 3: Vocabulario (Frecuencia 133-121)",
        description: "Cátedra de Hebreo I & II - UNACH",
      },
    });

  // 4. Crear reactivos de ejercicios de opción múltiple para cada palabra
  const exerciseIds: string[] = [];

  for (let i = 0; i < WEEK_3_WORDS.length; i++) {
    const item = WEEK_3_WORDS[i];
    const exerciseId = `ex-catedra-s3-${i + 1}`;
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
        hint: "Palabra del rango de frecuencia 133-121",
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

  // 5. Crear o Actualizar el Quiz Académico para la Semana 3
  const quizId = "catedra-semana-3";
  await database
    .insert(quizzes)
    .values({
      id: quizId,
      teacherId: teacherId,
      title: "Semana 3: Vocabulario (Frecuencia 133-121)",
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
        title: "Semana 3: Vocabulario (Frecuencia 133-121)",
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

  // 7. Configurar la Semana 3 para que quede PAUSADA por defecto
  await database
    .insert(catedraControl)
    .values({
      id: "semana-3",
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

  console.log("✅ Cátedra Semana 3 sembrada con éxito (estado: PAUSADA).");
}

// Permitir ejecución independiente directa
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCatedraSemana3()
    .then(() => {
      console.log("🎉 Seed Cátedra Semana 3 completado.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error en seed Cátedra Semana 3:", err);
      process.exit(1);
    });
}

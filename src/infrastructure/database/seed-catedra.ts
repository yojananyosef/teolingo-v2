import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { exercises, lessons, quizQuestions, quizzes, users } from "./schema";

const JENNIFER_TEACHER_ID = "b11fb87d-6b57-4e60-8853-3a9568415f6a";

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

export const WEEK_2_WORDS = [
  {
    hebrew: "אָז | מֵאָז",
    translation: "entonces",
    options: ["entonces", "ahora", "después", "nunca"],
  },
  {
    hebrew: "זָבַח",
    translation: "matar, sacrificar",
    options: ["matar, sacrificar", "comer, cenar", "bendecir, orar", "quemar, ofrecer"],
  },
  { hebrew: "חָכָם", translation: "sabio", options: ["sabio", "fuerte", "rico", "justo"] },
  {
    hebrew: "חָלַל",
    translation: "ser profanado; profanar, violar; comenzar",
    options: [
      "ser profanado; profanar, violar; comenzar",
      "santificar, consagrar",
      "destruir, asolar",
      "cantar, alabar",
    ],
  },
  {
    hebrew: "חָנָה",
    translation: "acampar",
    options: ["acampar", "viajar, marchar", "construir, edificar", "vender, comprar"],
  },
  {
    hebrew: "יַחַד | יַחְדָּו",
    translation: "todos; juntamente, al mismo tiempo",
    options: [
      "todos; juntamente, al mismo tiempo",
      "separadamente, uno a uno",
      "antes, anteriormente",
      "después, más tarde",
    ],
  },
  { hebrew: "יַיִן", translation: "vino", options: ["vino", "agua", "leche", "aceite"] },
  {
    hebrew: "יָמִין",
    translation: "(mano) derecha; sur",
    options: ["(mano) derecha; sur", "(mano) izquierda; norte", "cabeza; arriba", "pie; abajo"],
  },
  { hebrew: "יֵשׁ", translation: "hay", options: ["hay", "no hay", "había", "habrá"] },
  {
    hebrew: "כְּמוֹ",
    translation: "como, tal como",
    options: ["como, tal como", "pero, sin embargo", "porque, ya que", "cuando, mientras"],
  },
  {
    hebrew: "כִּסֵּא",
    translation: "asiento, trono",
    options: ["asiento, trono", "mesa, altar", "puerta, entrada", "casa, palacio"],
  },
  { hebrew: "מִסְפָּר", translation: "número", options: ["número", "nombre", "libro", "palabra"] },
  {
    hebrew: "מַעַל",
    translation: "arriba; encima",
    options: ["arriba; encima", "abajo; debajo", "dentro; interior", "fuera; exterior"],
  },
  {
    hebrew: "מִשְׁכָּן",
    translation: "habitación, tabernáculo, santuario",
    options: [
      "habitación, tabernáculo, santuario",
      "ciudad, pueblo",
      "campo, desierto",
      "monte, colina",
    ],
  },
  {
    hebrew: "נוּחַ",
    translation: "descansar, apoyarse, aguardar, detenerse; colocar, instalar",
    options: [
      "descansar, apoyarse, aguardar, detenerse; colocar, instalar",
      "correr, huir",
      "trabajar, luchar",
      "caer, tropezar",
    ],
  },
  {
    hebrew: "נַחַל",
    translation: "torrente, río, cañada",
    options: ["torrente, río, cañada", "mar, océano", "pozo, fuente", "nube, lluvia"],
  },
  {
    hebrew: "נְחֹשֶׁת",
    translation: "cobre, bronce",
    options: ["cobre, bronce", "oro, plata", "hierro, piedra", "madera, barro"],
  },
  {
    hebrew: "סוּס | סוּסָה",
    translation: "caballo",
    options: ["caballo", "asno, burro", "camello", "buey, toro"],
  },
  {
    hebrew: "עֲבֹדָה",
    translation: "servicio",
    options: ["servicio", "guerra, batalla", "fiesta, banquete", "reposo, descanso"],
  },
  {
    hebrew: "עֶרֶב",
    translation: "anochecer, atardecer",
    options: ["anochecer, atardecer", "mañana, amanecer", "mediodía", "noche profunda"],
  },
  {
    hebrew: "פָּנָה",
    translation: "volverse, dar hacia, dirigirse a",
    options: [
      "volverse, dar hacia, dirigirse a",
      "quedarse, parar",
      "subir, ascender",
      "bajar, descender",
    ],
  },
  {
    hebrew: "קָרָא",
    translation: "suceder, salir al encuentro, encontrarse",
    options: [
      "suceder, salir al encuentro, encontrarse",
      "llamar, proclamar",
      "leer, recitar",
      "enviar, mandar",
    ],
  },
  {
    hebrew: "רָדַף",
    translation: "perseguir, seguir",
    options: ["perseguir, seguir", "huir, escapar", "esperar, aguardar", "ayudar, socorrer"],
  },
  {
    hebrew: "שַׁ-",
    translation: "quien, cual; que",
    options: ["quien, cual; que", "porque, debido a", "si, en caso de", "no, tampoco"],
  },
  { hebrew: "שְׁמוּאֵל", translation: "Samuel", options: ["Samuel", "Saúl", "David", "Salomón"] },
  { hebrew: "שֶׁמֶשׁ", translation: "sol", options: ["sol", "luna", "estrella", "cielo"] },
];

export async function ensureCatedraSeeded(database = db) {
  const [existingQuiz] = await database
    .select({ id: quizzes.id })
    .from(quizzes)
    .where(eq(quizzes.id, "catedra-semana-1"))
    .limit(1);

  if (!existingQuiz) {
    await seedCatedra(database);
  }
}

export async function seedCatedra(database = db) {
  console.log("🏛️ Sembrando Módulo Cátedra UNACH (Semana 1)...");

  // NOTA: @libsql/client/web no soporta PRAGMA statements.
  // No se necesitan: los inserts están en el orden correcto de FK.

  // 1. Resolver teacherId de forma robusta
  let teacherId: string;

  // Paso A: intentar insertar a Jennifer con su UUID canónico
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
    .onConflictDoNothing(); // Salta si ID o email ya existen

  // Paso B: verificar si su UUID canónico está en la BD
  const [byId] = await database
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, JENNIFER_TEACHER_ID))
    .limit(1);

  if (byId) {
    teacherId = byId.id;
  } else {
    // El insert fue saltado por conflicto de email → buscar quién tiene ese email
    const [byEmail] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, "jennifer.coleman@unach.cl"))
      .limit(1);

    if (byEmail) {
      teacherId = byEmail.id;
    } else {
      // Fallback: cualquier docente, o cualquier usuario
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
      updatedByName: "Prof.ª Jennifer Coleman",
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: quizzes.id,
      set: {
        teacherId: teacherId,
        title: "Semana 1: Vocabulario (Frecuencia 159-144)",
        description: "Evaluación formativa semestral - 10 intentos máximo",
        allowedAttempts: 10,
        timeLimitSeconds: 600,
        isActive: true,
        updatedByName: "Prof.ª Jennifer Coleman",
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

  console.log("✅ Cátedra Semana 1 sembrada con éxito asignada a la docente Jennifer Coleman.");

  // --- SEMANA 2 SEED ---
  const lesson2Id = "catedra-lesson-semana-2";
  await database
    .insert(lessons)
    .values({
      id: lesson2Id,
      title: "Semana 2: Vocabulario (Frecuencia 143-134)",
      description: "Cátedra de Hebreo I & II - UNACH",
      order: 102,
      moduleIndex: 99,
      xpReward: 50,
      course: "hebrew",
    })
    .onConflictDoUpdate({
      target: lessons.id,
      set: {
        title: "Semana 2: Vocabulario (Frecuencia 143-134)",
        description: "Cátedra de Hebreo I & II - UNACH",
      },
    });

  const exercise2Ids: string[] = [];
  for (let i = 0; i < WEEK_2_WORDS.length; i++) {
    const item = WEEK_2_WORDS[i];
    const exerciseId = `ex-catedra-s2-${i + 1}`;
    exercise2Ids.push(exerciseId);

    await database
      .insert(exercises)
      .values({
        id: exerciseId,
        lessonId: lesson2Id,
        type: "multiple-choice",
        question: `¿Cuál es la traducción de: ${item.hebrew}?`,
        correctAnswer: item.translation,
        options: JSON.stringify(item.options),
        hebrewText: item.hebrew,
        hint: "Palabra del rango de frecuencia 143-134",
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

  const quiz2Id = "catedra-semana-2";
  await database
    .insert(quizzes)
    .values({
      id: quiz2Id,
      teacherId: teacherId,
      title: "Semana 2: Vocabulario (Frecuencia 143-134)",
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
        title: "Semana 2: Vocabulario (Frecuencia 143-134)",
        description: "Evaluación formativa semestral - 10 intentos máximo",
        allowedAttempts: 10,
        timeLimitSeconds: 600,
        isActive: true,
        updatedByName: "Prof.ª Jennifer Coleman",
        updatedAt: new Date(),
      },
    });

  for (let i = 0; i < exercise2Ids.length; i++) {
    await database
      .insert(quizQuestions)
      .values({
        id: `qq-${quiz2Id}-${i + 1}`,
        quizId: quiz2Id,
        exerciseId: exercise2Ids[i],
        order: i + 1,
      })
      .onConflictDoNothing();
  }

  console.log("✅ Cátedra Semana 2 sembrada con éxito.");
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

import { db } from "./db";
import { exercises, lessons, flashcards } from "./schema";

async function main() {
  console.log("📈 Iniciando la migración SEGURA de Frecuencia Bíblica...");
  console.log("Esta migración NO borrará a los usuarios ni su progreso.");

  try {
    // 1. Insertar Lecciones
    console.log("📚 Insertando lecciones de frecuencia...");
    await db
      .insert(lessons)
      .values([
        {
          id: "freq-2200-5000",
          title: "Frecuencia 5000-2200",
          description: "Palabras que aparecen entre 5000 y 2200 veces en el Tanaj.",
          order: 900,
          xpReward: 0,
        },
        {
          id: "freq-1000-2199",
          title: "Frecuencia 2199-1000",
          description: "Palabras que aparecen entre 2199 y 1000 veces en el Tanaj.",
          order: 901,
          xpReward: 0,
        },
        {
          id: "freq-730-999",
          title: "Frecuencia 999-730",
          description: "Palabras que aparecen entre 999 y 730 veces en el Tanaj.",
          order: 902,
          xpReward: 0,
        },
        {
          id: "freq-500-729",
          title: "Frecuencia 729-500",
          description: "Palabras que aparecen entre 729 y 500 veces en el Tanaj.",
          order: 903,
          xpReward: 0,
        },
        {
          id: "freq-400-499",
          title: "Frecuencia 499-400",
          description: "Palabras que aparecen entre 499 y 400 veces en el Tanaj.",
          order: 904,
          xpReward: 0,
        },
      ])
      .onConflictDoNothing(); // Si ya existen, no hacer nada

    // 2. Insertar Vocabulario
    console.log("📝 Preparando vocabulario...");
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
      {
        h: "הֲ",
        s: "partícula interrogativa",
        o: ["partícula interrogativa", "el, la", "que, el cual", "no"],
      },
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
      {
        h: "יָשַׁב",
        s: "sentarse, habitar",
        o: ["sentarse, habitar", "caminar", "estar de pie", "ir"],
      },
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

    const freq3_vocab = [
      { h: "אֲדֹנָי", s: "señor, el Señor" },
      { h: "אֶחָד | אַחַת", s: "uno, una" },
      { h: "אֵין | אַיִן", s: "no hay" },
      { h: "אָכַל", s: "comer, devorar" },
      { h: "אַל", s: "no" },
      { h: "אֵלֶּה", s: "estos, estas" },
      { h: "אִשָּׁה | נָשִׁים", s: "mujer, mujeres" },
      { h: "אַתָּה | אַתְּ", s: "tú" },
      { h: "גַּם", s: "también, incluso, aún" },
      { h: "יָדַע", s: "conocer, percibir" },
      { h: "יְהוּדָה | יְהוּדִי", s: "Judá, judío" },
      { h: "כֹּהֵן", s: "sacerdote" },
      { h: "לֵבָב | לֵב", s: "corazón" },
      { h: "לָקַח", s: "tomar" },
      { h: "מָה | מֶה | מַה", s: "¿qué? ¿cómo?" },
      { h: "מוּת", s: "morir" },
      { h: "מֹשֶׁה", s: "Moisés" },
      { h: "נֶפֶשׁ", s: "vida, ser, alma, cuello" },
      { h: "עֶבֶד", s: "siervo" },
      { h: "עַיִן", s: "ojo, manantial" },
      { h: "עָלָה", s: "subir" },
      { h: "עֲשָׂרִים | עֶשֶׂר", s: "diez, veinte" },
      { h: "קָרָא", s: "llamar, encontrar, leer" },
      { h: "שָׁלַח", s: "estirar, soltar, enviar" },
      { h: "שָׁם", s: "allí" },
      { h: "שֵׁם", s: "nombre" },
      { h: "שָׁנָה", s: "año" },
      { h: "שְׁתַּיִם | שְׁנַיִם", s: "dos" },
    ];

    const freq4_vocab = [
      { h: "אָדָם", s: "hombre" },
      { h: "אָח", s: "hermano" },
      { h: "אַחַר", s: "atrás, detrás, después" },
      { h: "בַּת", s: "hija" },
      { h: "גָּדוֹל", s: "grande" },
      { h: "גּוֹי", s: "pueblo, nación" },
      { h: "דֶּרֶךְ", s: "camino, viaje, costumbre" },
      { h: "הִיא", s: "ella" },
      { h: "הָר", s: "montaña, cordillera" },
      { h: "טוֹב", s: "bueno, bondad; ser bueno" },
      { h: "יְרוּשָׁלַם", s: "Jerusalén" },
      { h: "כַּאֲשֶׁר", s: "como" },
      { h: "כֹּה", s: "así" },
      { h: "כֵּן", s: "recto, correcto; correctamente" },
      { h: "מֵאָה", s: "cien, doscientos" },
      { h: "מַיִם", s: "agua" },
      { h: "מִצְרַיִם | מִצְרִי", s: "Egipto, egipcio" },
      { h: "נָכָה", s: "golpear, herir" },
      { h: "נָשָׂא", s: "levantar, llevar" },
      { h: "עָבַר", s: "pasar, transgredir" },
      { h: "עָמַד", s: "pararse" },
      { h: "קוּם", s: "levantarse, pararse" },
      { h: "רֹאשׁ", s: "cabeza" },
      { h: "רַע | רָעָה | רָעַע", s: "malo, malvado" },
      { h: "שִׂים", s: "poner, colocar" },
      { h: "שָׁלוֹשׁ | שְׁלוֹשִׁים", s: "tres, treinta" },
    ];

    const freq5_vocab = [
      { h: "אֶלֶף", s: "mil; tribu, clan" },
      { h: "אַרְבַּע | אַרְבָּעִים", s: "cuatro; cuarenta" },
      { h: "חָמֵשׁ | חֲמִשִּׁים", s: "cinco; cincuenta" },
      { h: "חֶרֶב", s: "espada" },
      { h: "יָלַד", s: "dar a luz, engendrar" },
      { h: "מִזְבֵּחַ", s: "altar" },
      { h: "מִי", s: "¿quién?" },
      { h: "מָצָא", s: "encontrar; presentar" },
      { h: "מִשְׁפָּט", s: "juicio, costumbre, justicia" },
      { h: "נָא", s: "por favor" },
      { h: "נָפַל", s: "caer" },
      { h: "עוֹד", s: "aún, todavía, mientras" },
      { h: "עוֹלָם", s: "larga duración, eternidad, siempre" },
      { h: "עַתָּה", s: "ahora" },
      { h: "פֶּה", s: "boca; según" },
      { h: "צָבָא", s: "ejército, guerra, servicio militar" },
      { h: "צָוָה", s: "mandar, ordenar" },
      { h: "קָדוֹשׁ", s: "santo, cosa santa" },
      { h: "קוֹל", s: "voz, sonido" },
      { h: "רַב", s: "mucho, abundante; jefe" },
      { h: "שַׂר", s: "jefe, dirigente, príncipe" },
      { h: "שָׁאוּל", s: "Saúl" },
      { h: "שֶׁבַע | שִׁבְעִים", s: "siete; setenta" },
      { h: "שָׁמַיִם", s: "cielo" },
      { h: "שָׁמַר", s: "guardar, cuidar, vigilar" },
      { h: "תָּוֶךְ", s: "medio, mitad, centro, interior" },
      { h: "תַּחַת", s: "debajo, abajo, en lugar de" },
    ];

    console.log("📝 Insertando ejercicios...");
    await db
      .insert(exercises)
      .values([
        ...freq1_vocab.map((v, i) => ({
          id: `freq1-${i + 1}`,
          lessonId: "freq-2200-5000",
          type: "translation",
          question: `¿Qué significa '${v.h}'?`,
          correctAnswer: v.s,
          options: JSON.stringify(v.o.sort(() => Math.random() - 0.5)),
          hebrewText: v.h,
          order: i + 1,
        })),
        ...freq2_vocab.map((v, i) => ({
          id: `freq2-${i + 1}`,
          lessonId: "freq-1000-2199",
          type: "translation",
          question: `¿Qué significa '${v.h}'?`,
          correctAnswer: v.s,
          options: JSON.stringify(v.o.sort(() => Math.random() - 0.5)),
          hebrewText: v.h,
          order: i + 1,
        })),
        ...freq3_vocab.map((v, i) => ({
          id: `freq3-${i + 1}`,
          lessonId: "freq-730-999",
          type: "translation",
          question: `¿Qué significa '${v.h}'?`,
          correctAnswer: v.s,
          options: JSON.stringify(
            [
              v.s,
              freq3_vocab[(i + 1) % freq3_vocab.length].s,
              freq3_vocab[(i + 5) % freq3_vocab.length].s,
              freq3_vocab[(i + 9) % freq3_vocab.length].s,
            ].sort(() => Math.random() - 0.5),
          ),
          hebrewText: v.h,
          order: i + 1,
        })),
        ...freq4_vocab.map((v, i) => ({
          id: `freq4-${i + 1}`,
          lessonId: "freq-500-729",
          type: "translation",
          question: `¿Qué significa '${v.h}'?`,
          correctAnswer: v.s,
          options: JSON.stringify(
            [
              v.s,
              freq4_vocab[(i + 1) % freq4_vocab.length].s,
              freq4_vocab[(i + 5) % freq4_vocab.length].s,
              freq4_vocab[(i + 9) % freq4_vocab.length].s,
            ].sort(() => Math.random() - 0.5),
          ),
          hebrewText: v.h,
          order: i + 1,
        })),
        ...freq5_vocab.map((v, i) => ({
          id: `freq5-${i + 1}`,
          lessonId: "freq-400-499",
          type: "translation",
          question: `¿Qué significa '${v.h}'?`,
          correctAnswer: v.s,
          options: JSON.stringify(
            [
              v.s,
              freq5_vocab[(i + 1) % freq5_vocab.length].s,
              freq5_vocab[(i + 5) % freq5_vocab.length].s,
              freq5_vocab[(i + 9) % freq5_vocab.length].s,
            ].sort(() => Math.random() - 0.5),
          ),
          hebrewText: v.h,
          order: i + 1,
        })),
      ])
      .onConflictDoNothing();

    console.log("📇 Insertando flashcards de frecuencia...");
    await db
      .insert(flashcards)
      .values([
        ...freq1_vocab.map((v, i) => ({
          id: `fc-freq1-${i + 1}`,
          category: "freq1",
          type: "vocabulary",
          frontContent: JSON.stringify({ text: v.h }),
          backContent: JSON.stringify({ meaning: v.s }),
          order: i + 1,
        })),
        ...freq2_vocab.map((v, i) => ({
          id: `fc-freq2-${i + 1}`,
          category: "freq2",
          type: "vocabulary",
          frontContent: JSON.stringify({ text: v.h }),
          backContent: JSON.stringify({ meaning: v.s }),
          order: i + 1,
        })),
        ...freq3_vocab.map((v, i) => ({
          id: `fc-freq3-${i + 1}`,
          category: "freq3",
          type: "vocabulary",
          frontContent: JSON.stringify({ text: v.h }),
          backContent: JSON.stringify({ meaning: v.s }),
          order: i + 1,
        })),
        ...freq4_vocab.map((v, i) => ({
          id: `fc-freq4-${i + 1}`,
          category: "freq4",
          type: "vocabulary",
          frontContent: JSON.stringify({ text: v.h }),
          backContent: JSON.stringify({ meaning: v.s }),
          order: i + 1,
        })),
        ...freq5_vocab.map((v, i) => ({
          id: `fc-freq5-${i + 1}`,
          category: "freq5",
          type: "vocabulary",
          frontContent: JSON.stringify({ text: v.h }),
          backContent: JSON.stringify({ meaning: v.s }),
          order: i + 1,
        })),
      ])
      .onConflictDoNothing();

    console.log("✅ Migración de Frecuencia Bíblica completada con éxito!");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  }
}

main();

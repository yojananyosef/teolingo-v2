import { exercises, lessons } from "./schema";
import { db } from "./db";

async function main() {
  console.log("📈 Iniciando la migración SEGURA de Frecuencia Bíblica...");
  console.log("Esta migración NO borrará a los usuarios ni su progreso.");

  try {
    // 1. Insertar Lecciones
    console.log("📚 Insertando lecciones de frecuencia...");
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
    ]).onConflictDoNothing(); // Si ya existen, no hacer nada

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
      { h: "בֹּוא", s: "venir, entrar", o: ["venir, entrar", "salir", "ir", "volver"] },
      { h: "בֵּן", s: "hijo", o: ["hijo", "padre", "hermano", "rey"] },
      { h: "הַּ", s: "el, la", o: ["el, la", "un, una", "este, esta", "y, también"] },
      { h: "הֲ", s: "partícula interrogativa", o: ["partícula interrogativa", "el, la", "que, el cual", "no"] },
      { h: "הָיָה", s: "ser, estar", o: ["ser, estar", "hacer", "decir", "ir"] },
      { h: "וְ", s: "y, también", o: ["y, también", "en", "como", "no"] },
      { h: "יְהוָה", s: "el Señor", o: ["el Señor", "Dios", "rey", "profeta"] },
      { h: "יֹום", s: "día", o: ["día", "noche", "año", "tierra"] },
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
      { h: "הּוא", s: "él", o: ["él", "ella", "yo", "tú"] },
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
      { h: "שּׁוב", s: "volver", o: ["volver", "salir", "ir", "venir"] },
      { h: "שָׁמַע", s: "oír, escuchar", o: ["oír, escuchar", "ver", "hablar", "decir"] },
    ];

    console.log("📝 Insertando ejercicios...");
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
    ]).onConflictDoNothing();

    console.log("✅ Migración de Frecuencia Bíblica completada con éxito!");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  }
}

main();

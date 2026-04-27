import type { InferInsertModel } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import { db } from "./db";
import { exercises, lessons } from "./schema";

type LessonInsert = InferInsertModel<typeof lessons>;
type ExerciseInsert = InferInsertModel<typeof exercises>;

const sectionLessons: LessonInsert[] = [
  {
    id: "section-1-alphabet-opt",
    title: "Subsección informativa: Alfabeto",
    description:
      "Section 1: The Basics of Hebrew Writing. Panorama del alfabeto hebreo (informativa, no evaluada).",
    order: 1,
    xpReward: 0,
  },
  {
    id: "section-1-vowels-opt",
    title: "Subsección informativa: Vocales",
    description:
      "Section 1: The Basics of Hebrew Writing. Mapa general de vocales (BBH 2.1-2.13), letras vocálicas y reglas clave (informativa, no evaluada).",
    order: 2,
    xpReward: 0,
  },
  {
    id: "section-1-syllabification-opt",
    title: "Subsección informativa: Silabificación",
    description:
      "Section 1: The Basics of Hebrew Writing. Cómo se forman sílabas hebreas de forma gradual (informativa, no evaluada).",
    order: 3,
    xpReward: 0,
  },
  {
    id: "lesson-1-1",
    title: "Lección 1: Alef-Bet esencial",
    description:
      "Section 1: The Basics of Hebrew Writing. Reconocimiento base de consonantes para iniciar la lectura.",
    order: 4,
    xpReward: 30,
  },
  {
    id: "lesson-1-2-vowels-consonants",
    title: "Lección 14: Lectura Integrada (Deuteronomio 6:5)",
    description:
      "Aplicación final: lectura de texto consonántico y texto vocalizado después de dominar los cuadros vocálicos.",
    order: 17,
    xpReward: 35,
  },
  {
    id: "lesson-1-3-vowels-long",
    title: "Lección 2: Vowel Chart 1 (Long Vowels)",
    description: "Vocales largas variables: Qamets, Tsere, Holem.",
    order: 5,
    xpReward: 35,
  },
  {
    id: "lesson-1-4-vowels-short",
    title: "Lección 3: Vowel Chart 2 (Short Vowels)",
    description: "Vocales cortas: Pathach, Seghol, Hireq, Qamets Hatuf, Qibbuts.",
    order: 6,
    xpReward: 35,
  },
  {
    id: "lesson-1-5-vowels-reduced",
    title: "Lección 4: Vowel Chart 3 (Reduced)",
    description: "Vocales reducidas (hateph): Hateph Pathach, Hateph Seghol, Hateph Qamets.",
    order: 7,
    xpReward: 35,
  },
  {
    id: "lesson-1-6-vowels-summary-lsr",
    title: "Lección 5: Resumen de Vocales",
    description: "Resumen integrado de vocales largas, cortas y reducidas.",
    order: 8,
    xpReward: 30,
  },
  {
    id: "lesson-1-7-vowel-letters-he",
    title: "Lección 6: Letras Vocálicas con He",
    description: "Qamets He, Tsere He, Seghol He, Holem He. Uso al final de palabra.",
    order: 9,
    xpReward: 35,
  },
  {
    id: "lesson-1-8-vowel-letters-waw",
    title: "Lección 7: Letras Vocálicas con Waw",
    description: "Holem Waw y Shureq como vocales largas inmutables.",
    order: 10,
    xpReward: 35,
  },
  {
    id: "lesson-1-9-vowel-letters-yod",
    title: "Lección 8: Letras Vocálicas con Yod",
    description: "Tsere Yod, Seghol Yod, Hireq Yod como vocales largas inmutables.",
    order: 11,
    xpReward: 35,
  },
  {
    id: "lesson-1-10-vowel-letters-summary",
    title: "Lección 9: Resumen de Letras Vocálicas",
    description: "Panorama de vocales escritas con He, Waw y Yod.",
    order: 12,
    xpReward: 30,
  },
  {
    id: "lesson-1-11-defective-writing",
    title: "Lección 10: Escritura Defectiva",
    description: "Contraste entre escritura plena y defectiva en hebreo bíblico.",
    order: 13,
    xpReward: 35,
  },
  {
    id: "lesson-1-12-shewa",
    title: "Lección 11: Shewa",
    description: "Shewa silente y Shewa vocal: función y diferencias clave.",
    order: 14,
    xpReward: 35,
  },
  {
    id: "lesson-1-13-daghesh-forte",
    title: "Lección 12: Daghesh Forte",
    description: "Diferencia entre Daghesh Forte y Daghesh Lene; duplicación consonántica.",
    order: 15,
    xpReward: 35,
  },
  {
    id: "lesson-1-14-gutturals-resh",
    title: "Lección 13: Guturales y Resh",
    description: "Preferencias de guturales y ר: sin Daghesh Forte, sin Shewa vocal en guturales.",
    order: 16,
    xpReward: 35,
  },
  {
    id: "freq-2200-5000",
    title: "Frecuencia Bíblica Nivel 1",
    description: "Vocabulario más frecuente (5000-2200 apariciones).",
    order: 900,
    xpReward: 0,
  },
  {
    id: "freq-1000-2199",
    title: "Frecuencia Bíblica Nivel 2",
    description: "Vocabulario frecuente intermedio (2199-1000 apariciones).",
    order: 901,
    xpReward: 0,
  },
  {
    id: "freq-730-999",
    title: "Frecuencia Bíblica Nivel 3",
    description: "Vocabulario frecuente (999-730 apariciones).",
    order: 902,
    xpReward: 0,
  },
  {
    id: "freq-500-729",
    title: "Frecuencia Bíblica Nivel 4",
    description: "Vocabulario frecuente (729-500 apariciones).",
    order: 903,
    xpReward: 0,
  },
  {
    id: "freq-400-499",
    title: "Frecuencia Bíblica Nivel 5",
    description: "Vocabulario frecuente (499-400 apariciones).",
    order: 904,
    xpReward: 0,
  },
  {
    id: "practice-nouns",
    title: "Clasificación Morfológica",
    description: "Analiza sustantivos por su género, número y significado.",
    order: 905,
    xpReward: 0,
  },
  {
    id: "practice-adjectives",
    title: "Clasificación de Adjetivos",
    description: "Analiza adjetivos por género, número, significado y uso adjetival.",
    order: 906,
    xpReward: 0,
  },
  {
    id: "practice-prefixes",
    title: "Uso de Prefijos",
    description: "Analiza artículo, conjunción y preposiciones inseparables en frases hebreas.",
    order: 907,
    xpReward: 0,
  },
  {
    id: "practice-pronouns",
    title: "Pronombres Independientes",
    description:
      "Practica pronombres personales independientes con frases simples en contexto.",
    order: 908,
    xpReward: 0,
  },
  {
    id: "practice-suffixes",
    title: "Sufijos Pronominales",
    description:
      "Practica sustantivos con sufijos pronominales e identifica persona, género y número.",
    order: 909,
    xpReward: 0,
  },
];

const alphabetCoreConsonants = [
  { name: "Alef", char: "א", options: ["א", "ה", "ע", "ח"] },
  { name: "Bet", char: "ב", options: ["ב", "כ", "מ", "נ"] },
  { name: "Guimel", char: "ג", options: ["ג", "ד", "ר", "ז"] },
  { name: "Dalet", char: "ד", options: ["ד", "ר", "כ", "ב"] },
  { name: "He", char: "ה", options: ["ה", "ח", "א", "ע"] },
  { name: "Waw", char: "ו", options: ["ו", "ז", "י", "נ"] },
  { name: "Zayin", char: "ז", options: ["ז", "ו", "נ", "ג"] },
  { name: "Het", char: "ח", options: ["ח", "ה", "ע", "א"] },
  { name: "Tet", char: "ט", options: ["ט", "ת", "צ", "ס"] },
  { name: "Yod", char: "י", options: ["י", "ו", "נ", "ז"] },
  { name: "Kaf", char: "כ", options: ["כ", "ב", "פ", "מ"] },
  { name: "Lamed", char: "ל", options: ["ל", "ך", "ד", "ר"] },
  { name: "Mem", char: "מ", options: ["מ", "ס", "נ", "ם"] },
  { name: "Nun", char: "נ", options: ["נ", "ו", "ז", "ן"] },
  { name: "Samekh", char: "ס", options: ["ס", "ש", "ם", "מ"] },
  { name: "Ayin", char: "ע", options: ["ע", "א", "ה", "ח"] },
  { name: "Pe", char: "פ", options: ["פ", "ב", "כ", "ף"] },
  { name: "Tsade", char: "צ", options: ["צ", "ט", "ץ", "ס"] },
  { name: "Qof", char: "ק", options: ["ק", "כ", "ג", "ת"] },
  { name: "Resh", char: "ר", options: ["ר", "ד", "ל", "ו"] },
  { name: "Shin", char: "ש", options: ["ש", "ס", "צ", "ת"] },
  { name: "Tav", char: "ת", options: ["ת", "ט", "ד", "ש"] },
] as const;

const alphabetRecognitionExercises: ExerciseInsert[] = alphabetCoreConsonants.map((item, index) => ({
  id: `lesson-1-1-ex-${index + 1}`,
  lessonId: "lesson-1-1",
  type: "multiple-choice",
  question: `Selecciona la letra ${item.name}`,
  correctAnswer: item.char,
  options: JSON.stringify(item.options),
  order: index + 1,
}));

const freqLevel1Vocabulary = [
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
] as const;

const freqLevel2Vocabulary = [
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
] as const;

const freqLevel3Vocabulary = [
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
] as const;

const freqLevel4Vocabulary = [
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
] as const;

const freqLevel5Vocabulary = [
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
] as const;

const freqLevel1Exercises: ExerciseInsert[] = freqLevel1Vocabulary.map((v, i) => ({
  id: `freq1-${i + 1}`,
  lessonId: "freq-2200-5000",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify(v.o),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel2Exercises: ExerciseInsert[] = freqLevel2Vocabulary.map((v, i) => ({
  id: `freq2-${i + 1}`,
  lessonId: "freq-1000-2199",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify(v.o),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel3Exercises: ExerciseInsert[] = freqLevel3Vocabulary.map((v, i) => ({
  id: `freq3-${i + 1}`,
  lessonId: "freq-730-999",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel3Vocabulary[(i + 1) % freqLevel3Vocabulary.length].s,
    freqLevel3Vocabulary[(i + 5) % freqLevel3Vocabulary.length].s,
    freqLevel3Vocabulary[(i + 9) % freqLevel3Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel4Exercises: ExerciseInsert[] = freqLevel4Vocabulary.map((v, i) => ({
  id: `freq4-${i + 1}`,
  lessonId: "freq-500-729",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel4Vocabulary[(i + 1) % freqLevel4Vocabulary.length].s,
    freqLevel4Vocabulary[(i + 5) % freqLevel4Vocabulary.length].s,
    freqLevel4Vocabulary[(i + 9) % freqLevel4Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel5Exercises: ExerciseInsert[] = freqLevel5Vocabulary.map((v, i) => ({
  id: `freq5-${i + 1}`,
  lessonId: "freq-400-499",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel5Vocabulary[(i + 1) % freqLevel5Vocabulary.length].s,
    freqLevel5Vocabulary[(i + 5) % freqLevel5Vocabulary.length].s,
    freqLevel5Vocabulary[(i + 9) % freqLevel5Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const nounsPracticeVocabulary = [
  { h: "דָּבָר", g: "m", n: "s", m: "palabra / cosa", d: ["día", "reyes", "hijas"] },
  { h: "יוֹם", g: "m", n: "s", m: "día", d: ["dos días", "reyes", "muro"] },
  { h: "[יָד:r][ַיִם:s]", g: "f", n: "d", m: "manos", d: ["dos días", "pies", "leyes"] },
  { h: "[מְלָכ:r][ִים:s]", g: "m", n: "p", m: "reyes", d: ["hijas", "leyes", "niños"] },
  { h: "[בָּנ:r][וֹת:s]", g: "f", n: "p", m: "hijas", d: ["hija", "leyes", "reyes"] },
  { h: "[תּוֹר:r][וֹת:s]", g: "f", n: "p", m: "leyes", d: ["hijas", "reyes", "manos"] },
  { h: "[חוֹמ:r][ָה:s]", g: "f", n: "s", m: "muro", d: ["arco", "día", "palabra / cosa"] },
  { h: "[קֶשׁ:r][ֶת:s]", g: "f", n: "s", m: "arco", d: ["muro", "hija", "leyes"] },
  { h: "[יוֹמ:r][ַיִם:s]", g: "m", n: "d", m: "dos días", d: ["día", "manos", "pies"] },
  { h: "[רַגְל:r][ַיִם:s]", g: "f", n: "d", m: "pies", d: ["manos", "dos días", "hijas"] },
] as const;

const nounsPracticeExercises: ExerciseInsert[] = nounsPracticeVocabulary.map((entry, index) => ({
  id: `noun-p-${index + 1}`,
  lessonId: "practice-nouns",
  type: "noun-parsing",
  question: "Clasifica este sustantivo hebreo",
  correctAnswer: JSON.stringify({
    gender: entry.g,
    number: entry.n,
    meaning: entry.m,
  }),
  options: JSON.stringify([entry.m, ...entry.d]),
  hebrewText: entry.h,
  order: index + 1,
}));

const adjectivePracticeVocabulary = [
  { h: "[טוֹב:r][ָה:s]", g: "f", n: "s", m: "Buena", d: ["Malo / Malvado", "Sabia", "Santo / Sagrado"] },
  {
    h: "[גְּדוֹל:r][ִים:s]",
    g: "m",
    n: "p",
    m: "Grandes",
    d: ["Rectos / Íntegros / Justos", "Nuevas (también: noticias)", "Pobre / Débil / Escasa"],
  },
  {
    h: "[חֲכָמ:r][וֹת:s]",
    g: "f",
    n: "p",
    m: "Sabias",
    d: ["Grandes", "Nuevas (también: noticias)", "Rectos / Íntegros / Justos"],
  },
  {
    h: "רַע",
    g: "m",
    n: "s",
    m: "Malo / Malvado",
    d: ["Santo / Sagrado", "Mucho / Grande / Numeroso", "Buena"],
  },
  {
    h: "[חֲדָשׁ:r][וֹת:s]",
    g: "f",
    n: "p",
    m: "Nuevas (también: noticias)",
    d: ["Sabias", "Grandes", "Pobre / Débil / Escasa"],
  },
  {
    h: "רַב",
    g: "m",
    n: "s",
    m: "Mucho / Grande / Numeroso",
    d: ["Malo / Malvado", "Santo / Sagrado", "Rectos / Íntegros / Justos"],
  },
  {
    h: "[חֲכָמ:r][ָה:s]",
    g: "f",
    n: "s",
    m: "Sabia",
    d: ["Buena", "Pobre / Débil / Escasa", "Malo / Malvado"],
  },
  {
    h: "קָדוֹשׁ",
    g: "m",
    n: "s",
    m: "Santo / Sagrado",
    d: ["Malo / Malvado", "Mucho / Grande / Numeroso", "Grandes"],
  },
  {
    h: "[יְשָׁר:r][ִים:s]",
    g: "m",
    n: "p",
    m: "Rectos / Íntegros / Justos",
    d: ["Grandes", "Sabias", "Nuevas (también: noticias)"],
  },
  {
    h: "[דַּלּ:r][ָה:s]",
    g: "f",
    n: "s",
    m: "Pobre / Débil / Escasa",
    d: ["Buena", "Sabia", "Nuevas (también: noticias)"],
  },
] as const;

const adjectivePracticeWordExercises: ExerciseInsert[] = adjectivePracticeVocabulary.map((entry, index) => ({
  id: `adj-p-${index + 1}`,
  lessonId: "practice-adjectives",
  type: "adjective-parsing",
  question: "Clasifica este adjetivo hebreo",
  correctAnswer: JSON.stringify({
    gender: entry.g,
    number: entry.n,
    meaning: entry.m,
  }),
  options: JSON.stringify([entry.m, ...entry.d]),
  hebrewText: entry.h,
  order: index + 1,
}));

const adjectivePracticePhrases = [
  {
    m: "El libro es bueno.",
    u: "predicado",
    a: "[טוֹב:r] [הַ:a][סֵּפֶר:r]",
    b: ["[טוֹב:r]", "[הַ:a][סֵּפֶר:r]", "[הַ:a][טּוֹב:r]", "[הָ:a][אָרֶץ:r]"],
  },
  {
    m: "El buen libro.",
    u: "atributivo",
    a: "[הַ:a][סֵּפֶר:r] [הַ:a][טּוֹב:r]",
    b: ["[הַ:a][סֵּפֶר:r]", "[הַ:a][טּוֹב:r]", "[טוֹב:r]", "[יָפ:r][ָה:s]"],
  },
  {
    m: "La buena tierra.",
    u: "atributivo",
    a: "[הָ:a][אָרֶץ:r] [הַ:a][טּוֹב:r][ָה:s]",
    b: ["[הָ:a][אָרֶץ:r]", "[הַ:a][טּוֹב:r][ָה:s]", "[הַ:a][סֵּפֶר:r]", "[הַ:a][טּוֹב:r]"],
  },
  {
    m: "El sabio.",
    u: "sustantivado",
    a: "[הֶ:a][חָכָם:r]",
    b: ["[הֶ:a][חָכָם:r]", "[טוֹב:r]", "[הָ:a][אִשּׁ:r][ָה:s]", "[יָפ:r][ָה:s]"],
  },
  {
    m: "La mujer es hermosa.",
    u: "predicado",
    a: "[הָ:a][אִשּׁ:r][ָה:s] [יָפ:r][ָה:s]",
    b: ["[הָ:a][אִשּׁ:r][ָה:s]", "[יָפ:r][ָה:s]", "[הָ:a][אָרֶץ:r]", "[הַ:a][טּוֹב:r][ָה:s]"],
  },
] as const;

const adjectivePracticePhraseExercises: ExerciseInsert[] = adjectivePracticePhrases.map(
  (entry, index) => ({
    id: `adj-ph-${index + 1}`,
    lessonId: "practice-adjectives",
    type: "word-bank",
    question: `Arma en hebreo (${entry.u}): ${entry.m}`,
    correctAnswer: entry.a,
    options: JSON.stringify(entry.b),
    order: adjectivePracticeWordExercises.length + index + 1,
  }),
);

const adjectivePracticeExercises: ExerciseInsert[] = [
  ...adjectivePracticeWordExercises,
  ...adjectivePracticePhraseExercises,
];

const prefixPracticeEntries = [
  {
    h: "[הַ:a][שָּׁמַיִם:r] [וְ:c][הָ:a][אָרֶץ:r]",
    a: "Traducción: Los cielos y la tierra. Prefijos: הַ=Artículo; וְ=Conjunción; הָ=Artículo.",
  },
  {
    h: "[הַ:a][מֶּלֶךְ:r] [וְ:c][הַ:a][מַּלְכָּה:r]",
    a: "Traducción: El rey y la reina. Prefijos: הַ=Artículo; וְ=Conjunción; הַ=Artículo.",
  },
  {
    h: "[בְּ:p][שָׂדֶה:r]",
    a: "Traducción: En un campo. Prefijo: בְּ=Preposición inseparable (indefinido).",
  },
  {
    h: "[לְ:p][עִיר:r]",
    a: "Traducción: A una ciudad. Prefijo: לְ=Preposición inseparable (a/para/hacia).",
  },
  {
    h: "[בַּ:p][בַּיִת:r] [וּ:c][בַּ:p][שָּׂדֶה:r]",
    a: "Traducción: En la casa y en el campo. Prefijos: בַּ=Preposición+Artículo contraídos; וּ=Conjunción; בַּ=Preposición+Artículo.",
  },
  {
    h: "[טוֹב:r] [הַ:a][סֵּפֶר:r]",
    a: "Traducción: El libro es bueno. Prefijos: הַ=Artículo en el sustantivo.",
  },
  {
    h: "[הַ:a][סֵּפֶר:r] [הַ:a][טּוֹב:r]",
    a: "Traducción: El buen libro. Prefijos: הַ=Artículo en sustantivo y adjetivo.",
  },
  {
    h: "[הָ:a][אָרֶץ:r] [הַ:a][טּוֹב:r][ָה:s]",
    a: "Traducción: La buena tierra. Prefijos: הָ/הַ=Artículo definido en ambos elementos.",
  },
  {
    h: "[הֶ:a][חָכָם:r]",
    a: "Traducción: El sabio. Prefijo: הֶ=Artículo definido (forma con segol).",
  },
  {
    h: "[הָ:a][אִשּׁ:r][ָה:s] [יָפ:r][ָה:s]",
    a: "Traducción: La mujer es hermosa. Prefijo: הָ=Artículo en el sustantivo.",
  },
  {
    h: "[הַ:a][בַּיִת:r]",
    a: "Traducción: La casa. Prefijo: הַ=Artículo; en begadkephat aparece dagesh forte en בּ.",
  },
  {
    h: "[הָ:a][אִישׁ:r]",
    a: "Traducción: El hombre. Prefijo: הָ=Artículo antes de gutural/alef (compensatory lengthening).",
  },
  {
    h: "[וְ:c][הָ:a][אִשּׁ:r][ָה:s]",
    a: "Traducción: Y la mujer. Prefijos: וְ=Conjunción; הָ=Artículo.",
  },
  {
    h: "[וּ:c][מֶלֶךְ:r]",
    a: "Traducción: Y un rey. Prefijo: וּ=Conjunción en forma shureq antes de מ.",
  },
  {
    h: "[בַּ:p][שָּׂדֶה:r]",
    a: "Traducción: En el campo. Prefijo: בַּ=Preposición inseparable con artículo contraído.",
  },
] as const;

const prefixPracticeExercises: ExerciseInsert[] = prefixPracticeEntries.map((entry, index) => ({
  id: `pref-p-${index + 1}`,
  lessonId: "practice-prefixes",
  type: "prefix-parsing",
  question: "Traduce e identifica el uso del/los prefijo(s)",
  correctAnswer: entry.a,
  options: JSON.stringify([
    entry.a,
    prefixPracticeEntries[(index + 1) % prefixPracticeEntries.length].a,
    prefixPracticeEntries[(index + 3) % prefixPracticeEntries.length].a,
    prefixPracticeEntries[(index + 5) % prefixPracticeEntries.length].a,
  ]),
  hebrewText: entry.h,
  order: index + 1,
}));

const pronounPracticeEntries = [
  {
    h: "[אֲנִי:n] [אָדָם:r]",
    p: "1",
    g: "c",
    n: "s",
    m: "Yo soy hombre.",
    d: ["Él es montaña.", "Tú eres grande.", "Nosotros somos pueblo."],
  },
  {
    h: "[אָנֹכִי:n] [אָח:r]",
    p: "1",
    g: "c",
    n: "s",
    m: "Yo soy hermano.",
    d: ["Ella es buena.", "Ellos están detrás.", "Tú eres hija."],
  },
  {
    h: "[אַתָּה:n] [גָּדוֹל:r]",
    p: "2",
    g: "m",
    n: "s",
    m: "Tú eres grande.",
    d: ["Yo soy hombre.", "Tú eres hija.", "Ellas están así."],
  },
  {
    h: "[אַתְּ:n] [בַּת:r]",
    p: "2",
    g: "f",
    n: "s",
    m: "Tú eres hija.",
    d: ["Tú eres grande.", "Ella es buena.", "Ustedes son agua."],
  },
  {
    h: "[אֲנַחְנוּ:n] [גּוֹי:r]",
    p: "1",
    g: "c",
    n: "p",
    m: "Nosotros somos pueblo.",
    d: ["Ustedes están en camino.", "Ellos son cabeza.", "Yo soy hombre."],
  },
  {
    h: "[אַתֶּם:n] [דֶּרֶךְ:r]",
    p: "2",
    g: "m",
    n: "p",
    m: "Ustedes están en camino.",
    d: ["Nosotros somos pueblo.", "Ellos están detrás.", "Tú eres grande."],
  },
  {
    h: "[אַתֵּנָה:n] [מַיִם:r]",
    p: "2",
    g: "f",
    n: "p",
    m: "Ustedes son agua.",
    d: ["Ustedes están en camino.", "Ellas están así.", "Yo soy hermano."],
  },
  {
    h: "[הוּא:n] [הָר:r]",
    p: "3",
    g: "m",
    n: "s",
    m: "Él es montaña.",
    d: ["Yo soy hombre.", "Ella es buena.", "Ellos son cabeza."],
  },
  {
    h: "[הִיא:n] [טוֹב:r]",
    p: "3",
    g: "f",
    n: "s",
    m: "Ella es buena.",
    d: ["Él es montaña.", "Tú eres hija.", "Ellas están así (de este modo)."],
  },
  {
    h: "[הֵם:n] [רֹאשׁ:r]",
    p: "3",
    g: "m",
    n: "p",
    m: "Ellos son cabeza.",
    d: ["Ellos están detrás.", "Nosotros somos pueblo.", "Tú eres grande."],
  },
  {
    h: "[הֵמָּה:n] [אַחַר:r]",
    p: "3",
    g: "m",
    n: "p",
    m: "Ellos están detrás.",
    d: ["Ellos son cabeza.", "Ustedes están en camino.", "Yo soy hermano."],
  },
  {
    h: "[הֵן:n] [כֵּן:r]",
    p: "3",
    g: "f",
    n: "p",
    m: "Ellas están así.",
    d: ["Ellas están así (de este modo).", "Ellos están detrás.", "Tú eres hija."],
  },
  {
    h: "[הֵנָּה:n] [כֹּה:r]",
    p: "3",
    g: "f",
    n: "p",
    m: "Ellas están así (de este modo).",
    d: ["Ellas están así.", "Yo soy hombre.", "Ustedes son agua."],
  },
] as const;

const pronounPracticeExercises: ExerciseInsert[] = pronounPracticeEntries.map((entry, index) => ({
  id: `pron-p-${index + 1}`,
  lessonId: "practice-pronouns",
  type: "pronoun-parsing",
  question: "Identifica el pronombre y selecciona la definición completa de la oración",
  correctAnswer: JSON.stringify({
    person: entry.p,
    gender: entry.g,
    number: entry.n,
    meaning: entry.m,
  }),
  options: JSON.stringify([entry.m, ...entry.d]),
  hebrewText: entry.h,
  order: index + 1,
}));

const suffixPracticeEntries = [
  {
    h: "[שִׁיר:r][ִי:s]",
    p: "1",
    g: "c",
    n: "s",
    m: "mi canción",
    d: ["sus palabras (de él)", "nuestra casa", "su hija (de él)"],
  },
  {
    h: "[דְּבָר:r][ָיו:s]",
    p: "3",
    g: "m",
    n: "s",
    m: "sus palabras (de él)",
    d: ["mi canción", "sus libros (de ellas)", "tu pueblo (de ti, masc. sing.)"],
  },
  {
    h: "[עַם:r][ְךָ:s]",
    p: "2",
    g: "m",
    n: "s",
    m: "tu pueblo (de ti, masc. sing.)",
    d: ["nuestro Dios", "tu vaca (de ti, fem. sing.)", "sus palabras (de él)"],
  },
  {
    h: "[סִפְר:r][ֵיהֶן:s]",
    p: "3",
    g: "f",
    n: "p",
    m: "sus libros (de ellas)",
    d: ["sus hermanos (de ustedes, masc. pl.)", "nuestra casa", "mi esposa"],
  },
  {
    h: "[מַלְכ:r][ַיִךְ:s]",
    p: "2",
    g: "f",
    n: "s",
    m: "tus reyes (de ti, fem. sing.)",
    d: ["tu pueblo (de ti, masc. sing.)", "sus libros (de ellas)", "sus palabras (de él)"],
  },
  {
    h: "[מִנְחֹת:r][ַי:s]",
    p: "1",
    g: "c",
    n: "s",
    m: "mis ofrendas",
    d: ["sus leyes (de él)", "mi canción", "su ciudad (de ella)"],
  },
  {
    h: "[פָרָת:r][ֵךְ:s]",
    p: "2",
    g: "f",
    n: "s",
    m: "tu vaca (de ti, fem. sing.)",
    d: ["tu pueblo (de ti, masc. sing.)", "su hija (de él)", "sus libros (de ellas)"],
  },
  {
    h: "[תּוֹרָת:r][וֹ:s]",
    p: "3",
    g: "m",
    n: "s",
    m: "su ley (de él)",
    d: ["mis ofrendas", "nuestro padre", "sus palabras (de él)"],
  },
  {
    h: "[אֱלֹה:r][ֵינוּ:s]",
    p: "1",
    g: "c",
    n: "p",
    m: "nuestro Dios",
    d: ["nuestro padre", "su casa (de ellos)", "tu pueblo (de ti, masc. sing.)"],
  },
  {
    h: "[אֲח:r][ֵיכֶם:s]",
    p: "2",
    g: "m",
    n: "p",
    m: "sus hermanos (de ustedes, masc. pl.)",
    d: ["sus libros (de ellas)", "su casa (de ellos)", "nuestro Dios"],
  },
  {
    h: "[אִשְׁת:r][ִי:s]",
    p: "1",
    g: "c",
    n: "s",
    m: "mi esposa",
    d: ["su hija (de él)", "mi canción", "su ciudad (de ella)"],
  },
  {
    h: "[עִיר:r][ָהּ:s]",
    p: "3",
    g: "f",
    n: "s",
    m: "su ciudad (de ella)",
    d: ["su casa (de ellos)", "mi esposa", "su ley (de él)"],
  },
  {
    h: "[אָבִי:r][נוּ:s]",
    p: "1",
    g: "c",
    n: "p",
    m: "nuestro padre",
    d: ["nuestro Dios", "sus hermanos (de ustedes, masc. pl.)", "mi canción"],
  },
  {
    h: "[בֵית:r][ָם:s]",
    p: "3",
    g: "m",
    n: "p",
    m: "su casa (de ellos)",
    d: ["su ciudad (de ella)", "sus libros (de ellas)", "nuestro padre"],
  },
  {
    h: "[בִּתּ:r][וֹ:s]",
    p: "3",
    g: "m",
    n: "s",
    m: "su hija (de él)",
    d: ["mi esposa", "mi canción", "su casa (de ellos)"],
  },
] as const;

const suffixPracticeExercises: ExerciseInsert[] = suffixPracticeEntries.map((entry, index) => ({
  id: `suf-p-${index + 1}`,
  lessonId: "practice-suffixes",
  type: "suffix-parsing",
  question: "Identifica el sufijo pronominal y selecciona la definición correcta",
  correctAnswer: JSON.stringify({
    person: entry.p,
    gender: entry.g,
    number: entry.n,
    meaning: entry.m,
  }),
  options: JSON.stringify([entry.m, ...entry.d]),
  hebrewText: entry.h,
  order: index + 1,
}));

const sectionExercises: ExerciseInsert[] = [
  {
    id: "section-1-alphabet-opt-ex-1",
    lessonId: "section-1-alphabet-opt",
    type: "multiple-choice",
    question: "¿Qué objetivo tiene esta subsección del alfabeto?",
    correctAnswer: "Reconocer letras y su función básica",
    options: JSON.stringify([
      "Reconocer letras y su función básica",
      "Conjugar verbos en todos los tiempos",
      "Traducir poesía completa",
      "Memorizar todo el léxico del Tanaj",
    ]),
    order: 1,
  },
  {
    id: "section-1-vowels-opt-ex-1",
    lessonId: "section-1-vowels-opt",
    type: "multiple-choice",
    question: "¿Qué cubre esta subsección de vocales?",
    correctAnswer: "Cuadros vocálicos, letras vocálicas y reglas clave",
    options: JSON.stringify([
      "Cuadros vocálicos, letras vocálicas y reglas clave",
      "Solo raíces trilíteras avanzadas",
      "Solo sintaxis de cláusulas nominales",
      "Solo crítica textual",
    ]),
    order: 1,
  },
  {
    id: "section-1-syllabification-opt-ex-1",
    lessonId: "section-1-syllabification-opt",
    type: "multiple-choice",
    question: "La silabificación te ayuda principalmente a...",
    correctAnswer: "Leer con ritmo y claridad",
    options: JSON.stringify([
      "Leer con ritmo y claridad",
      "Evitar toda vocalización",
      "Eliminar preposiciones",
      "Sustituir la traducción",
    ]),
    order: 1,
  },
  ...alphabetRecognitionExercises,
  {
    id: "lesson-1-2-vowels-consonants-ex-1",
    lessonId: "lesson-1-2-vowels-consonants",
    type: "multiple-choice",
    question: "¿Cuál línea muestra Deuteronomio 6:5 con vocalización (niqqud)?",
    correctAnswer: "וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ",
    options: JSON.stringify([
      "וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ",
      "ואהבת את יהוה אלהיך בכל לבבך",
      "וְאהבת את יהוה אלהיך בכל לבבך",
      "ואהבת אֵת יהוה אלהיך בכל לבבך",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-2-vowels-consonants-ex-2",
    lessonId: "lesson-1-2-vowels-consonants",
    type: "multiple-choice",
    question: "¿Cuál es la versión consonántica sin vocales?",
    correctAnswer: "ואהבת את יהוה אלהיך בכל לבבך",
    options: JSON.stringify([
      "ואהבת את יהוה אלהיך בכל לבבך",
      "וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל לְבָבְךָ",
      "וְאָהַבְתָּ אֵת יְהוָה אלהיך בְּכָל לְבָבְךָ",
      "ואהבת אֵת יהוה אֱלֹהֶיךָ בכל לבבך",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-2-vowels-consonants-ex-3",
    lessonId: "lesson-1-2-vowels-consonants",
    type: "multiple-choice",
    question: "La vocalización (niqqud) ayuda principalmente a...",
    correctAnswer: "Guiar la pronunciación precisa",
    options: JSON.stringify([
      "Guiar la pronunciación precisa",
      "Eliminar consonantes de la palabra",
      "Sustituir el texto consonántico",
      "Quitar toda ambigüedad semántica",
    ]),
    order: 3,
  },
  {
    id: "lesson-1-3-vowels-long-ex-1",
    lessonId: "lesson-1-3-vowels-long",
    type: "multiple-choice",
    question: "¿Qué vocal larga corresponde al sonido tipo 'a' (father)?",
    correctAnswer: "Qamets (ָ)",
    options: JSON.stringify(["Qamets (ָ)", "Pathach (ַ)", "Seghol (ֶ)", "Qibbuts (ֻ)"]),
    order: 1,
  },
  {
    id: "lesson-1-3-vowels-long-ex-2",
    lessonId: "lesson-1-3-vowels-long",
    type: "multiple-choice",
    question: "Tsere (ֵ) se asocia con pronunciación...",
    correctAnswer: "e como en 'they'",
    options: JSON.stringify([
      "e como en 'they'",
      "a como en 'bat'",
      "o como en 'bottle'",
      "u como en 'ruler'",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-3-vowels-long-ex-3",
    lessonId: "lesson-1-3-vowels-long",
    type: "multiple-choice",
    question: "¿Cuál de estas es la vocal larga tipo 'o'?",
    correctAnswer: "Holem (ֹ)",
    options: JSON.stringify(["Holem (ֹ)", "Hireq (ִ)", "Seghol (ֶ)", "Hateph Pathach (ֲ)"]),
    order: 3,
  },
  {
    id: "lesson-1-4-vowels-short-ex-1",
    lessonId: "lesson-1-4-vowels-short",
    type: "multiple-choice",
    question: "Pathach (ַ) representa típicamente...",
    correctAnswer: "a corta",
    options: JSON.stringify(["a corta", "e larga", "o larga", "u larga"]),
    order: 1,
  },
  {
    id: "lesson-1-4-vowels-short-ex-2",
    lessonId: "lesson-1-4-vowels-short",
    type: "multiple-choice",
    question: "¿Qué vocal corta da sonido tipo 'i' (bitter)?",
    correctAnswer: "Hireq (ִ)",
    options: JSON.stringify(["Hireq (ִ)", "Tsere (ֵ)", "Qamets (ָ)", "Holem (ֹ)"]),
    order: 2,
  },
  {
    id: "lesson-1-4-vowels-short-ex-3",
    lessonId: "lesson-1-4-vowels-short",
    type: "multiple-choice",
    question: "¿Cuál par corresponde a vocales cortas tipo 'o' y 'u'?",
    correctAnswer: "Qamets Hatuf (ָ) y Qibbuts (ֻ)",
    options: JSON.stringify([
      "Qamets Hatuf (ָ) y Qibbuts (ֻ)",
      "Holem (ֹ) y Shureq (וּ)",
      "Tsere (ֵ) y Seghol (ֶ)",
      "Qamets (ָ) y Tsere (ֵ)",
    ]),
    order: 3,
  },
  {
    id: "lesson-1-5-vowels-reduced-ex-1",
    lessonId: "lesson-1-5-vowels-reduced",
    type: "multiple-choice",
    question: "¿Qué vocal reducida corresponde al tipo 'a'?",
    correctAnswer: "Hateph Pathach (ֲ)",
    options: JSON.stringify([
      "Hateph Pathach (ֲ)",
      "Hateph Seghol (ֱ)",
      "Hateph Qamets (ֳ)",
      "Qibbuts (ֻ)",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-5-vowels-reduced-ex-2",
    lessonId: "lesson-1-5-vowels-reduced",
    type: "multiple-choice",
    question: "Hateph Seghol (ֱ) se asocia con sonido tipo...",
    correctAnswer: "e reducida",
    options: JSON.stringify(["e reducida", "a larga", "i larga", "u larga"]),
    order: 2,
  },
  {
    id: "lesson-1-6-vowels-summary-lsr-ex-1",
    lessonId: "lesson-1-6-vowels-summary-lsr",
    type: "multiple-choice",
    question: "¿Cuál triada presenta a, e, o en versión larga?",
    correctAnswer: "Qamets, Tsere, Holem",
    options: JSON.stringify([
      "Qamets, Tsere, Holem",
      "Pathach, Seghol, Hireq",
      "Hateph Pathach, Hateph Seghol, Hateph Qamets",
      "Qamets Hatuf, Qibbuts, Hireq",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-6-vowels-summary-lsr-ex-2",
    lessonId: "lesson-1-6-vowels-summary-lsr",
    type: "multiple-choice",
    question: "Las vocales reducidas del resumen son...",
    correctAnswer: "Hateph Pathach, Hateph Seghol y Hateph Qamets",
    options: JSON.stringify([
      "Hateph Pathach, Hateph Seghol y Hateph Qamets",
      "Pathach, Seghol y Hireq",
      "Qamets, Tsere y Holem",
      "Holem Waw, Shureq y Hireq Yod",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-7-vowel-letters-he-ex-1",
    lessonId: "lesson-1-7-vowel-letters-he",
    type: "multiple-choice",
    question: "Las vocales escritas con ה se usan típicamente...",
    correctAnswer: "Al final de una palabra",
    options: JSON.stringify([
      "Al final de una palabra",
      "Solo al inicio de palabra",
      "Solo en sílaba cerrada tónica",
      "Nunca en texto bíblico",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-7-vowel-letters-he-ex-2",
    lessonId: "lesson-1-7-vowel-letters-he",
    type: "multiple-choice",
    question: "¿Cuál ejemplo pertenece al patrón con He final?",
    correctAnswer: "תּוֹרָה",
    options: JSON.stringify(["תּוֹרָה", "בּוּ", "בִּי", "בֹּו"]),
    order: 2,
  },
  {
    id: "lesson-1-8-vowel-letters-waw-ex-1",
    lessonId: "lesson-1-8-vowel-letters-waw",
    type: "multiple-choice",
    question: "¿Qué vocal con ו representa o larga?",
    correctAnswer: "Holem Waw (וֹ)",
    options: JSON.stringify(["Holem Waw (וֹ)", "Shureq (וּ)", "Hireq Yod (ִי)", "Tsere He (ֵה)"]),
    order: 1,
  },
  {
    id: "lesson-1-8-vowel-letters-waw-ex-2",
    lessonId: "lesson-1-8-vowel-letters-waw",
    type: "multiple-choice",
    question: "Shureq (וּ) se translitera usualmente como...",
    correctAnswer: "u larga",
    options: JSON.stringify(["u larga", "o breve", "e larga", "a breve"]),
    order: 2,
  },
  {
    id: "lesson-1-9-vowel-letters-yod-ex-1",
    lessonId: "lesson-1-9-vowel-letters-yod",
    type: "multiple-choice",
    question: "¿Cuál forma representa i larga con Yod?",
    correctAnswer: "Hireq Yod (ִי)",
    options: JSON.stringify([
      "Hireq Yod (ִי)",
      "Hateph Seghol (ֱ)",
      "Qamets Hatuf (ָ)",
      "Holem He (ֹה)",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-9-vowel-letters-yod-ex-2",
    lessonId: "lesson-1-9-vowel-letters-yod",
    type: "multiple-choice",
    question: "Tsere Yod y Seghol Yod se asocian al tipo...",
    correctAnswer: "e",
    options: JSON.stringify(["e", "a", "o", "u"]),
    order: 2,
  },
  {
    id: "lesson-1-10-vowel-letters-summary-ex-1",
    lessonId: "lesson-1-10-vowel-letters-summary",
    type: "multiple-choice",
    question: "¿Con qué letra se escribe típicamente Shureq?",
    correctAnswer: "Waw (ו)",
    options: JSON.stringify(["Waw (ו)", "He (ה)", "Yod (י)", "Alef (א)"]),
    order: 1,
  },
  {
    id: "lesson-1-10-vowel-letters-summary-ex-2",
    lessonId: "lesson-1-10-vowel-letters-summary",
    type: "multiple-choice",
    question: "¿Cuál combinación resume bien letras vocálicas?",
    correctAnswer: "He, Waw y Yod",
    options: JSON.stringify([
      "He, Waw y Yod",
      "Bet, Gimel y Dalet",
      "Qof, Resh y Tav",
      "Nun, Samekh y Pe",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-11-defective-writing-ex-1",
    lessonId: "lesson-1-11-defective-writing",
    type: "multiple-choice",
    question: "En escritura defectiva/plena, un cambio frecuente es...",
    correctAnswer: "Holem Waw -> Holem",
    options: JSON.stringify([
      "Holem Waw -> Holem",
      "Daghesh Forte -> Shewa",
      "Tsere -> Qamets Hatuf",
      "Shewa -> Qibbuts",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-11-defective-writing-ex-2",
    lessonId: "lesson-1-11-defective-writing",
    type: "multiple-choice",
    question: "¿Qué par ejemplifica variación defectiva/plena de 'shofar'?",
    correctAnswer: "שֹׁפָר -> שׁוֹפָר",
    options: JSON.stringify([
      "שֹׁפָר -> שׁוֹפָר",
      "שׁוֹפָר -> שָׁפָר",
      "שֹׁפָר -> שׁוּפָר",
      "שׁוֹפָר -> שׁוֹפֶר",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-12-shewa-ex-1",
    lessonId: "lesson-1-12-shewa",
    type: "multiple-choice",
    question: "¿Cuántos tipos principales de Shewa hay en hebreo?",
    correctAnswer: "Dos: silente y vocal",
    options: JSON.stringify([
      "Dos: silente y vocal",
      "Uno: siempre vocal",
      "Tres: larga, corta y reducida",
      "Cuatro: según acento",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-12-shewa-ex-2",
    lessonId: "lesson-1-12-shewa",
    type: "multiple-choice",
    question: "El Shewa no pertenece directamente a...",
    correctAnswer: "Ninguna clase vocálica a/e/i/o/u",
    options: JSON.stringify([
      "Ninguna clase vocálica a/e/i/o/u",
      "Solo la clase e",
      "Solo la clase i",
      "Solo la clase o",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-13-daghesh-forte-ex-1",
    lessonId: "lesson-1-13-daghesh-forte",
    type: "multiple-choice",
    question: "¿Qué hace Daghesh Forte en una consonante?",
    correctAnswer: "Duplica la consonante",
    options: JSON.stringify([
      "Duplica la consonante",
      "La vuelve silenciosa",
      "La convierte en vocal",
      "Elimina su valor fonético",
    ]),
    order: 1,
  },
  {
    id: "lesson-1-13-daghesh-forte-ex-2",
    lessonId: "lesson-1-13-daghesh-forte",
    type: "multiple-choice",
    question: "¿Qué grupo no acepta Daghesh Forte?",
    correctAnswer: "Guturales (א ה ח ע) y ר",
    options: JSON.stringify([
      "Guturales (א ה ח ע) y ר",
      "Begadkephat solamente",
      "Sibilantes solamente",
      "Todas las consonantes lo aceptan",
    ]),
    order: 2,
  },
  {
    id: "lesson-1-14-gutturals-resh-ex-1",
    lessonId: "lesson-1-14-gutturals-resh",
    type: "multiple-choice",
    question: "¿Cuáles son las guturales principales?",
    correctAnswer: "א ה ח ע",
    options: JSON.stringify(["א ה ח ע", "ב ג ד כ", "מ נ ס צ", "ק ש ת ל"]),
    order: 1,
  },
  {
    id: "lesson-1-14-gutturals-resh-ex-2",
    lessonId: "lesson-1-14-gutturals-resh",
    type: "multiple-choice",
    question: "¿Qué preferencia vocálica suelen mostrar las guturales?",
    correctAnswer: "Preferencia por vocales tipo a",
    options: JSON.stringify([
      "Preferencia por vocales tipo a",
      "Preferencia por vocales tipo i",
      "Solo aceptan vocales reducidas tipo o",
      "No muestran preferencia",
    ]),
    order: 2,
  },
  ...freqLevel1Exercises,
  ...freqLevel2Exercises,
  ...freqLevel3Exercises,
  ...freqLevel4Exercises,
  ...freqLevel5Exercises,
  ...nounsPracticeExercises,
  ...adjectivePracticeExercises,
  ...prefixPracticeExercises,
  ...pronounPracticeExercises,
  ...suffixPracticeExercises,
];

const PRACTICE_LESSON_IDS = {
  freqLevel1: "freq-2200-5000",
  freqLevel2: "freq-1000-2199",
  freqLevel3: "freq-730-999",
  freqLevel4: "freq-500-729",
  freqLevel5: "freq-400-499",
  nouns: "practice-nouns",
  adjectives: "practice-adjectives",
  prefixes: "practice-prefixes",
  pronouns: "practice-pronouns",
  suffixes: "practice-suffixes",
} as const;

const allPracticeLessonIds = new Set<string>(Object.values(PRACTICE_LESSON_IDS));

const roadmapLessonIds = sectionLessons
  .map((lesson) => lesson.id as string)
  .filter((lessonId) => !allPracticeLessonIds.has(lessonId));

async function reseedLessonGroup(
  database: typeof db,
  label: string,
  lessonIds: readonly string[]
) {
  const lessonIdSet = new Set(lessonIds);
  const lessonRows = sectionLessons.filter((lesson) => lessonIdSet.has(lesson.id as string));
  const exerciseRows = sectionExercises.filter((exercise) =>
    lessonIdSet.has(exercise.lessonId as string)
  );

  if (lessonRows.length === 0) {
    console.log(`⚠️ Seed omitido (${label}): no hay lecciones configuradas.`);
    return;
  }

  await database.delete(exercises).where(inArray(exercises.lessonId, lessonIds as string[]));

  for (const lesson of lessonRows) {
    await database
      .insert(lessons)
      .values(lesson)
      .onConflictDoUpdate({
        target: lessons.id,
        set: {
          title: lesson.title,
          description: lesson.description ?? null,
          order: lesson.order,
          xpReward: lesson.xpReward ?? 0,
        },
      });
  }

  if (exerciseRows.length > 0) {
    await database.insert(exercises).values(exerciseRows);
  }

  console.log(
    `✅ Seed ${label}: ${lessonRows.length} lecciones, ${exerciseRows.length} ejercicios.`
  );
}

export async function seedRoadmapLessonsAndExercises(database: typeof db) {
  await reseedLessonGroup(database, "roadmap", roadmapLessonIds);
}

export async function seedPracticeFrequencyLevel1(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-2200-5000", [PRACTICE_LESSON_IDS.freqLevel1]);
}

export async function seedPracticeFrequencyLevel2(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-1000-2199", [PRACTICE_LESSON_IDS.freqLevel2]);
}

export async function seedPracticeFrequencyLevel3(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-730-999", [PRACTICE_LESSON_IDS.freqLevel3]);
}

export async function seedPracticeFrequencyLevel4(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-500-729", [PRACTICE_LESSON_IDS.freqLevel4]);
}

export async function seedPracticeFrequencyLevel5(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-400-499", [PRACTICE_LESSON_IDS.freqLevel5]);
}

export async function seedPracticeNouns(database: typeof db) {
  await reseedLessonGroup(database, "practice/nouns", [PRACTICE_LESSON_IDS.nouns]);
}

export async function seedPracticeAdjectives(database: typeof db) {
  await reseedLessonGroup(database, "practice/adjectives", [PRACTICE_LESSON_IDS.adjectives]);
}

export async function seedPracticePrefixes(database: typeof db) {
  await reseedLessonGroup(database, "practice/prefixes", [PRACTICE_LESSON_IDS.prefixes]);
}

export async function seedPracticePronouns(database: typeof db) {
  await reseedLessonGroup(database, "practice/pronouns", [PRACTICE_LESSON_IDS.pronouns]);
}

export async function seedPracticeSuffixes(database: typeof db) {
  await reseedLessonGroup(database, "practice/suffixes", [PRACTICE_LESSON_IDS.suffixes]);
}

export async function seedAllPracticeSections(database: typeof db) {
  await seedPracticeFrequencyLevel1(database);
  await seedPracticeFrequencyLevel2(database);
  await seedPracticeFrequencyLevel3(database);
  await seedPracticeFrequencyLevel4(database);
  await seedPracticeFrequencyLevel5(database);
  await seedPracticeNouns(database);
  await seedPracticeAdjectives(database);
  await seedPracticePrefixes(database);
  await seedPracticePronouns(database);
  await seedPracticeSuffixes(database);
}

export async function seedLessonsAndExercises(database: typeof db) {
  console.log("📘 Reiniciando plan de lecciones (modular)...");
  await seedRoadmapLessonsAndExercises(database);
  await seedAllPracticeSections(database);

  console.log(
    `✅ Lecciones sembradas desde módulos: ${sectionLessons.length} lecciones, ${sectionExercises.length} ejercicios`
  );
}

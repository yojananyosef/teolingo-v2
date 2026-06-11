import type { InferInsertModel } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import type { db } from "./db";
import {
  alphabet,
  exercises,
  flashcards,
  lessons,
  quizQuestions,
  rhythmParadigms,
  userMistakes,
} from "./schema";

type LessonInsert = InferInsertModel<typeof lessons>;
type ExerciseInsert = InferInsertModel<typeof exercises>;

const sectionLessons: LessonInsert[] = [
  // MÓDULO 1: Fundamentos
  {
    id: "lesson-1",
    title: "Lección 1: El Alfabeto Hebreo",
    description: "Consonantes, guturales y formas finales.",
    order: 1,
    xpReward: 30,
  },
  {
    id: "lesson-2",
    title: "Lección 2: Las Vocales Hebreas",
    description: "Vocales largas, cortas y reducidas.",
    order: 2,
    xpReward: 30,
  },
  {
    id: "lesson-3",
    title: "Lección 3: Silabificación y Pronunciación",
    description: "Shewa, Daghesh y formación de sílabas.",
    order: 3,
    xpReward: 30,
  },

  // MÓDULO 2: Sustantivos y Partículas
  {
    id: "lesson-4",
    title: "Lección 4: Sustantivos Hebreos",
    description: "Género y número de los sustantivos.",
    order: 4,
    xpReward: 30,
  },
  {
    id: "lesson-5",
    title: "Lección 5: Artículo Definido y Conjunción",
    description: "El artículo He y la conjunción Waw.",
    order: 5,
    xpReward: 30,
  },
  {
    id: "lesson-6",
    title: "Lección 6: Preposiciones Hebreas",
    description: "Preposiciones inseparables e independientes.",
    order: 6,
    xpReward: 30,
  },

  // MÓDULO 3: Calificadores y Pronombres
  {
    id: "lesson-7",
    title: "Lección 7: Adjetivos Hebreos",
    description: "Uso atributivo, predicativo y sustantivado.",
    order: 7,
    xpReward: 30,
  },
  {
    id: "lesson-8",
    title: "Lección 8: Pronombres Hebreos",
    description: "Pronombres personales y demostrativos.",
    order: 8,
    xpReward: 30,
  },
  {
    id: "lesson-9",
    title: "Lección 9: Sufijos Pronominales",
    description: "Sufijos en sustantivos y preposiciones.",
    order: 9,
    xpReward: 30,
  },

  // MÓDULO 4: Relaciones de Propiedad
  {
    id: "lesson-10",
    title: "Lección 10: La Cadena Constructa",
    description: "Estado absoluto y constructo.",
    order: 10,
    xpReward: 30,
  },
  {
    id: "lesson-11",
    title: "Lección 11: Números Hebreos",
    description: "Números cardinales y ordinales.",
    order: 11,
    xpReward: 30,
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
    id: "freq-310-399",
    title: "Frecuencia Bíblica Nivel 6",
    description: "Vocabulario frecuente (399-310 apariciones).",
    order: 905,
    xpReward: 0,
  },
  {
    id: "freq-270-309",
    title: "Frecuencia Bíblica Nivel 7",
    description: "Vocabulario frecuente (309-270 apariciones).",
    order: 906,
    xpReward: 0,
  },
  {
    id: "freq-220-269",
    title: "Frecuencia Bíblica Nivel 8",
    description: "Vocabulario frecuente (269-220 apariciones).",
    order: 907,
    xpReward: 0,
  },
  {
    id: "freq-200-219",
    title: "Frecuencia Bíblica Nivel 9",
    description: "Vocabulario frecuente (219-200 apariciones).",
    order: 908,
    xpReward: 0,
  },
  {
    id: "freq-175-199",
    title: "Frecuencia Bíblica Nivel 10",
    description: "Vocabulario frecuente (199-175 apariciones).",
    order: 909,
    xpReward: 0,
  },
  {
    id: "freq-160-174",
    title: "Frecuencia Bíblica Nivel 11",
    description: "Vocabulario frecuente (174-160 apariciones).",
    order: 910,
    xpReward: 0,
  },
  {
    id: "practice-nouns",
    title: "Clasificación Morfológica",
    description: "Analiza sustantivos por su género, número y significado.",
    order: 907,
    xpReward: 0,
  },
  {
    id: "practice-adjectives",
    title: "Clasificación de Adjetivos",
    description: "Analiza adjetivos por género, número, significado y uso adjetival.",
    order: 908,
    xpReward: 0,
  },
  {
    id: "practice-verbs",
    title: "Verbos: Qal Perfecto",
    description: "Analiza verbos en estado Qal perfecto por persona, género, número y significado.",
    order: 909,
    xpReward: 0,
  },
  {
    id: "practice-qal-imperfect",
    title: "Verbos: Qal Imperfecto",
    description:
      "Analiza verbos en estado Qal imperfecto por persona, género, número y significado.",
    order: 910,
    xpReward: 0,
  },
  {
    id: "practice-verb-suffixes",
    title: "Sufijos Verbales Qal",
    description: "Identifica la persona, género y número de los sufijos verbales en Qal perfecto.",
    order: 911,
    xpReward: 0,
  },
  {
    id: "practice-prefixes",
    title: "Uso de Prefijos",
    description: "Analiza artículo, conjunción y preposiciones inseparables en frases hebreas.",
    order: 912,
    xpReward: 0,
  },
  {
    id: "practice-pronouns",
    title: "Pronombres Independientes",
    description: "Practica pronombres personales independientes con frases simples en contexto.",
    order: 912,
    xpReward: 0,
  },
  {
    id: "practice-suffixes",
    title: "Sufijos Pronominales",
    description:
      "Practica sustantivos con sufijos pronominales e identifica persona, género y número.",
    order: 913,
    xpReward: 0,
  },
  {
    id: "practice-qal-participle",
    title: "Verbos: Qal Participio",
    description: "Analiza participios en estado Qal activo por género, número y significado.",
    order: 914,
    xpReward: 0,
  },
  {
    id: "practice-qal-imperative",
    title: "Verbos: Qal Imperativo",
    description:
      "Analiza verbos en estado Qal imperativo por persona, género, número y significado.",
    order: 915,
    xpReward: 0,
  },
  {
    id: "practice-qal-infinitives",
    title: "Infinitivos Qal",
    description: "Identifica y traduce infinitivos constructos y absolutos en contexto.",
    order: 916,
    xpReward: 0,
  },
  {
    id: "practice-qal-participle-v2",
    title: "Verbos: Participio Qal (Parte 2)",
    description:
      "Análisis avanzado de participios en estado Qal activo y traducción de frases participiales.",
    order: 917,
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

const alphabetRecognitionExercises: ExerciseInsert[] = alphabetCoreConsonants.map(
  (item, index) => ({
    id: `lesson-1-ex-${index + 1}`,
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: `Selecciona la letra ${item.name}`,
    correctAnswer: item.char,
    options: JSON.stringify(item.options),
    order: index + 1,
  }),
);

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

const freqLevel6Vocabulary = [
  { h: "אֹהֶל", s: "tienda" },
  { h: "אַהֲרוֹן", s: "Aarón" },
  { h: "אוֹ", s: "o" },
  { h: "אֵשׁ", s: "fuego" },
  { h: "אֶתֶּן | אַתֶּם", s: "ustedes" },
  { h: "בַּיִן | בֵּין", s: "entre" },
  { h: "בָּנָה", s: "construir" },
  { h: "בָּרַךְ", s: "bendecir" },
  { h: "דָּם", s: "sangre" },
  { h: "זָהָב", s: "oro" },
  { h: "חַיִּים | חַי", s: "vida, sustento; tiempo de vida" },
  { h: "יָם", s: "mar, lago; occidente" },
  { h: "יַעֲקֹב", s: "Jacob" },
  { h: "יָרֵא", s: "temer, respetar, honrar" },
  { h: "יָרַד", s: "bajar" },
  { h: "כְּלִי", s: "vaso, recipiente, utensilio" },
  { h: "כֶּסֶף", s: "plata" },
  { h: "לֵוִי", s: "Leví" },
  { h: "מִלְחָמָה", s: "guerra, batalla" },
  { h: "מָלַךְ", s: "reinar, ser rey" },
  { h: "מָקוֹם", s: "lugar" },
  { h: "נְאֻם", s: "profecía, oráculo, declaración" },
  { h: "נָבִיא", s: "profeta" },
  { h: "נָגַד", s: "anunciar, informar, contar" },
  { h: "עָנָה", s: "responder, contestar" },
  { h: "עֵץ", s: "arbol" },
  { h: "רוּחַ", s: "espíritu, viento" },
  { h: "שָׂדַי | שָׂדֶה", s: "campo, campo abierto" },
  { h: "שַׁעַר", s: "puerta, entrada" },
] as const;

const freqLevel7Vocabulary = [
  { h: "אֹיֵב | אוֹיֵב", s: "enemigo" },
  { h: "אַף", s: "nariz, olfato; ira" },
  { h: "בַּבְלִי | בָּבֶל", s: "Babilonia; babilonios" },
  { h: "בְּרִית", s: "pacto" },
  { h: "בָּשָׂר", s: "carne" },
  { h: "חֹדֶשׁ", s: "luna nueva, mes" },
  { h: "חָזַק", s: "ser/hacerse fuerte; agarrar, sostener" },
  { h: "חַטָּאת", s: "pecado, sacrificio por el pecado" },
  { h: "חַיָּה", s: "vivir, revivir, dejar con vida" },
  { h: "כָּרַת", s: "cortar, talar, arrancar; hacer (un pacto)" },
  { h: "לֶחֶם", s: "pan" },
  { h: "מְאֹד", s: "fuerza; mucho, muy, demasiado" },
  { h: "מִדְבָּר", s: "desierto, estepa" },
  { h: "מִשְׁפָּחָה", s: "familia (extendida); clan" },
  { h: "סַבִיב", s: "círculo, alrededores; alrededor" },
  { h: "סוּר", s: "apartarse; eliminar, abolir" },
  { h: "עָבַד", s: "servir" },
  { h: "עֹלָה", s: "ofrenda quemada" },
  { h: "עֵת", s: "tiempo" },
  { h: "פְּלִשְׁתִּי | פְּלֶשֶׁת", s: "filisteo, Filistea" },
  { h: "פָּקַד", s: "visitar, inspeccionar, vigilar, registrar, encargar(se)" },
  { h: "פַּרְעֹה", s: "Faraón" },
  { h: "צֹנֶה | צֹאן", s: "rebaño" },
  { h: "קָרַב", s: "acercarse" },
  { h: "שְׁלֹמֹה", s: "Salomón" },
  { h: "שִׁשִׁים | שֵׁשׁ", s: "seis; sesenta" },
] as const;

const freqLevel8Vocabulary = [
  { h: "אֶבֶן", s: "piedra" },
  { h: "אַבְרָם | אַבְרָהָם", s: "Abram, Abraham" },
  { h: "אֲדָמָה", s: "tierra, arcilla" },
  { h: "אֵל", s: "Dios" },
  { h: "אַמָּה", s: "codo" },
  { h: "בָּקַשׁ", s: "buscar" },
  { h: "גְּבוּל", s: "límite, contorno, borde" },
  { h: "זָכַר", s: "recordar" },
  { h: "זֶרַע", s: "semilla" },
  { h: "חָטָא", s: "fallar, pecar" },
  { h: "חַיִל", s: "fuerza, riqueza, ejército" },
  { h: "חֶסֶד", s: "solidaridad, amor, bondad, lealtad, compromiso" },
  { h: "יְהוֹשֻׁעַ | יֵשׁוּע", s: "Josué" },
  { h: "יָרַשׁ", s: "tomar posesión, poseer, heredar, desposeer" },
  { h: "יֹשֵׁב", s: "habitante" },
  { h: "כָּתַב", s: "escribir" },
  { h: "לַיְלָה | לֵיל", s: "noche" },
  { h: "לְמַעַן", s: "con el fin de, a causa de; para que" },
  { h: "מוֹעֵד", s: "lugar de encuentro, reunión, cita" },
  { h: "מַטֶּה", s: "vara, bastón; tribu" },
  { h: "מָלֵא", s: "llenar, estar lleno, cumplirse" },
  { h: "מַעֲשֶׂה", s: "acción, obra, trabajo" },
  { h: "נַחֲלָה", s: "herencia" },
  { h: "נַעַר", s: "muchacho, joven, niño" },
  { h: "עָוֹן", s: "transgresión, iniquidad" },
  { h: "קֶרֶב", s: "intestinos, interior, medio" },
  { h: "רָבָה", s: "multiplicarse, crecer, ser/hacerse numeroso" },
  { h: "רֶגֶל", s: "pie" },
  { h: "רָשָׁע", s: "culpable, malvado, injusto" },
  { h: "שָׁלוֹם", s: "paz, salud" },
  { h: "תּוֹרָה", s: "enseñanza, ley" },
] as const;

const freqLevel9Vocabulary = [
  { h: "אָהַב", t: "Ahav", s: "Amar, querer" },
  { h: "אֵם", t: "Em", s: "Madre" },
  { h: "אָסַף", t: "Asaf", s: "Reunir, cosechar, recoger" },
  { h: "אָרוֹן", t: "Arón", s: "Caja, cofre, arca" },
  { h: "בֶּגֶד", t: "Béged", s: "Ropa, traje" },
  { h: "בֹּקֶר", t: "Bóqer", s: "Mañana (parte del día)" },
  { h: "יוֹסֵף", t: "Yosef", s: "José (nombre propio)" },
  { h: "יָסַף", t: "Yasaf", s: "Añadir, aumentar" },
  { h: "יָשַׁע", t: "Yasha'", s: "Salvarse, estar a salvo, salvar" },
  { h: "כָּבוֹד", t: "Kavod", s: "Gloria, honor, peso" },
  { h: "כּוּן", t: "Kun", s: "Estar establecido, ser/estar firme, colocar, prepararse" },
  { h: "כָּלָה", t: "Kalah", s: "Acabar, faltar, agotarse, perecer, cumplirse" },
  { h: "מַחֲנֶה", t: "Machaneh", s: "Campamento, ejército" },
  { h: "מַלְאָךְ", t: "Mal’akh", s: "Mensajero (o ángel)" },
  { h: "מִנְחָה", t: "Minchah", s: "Regalo, ofrenda" },
  { h: "נָטָה", t: "Natah", s: "Extender, alargar, doblar" },
  { h: "נָצַל", t: "Natsal", s: "Librarse, escapar, salvar, quitar" },
  { h: "עָזַב", t: "Azav", s: "Dejar, abandonar" },
  { h: "צַדִּיק", t: "Tsadiq", s: "Correcto, justo" },
  { h: "שָׁכַב", t: "Shakhav", s: "Acostarse, tener relaciones" },
  { h: "שָׁפַט", t: "Shafat", s: "Juzgar, hacer justicia, pleitear" },
  { h: "שָׁתָה", t: "Shatah", s: "Tomar, beber" },
] as const;

const freqLevel10Vocabulary = [
  { h: "אָבַד", t: "avad", s: "perecer, destruir, exterminar" },
  { h: "אֹזֶן", t: "ozen", s: "oreja, oído" },
  { h: "אֶפְרַיִם | אֶפְרָתִי", t: "efraín / efratí", s: "Efraín; de Efraín" },
  { h: "בְּהֵמָה | בְּהֵמוֹת", t: "behemá / behemot", s: "ganado, animal doméstico" },
  { h: "בִּנְיָמִין | בֶּן-יְמִינִי", t: "binyamín / ben-yeminí", s: "Benjamín, de Benjamín" },
  { h: "בַעַל", t: "ba'al", s: "dueño, señor, esposo; Baal" },
  { h: "בָקָר", t: "baqar", s: "ganado (toros, vacas)" },
  { h: "גָּלָה", t: "galah", s: "revelar, descubrir; ser desterrado" },
  { h: "זָקֵן", t: "zaqen", s: "viejo; anciano" },
  { h: "חָצֵר", t: "jatser", s: "poblado, atrio, patio, corral" },
  { h: "יָכֹל", t: "yakhol", s: "poder, lograr" },
  { h: "יָרְדֵן", t: "yarden", s: "Jordán" },
  { h: "כַף", t: "khaf", s: "mano, palma" },
  { h: "לָכֵן", t: "lakhen", s: "por eso, pues, pero" },
  { h: "מוֹאָב | מֹאָבִי", t: "moav / moaví", s: "Moab; moabita" },
  { h: "מִצְוָה", t: "mitsvah", s: "mandamiento, mandato, ley" },
  { h: "סֵפֶר", t: "sefer", s: "libro, rollo" },
  { h: "רִאשׁוֹן", t: "rishon", s: "primero" },
  { h: "רוּם", t: "rum", s: "ser alto, enaltecer, exaltarse" },
  { h: "רֵעַ", t: "re'a", s: "amigo, compañero" },
  { h: "שָׂפָה", t: "safah", s: "labio, lengua; borde" },
  { h: "שֵבֶט", t: "shevet", s: "vara, bastón; tribu" },
  { h: "שָבַע", t: "shava", s: "jurar" },
  { h: "שֶמֶן", t: "shemen", s: "aceite" },
] as const;

const freqLevel11Vocabulary = [
  { h: "אָחֵר", t: "ajer", s: "otro" },
  { h: "אַיִל", t: "ayil", s: "carnero" },
  { h: "אַךְ", t: "akh", s: "solo; precisamente" },
  { h: "בָּחַר", t: "bachar", s: "escoger, designar" },
  { h: "בִּין", t: "bin", s: "entender, considerar; ser inteligente" },
  { h: "גִּבּוֹר", t: "gibbor", s: "valiente, guerrero, héroe" },
  { h: "דּוֹר", t: "dor", s: "generación, época, edad" },
  { h: "דָּרַשׁ", t: "darash", s: "buscar, investigar" },
  { h: "הָרַג", t: "harag", s: "matar" },
  { h: "זֶבַח", t: "zevach", s: "sacrificio" },
  { h: "חָוָה", t: "javah", s: "inclinarse, adorar" },
  { h: "חוּץ", t: "juts", s: "el exterior, calles; fuera, afuera" },
  { h: "טָמֵא", t: "tame", s: "ser/hacerse impuro; contaminarse" },
  { h: "כְּנַעַן | כְּנַעֲנִי", t: "kena'an / kena'aní", s: "Canaán; Cananeo" },
  { h: "לָחַם", t: "lajam", s: "atacar; pelear" },
  { h: "לָמָה | לָמָּה", t: "lamah / lammah", s: "¿por qué?" },
  { h: "מְלָאכָה", t: "melajah", s: "obra, tarea, oficio" },
  { h: "נוּס", t: "nus", s: "huir" },
  { h: "סָבַב", t: "savav", s: "rodear, volverse, girar" },
  { h: "סָפַר", t: "safar", s: "contar, registrar; proclamar, contar" },
  { h: "עֶשֶר | עֲשָׂרָה", t: "esher / asarah", s: "diez, década" },
  { h: "פֶּתַח", t: "petaj", s: "puerta, entrada, abertura" },
  { h: "קָדַשׁ", t: "qadash", s: "ser santo; consagrar" },
  { h: "רָعָה", t: "ra'ah", s: "pastorear, llevar a pastar, acompañar" },
  { h: "שָׁאַל", t: "sha'al", s: "pedir, rogar, preguntar" },
  { h: "שָׁחָה", t: "shajah", s: "echarse al suelo, postrarse, arrodillarse" },
  { h: "שָׁחַת", t: "shajat", s: "estar corrompido; corromper, dañar; destruir" },
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

const freqLevel6Exercises: ExerciseInsert[] = freqLevel6Vocabulary.map((v, i) => ({
  id: `freq6-${i + 1}`,
  lessonId: "freq-310-399",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel6Vocabulary[(i + 1) % freqLevel6Vocabulary.length].s,
    freqLevel6Vocabulary[(i + 5) % freqLevel6Vocabulary.length].s,
    freqLevel6Vocabulary[(i + 9) % freqLevel6Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel7Exercises: ExerciseInsert[] = freqLevel7Vocabulary.map((v, i) => ({
  id: `freq7-${i + 1}`,
  lessonId: "freq-270-309",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel7Vocabulary[(i + 1) % freqLevel7Vocabulary.length].s,
    freqLevel7Vocabulary[(i + 5) % freqLevel7Vocabulary.length].s,
    freqLevel7Vocabulary[(i + 9) % freqLevel7Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel8Exercises: ExerciseInsert[] = freqLevel8Vocabulary.map((v, i) => ({
  id: `freq8-${i + 1}`,
  lessonId: "freq-220-269",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel8Vocabulary[(i + 1) % freqLevel8Vocabulary.length].s,
    freqLevel8Vocabulary[(i + 5) % freqLevel8Vocabulary.length].s,
    freqLevel8Vocabulary[(i + 9) % freqLevel8Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel9Exercises: ExerciseInsert[] = freqLevel9Vocabulary.map((v, i) => ({
  id: `freq9-${i + 1}`,
  lessonId: "freq-200-219",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel9Vocabulary[(i + 1) % freqLevel9Vocabulary.length].s,
    freqLevel9Vocabulary[(i + 5) % freqLevel9Vocabulary.length].s,
    freqLevel9Vocabulary[(i + 9) % freqLevel9Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel10Exercises: ExerciseInsert[] = freqLevel10Vocabulary.map((v, i) => ({
  id: `freq10-${i + 1}`,
  lessonId: "freq-175-199",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel10Vocabulary[(i + 1) % freqLevel10Vocabulary.length].s,
    freqLevel10Vocabulary[(i + 5) % freqLevel10Vocabulary.length].s,
    freqLevel10Vocabulary[(i + 9) % freqLevel10Vocabulary.length].s,
  ]),
  hebrewText: v.h,
  order: i + 1,
}));

const freqLevel11Exercises: ExerciseInsert[] = freqLevel11Vocabulary.map((v, i) => ({
  id: `freq11-${i + 1}`,
  lessonId: "freq-160-174",
  type: "translation",
  question: `¿Qué significa '${v.h}'?`,
  correctAnswer: v.s,
  options: JSON.stringify([
    v.s,
    freqLevel11Vocabulary[(i + 1) % freqLevel11Vocabulary.length].s,
    freqLevel11Vocabulary[(i + 5) % freqLevel11Vocabulary.length].s,
    freqLevel11Vocabulary[(i + 9) % freqLevel11Vocabulary.length].s,
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
  {
    h: "[טוֹב:r][ָה:s]",
    g: "f",
    n: "s",
    m: "Buena",
    d: ["Malo / Malvado", "Sabia", "Santo / Sagrado"],
  },
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

const adjectivePracticeWordExercises: ExerciseInsert[] = adjectivePracticeVocabulary.map(
  (entry, index) => ({
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
  }),
);

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

const verbsPracticeEntries = [
  {
    h: "[שְׁמַרְ:r][תֶּם:s]",
    p: "2",
    g: "m",
    n: "p",
    m: "Ustedes guardaron (m).",
    d: ["Ellos/Ellas guardaron.", "Nosotros guardamos.", "Tú guardaste (m)."],
  },
  {
    h: "[כָּתַב:r]",
    p: "3",
    g: "m",
    n: "s",
    m: "Él escribió.",
    d: ["Yo escribí.", "Ella escribió.", "Nosotros escribimos."],
  },
  {
    h: "[רָדְפ:r][וּ:s]",
    p: "3",
    g: "c",
    n: "p",
    m: "Ellos/Ellas persiguieron.",
    d: ["Él persiguió.", "Nosotros perseguimos.", "Ustedes persiguieron (m)."],
  },
  {
    h: "[זָכַרְ:r][תָּ:s]",
    p: "2",
    g: "m",
    n: "s",
    m: "Tú recordaste (m).",
    d: ["Él recordó.", "Tú recordaste (f).", "Yo recordé."],
  },
  {
    h: "[יָלְד:r][ָה:s]",
    p: "3",
    g: "f",
    n: "s",
    m: "Ella dio a luz / engendró.",
    d: [
      "Él dio a luz / engendró.",
      "Nosotros dimos a luz / engendramos.",
      "Tú diste a luz / engendraste (f).",
    ],
  },
  {
    h: "[זָכַרְ:r][תְּ:s]",
    p: "2",
    g: "f",
    n: "s",
    m: "Tú recordaste (f).",
    d: ["Él recordó.", "Tú recordaste (m).", "Ella recordó."],
  },
  {
    h: "[קָבַצְ:r][תִּי:s]",
    p: "1",
    g: "c",
    n: "s",
    m: "Yo junté / reuní.",
    d: ["Él juntó / reunió.", "Nosotros juntamos / reunimos.", "Tú juntaste / reuniste (m)."],
  },
  {
    h: "[יְשַׁבְ:r][תֶּן:s]",
    p: "2",
    g: "f",
    n: "p",
    m: "Ustedes se sentaron / habitaron (f).",
    d: [
      "Ellos/Ellas se sentaron / habitaron.",
      "Ustedes se sentaron / habitaron (m).",
      "Nosotros nos sentamos / habitamos.",
    ],
  },
  {
    h: "[שָׁמַרְ:r][נוּ:s]",
    p: "1",
    g: "c",
    n: "p",
    m: "Nosotros guardamos.",
    d: ["Yo guardé.", "Ellos/Ellas guardaron.", "Ustedes guardaron (m)."],
  },
  {
    h: "[זָכְר:r][וּ:s]",
    p: "3",
    g: "c",
    n: "p",
    m: "Ellos/Ellas recordaron.",
    d: ["Nosotros recordamos.", "Él recordó.", "Ustedes recordaron (m)."],
  },
  {
    h: "[קָבַץ:r]",
    p: "3",
    g: "m",
    n: "s",
    m: "Él juntó / reunió.",
    d: ["Yo junté / reuní.", "Ella juntó / reunió.", "Ellos/Ellas juntaron / reunieron."],
  },
  {
    h: "[יָשְׁב:r][ָה:s]",
    p: "3",
    g: "f",
    n: "s",
    m: "Ella se sentó / habitó.",
    d: ["Él se sentó / habitó.", "Tú te sentaste / habitaste (f).", "Yo me senté / habité."],
  },
  {
    h: "[כָּתְב:r][וּ:s]",
    p: "3",
    g: "c",
    n: "p",
    m: "Ellos/Ellas escribieron.",
    d: ["Nosotros escribimos.", "Él escribió.", "Ustedes escribieron (m)."],
  },
  {
    h: "[קְבַצְ:r][תֶּם:s]",
    p: "2",
    g: "m",
    n: "p",
    m: "Ustedes juntaron / reunieron (m).",
    d: [
      "Ellos/Ellas juntaron / reunieron.",
      "Nosotros juntamos / reunimos.",
      "Ustedes juntaron / reunieron (f).",
    ],
  },
  {
    h: "[כָּתַבְ:r][תְּ:s]",
    p: "2",
    g: "f",
    n: "s",
    m: "Tú escribiste (f).",
    d: ["Ella escribió.", "Yo escribí.", "Tú escribiste (m)."],
  },
] as const;

const verbsPracticeExercises: ExerciseInsert[] = verbsPracticeEntries.map((entry, index) => ({
  id: `verb-p-${index + 1}`,
  lessonId: "practice-verbs",
  type: "verb-parsing",
  question: "Clasifica este verbo hebreo",
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

const imperfectPracticeEntries = [
  {
    h: "תִּמְכְּרוּ",
    p: "2",
    g: "m",
    n: "p",
    m: "Ustedes venderán.",
    d: ["Ellos/Ellas venderán.", "Nosotros venderemos.", "Tú venderás (m)."],
  },
  {
    h: "יִשְׁמְרוּ",
    p: "3",
    g: "c",
    n: "p",
    m: "Ellos/Ellas guardarán.",
    d: ["Ustedes guardarán.", "Nosotros guardaremos.", "Ella guardará."],
  },
  {
    h: "נִשְׁמֹר",
    p: "1",
    g: "c",
    n: "p",
    m: "Nosotros guardaremos.",
    d: ["Yo guardaré.", "Ellos/Ellas guardarán.", "Tú guardarás (m)."],
  },
  {
    h: "יִמְלְכוּ",
    p: "3",
    g: "c",
    n: "p",
    m: "Ellos/Ellas reinarán.",
    d: ["Ustedes reinarán.", "Nosotros reinaremos.", "Ella reinara."],
  },
  {
    h: "אֶשְׂרֹף",
    p: "1",
    g: "c",
    n: "s",
    m: "Yo quemaré.",
    d: ["Yo escribiré.", "Él quemará.", "Nosotros quemaremos."],
  },
  {
    h: "יִרְדֹּף",
    p: "3",
    g: "m",
    n: "s",
    m: "Él perseguirá.",
    d: ["Tú perseguirás (m).", "Ella perseguirá.", "Ustedes perseguirán."],
  },
  {
    h: "תִּכְרְתוּ",
    p: "2",
    g: "m",
    n: "p",
    m: "Ustedes cortarán.",
    d: ["Ellos/Ellas cortarán.", "Nosotros cortaremos.", "Tú cortarás (m)."],
  },
  {
    h: "תִּזְכֹּרְנָה",
    p: "3",
    g: "f",
    n: "p",
    m: "Ellas recordarán.",
    d: ["Ustedes recordarán.", "Nosotros recordaremos.", "Ella recordará."],
  },
  {
    h: "תִּכְתְּבִי",
    p: "2",
    g: "f",
    n: "s",
    m: "Tú escribirás (f).",
    d: ["Ella escribirá.", "Yo escribiré.", "Tú escribirás (m)."],
  },
  {
    h: "אֶשְׁבֹּר",
    p: "1",
    g: "c",
    n: "s",
    m: "Yo quebraré.",
    d: ["Él quebrará.", "Nosotros quebraremos.", "Tú quebrarás (m)."],
  },
  {
    h: "תִּזְכֹּרְוּ",
    p: "2",
    g: "m",
    n: "p",
    m: "Ustedes recordarán.",
    d: ["Ellos/Ellas recordarán.", "Nosotros recordaremos.", "Tú recordarás (m)."],
  },
  {
    h: "תִּקְבֹּצְנָה",
    p: "3",
    g: "f",
    n: "p",
    m: "Ellas reunirán.",
    d: ["Ustedes reunirán.", "Nosotros reuniremos.", "Él reunirá."],
  },
  {
    h: "תִּשְׁמֹר",
    p: "2",
    g: "m",
    n: "s",
    m: "Tú guardarás (m).",
    d: ["Ella guardará.", "Yo guardaré.", "Ustedes guardarán."],
  },
  {
    h: "יִזְכֹּר",
    p: "3",
    g: "m",
    n: "s",
    m: "Él recordará.",
    d: ["Ella recordará.", "Yo recordaré.", "Tú recordarás (m)."],
  },
] as const;

const imperfectPracticeExercises: ExerciseInsert[] = imperfectPracticeEntries.map(
  (entry, index) => ({
    id: `imp-verb-p-${index + 1}`,
    lessonId: "practice-qal-imperfect",
    type: "verb-parsing",
    question: "Clasifica este verbo hebreo",
    correctAnswer: JSON.stringify({
      person: entry.p,
      gender: entry.g,
      number: entry.n,
      meaning: entry.m,
    }),
    options: JSON.stringify([entry.m, ...entry.d]),
    hebrewText: entry.h,
    order: index + 1,
  }),
);

const verbSuffixPracticeEntries = [
  {
    h: "[תִּי:s]",
    p: "1",
    g: "c",
    n: "s",
    m: "1ª persona, común, singular (yo)",
    d: [
      "2ª persona, masc., singular (tú)",
      "3ª persona, fem., singular (ella)",
      "1ª persona, común, plural (nosotros)",
    ],
  },
  {
    h: "[תָּ:s]",
    p: "2",
    g: "m",
    n: "s",
    m: "2ª persona, masc., singular (tú)",
    d: [
      "1ª persona, común, singular (yo)",
      "2ª persona, fem., singular (tú)",
      "3ª persona, masc., singular (él)",
    ],
  },
  {
    h: "[תְּ:s]",
    p: "2",
    g: "f",
    n: "s",
    m: "2ª persona, fem., singular (tú)",
    d: [
      "2ª persona, masc., singular (tú)",
      "3ª persona, fem., singular (ella)",
      "1ª persona, común, singular (yo)",
    ],
  },
  {
    h: "[∅:s]",
    p: "3",
    g: "m",
    n: "s",
    m: "3ª persona, masc., singular (él)",
    d: [
      "3ª persona, fem., singular (ella)",
      "1ª persona, común, singular (yo)",
      "3ª persona, común, plural (ellos/ellas)",
    ],
  },
  {
    h: "[ָה:s]",
    p: "3",
    g: "f",
    n: "s",
    m: "3ª persona, fem., singular (ella)",
    d: [
      "3ª persona, masc., singular (él)",
      "2ª persona, fem., singular (tú)",
      "3ª persona, común, plural (ellos/ellas)",
    ],
  },
  {
    h: "[נוּ:s]",
    p: "1",
    g: "c",
    n: "p",
    m: "1ª persona, común, plural (nosotros)",
    d: [
      "2ª persona, masc., plural (ustedes)",
      "3ª persona, común, plural (ellos/ellas)",
      "1ª persona, común, singular (yo)",
    ],
  },
  {
    h: "[תֶּם:s]",
    p: "2",
    g: "m",
    n: "p",
    m: "2ª persona, masc., plural (ustedes)",
    d: [
      "2ª persona, fem., plural (ustedes)",
      "3ª persona, común, plural (ellos/ellas)",
      "1ª persona, común, plural (nosotros)",
    ],
  },
  {
    h: "[תֶּן:s]",
    p: "2",
    g: "f",
    n: "p",
    m: "2ª persona, fem., plural (ustedes)",
    d: [
      "2ª persona, masc., plural (ustedes)",
      "3ª persona, común, plural (ellos/ellas)",
      "1ª persona, común, plural (nosotros)",
    ],
  },
  {
    h: "[וּ:s]",
    p: "3",
    g: "c",
    n: "p",
    m: "3ª persona, común, plural (ellos/ellas)",
    d: [
      "1ª persona, común, plural (nosotros)",
      "2ª persona, masc., plural (ustedes)",
      "3ª persona, masc., singular (él)",
    ],
  },
] as const;

const verbSuffixPracticeExercises: ExerciseInsert[] = verbSuffixPracticeEntries.map(
  (entry, index) => ({
    id: `v-suff-p-${index + 1}`,
    lessonId: "practice-verb-suffixes",
    type: "verb-parsing",
    question: "Identifica la persona, género y número de este sufijo verbal Qal",
    correctAnswer: JSON.stringify({
      person: entry.p,
      gender: entry.g,
      number: entry.n,
      meaning: entry.m,
    }),
    options: JSON.stringify([entry.m, ...entry.d]),
    hebrewText: entry.h,
    order: index + 1,
  }),
);

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

const participlePracticeEntries = [
  {
    h: "זֹכֵר",
    g: "m",
    n: "s",
    m: "El que recuerda / recordando (m.s.)",
    d: [
      "Las que recuerdan / recordando (f.p.)",
      "La que recuerda / recordando (f.s.)",
      "Los que recuerdan / recordando (m.p.)",
    ],
  },
  {
    h: "שֹׁפְטוֹת",
    g: "f",
    n: "p",
    m: "Las que juzgan / juzgando (f.p.)",
    d: [
      "Los que juzgan / juzgando (m.p.)",
      "La que juzga / juzgando (f.s.)",
      "El que juzga / juzgando (m.s.)",
    ],
  },
  {
    h: "לֹמְדָה",
    g: "f",
    n: "s",
    m: "La que aprende / aprendiendo (f.s.)",
    d: [
      "Las que aprenden / aprendiendo (f.p.)",
      "El que aprende / aprendiendo (m.s.)",
      "Los que aprenden / aprendiendo (m.p.)",
    ],
  },
  {
    h: "דֹּבְרִים",
    g: "m",
    n: "p",
    m: "Los que hablan / hablando (m.p.)",
    d: [
      "El que habla / hablando (m.s.)",
      "Las que hablan / hablando (f.p.)",
      "La que habla / hablando (f.s.)",
    ],
  },
  {
    h: "סֹפֶרֶת",
    g: "f",
    n: "s",
    m: "La que cuenta / contando (f.s.)",
    d: [
      "Las que cuentan / contando (f.p.)",
      "El que cuenta / contando (m.s.)",
      "Los que cuentan / contando (m.p.)",
    ],
  },
  {
    h: "פֹּקֵד",
    g: "m",
    n: "s",
    m: "El que visita / visitando (m.s.)",
    d: [
      "Los que visitan / visitando (m.p.)",
      "La que visita / visitando (f.s.)",
      "Las que visitan / visitando (f.p.)",
    ],
  },
  {
    h: "שֹׁמְרוֹת",
    g: "f",
    n: "p",
    m: "Las que guardan / guardando (f.p.)",
    d: [
      "Los que guardan / guardando (m.p.)",
      "La que guarda / guardando (f.s.)",
      "El que guarda / guardando (m.s.)",
    ],
  },
  {
    h: "כֹּתְבִים",
    g: "m",
    n: "p",
    m: "Los que escriben / escribiendo (m.p.)",
    d: [
      "El que escribe / escribiendo (m.s.)",
      "Las que escriben / escribiendo (f.p.)",
      "La que escribe / escribiendo (f.s.)",
    ],
  },
] as const;

const participlePracticeExercises: ExerciseInsert[] = participlePracticeEntries.map(
  (entry, index) => ({
    id: `part-p-${index + 1}`,
    lessonId: "practice-qal-participle",
    type: "verb-parsing",
    question: "Clasifica este participio hebreo",
    correctAnswer: JSON.stringify({
      gender: entry.g,
      number: entry.n,
      meaning: entry.m,
    }),
    options: JSON.stringify([entry.m, ...entry.d]),
    hebrewText: entry.h,
    order: index + 1,
  }),
);

const imperativePracticeEntries = [
  {
    h: "כִּתְבוּ",
    p: "2",
    g: "m",
    n: "p",
    m: "¡Escriban ustedes (m)!",
    d: ["¡Escribe tú (m)!", "¡Escribe tú (f)!", "¡Escriban ustedes (f)!"],
  },
  {
    h: "קִבְצִי",
    p: "2",
    g: "f",
    n: "s",
    m: "¡Reúne tú (f)!",
    d: ["¡Reúna él!", "¡Reúnan ustedes (m)!", "¡Reúne tú (m)!"],
  },
  {
    h: "שְׁמֹר",
    p: "2",
    g: "m",
    n: "s",
    m: "¡Guarda tú (m)!",
    d: ["¡Guarde ella!", "¡Guarden ustedes (f)!", "¡Guarda tú (f)!"],
  },
  {
    h: "עִבְדוּ",
    p: "2",
    g: "m",
    n: "p",
    m: "¡Sirvan ustedes (m)!",
    d: ["¡Sirva él!", "¡Sirvan ustedes (f)!", "¡Sirve tú (m)!"],
  },
  {
    h: "שִׁמְעִי",
    p: "2",
    g: "f",
    n: "s",
    m: "¡Escucha tú (f)!",
    d: ["¡Escuche él!", "¡Escuchen ustedes (m)!", "¡Escucha tú (m)!"],
  },
  {
    h: "שִׁפְטֹנָה",
    p: "2",
    g: "f",
    n: "p",
    m: "¡Juzguen ustedes (f)!",
    d: ["¡Juzguen ustedes (m)!", "¡Juzgue él!", "¡Juzga tú (f)!"],
  },
  {
    h: "כְּתֹב",
    p: "2",
    g: "m",
    n: "s",
    m: "¡Escribe tú (m)!",
    d: ["¡Escriban ustedes (m)!", "¡Escribe tú (f)!", "¡Escriban ustedes (f)!"],
  },
  {
    h: "זִכְרֹנָה",
    p: "2",
    g: "f",
    n: "p",
    m: "¡Recuerden ustedes (f)!",
    d: ["¡Recuerden ustedes (m)!", "¡Recuerde él!", "¡Recuerda tú (m)!"],
  },
] as const;

const imperativePracticeExercises: ExerciseInsert[] = imperativePracticeEntries.map(
  (entry, index) => ({
    id: `imp-p-${index + 1}`,
    lessonId: "practice-qal-imperative",
    type: "verb-parsing",
    question: "Clasifica este imperativo hebreo",
    correctAnswer: JSON.stringify({
      person: entry.p,
      gender: entry.g,
      number: entry.n,
      meaning: entry.m,
    }),
    options: JSON.stringify([entry.m, ...entry.d]),
    hebrewText: entry.h,
    order: index + 1,
  }),
);

const infinitivePracticeExercises: ExerciseInsert[] = [
  // Reglas teóricas
  {
    id: "inf-r-1",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "¿Cómo se traduce normalmente un Infinitivo Constructo en español según la regla?",
    correctAnswer: "Como infinitivo (terminación -ar, -er, -ir)",
    options: JSON.stringify([
      "Como infinitivo (terminación -ar, -er, -ir)",
      "Como gerundio (terminación -ando, -iendo)",
      "Como participio (terminación -ado, -ido)",
      "Como futuro simple",
    ]),
    order: 1,
  },
  {
    id: "inf-r-2",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "¿Cómo se traduce normalmente un Infinitivo Absoluto en español según la regla?",
    correctAnswer: "Como gerundio (terminación -ando, -iendo)",
    options: JSON.stringify([
      "Como gerundio (terminación -ando, -iendo)",
      "Como infinitivo (terminación -ar, -er, -ir)",
      "Como participio (terminación -ado, -ido)",
      "Como imperativo afirmativo",
    ]),
    order: 2,
  },
  {
    id: "inf-r-3",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "¿Qué pista morfológica ayuda a identificar los infinitivos constructos y absolutos?",
    correctAnswer:
      'Los constructos suelen llevar el prefijo ל (lamed), y los absolutos suelen tener el sonido "o" u "o...o".',
    options: JSON.stringify([
      'Los constructos suelen llevar el prefijo ל (lamed), y los absolutos suelen tener el sonido "o" u "o...o".',
      "Los constructos terminan en ־ה y los absolutos en ־ים.",
      "Los absolutos llevan prefijo ה y los constructos prefijo de lamed.",
      "No hay pistas morfológicas diferenciadoras.",
    ]),
    order: 3,
  },
  // Identificación básica de infinitivos (Página 1)
  {
    id: "inf-p1-1",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: לִזְכֹּר",
    correctAnswer: "Infinitivo constructo, recordar",
    options: JSON.stringify([
      "Infinitivo constructo, recordar",
      "Infinitivo absoluto, guardando",
      "Infinitivo constructo, recordando",
      "Infinitivo absoluto, recordar",
    ]),
    hebrewText: "לִזְכֹּר",
    order: 4,
  },
  {
    id: "inf-p1-2",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: שָׁמוֹר",
    correctAnswer: "Infinitivo absoluto, guardando",
    options: JSON.stringify([
      "Infinitivo absoluto, guardando",
      "Infinitivo constructo, guardar",
      "Infinitivo absoluto, guardar",
      "Infinitivo constructo, guardando",
    ]),
    hebrewText: "שָׁמוֹר",
    order: 5,
  },
  {
    id: "inf-p1-3",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: לִשְכֹּן",
    correctAnswer: "Infinitivo constructo, habitar",
    options: JSON.stringify([
      "Infinitivo constructo, habitar",
      "Infinitivo absoluto, habitando",
      "Infinitivo constructo, habitando",
      "Infinitivo absoluto, habitar",
    ]),
    hebrewText: "לִשְכֹּן",
    order: 6,
  },
  {
    id: "inf-p1-4",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: לִקְרֹּא",
    correctAnswer: "Infinitivo constructo, llamar",
    options: JSON.stringify([
      "Infinitivo constructo, llamar",
      "Infinitivo absoluto, llamando",
      "Infinitivo absoluto, llamar",
      "Infinitivo constructo, llamando",
    ]),
    hebrewText: "לִקְרֹּא",
    order: 7,
  },
  {
    id: "inf-p1-5",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: אָׁמוֹר",
    correctAnswer: "Infinitivo absoluto, diciendo",
    options: JSON.stringify([
      "Infinitivo absoluto, diciendo",
      "Infinitivo constructo, decir",
      "Infinitivo absoluto, decir",
      "Infinitivo constructo, diciendo",
    ]),
    hebrewText: "אָׁמוֹר",
    order: 8,
  },
  {
    id: "inf-p1-6",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: הָׁלוְֹך",
    correctAnswer: "Infinitivo absoluto, yendo",
    options: JSON.stringify([
      "Infinitivo absoluto, yendo",
      "Infinitivo constructo, ir",
      "Infinitivo absoluto, ir",
      "Infinitivo constructo, yendo",
    ]),
    hebrewText: "הָׁלוְֹך",
    order: 9,
  },
  {
    id: "inf-p1-7",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question:
      "Identifica el tipo de infinitivo y su traducción correcta para: שְֹּלח (Nota: Forma constructa sin prefijo)",
    correctAnswer: "Infinitivo constructo, enviar",
    options: JSON.stringify([
      "Infinitivo constructo, enviar",
      "Infinitivo absoluto, enviando",
      "Infinitivo constructo, enviando",
      "Infinitivo absoluto, enviar",
    ]),
    hebrewText: "שְֹּלח",
    order: 10,
  },
  {
    id: "inf-p1-8",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: בָׁחוֹר",
    correctAnswer: "Infinitivo absoluto, eligiendo",
    options: JSON.stringify([
      "Infinitivo absoluto, eligiendo",
      "Infinitivo constructo, elegir",
      "Infinitivo absoluto, elegir",
      "Infinitivo constructo, eligiendo",
    ]),
    hebrewText: "בָׁחוֹר",
    order: 11,
  },
  {
    id: "inf-p1-9",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: לִשְחֹּט",
    correctAnswer: "Infinitivo constructo, degollar",
    options: JSON.stringify([
      "Infinitivo constructo, degollar",
      "Infinitivo absoluto, degollando",
      "Infinitivo constructo, degollando",
      "Infinitivo absoluto, degollar",
    ]),
    hebrewText: "לִשְחֹּט",
    order: 12,
  },
  {
    id: "inf-p1-10",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Identifica el tipo de infinitivo y su traducción correcta para: נָׁפוֹל",
    correctAnswer: "Infinitivo absoluto, cayendo",
    options: JSON.stringify([
      "Infinitivo absoluto, cayendo",
      "Infinitivo constructo, caer",
      "Infinitivo absoluto, caer",
      "Infinitivo constructo, cayendo",
    ]),
    hebrewText: "נָׁפוֹל",
    order: 13,
  },
  // Traducción en Contexto (Página 2, arriba)
  {
    id: "inf-p2-1",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: שָׁמוֹר תִשְמֹּר",
    correctAnswer: "Ciertamente guardarás.",
    options: JSON.stringify([
      "Ciertamente guardarás.",
      "Guardar y guardar.",
      "¡Guarda el mandamiento!",
      "Cuando guardes.",
    ]),
    hebrewText: "שָׁמוֹר תִשְמֹּר",
    order: 14,
  },
  {
    id: "inf-p2-2",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: בִשְכֹּn יִשְrָׁאֵל בָׁאָׁרֶץ",
    correctAnswer: "Cuando Israel habitaba en la tierra.",
    options: JSON.stringify([
      "Cuando Israel habitaba en la tierra.",
      "Para que Israel habite en la tierra.",
      "Israel ciertamente habitará en la tierra.",
      "¡Habita, Israel, en la tierra!",
    ]),
    hebrewText: "בִשְכֹּן יִשְרָׁאֵל בָׁאָׁרֶץ",
    order: 15,
  },
  {
    id: "inf-p2-3",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: אָׁמוֹר אָׁמַרְתִי",
    correctAnswer: "Ciertamente dije.",
    options: JSON.stringify([
      "Ciertamente dije.",
      "Diciendo y diciendo.",
      "¡Di la palabra!",
      "Cuando yo decía.",
    ]),
    hebrewText: "אָׁמוֹר אָׁמַרְתִי",
    order: 16,
  },
  {
    id: "inf-p2-4",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: שָׁמוֹר אֶת־יוֹם הַשַּׁבָּת",
    correctAnswer: "¡Guarda el día de reposo (el sábado)!",
    options: JSON.stringify([
      "¡Guarda el día de reposo (el sábado)!",
      "Ciertamente guardarás el sábado.",
      "Cuando guardabas el sábado.",
      "El guardar el sábado.",
    ]),
    hebrewText: "שָׁמוֹר אֶת־יוֹם הַשַּׁבָּת",
    order: 17,
  },
  {
    id: "inf-p2-5",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: כִכְתֹּב הָׁאִשָׁה",
    correctAnswer: "Cuando la mujer escribía.",
    options: JSON.stringify([
      "Cuando la mujer escribía.",
      "Para que la mujer escriba.",
      "¡Escribe, oh mujer!",
      "La mujer ciertamente escribirá.",
    ]),
    hebrewText: "כִכְתֹּב הָׁאִשָׁה",
    order: 18,
  },
  {
    id: "inf-p2-6",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: יָׁשַב לִקְרֹּא",
    correctAnswer: "(Él) se sentó para llamar (o para leer).",
    options: JSON.stringify([
      "(Él) se sentó para llamar (o para leer).",
      "Cuando se sentaba a llamar.",
      "¡Siéntate a llamar!",
      "Ciertamente se sentará a llamar.",
    ]),
    hebrewText: "יָׁשַב לִקְרֹּא",
    order: 19,
  },
  {
    id: "inf-p2-7",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: זָׁכוֹר אֶת־הַיּוֹם הַזֶּה",
    correctAnswer: "¡Recuerda este día!",
    options: JSON.stringify([
      "¡Recuerda este día!",
      "Ciertamente recordarás este día.",
      "Cuando recordabas este día.",
      "El recuerdo de este día.",
    ]),
    hebrewText: "זָׁכוֹר אֶת־הַיּוֹם הַזֶּה",
    order: 20,
  },
  {
    id: "inf-p2-8",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: וַיֵּלֶךְ הָׁלוֹךְ וְאָכֹּל",
    correctAnswer: "Y (él) fue caminando y comiendo.",
    options: JSON.stringify([
      "Y (él) fue caminando y comiendo.",
      "Ciertamente caminó y comió.",
      "¡Camina y come!",
      "Cuando caminaba y comía.",
    ]),
    hebrewText: "וַיֵּלֶךְ הָׁלוֹךְ וְאָכֹּל",
    order: 21,
  },
  {
    id: "inf-p2-9",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: בְעָׁבְרְכֶם אֶת־הַיַּרְדֵּן",
    correctAnswer: "Cuando ustedes cruzaban el Jordán.",
    options: JSON.stringify([
      "Cuando ustedes cruzaban el Jordán.",
      "Para que crucen el Jordán.",
      "Ustedes ciertamente cruzarán el Jordán.",
      "¡Crucen el Jordán!",
    ]),
    hebrewText: "בְעָׁבְרְכֶם אֶת־הַיַּרְדֵּן",
    order: 22,
  },
  {
    id: "inf-p2-10",
    lessonId: "practice-qal-infinitives",
    type: "multiple-choice",
    question: "Traduce la frase en contexto aplicando las reglas del infinitivo: עָׁלָׁה לִזְבֹּחַ",
    correctAnswer: "(Él) subió para sacrificar.",
    options: JSON.stringify([
      "(Él) subió para sacrificar.",
      "Cuando (él) subía a sacrificar.",
      "¡Sube a sacrificar!",
      "Ciertamente subirá a sacrificar.",
    ]),
    hebrewText: "עָׁלָׁה לִזְבֹּחַ",
    order: 23,
  },
];

const participleV2PracticeEntries = [
  {
    h: "אֹּמְריִם",
    g: "m",
    n: "p",
    m: "diciendo",
    d: ["viendo", "guardando", "escuchando"],
  },
  {
    h: "רֹּאֶה",
    g: "m",
    n: "s",
    m: "viendo",
    d: ["diciendo", "encontrando", "sentándose"],
  },
  {
    h: "שֹׁמֵר",
    g: "m",
    n: "s",
    m: "guardando",
    d: ["escuchando", "juzgando", "yendo"],
  },
  {
    h: "הֹּלְכָׁה",
    g: "f",
    n: "s",
    m: "yendo",
    d: ["guardando", "juzgando", "sentándose"],
  },
  {
    h: "הֹּלֶכֶת",
    g: "f",
    n: "s",
    m: "yendo",
    d: ["viendo", "encontrando", "diciendo"],
  },
  {
    h: "מֹּצְאִים",
    g: "m",
    n: "p",
    m: "encontrando",
    d: ["guardando", "viendo", "diciendo"],
  },
  {
    h: "שֹׁמְעוֹת",
    g: "f",
    n: "p",
    m: "escuchando",
    d: ["juzgando", "sentándose", "viendo"],
  },
  {
    h: "שֹׁפֵט",
    g: "m",
    n: "s",
    m: "juzgando",
    d: ["encontrando", "diciendo", "guardando"],
  },
  {
    h: "יֹּשֶׁבֶת",
    g: "f",
    n: "s",
    m: "sentándose",
    d: ["yendo", "guardando", "escuchando"],
  },
  {
    h: "הֹּלְכִים",
    g: "m",
    n: "p",
    m: "yendo",
    d: ["encontrando", "juzgando", "guardando"],
  },
] as const;

const participleV2PracticeExercises: ExerciseInsert[] = [
  ...participleV2PracticeEntries.map((entry, index) => ({
    id: `part-v2-p-${index + 1}`,
    lessonId: "practice-qal-participle-v2",
    type: "verb-parsing" as const,
    question: "Clasifica este participio hebreo avanzado (género, número, traducción)",
    correctAnswer: JSON.stringify({
      gender: entry.g,
      number: entry.n,
      meaning: entry.m,
    }),
    options: JSON.stringify([entry.m, ...entry.d]),
    hebrewText: entry.h,
    order: index + 1,
  })),
  // Frases Participiales (Página 3, abajo)
  {
    id: "part-v2-ph-1",
    lessonId: "practice-qal-participle-v2",
    type: "multiple-choice",
    question: "Traduce la frase participial atributiva: הָׁאִישׁ הַכֹּתֵב",
    correctAnswer: "El hombre que está escribiendo.",
    options: JSON.stringify([
      "El hombre que está escribiendo.",
      "El hombre está escribiendo el libro.",
      "El que está guardando el pacto.",
      "La mujer está sentada en la ciudad.",
    ]),
    hebrewText: "הָׁאִישׁ הַכֹּתֵב",
    order: 11,
  },
  {
    id: "part-v2-ph-2",
    lessonId: "practice-qal-participle-v2",
    type: "multiple-choice",
    question: "Traduce la frase participial atributiva: הָׁאִשָׁה הַיֹּשֶׁבֶת",
    correctAnswer: "La mujer que está sentada.",
    options: JSON.stringify([
      "La mujer que está sentada.",
      "La mujer está sentada en la ciudad.",
      "La que está habitando la ciudad.",
      "El hombre está escribiendo el libro.",
    ]),
    hebrewText: "הָׁאִשָׁה הַיֹּשֶׁבֶת",
    order: 12,
  },
  {
    id: "part-v2-ph-3",
    lessonId: "practice-qal-participle-v2",
    type: "multiple-choice",
    question: "Traduce la frase participial predicativa: הָׁאִישׁ כֹּתֵב אֶת־הַסֵּפֶR / הָׁאִישׁ כֹּתֵב אֶת־הַסֵּפֶר",
    correctAnswer: "El hombre está escribiendo el libro.",
    options: JSON.stringify([
      "El hombre está escribiendo el libro.",
      "El hombre que está escribiendo.",
      "El que está guardando el pacto.",
      "Los que están habitando la ciudad.",
    ]),
    hebrewText: "הָׁאִישׁ כֹּתֵב אֶת־הַסֵּפֶר",
    order: 13,
  },
  {
    id: "part-v2-ph-4",
    lessonId: "practice-qal-participle-v2",
    type: "multiple-choice",
    question: "Traduce la frase participial predicativa: הָׁאִשָׁה יֹּשֶׁבֶת בָּעִיר",
    correctAnswer: "La mujer está sentada en la ciudad.",
    options: JSON.stringify([
      "La mujer está sentada en la ciudad.",
      "La mujer que está sentada.",
      "La que está habitando la ciudad.",
      "El hombre está escribiendo el libro.",
    ]),
    hebrewText: "הָׁאִשָׁה יֹּשֶׁבֶת בָּעִיר",
    order: 14,
  },
  {
    id: "part-v2-ph-5",
    lessonId: "practice-qal-participle-v2",
    type: "multiple-choice",
    question: "Traduce la frase participial sustantivada: שֹׁמֵR־הַבְּרִית / שֹׁמֵר־הַבְּרִית",
    correctAnswer: "El que está guardando el pacto.",
    options: JSON.stringify([
      "El que está guardando el pacto.",
      "Los que están habitando la ciudad.",
      "El hombre que está escribiendo.",
      "La mujer está sentada en la ciudad.",
    ]),
    hebrewText: "...שֹּמֵר־ה בְרִית", // wait, let's write exactly with simple hebrew tag: שֹׁמֵר־הַבְּרִית
    order: 15,
  },
  {
    id: "part-v2-ph-6",
    lessonId: "practice-qal-participle-v2",
    type: "multiple-choice",
    question: "Traduce la frase participial sustantivada: יֹּשְׁבֵי הָׁעִיר",
    correctAnswer: "Los que están habitando la ciudad.",
    options: JSON.stringify([
      "Los que están habitando la ciudad.",
      "El que está guardando el pacto.",
      "El hombre está escribiendo el libro.",
      "La mujer que está sentada.",
    ]),
    hebrewText: "יֹּשְׁבֵי הָׁעִיר",
    order: 16,
  },
];

const sectionExercises: ExerciseInsert[] = [
  // MÓDULO 1: Fundamentos
  {
    id: "ex-1-1",
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: "¿Cuántas consonantes tiene el alfabeto hebreo estándar?",
    correctAnswer: "22 consonantes",
    options: JSON.stringify([
      "22 consonantes",
      "24 consonantes",
      "20 consonantes",
      "27 consonantes",
    ]),
    order: 1,
  },
  {
    id: "ex-1-2",
    lessonId: "lesson-1",
    type: "multiple-choice",
    question: "¿En qué dirección se lee y escribe el hebreo?",
    correctAnswer: "De derecha a izquierda",
    options: JSON.stringify([
      "De derecha a izquierda",
      "De izquierda a derecha",
      "De arriba hacia abajo",
      "No tiene dirección fija",
    ]),
    order: 2,
  },
  {
    id: "ex-2-1",
    lessonId: "lesson-2",
    type: "multiple-choice",
    question: "¿Qué sistema se usa en hebreo para escribir las vocales?",
    correctAnswer: "Niqqud (puntos y trazos)",
    options: JSON.stringify([
      "Niqqud (puntos y trazos)",
      "Letras mayúsculas",
      "Acentos",
      "No se usan vocales en absoluto",
    ]),
    order: 1,
  },
  {
    id: "ex-3-1",
    lessonId: "lesson-3",
    type: "multiple-choice",
    question: "¿Qué es un Daghesh Forte?",
    correctAnswer: "Un punto que duplica una consonante",
    options: JSON.stringify([
      "Un punto que duplica una consonante",
      "Una vocal larga",
      "Una consonante muda",
      "Un acento musical",
    ]),
    order: 1,
  },

  // MÓDULO 2: Sustantivos y Partículas
  {
    id: "ex-4-1",
    lessonId: "lesson-4",
    type: "multiple-choice",
    question: "Los sustantivos en hebreo tienen...",
    correctAnswer: "Género y número",
    options: JSON.stringify([
      "Género y número",
      "Solo género",
      "Solo número",
      "Ninguno de los dos",
    ]),
    order: 1,
  },
  {
    id: "ex-5-1",
    lessonId: "lesson-5",
    type: "multiple-choice",
    question: "¿Cómo se forma el artículo definido normalmente?",
    correctAnswer: "Con la letra He (ה) + vocal Pataj + Daghesh Forte",
    options: JSON.stringify([
      "Con la letra He (ה) + vocal Pataj + Daghesh Forte",
      "Añadiendo Waw (ו)",
      "Añadiendo Yod (י)",
      "El hebreo no tiene artículo definido",
    ]),
    order: 1,
  },
  {
    id: "ex-6-1",
    lessonId: "lesson-6",
    type: "multiple-choice",
    question: "¿Qué son las preposiciones inseparables?",
    correctAnswer: "Preposiciones que se unen como prefijo a la palabra",
    options: JSON.stringify([
      "Preposiciones que se unen como prefijo a la palabra",
      "Preposiciones que siempre van solas",
      "Preposiciones que se sufijan",
      "Preposiciones largas",
    ]),
    order: 1,
  },

  // MÓDULO 3: Calificadores y Pronombres
  {
    id: "ex-7-1",
    lessonId: "lesson-7",
    type: "multiple-choice",
    question: "Un adjetivo en uso atributivo...",
    correctAnswer: "Sigue al sustantivo y concuerda en género, número y artículo",
    options: JSON.stringify([
      "Sigue al sustantivo y concuerda en género, número y artículo",
      "Precede al sustantivo",
      "No concuerda con el sustantivo",
      "Nunca lleva artículo",
    ]),
    order: 1,
  },
  {
    id: "ex-8-1",
    lessonId: "lesson-8",
    type: "multiple-choice",
    question: "¿Qué significa 'Añí' (אֲנִי)?",
    correctAnswer: "Yo",
    options: JSON.stringify(["Yo", "Tú", "Él", "Nosotros"]),
    order: 1,
  },
  {
    id: "ex-9-1",
    lessonId: "lesson-9",
    type: "multiple-choice",
    question: "Los sufijos pronominales en un sustantivo indican...",
    correctAnswer: "Posesión (mi, tu, su)",
    options: JSON.stringify([
      "Posesión (mi, tu, su)",
      "El sujeto del verbo",
      "El objeto directo",
      "Tiempo futuro",
    ]),
    order: 1,
  },

  // MÓDULO 4: Relaciones de Propiedad
  {
    id: "ex-10-1",
    lessonId: "lesson-10",
    type: "multiple-choice",
    question: "En una cadena constructa, la palabra en estado absoluto está...",
    correctAnswer: "Al final de la cadena",
    options: JSON.stringify([
      "Al final de la cadena",
      "Al principio",
      "En el medio",
      "No hay estado absoluto",
    ]),
    order: 1,
  },
  {
    id: "ex-11-1",
    lessonId: "lesson-11",
    type: "multiple-choice",
    question: "¿Qué significa 'Ejad' (אֶחָד)?",
    correctAnswer: "Uno",
    options: JSON.stringify(["Uno", "Dos", "Tres", "Diez"]),
    order: 1,
  },

  ...freqLevel1Exercises,
  ...freqLevel2Exercises,
  ...freqLevel3Exercises,
  ...freqLevel4Exercises,
  ...freqLevel5Exercises,
  ...freqLevel6Exercises,
  ...freqLevel7Exercises,
  ...freqLevel8Exercises,
  ...freqLevel9Exercises,
  ...freqLevel10Exercises,
  ...freqLevel11Exercises,
  ...nounsPracticeExercises,
  ...adjectivePracticeExercises,
  ...verbsPracticeExercises,
  ...imperfectPracticeExercises,
  ...verbSuffixPracticeExercises,
  ...prefixPracticeExercises,
  ...pronounPracticeExercises,
  ...suffixPracticeExercises,
  ...participlePracticeExercises,
  ...imperativePracticeExercises,
  ...infinitivePracticeExercises,
  ...participleV2PracticeExercises,
];

const PRACTICE_LESSON_IDS = {
  freqLevel1: "freq-2200-5000",
  freqLevel2: "freq-1000-2199",
  freqLevel3: "freq-730-999",
  freqLevel4: "freq-500-729",
  freqLevel5: "freq-400-499",
  freqLevel6: "freq-310-399",
  freqLevel7: "freq-270-309",
  freqLevel8: "freq-220-269",
  freqLevel9: "freq-200-219",
  freqLevel10: "freq-175-199",
  freqLevel11: "freq-160-174",
  nouns: "practice-nouns",
  adjectives: "practice-adjectives",
  verbs: "practice-verbs",
  imperfect: "practice-qal-imperfect",
  verbSuffixes: "practice-verb-suffixes",
  prefixes: "practice-prefixes",
  pronouns: "practice-pronouns",
  suffixes: "practice-suffixes",
  participle: "practice-qal-participle",
  imperatives: "practice-qal-imperative",
  participleV2: "practice-qal-participle-v2",
  infinitives: "practice-qal-infinitives",
} as const;

const allPracticeLessonIds = new Set<string>(Object.values(PRACTICE_LESSON_IDS));

const roadmapLessonIds = sectionLessons
  .map((lesson) => lesson.id as string)
  .filter((lessonId) => !allPracticeLessonIds.has(lessonId));

async function reseedLessonGroup(database: typeof db, label: string, lessonIds: readonly string[]) {
  const lessonIdSet = new Set(lessonIds);
  const lessonRows = sectionLessons.filter((lesson) => lessonIdSet.has(lesson.id as string));
  const exerciseRows = sectionExercises.filter((exercise) =>
    lessonIdSet.has(exercise.lessonId as string),
  );

  if (lessonRows.length === 0) {
    console.log(`⚠️ Seed omitido (${label}): no hay lecciones configuradas.`);
    return;
  }

  // Obtener los IDs de los ejercicios a eliminar para limpiar las referencias FK
  const exercisesToDelete = await database
    .select({ id: exercises.id })
    .from(exercises)
    .where(inArray(exercises.lessonId, lessonIds as string[]));

  const exerciseIds = exercisesToDelete.map((e) => e.id);

  if (exerciseIds.length > 0) {
    await database.delete(userMistakes).where(inArray(userMistakes.exerciseId, exerciseIds));
    await database.delete(quizQuestions).where(inArray(quizQuestions.exerciseId, exerciseIds));
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
    `✅ Seed ${label}: ${lessonRows.length} lecciones, ${exerciseRows.length} ejercicios.`,
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

export async function seedPracticeFrequencyLevel6(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-310-399", [PRACTICE_LESSON_IDS.freqLevel6]);
}

export async function seedPracticeFrequencyLevel7(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-270-309", [PRACTICE_LESSON_IDS.freqLevel7]);
}

export async function seedPracticeFrequencyLevel8(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-220-269", [PRACTICE_LESSON_IDS.freqLevel8]);
}

export async function seedPracticeFrequencyLevel9(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-200-219", [PRACTICE_LESSON_IDS.freqLevel9]);
}

export async function seedPracticeFrequencyLevel10(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-175-199", [PRACTICE_LESSON_IDS.freqLevel10]);
}

export async function seedPracticeFrequencyLevel11(database: typeof db) {
  await reseedLessonGroup(database, "practice/freq-160-174", [PRACTICE_LESSON_IDS.freqLevel11]);
}

export async function seedPracticeNouns(database: typeof db) {
  await reseedLessonGroup(database, "practice/nouns", [PRACTICE_LESSON_IDS.nouns]);
}

export async function seedPracticeAdjectives(database: typeof db) {
  await reseedLessonGroup(database, "practice/adjectives", [PRACTICE_LESSON_IDS.adjectives]);
}

export async function seedPracticeVerbs(database: typeof db) {
  await reseedLessonGroup(database, "practice/verbs", [PRACTICE_LESSON_IDS.verbs]);
}

export async function seedPracticeQalImperfect(database: typeof db) {
  await reseedLessonGroup(database, "practice/qal-imperfect", [PRACTICE_LESSON_IDS.imperfect]);
}

export async function seedPracticeVerbSuffixes(database: typeof db) {
  await reseedLessonGroup(database, "practice/verb-suffixes", [PRACTICE_LESSON_IDS.verbSuffixes]);
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

export async function seedPracticeParticiple(database: typeof db) {
  await reseedLessonGroup(database, "practice/participle", [PRACTICE_LESSON_IDS.participle]);
}

export async function seedPracticeImperatives(database: typeof db) {
  await reseedLessonGroup(database, "practice/imperatives", [PRACTICE_LESSON_IDS.imperatives]);
}

export async function seedPracticeInfinitives(database: typeof db) {
  await reseedLessonGroup(database, "practice/infinitives", [PRACTICE_LESSON_IDS.infinitives]);
}

export async function seedPracticeParticipleV2(database: typeof db) {
  await reseedLessonGroup(database, "practice/participle-v2", [PRACTICE_LESSON_IDS.participleV2]);
}

export async function seedAllPracticeSections(database: typeof db) {
  await seedPracticeFrequencyLevel1(database);
  await seedPracticeFrequencyLevel2(database);
  await seedPracticeFrequencyLevel3(database);
  await seedPracticeFrequencyLevel4(database);
  await seedPracticeFrequencyLevel5(database);
  await seedPracticeFrequencyLevel6(database);
  await seedPracticeFrequencyLevel7(database);
  await seedPracticeFrequencyLevel8(database);
  await seedPracticeFrequencyLevel9(database);
  await seedPracticeFrequencyLevel10(database);
  await seedPracticeFrequencyLevel11(database);
  await seedPracticeNouns(database);
  await seedPracticeAdjectives(database);
  await seedPracticeVerbs(database);
  await seedPracticeQalImperfect(database);
  await seedPracticeVerbSuffixes(database);
  await seedPracticePrefixes(database);
  await seedPracticePronouns(database);
  await seedPracticeSuffixes(database);
  await seedPracticeParticiple(database);
  await seedPracticeImperatives(database);
  await seedPracticeInfinitives(database);
  await seedPracticeParticipleV2(database);
}

export async function seedLessonsAndExercises(database: typeof db) {
  console.log("📘 Reiniciando plan de lecciones (modular)...");
  await seedRoadmapLessonsAndExercises(database);
  await seedAllPracticeSections(database);

  console.log(
    `✅ Lecciones sembradas desde módulos: ${sectionLessons.length} lecciones, ${sectionExercises.length} ejercicios`,
  );
}

export async function seedAlphabet(database: typeof db) {
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
  await database.insert(alphabet).values(letters).onConflictDoNothing();
  console.log("✅ Alfabeto sembrado con 27 letras");
}

export async function seedRhythmParadigms(database: typeof db) {
  console.log("🥁 Creando Paradigmas Rítmicos (IME)...");
  await database
    .insert(rhythmParadigms)
    .values([
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
          { hebrew: "כָּתְבוּ", translit: "katvu", meaning: "ellos escribieron" },
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
          { hebrew: "יִלְמְדוּ", translit: "yilmedu", meaning: "ellos aprenderán" },
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
          { hebrew: "שׁוֹמְרוֹת", translit: "shomrot", meaning: "guardando (fp)" },
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
          { hebrew: "הִקְדִּישׁוּ", translit: "hiqdishu", meaning: "ellos santificaron" },
        ]),
        order: 4,
      },
    ])
    .onConflictDoNothing();
  console.log("✅ Paradigmas Rítmicos sembrados (4 paradigmas)");
}
export async function seedFlashcards(database: typeof db) {
  console.log("🎴 Sembrando Flashcards por Frecuencia...");

  const allFreqVocab = [
    { vocab: freqLevel1Vocabulary, category: "freq-1" },
    { vocab: freqLevel2Vocabulary, category: "freq-2" },
    { vocab: freqLevel3Vocabulary, category: "freq-3" },
    { vocab: freqLevel4Vocabulary, category: "freq-4" },
    { vocab: freqLevel5Vocabulary, category: "freq-5" },
    { vocab: freqLevel6Vocabulary, category: "freq-6" },
    { vocab: freqLevel7Vocabulary, category: "freq-7" },
    { vocab: freqLevel8Vocabulary, category: "freq-8" },
    { vocab: freqLevel9Vocabulary, category: "freq-9" },
    { vocab: freqLevel10Vocabulary, category: "freq-10" },
    { vocab: freqLevel11Vocabulary, category: "freq-11" },
  ];

  for (const group of allFreqVocab) {
    const cards = group.vocab.map((v, i) => ({
      id: `fc-${group.category}-${i + 1}`,
      type: "vocabulary",
      category: group.category,
      frontContent: JSON.stringify({ text: v.h }),
      backContent: JSON.stringify({
        meaning: v.s,
        // biome-ignore lint/suspicious/noExplicitAny: polymorphic vocab groups
        translit: (v as any).t || (v as any).translit || "",
      }),
      order: i + 1,
    }));

    for (const card of cards) {
      await database
        .insert(flashcards)
        .values(card)
        .onConflictDoUpdate({
          target: flashcards.id,
          set: {
            category: card.category,
            frontContent: card.frontContent,
            backContent: card.backContent,
            order: card.order,
          },
        });
    }
  }
  console.log("✅ Flashcards de frecuencia sembradas.");
}

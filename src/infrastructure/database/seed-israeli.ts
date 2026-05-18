import type { InferInsertModel } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import type { db } from "./db";
import { flashcards, israeliSentences, israeliUnits, israeliVocabulary } from "./schema";

type IsraeliUnitInsert = InferInsertModel<typeof israeliUnits>;
type FlashcardInsert = InferInsertModel<typeof flashcards>;
type IsraeliVocabularyInsert = InferInsertModel<typeof israeliVocabulary>;
type IsraeliSentenceInsert = InferInsertModel<typeof israeliSentences>;

const israeliUnitsData: IsraeliUnitInsert[] = [
  {
    id: "israeli-unit-1",
    title: "Sustantivos y Artículos",
    description: "Inmersión léxica cerrada con sustantivos comunes y el artículo definido.",
    grammarScope: "Sustantivos, Artículo ה (Ha)",
    maxWords: 18,
    order: 1,
  },
  {
    id: "israeli-unit-2",
    title: "Preposiciones Inseparables",
    description: "Uso de las preposiciones ב, ל, כ con el artículo y sustantivos.",
    grammarScope: "Preposiciones Inseparables",
    maxWords: 18,
    order: 2,
  },
  {
    id: "israeli-unit-3",
    title: "Sustantivo y Adjetivo",
    description: "Concordancia de género y número entre sustantivos y adjetivos.",
    grammarScope: "Sustantivos y Adjetivos",
    maxWords: 18,
    order: 3,
  },
];

const unit1Words = [
  { id: "ifc-1", text: "[בָּרָא:r]", meaning: "creó", translit: "bará", order: 101 },
  { id: "ifc-2", text: "[אָמַר:r]", meaning: "dijo", translit: "amar", order: 102 },
  { id: "ifc-3", text: "[בָּא:r]", meaning: "vino / entró", translit: "ba", order: 103 },
  { id: "ifc-4", text: "[אֶל:p]", meaning: "a, hacia", translit: "el", order: 104 },
  { id: "ifc-5", text: "[מִן:p]", meaning: "de, desde", translit: "min", order: 105 },
  { id: "ifc-6", text: "[וְ:p]", meaning: "y", translit: "ve", order: 106 },
  { id: "ifc-7", text: "[עִיר:r]", meaning: "ciudad", translit: "ir", order: 107 },
  { id: "ifc-8", text: "[אֱלֹהַּ:r][ִים:s]", meaning: "Dios", translit: "Elohim", order: 108 },
  { id: "ifc-9", text: "[עָפָר:r]", meaning: "polvo", translit: "afár", order: 109 },
  { id: "ifc-10", text: "[חֹשֶׁךְ:r]", meaning: "oscuridad", translit: "jóshej", order: 110 },
  { id: "ifc-11", text: "[רֹאשׁ:r]", meaning: "cabeza", translit: "rosh", order: 111 },
  {
    id: "ifc-12",
    text: "[הֵיכָל:r]",
    meaning: "templo, palacio",
    translit: "heijal",
    order: 112,
  },
  { id: "ifc-13", text: "[מֶלֶךְ:r]", meaning: "rey", translit: "melej", order: 113 },
  { id: "ifc-14", text: "[יוֹם:r]", meaning: "día", translit: "yom", order: 114 },
  { id: "ifc-15", text: "[לַיְלָה:r]", meaning: "noche", translit: "láyla", order: 115 },
  { id: "ifc-16", text: "[אוֹר:r]", meaning: "luz", translit: "or", order: 116 },
  {
    id: "ifc-17",
    text: "[אָדָם:r]",
    meaning: "hombre (Adán)",
    translit: "adam",
    order: 117,
  },
  {
    id: "ifc-18",
    text: "[אֲדָמָה:r]",
    meaning: "tierra, suelo",
    translit: "adamá",
    order: 118,
  },
] as const;

const unit2And3Words = [
  { id: "fc-u2-1", text: "[קָרָא:r]", meaning: "él llamó", translit: "qara", order: 201 },
  { id: "fc-u2-2", text: "[נָתַן:r]", meaning: "él dio", translit: "natan", order: 202 },
  { id: "fc-u2-3", text: "[רָאָה:r]", meaning: "él vio", translit: "raah", order: 203 },
  {
    id: "fc-u2-4",
    text: "[הָלַךְ:r]",
    meaning: "él fue, caminó",
    translit: "halak",
    order: 204,
  },
  {
    id: "fc-u2-5",
    text: "[שָׁמַיִם:r]",
    meaning: "cielos",
    translit: "shamayim",
    order: 205,
  },
  {
    id: "fc-u2-6",
    text: "[דָּבָר:r]",
    meaning: "palabra, cosa",
    translit: "dabar",
    order: 206,
  },
  {
    id: "fc-u2-7",
    text: "[אִשָּׁה:r]",
    meaning: "mujer, esposa",
    translit: "ishah",
    order: 207,
  },
  { id: "fc-u2-8", text: "[לֹא:r]", meaning: "no", translit: "lo", order: 208 },
  {
    id: "fc-u2-9",
    text: "[שְׁמוּאֵל:r]",
    meaning: "Samuel",
    translit: "shemuel",
    order: 209,
  },
  { id: "fc-u2-10", text: "[עַם:r]", meaning: "un pueblo", translit: "am", order: 210 },
  {
    id: "fc-u2-11",
    text: "[הָ:p][עָם:r]",
    meaning: "el pueblo",
    translit: "ha'am",
    order: 211,
  },
  {
    id: "fc-u2-12",
    text: "[יהוה:r]",
    meaning: "Yahvé, el Señor",
    translit: "Adonai",
    order: 212,
  },
  { id: "fc-u3-1", text: "[טוֹב:r]", meaning: "bueno", translit: "tob", order: 300 },
] as const;

const flashcardsData: FlashcardInsert[] = [...unit1Words, ...unit2And3Words].map((word) => ({
  id: word.id,
  type: "vocabulary",
  frontContent: JSON.stringify({ text: word.text }),
  backContent: JSON.stringify({ meaning: word.meaning, translit: word.translit }),
  order: word.order,
}));

const unit1VocabularyRows: IsraeliVocabularyInsert[] = unit1Words.map((word, index) => ({
  id: `iv-u1-${index + 1}`,
  unitId: "israeli-unit-1",
  flashcardId: word.id,
  order: index + 1,
}));

const unit2And3VocabularyRows: IsraeliVocabularyInsert[] = [
  { id: "iv-u2-1", unitId: "israeli-unit-2", flashcardId: "fc-u2-1", order: 1 },
  { id: "iv-u2-2", unitId: "israeli-unit-2", flashcardId: "fc-u2-2", order: 2 },
  { id: "iv-u2-3", unitId: "israeli-unit-2", flashcardId: "fc-u2-3", order: 3 },
  { id: "iv-u2-4", unitId: "israeli-unit-2", flashcardId: "fc-u2-4", order: 4 },
  { id: "iv-u2-5", unitId: "israeli-unit-2", flashcardId: "fc-u2-5", order: 5 },
  { id: "iv-u2-6", unitId: "israeli-unit-2", flashcardId: "fc-u2-6", order: 6 },
  { id: "iv-u2-7", unitId: "israeli-unit-2", flashcardId: "fc-u2-7", order: 7 },
  { id: "iv-u2-8", unitId: "israeli-unit-2", flashcardId: "fc-u2-8", order: 8 },
  { id: "iv-u2-9", unitId: "israeli-unit-2", flashcardId: "fc-u2-9", order: 9 },
  { id: "iv-u2-10", unitId: "israeli-unit-2", flashcardId: "fc-u2-10", order: 10 },
  { id: "iv-u2-11", unitId: "israeli-unit-2", flashcardId: "fc-u2-11", order: 11 },
  { id: "iv-u2-12", unitId: "israeli-unit-2", flashcardId: "fc-u2-12", order: 12 },
  { id: "iv-u3-1", unitId: "israeli-unit-3", flashcardId: "fc-u3-1", order: 1 },
];

const israeliVocabularyRows: IsraeliVocabularyInsert[] = [
  ...unit1VocabularyRows,
  ...unit2And3VocabularyRows,
];

const unit1Sentences: IsraeliSentenceInsert[] = [
  {
    id: "is-1",
    unitId: "israeli-unit-1",
    hebrewText: "[מֶלֶךְ:r], [הַ:p][מֶּלֶךְ:r]",
    translation: "rey, el rey",
    order: 1,
  },
  {
    id: "is-2",
    unitId: "israeli-unit-1",
    hebrewText: "[יוֹם:r], [הַ:p][יּוֹם:r]",
    translation: "día, el día",
    order: 2,
  },
  {
    id: "is-3",
    unitId: "israeli-unit-1",
    hebrewText: "[לַיְלָה:r], [הַ:p][לַּיְלָה:r]",
    translation: "noche, la noche",
    order: 3,
  },
  {
    id: "is-4",
    unitId: "israeli-unit-1",
    hebrewText: "[אוֹר:r], [הָ:p][אוֹר:r]",
    translation: "luz, la luz",
    order: 4,
  },
  {
    id: "is-5",
    unitId: "israeli-unit-1",
    hebrewText: "[עִיר:r], [הָ:p][עִיר:r]",
    translation: "ciudad, la ciudad",
    order: 5,
  },
  {
    id: "is-6",
    unitId: "israeli-unit-1",
    hebrewText: "[רֹאשׁ:r], [הָ:p][רֹאשׁ:r]",
    translation: "cabeza, la cabeza",
    order: 6,
  },
  {
    id: "is-7",
    unitId: "israeli-unit-1",
    hebrewText: "[חֹשֶׁךְ:r], [הַ:p][חֹשֶׁךְ:r]",
    translation: "oscuridad, la oscuridad",
    order: 7,
  },
  {
    id: "is-8",
    unitId: "israeli-unit-1",
    hebrewText: "[הֵיכָל:r], [הַ:p][הֵיכָל:r]",
    translation: "templo, el templo",
    order: 8,
  },
  {
    id: "is-9",
    unitId: "israeli-unit-1",
    hebrewText: "[עָפָר:r], [הֶ:p][עָפָר:r]",
    translation: "polvo, el polvo",
    order: 9,
  },
  {
    id: "is-10",
    unitId: "israeli-unit-1",
    hebrewText: "[הַ:p][יּוֹם:r] [וְ:p][הַ:p][לַּיְלָה:r]",
    translation: "el día y la noche",
    order: 10,
  },
  {
    id: "is-11",
    unitId: "israeli-unit-1",
    hebrewText: "[הָ:p][אוֹר:r] [וְ:p] [הַ:p][חֹשֶׁךְ:r]",
    translation: "la luz y la oscuridad",
    order: 11,
  },
  {
    id: "is-12",
    unitId: "israeli-unit-1",
    hebrewText: "[מֶלֶךְ:r] [וְ:p][אָדָם:r], [הַ:p][מֶּלֶךְ:r] [וְ:p][הַ:p][אָדָם:r]",
    translation: "un rey y un hombre, el rey y el hombre",
    order: 12,
  },
  {
    id: "is-13",
    unitId: "israeli-unit-1",
    hebrewText: "[אֲדָמָה:r] [וְ:p][עָפָר:r], [הָ:p][אֲדָמָה:r] [וְ:p][הֶ:p][עָפָר:r]",
    translation: "tierra y polvo, la tierra y el polvo",
    order: 13,
  },
  {
    id: "is-14",
    unitId: "israeli-unit-1",
    hebrewText: "[עִיר:r] [וְ:p][הֵיכָל:r], [הָ:p][עִיר:r] [וְ:p][הַ:p][הֵיכָל:r]",
    translation: "ciudad y templo, la ciudad y el templo",
    order: 14,
  },
  {
    id: "is-15",
    unitId: "israeli-unit-1",
    hebrewText: "[בָּרָא:r] [אֱלֹהַּ:r][ִים:s] [אָדָם:r] [מִן:p]-[הָ:p][אֲדָמָה:r]",
    translation: "Dios creó al hombre de la tierra",
    order: 15,
  },
  {
    id: "is-16",
    unitId: "israeli-unit-1",
    hebrewText: "[בָּא:r] [הַ:p][מֶּלֶךְ:r] [מִן:p] [הַ:p][הֵיכָל:r]",
    translation: "El rey vino del templo",
    order: 16,
  },
  {
    id: "is-17",
    unitId: "israeli-unit-1",
    hebrewText: "[אָמַר:r] [אֱלֹהַּ:r][ִים:s] [אֶל:p]-[הָ:p][אָדָם:r]",
    translation: "Dios dijo al hombre",
    order: 17,
  },
  {
    id: "is-18",
    unitId: "israeli-unit-1",
    hebrewText: "[וְ:p][אֶל:p]-[הָ:p][עִיר:r] [בָּא:r] [הַ:p][מֶּלֶךְ:r]",
    translation: "Y hacia la ciudad vino el rey",
    order: 18,
  },
  {
    id: "is-19",
    unitId: "israeli-unit-1",
    hebrewText: "[בָּרָא:r] [אֱלֹהַּ:r][ִים:s] [אוֹר:r] [מִן:p]-[הַ:p][חֹשֶׁךְ:r]",
    translation: "Dios creó luz de la oscuridad",
    order: 19,
  },
];

const unit2And3Sentences: IsraeliSentenceInsert[] = [
  {
    id: "is-u2-1",
    unitId: "israeli-unit-2",
    hebrewText:
      "[מֶלֶךְ:r], [לְ:p][מֶלֶךְ:r], [מִ:p][מֶּלֶךְ:r]; [הַ:p][מֶּלֶךְ:r], [לַ:p][מֶּלֶךְ:r], [מִן:p]-[הַ:p][מֶּלֶךְ:r]",
    translation: "rey, para un rey, de un rey; el rey, para el rey, del rey.",
    order: 1,
  },
  {
    id: "is-u2-2",
    unitId: "israeli-unit-2",
    hebrewText:
      "[אָדָם:r], [כְּ:p][אָדָם:r], [מֵ:p][אָדָם:r]; [הָ:p][אָדָם:r], [כָּ:p][אָדָם:r], [מִן:p]-[הָ:p][אָדָם:r]",
    translation: "hombre, como un hombre, de un hombre; el hombre, como el hombre, del hombre.",
    order: 2,
  },
  {
    id: "is-u2-3",
    unitId: "israeli-unit-2",
    hebrewText: "[הֵיכָל:r], [בְּ:p][הֵיכָל:r], [מִן:p]-[הַ:p][הֵיכָל:r]",
    translation: "templo, en un templo, desde el templo.",
    order: 3,
  },
  {
    id: "is-u2-4",
    unitId: "israeli-unit-2",
    hebrewText: "[חֹשֶׁךְ:r], [לַ:p][חֹשֶׁךְ:r], [בַּ:p][חֹשֶׁךְ:r]",
    translation: "oscuridad, para la oscuridad, en la oscuridad.",
    order: 4,
  },
  {
    id: "is-u2-5",
    unitId: "israeli-unit-2",
    hebrewText: "[עָפָר:r], [מֵ:p][עָפָר:r]; [הֶ:p][עָפָר:r], [בֶּ:p][עָפָר:r], [מִן:p]-[הֶ:p][עָפָר:r]",
    translation: "polvo, de polvo; el polvo, en el polvo, del polvo.",
    order: 5,
  },
  {
    id: "is-u2-6",
    unitId: "israeli-unit-2",
    hebrewText:
      "[אֱלֹהִים:r], [כֵּ:p][אֱלֹהִים:r], [מֵ:p][אֱלֹהִים:r]; [הָ:p][אֱלֹהִים:r], [כָּ:p][אֱלֹהִים:r]; [מִן:p]-[הָ:p][אֱלֹהִים:r]",
    translation: "Dios, como Dios, de Dios; el (verdadero) Dios, como el Dios, de el Dios.",
    order: 6,
  },
  {
    id: "is-u2-7",
    unitId: "israeli-unit-2",
    hebrewText: "[יהוה:r], [לַ:p][יהוה:r], [מֵ:p][יהוה:r]",
    translation: "Yahvé, para Yahvé, de Yahvé.",
    order: 7,
  },
  {
    id: "is-u2-8",
    unitId: "israeli-unit-2",
    hebrewText: "[אֲדָמָה:r], [כַּ:p][אֲדָמָה:r], [הָ:p][אֲדָמָה:r], [בָּ:p][אֲדָמָה:r]",
    translation: "tierra, como tierra, la tierra, en la tierra.",
    order: 8,
  },
  {
    id: "is-u2-9",
    unitId: "israeli-unit-2",
    hebrewText: "[שְׁמוּאֵל:r], [לִ:p][שְׁמוּאֵל:r], [כִּ:p][שְׁמוּאֵל:r], [מִ:p][שְּׁמוּאֵל:r]",
    translation: "Samuel, para Samuel, como Samuel, de Samuel.",
    order: 9,
  },
  {
    id: "is-u2-10",
    unitId: "israeli-unit-2",
    hebrewText: "[קָרָא:r] [אֱלֹהִים:r] [לָ:p][אוֹר:r] [יוֹם:r] [וְ:p][לַ:p][חֹשֶׁךְ:r] [קָרָא:r] [לַיְלָה:r]",
    translation: "Llamó Dios a la luz día, y a la oscuridad llamó noche.",
    order: 10,
  },
  {
    id: "is-u2-11",
    unitId: "israeli-unit-2",
    hebrewText: "[הָלַךְ:r] [הָ:p][עָם:r] [בַּ:p][חֹשֶׁךְ:r] [וְ:p][לֹא:r] [רָאָה:r] [אוֹר:r]",
    translation: "Caminó el pueblo en la oscuridad y no vio luz.",
    order: 11,
  },
  {
    id: "is-u2-12",
    unitId: "israeli-unit-2",
    hebrewText: "[נָתַן:r] [שְׁמוּאֵל:r] [מֶלֶךְ:r] [לָ:p][עָם:r]",
    translation: "Dio Samuel un rey al pueblo.",
    order: 12,
  },
  {
    id: "is-u2-13",
    unitId: "israeli-unit-2",
    hebrewText: "[מִן:p]-[הַ:p][שָּׁמַיִם:r] [רָאָה:r] [יהוה:r]",
    translation: "Desde los cielos vio Yahvé.",
    order: 13,
  },
  {
    id: "is-u2-14",
    unitId: "israeli-unit-2",
    hebrewText: "[בָּרָא:r] [אֱלֹהִים:r] [אָדָם:r] [מֵ:p][עָפָר:r] [וְ:p][אִשָּׁה:r] [מִן:p]-[הָ:p][אָדָם:r]",
    translation: "Creó Dios al hombre del polvo y a una mujer del hombre.",
    order: 14,
  },
  {
    id: "is-u2-15",
    unitId: "israeli-unit-2",
    hebrewText: "[אָמַר:r] [שְׁמוּאֵל:r] [אֶל:p]-[הָ:p][עָם:r]: [בָּא:r] [הַ:p][מֶּלֶךְ:r] [אֶל:p]-[הָ:p][עִיר:r]",
    translation: 'Dijo Samuel al pueblo: "Vino el rey a la ciudad".',
    order: 15,
  },
  {
    id: "is-u2-16",
    unitId: "israeli-unit-2",
    hebrewText: "[קָרָא:r] [אֱלֹהִים:r] [לִ:p][שְׁמוּאֵל:r] [בַּ:p][לַּיְלָה:r]",
    translation: "Llamó Dios a Samuel en la noche.",
    order: 16,
  },
  {
    id: "is-u2-17",
    unitId: "israeli-unit-2",
    hebrewText: "[נָתַן:r] [אֱלֹהִים:r] [אִשָּׁה:r] [לָ:p][אָדָם:r]",
    translation: "Dio Dios una mujer al hombre.",
    order: 17,
  },
  {
    id: "is-u2-18",
    unitId: "israeli-unit-2",
    hebrewText: "[יהוה:r] [מֶלֶךְ:r] [בַּ:p][שָּׁמַיִם:r]",
    translation: "Yahvé es rey en los cielos.",
    order: 18,
  },
  {
    id: "is-u2-19",
    unitId: "israeli-unit-2",
    hebrewText: "[הָלַךְ:r] [הַ:p][מֶּלֶךְ:r] [אֶל:p]-[הַ:p][הֵיכָל:r] [בַּ:p][לַּיְלָה:r]",
    translation: "Fue el rey al palacio por la noche.",
    order: 19,
  },
  {
    id: "is-u2-20",
    unitId: "israeli-unit-2",
    hebrewText: "[נָתַן:r] [אֱלֹהִים:r] [אוֹר:r] [לָ:p][אָדָם:r] [וְ:p][לָ:p][אִשָּׁה:r]",
    translation: "Dio Dios luz al hombre y a la mujer.",
    order: 20,
  },
  {
    id: "is-u2-21",
    unitId: "israeli-unit-2",
    hebrewText: "[לֹא:r] [אָמַר:r] [הַ:p][מֶּלֶךְ:r] [דָּבָר:r] [לִ:p][שְׁמוּאֵל:r]",
    translation: "No dijo el rey (ni una) palabra a Samuel.",
    order: 21,
  },
  {
    id: "is-u2-22",
    unitId: "israeli-unit-2",
    hebrewText: "[קָרָא:r] [שְׁמוּאֵל:r] [אֶל:p]-[יהוה:r]",
    translation: "Clamó Samuel a Yahvé.",
    order: 22,
  },
  {
    id: "is-u2-23",
    unitId: "israeli-unit-2",
    hebrewText: "[לֹא:r] [נָתַן:r] [יהוה:r] [אוֹר:r] [לָ:p][עָם:r]",
    translation: "No dio Yahvé luz al pueblo.",
    order: 23,
  },
  {
    id: "is-u2-24",
    unitId: "israeli-unit-2",
    hebrewText: "[הָלַךְ:r] [שְׁמוּאֵל:r] [בָּ:p][עִיר:r]",
    translation: "Caminó Samuel en la ciudad.",
    order: 24,
  },
  {
    id: "is-u2-25",
    unitId: "israeli-unit-2",
    hebrewText: "[רָאָה:r] [יהוה:r] [בִּ:p][שְׁמוּאֵל:r] [רֹאשׁ:r] [לָ:p][עָם:r]",
    translation: "Vio Yahvé en Samuel un jefe (cabeza) para el pueblo.",
    order: 25,
  },
  {
    id: "is-u3-1",
    unitId: "israeli-unit-3",
    hebrewText: "[אִישׁ:r] [טוֹב:r]",
    translation: "un hombre bueno",
    order: 1,
  },
];

const israeliSentenceRows: IsraeliSentenceInsert[] = [...unit1Sentences, ...unit2And3Sentences];

export async function seedIsraeliMode(database: typeof db) {
  console.log("📜 Seed Modo Israelí (independiente)...");

  const unitIds = israeliUnitsData.map((unit) => unit.id as string);

  for (const unit of israeliUnitsData) {
    await database
      .insert(israeliUnits)
      .values(unit)
      .onConflictDoUpdate({
        target: israeliUnits.id,
        set: {
          title: unit.title,
          description: unit.description ?? null,
          grammarScope: unit.grammarScope ?? null,
          maxWords: unit.maxWords ?? 18,
          order: unit.order,
        },
      });
  }

  for (const card of flashcardsData) {
    await database
      .insert(flashcards)
      .values(card)
      .onConflictDoUpdate({
        target: flashcards.id,
        set: {
          type: card.type,
          frontContent: card.frontContent,
          backContent: card.backContent,
          imeMetadata: card.imeMetadata ?? null,
          order: card.order,
        },
      });
  }

  await database.delete(israeliVocabulary).where(inArray(israeliVocabulary.unitId, unitIds));
  await database.insert(israeliVocabulary).values(israeliVocabularyRows);

  await database.delete(israeliSentences).where(inArray(israeliSentences.unitId, unitIds));
  await database.insert(israeliSentences).values(israeliSentenceRows);

  console.log(
    `✅ Seed modo israelí: ${israeliUnitsData.length} unidades, ${israeliVocabularyRows.length} vocablos, ${israeliSentenceRows.length} oraciones.`,
  );
}

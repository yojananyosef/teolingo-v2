import { sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { anchorTexts } from "./schema";

export async function seedAnchorTexts(db: LibSQLDatabase<any>) {
  console.log("⚓ Creando/Actualizando Textos Ancla (IME)...");
  await db
    .insert(anchorTexts)
    .values([
      {
        id: "anchor-1",
        title: "El Origen Exclusivo",
        reference: "Génesis 1:1",
        hebrewText:
          "[בְּ:p][רֵאשִׁ:r][ית:s] [בָּרָא:r] [אֱלֹהִ:r][ים:s] [אֵת:p] [הַ:p][שָּׁמַיִ:r][ם:s] [וְ:p][אֵת:p] [הָ:p][אָרֶץ:r]",
        translation: "En el principio creó Dios los cielos y la tierra.",
        explanation:
          "DEVOCIONAL: La palabra hebrea para crear aquí es 'bārāʾ' (בָּרָא). En todo el Antiguo Testamento, el sujeto de este verbo es siempre y exclusivamente Dios. Nunca se usa para referirse a la actividad creativa humana. Mientras nosotros formamos cosas a partir de material existente (usando el verbo yāṣar), Dios tiene la capacidad única de traer a la existencia lo que no era. Esta primera declaración de la Biblia no solo establece a Dios como Creador, sino que define el tipo de creación: un acto divino sin precedentes y soberano. Descansar en este Dios significa confiar en Aquel que no está limitado por los recursos visibles.",
        order: 1,
      },
      {
        id: "anchor-2",
        title: "La Tensión de la Espera",
        reference: "Isaías 40:31",
        hebrewText: "[וְ:p][קוֹיֵ:r] [יְהוָה:r] [יַחֲלִ:r][יפוּ:s] [כֹחַ:r]",
        translation: "Pero los que esperan a Jehová tendrán nuevas fuerzas.",
        explanation:
          "DEVOCIONAL: La palabra traducida como 'esperan' es 'qāwâ' (קָוָה). Su raíz originalmente tiene la idea de 'atar' o 'tensar una cuerda' (de donde viene la palabra para línea o cordel). Esperar en el Señor no es una pasividad perezosa; es una tensión activa, como una cuerda que se tensa antes de soltar la flecha. En la espera bíblica hay una expectativa expectante. Cuando nos 'atamos' al Señor en medio de la dificultad, esa misma tensión se convierte en la fuerza que nos renueva (literalmente, 'intercambian' fuerzas).",
        order: 2,
      },
      {
        id: "anchor-3",
        title: "La Felicidad de Caminar",
        reference: "Salmo 1:1",
        hebrewText: "[אַשְׁרֵי:r] [הָ:p][אִישׁ:r] [אֲשֶׁר:p] [לֹא:p] [הָלַךְ:r] [בַּ:p][עֲצַת:r] [רְשָׁעִ:r][ים:s]",
        translation: "Bienaventurado el varón que no anduvo en consejo de malos.",
        explanation:
          "DEVOCIONAL: El Salmo 1 no comienza con la palabra típica para bendición ('bārûk', que viene de Dios a nosotros), sino con 'ʾašrê' (אַשְׁרֵי). Esta palabra es un sustantivo plural en estado constructo que significa literalmente 'Oh, las felicidades de...'. Curiosamente, proviene de una raíz que significa 'caminar directo' o 'avanzar'. La verdadera 'bienaventuranza' bíblica no es un estado estático de euforia, sino la satisfacción profunda de avanzar en la dirección correcta. El Salmo nos dice que la felicidad se encuentra en los pasos que elegimos NO dar (el consejo de malos) y en el camino en el que sí nos deleitamos (la Ley).",
        order: 3,
      },
    ])
    .onConflictDoUpdate({
      target: anchorTexts.id,
      set: {
        title: sql`excluded.title`,
        reference: sql`excluded.reference`,
        hebrewText: sql`excluded.hebrew_text`,
        translation: sql`excluded.translation`,
        explanation: sql`excluded.explanation`,
        order: sql`excluded.order`,
      },
    });
  console.log("✅ Seed Textos Ancla completado.");
}

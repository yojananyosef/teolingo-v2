import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { anchorTexts } from "./schema";

export async function seedAnchorTexts(db: LibSQLDatabase<any>) {
  console.log("⚓ Creando Textos Ancla (IME)...");
  await db.delete(anchorTexts);
  await db.insert(anchorTexts).values([
    {
      id: "anchor-1",
      title: "El Origen",
      reference: "Génesis 1:1",
      hebrewText:
        "[בְּ:p][רֵאשִׁ:r][ית:s] [בָּרָא:r] [אֱלֹהִ:r][ים:s] [אֵת:p] [הַ:p][שָּׁמַיִ:r][ם:s] [וְ:p][אֵת:p] [הָ:p][אָרֶץ:r]",
      translation: "En el principio creó Dios los cielos y la tierra.",
      explanation:
        "La palabra 'Bará' (crear) solo se usa con Dios como sujeto en la Biblia, indicando una acción exclusiva del Creador.",
      order: 1,
    },
    {
      id: "anchor-2",
      title: "La Declaración",
      reference: "Deuteronomio 6:4 (Shemá)",
      hebrewText: "[שְׁמַע:r] [יִשְׂרָאֵל:r] [יְהוָה:r] [אֱלֹהֵ:r][ינוּ:s] [יְהוָה:r] [אֶחָד:r]",
      translation: "Escucha, Israel: El Señor nuestro Dios, el Señor uno es.",
      explanation:
        "El 'Shemá' es la confesión de fe central del judaísmo. La palabra 'Ejad' subraya la unicidad de Dios.",
      order: 2,
    },
    {
      id: "anchor-3",
      title: "El Buen Pastor",
      reference: "Salmo 23:1",
      hebrewText: "[יְהוָה:r] [רֹעִ:r][י:s] [לֹא:p] [אֶחְסָר:r]",
      translation: "El Señor es mi pastor; nada me faltará.",
      explanation:
        "Aquí 'Roí' (mi pastor) usa un sufijo pronominal de primera persona, indicando una relación personal y cercana.",
      order: 3,
    },
  ]);
  console.log("✅ Seed Textos Ancla completado.");
}

import { db } from "@/infrastructure/database/db";
import { anchorTexts } from "@/infrastructure/database/schema";
import { asc } from "drizzle-orm";

export class GetAnchorTextsUseCase {
  async execute() {
    // Why: Recupera los textos ancla para el módulo de Teología Devocional.
    // Estos textos sirven como anclas emocionales y teológicas para el estudiante.
    try {
      const results = await db.select().from(anchorTexts).orderBy(asc(anchorTexts.order));
      return { success: true, data: results };
    } catch (error) {
      console.error("Error fetching anchor texts:", error);
      return { success: false, error: "No se pudieron cargar los textos ancla" };
    }
  }
}

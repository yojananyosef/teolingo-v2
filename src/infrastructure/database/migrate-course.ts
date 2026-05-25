import { db } from "./db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("🚀 Iniciando migración de columnas 'course' en SQLite/Turso...");
  try {
    // Intentamos añadir la columna 'course' a lessons
    await db.run(sql`ALTER TABLE lessons ADD COLUMN course TEXT DEFAULT 'hebrew'`);
    console.log("✅ Columna 'course' añadida con éxito a 'lessons'.");
  } catch (error: any) {
    if (error.message && (error.message.includes("duplicate column") || error.message.includes("already exists"))) {
      console.log("ℹ️ La columna 'course' ya existe en 'lessons'.");
    } else {
      console.error("❌ Error al modificar 'lessons':", error.message || error);
    }
  }

  try {
    // Intentamos añadir la columna 'course' a flashcards
    await db.run(sql`ALTER TABLE flashcards ADD COLUMN course TEXT DEFAULT 'hebrew'`);
    console.log("✅ Columna 'course' añadida con éxito a 'flashcards'.");
  } catch (error: any) {
    if (error.message && (error.message.includes("duplicate column") || error.message.includes("already exists"))) {
      console.log("ℹ️ La columna 'course' ya existe en 'flashcards'.");
    } else {
      console.error("❌ Error al modificar 'flashcards':", error.message || error);
    }
  }
  console.log("🎉 Proceso de migración terminado.");
}

run().catch(console.error);

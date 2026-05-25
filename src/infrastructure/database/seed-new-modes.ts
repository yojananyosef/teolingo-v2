import { db } from "./db";
import { lessons } from "./schema";
import { seedPracticeParticiple, seedPracticeImperatives } from "./seed-lessons";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando inserción de nuevos modos de práctica (Qal Participio y Qal Imperativo)...");

  try {
    // 1. Asegurar que las lecciones existan
    console.log("📘 Insertando / actualizando lecciones...");

    const newLessons = [
      {
        id: "practice-qal-participle",
        title: "Verbos: Qal Participio",
        description: "Analiza participios en estado Qal activo por género, número y significado.",
        order: 914,
        xpReward: 0,
        course: "hebrew",
      },
      {
        id: "practice-qal-imperative",
        title: "Verbos: Qal Imperativo",
        description: "Analiza verbos en estado Qal imperativo por persona, género, número y significado.",
        order: 915,
        xpReward: 0,
        course: "hebrew",
      },
    ];

    for (const lesson of newLessons) {
      await db
        .insert(lessons)
        .values(lesson)
        .onConflictDoUpdate({
          target: lessons.id,
          set: {
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            xpReward: lesson.xpReward,
            course: lesson.course,
          },
        });
    }

    console.log("✅ Lecciones de práctica registradas con éxito.");

    // 2. Ejecutar seed para poblar los ejercicios
    console.log("✍️ Sembrando ejercicios...");
    await seedPracticeParticiple(db);
    await seedPracticeImperatives(db);

    console.log("🎉 Seeding de nuevos modos de práctica completado exitosamente!");
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
    process.exit(1);
  }
}

main().catch(console.error);

import { db } from "./src/infrastructure/database/db";
import { lessons, exercises, userProgress } from "./src/infrastructure/database/schema";
import { notInArray, eq } from "drizzle-orm";

async function cleanOldLessons() {
  const validLessonIds = [
    "lesson-1", "lesson-2", "lesson-3",
    "lesson-4", "lesson-5", "lesson-6",
    "lesson-7", "lesson-8", "lesson-9",
    "lesson-10", "lesson-11",
    // Also include practice lessons to avoid deleting them
    "freq-2200-5000", "freq-1000-2199", "freq-730-999", "freq-500-729",
    "freq-400-499", "freq-310-399", "freq-270-309",
    "practice-nouns", "practice-adjectives", "practice-verbs",
    "practice-qal-imperfect", "practice-verb-suffixes", "practice-prefixes",
    "practice-pronouns", "practice-suffixes"
  ];

  console.log("Eliminando lecciones antiguas...");
  
  // Borrar progreso de lecciones antiguas
  await db.delete(userProgress).where(notInArray(userProgress.lessonId, validLessonIds));
  
  // Borrar ejercicios de lecciones antiguas
  await db.delete(exercises).where(notInArray(exercises.lessonId, validLessonIds));
  
  // Borrar lecciones antiguas
  const result = await db.delete(lessons).where(notInArray(lessons.id, validLessonIds));
  
  console.log("Lecciones antiguas eliminadas.");
}

cleanOldLessons().then(() => process.exit(0)).catch(console.error);

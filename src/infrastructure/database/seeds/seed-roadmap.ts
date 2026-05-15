import { db } from "../db";
import { lessons, exercises, userProgress } from "../schema";
import { inArray } from "drizzle-orm";
import { module1 } from "./modules/module-1";
import { module2 } from "./modules/module-2";
import { module3 } from "./modules/module-3";
import { module4 } from "./modules/module-4";
import { module5 } from "./modules/module-5";
import { module6 } from "./modules/module-6";
import { module7 } from "./modules/module-7";
import { module8 } from "./modules/module-8";
import { module9 } from "./modules/module-9";
import { module10 } from "./modules/module-10";
import type { ModuleData } from "./modules/types";

const ALL_MODULES: ModuleData[] = [
  module1, module2, module3, module4, module5,
  module6, module7, module8, module9, module10,
];

const ROADMAP_LESSON_IDS: string[] = ALL_MODULES
  .flatMap((m) => m.lessons.map((l) => l.id))
  .filter((id): id is string => id !== undefined);

export async function seedRoadmap() {
  console.log("🌱 Iniciando seed del roadmap completo (Módulos 1-10)...");

  // 1. Borrar en orden correcto (FK constraints: progress → exercises → lessons)
  const existing = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(inArray(lessons.id, ROADMAP_LESSON_IDS));

  if (existing.length > 0) {
    const existingIds = existing.map((l) => l.id);
    await db.delete(userProgress).where(inArray(userProgress.lessonId, existingIds));
    await db.delete(exercises).where(inArray(exercises.lessonId, existingIds));
    await db.delete(lessons).where(inArray(lessons.id, existingIds));
  }

  let totalLessons = 0;
  let totalExercises = 0;

  // 2. Insertar módulo por módulo
  for (const module of ALL_MODULES) {
    if (module.lessons.length > 0) {
      await db.insert(lessons).values(module.lessons);
      totalLessons += module.lessons.length;
    }
    if (module.exercises.length > 0) {
      await db.insert(exercises).values(module.exercises);
      totalExercises += module.exercises.length;
    }
  }

  console.log(`✅ Roadmap completo: ${totalLessons} lecciones, ${totalExercises} ejercicios.`);
}

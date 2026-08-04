import { sql } from "drizzle-orm";
import { db } from "../db";
import { exercises, lessons } from "../schema";
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
  module1,
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
  module8,
  module9,
  module10,
];

export async function seedRoadmap() {
  console.log("🌱 Iniciando seed seguro del roadmap completo (Módulos 1-10)...");

  let totalLessons = 0;
  let totalExercises = 0;

  // Insertar/actualizar módulo por módulo preservando la tabla user_progress
  for (const moduleData of ALL_MODULES) {
    if (moduleData.lessons.length > 0) {
      await db
        .insert(lessons)
        .values(moduleData.lessons)
        .onConflictDoUpdate({
          target: lessons.id,
          set: {
            title: sql`excluded.title`,
            description: sql`excluded.description`,
            order: sql`excluded.order`,
            moduleIndex: sql`excluded.module_index`,
            xpReward: sql`excluded.xp_reward`,
            course: sql`excluded.course`,
          },
        });
      totalLessons += moduleData.lessons.length;
    }

    if (moduleData.exercises.length > 0) {
      await db
        .insert(exercises)
        .values(moduleData.exercises)
        .onConflictDoUpdate({
          target: exercises.id,
          set: {
            question: sql`excluded.question`,
            correctAnswer: sql`excluded.correct_answer`,
            options: sql`excluded.options`,
            hebrewText: sql`excluded.hebrew_text`,
            audioUrl: sql`excluded.audio_url`,
            hint: sql`excluded.hint`,
            order: sql`excluded.order`,
          },
        });
      totalExercises += moduleData.exercises.length;
    }
  }

  console.log(`🛡️ Roadmap completo actualizado de forma segura: ${totalLessons} lecciones, ${totalExercises} ejercicios.`);
}

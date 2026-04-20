import {
  seedAllPracticeSections,
  seedPracticeAdjectives,
  seedPracticeFrequencyLevel1,
  seedPracticeFrequencyLevel2,
  seedPracticeFrequencyLevel3,
  seedPracticeFrequencyLevel4,
  seedPracticeNouns,
  seedPracticePronouns,
  seedPracticePrefixes,
  seedPracticeSuffixes,
  seedRoadmapLessonsAndExercises,
} from "./seed-lessons";
import { db } from "./db";
import { seedIsraeliMode } from "./seed-israeli";

const usage = `Uso:
  bun run src/infrastructure/database/seed-sections.ts roadmap
  bun run src/infrastructure/database/seed-sections.ts practice:all
  bun run src/infrastructure/database/seed-sections.ts practice:freq-1
  bun run src/infrastructure/database/seed-sections.ts practice:freq-2
  bun run src/infrastructure/database/seed-sections.ts practice:freq-3
  bun run src/infrastructure/database/seed-sections.ts practice:freq-4
  bun run src/infrastructure/database/seed-sections.ts practice:nouns
  bun run src/infrastructure/database/seed-sections.ts practice:adjectives
  bun run src/infrastructure/database/seed-sections.ts practice:prefixes
  bun run src/infrastructure/database/seed-sections.ts practice:pronouns
  bun run src/infrastructure/database/seed-sections.ts practice:suffixes
  bun run src/infrastructure/database/seed-sections.ts israeli`;

async function main() {
  const target = process.argv[2];

  if (!target) {
    console.error("❌ Debes indicar un segmento de seed.");
    console.log(usage);
    process.exit(1);
  }

  switch (target) {
    case "roadmap":
      await seedRoadmapLessonsAndExercises(db);
      break;
    case "practice:all":
      await seedAllPracticeSections(db);
      break;
    case "practice:freq-1":
      await seedPracticeFrequencyLevel1(db);
      break;
    case "practice:freq-2":
      await seedPracticeFrequencyLevel2(db);
      break;
    case "practice:freq-3":
      await seedPracticeFrequencyLevel3(db);
      break;
    case "practice:freq-4":
      await seedPracticeFrequencyLevel4(db);
      break;
    case "practice:nouns":
      await seedPracticeNouns(db);
      break;
    case "practice:adjectives":
      await seedPracticeAdjectives(db);
      break;
    case "practice:prefixes":
      await seedPracticePrefixes(db);
      break;
    case "practice:pronouns":
      await seedPracticePronouns(db);
      break;
    case "practice:suffixes":
      await seedPracticeSuffixes(db);
      break;
    case "israeli":
      await seedIsraeliMode(db);
      break;
    default:
      console.error(`❌ Segmento no reconocido: ${target}`);
      console.log(usage);
      process.exit(1);
  }

  console.log(`✅ Seed segmentado completado: ${target}`);
}

main().catch((error) => {
  console.error("❌ Error en seed segmentado:", error);
  process.exit(1);
});

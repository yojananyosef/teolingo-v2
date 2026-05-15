import type { InferInsertModel } from "drizzle-orm";
import { exercises, lessons } from "../../schema";

export type LessonInsert = InferInsertModel<typeof lessons>;
export type ExerciseInsert = InferInsertModel<typeof exercises>;

export interface ModuleData {
  lessons: LessonInsert[];
  exercises: ExerciseInsert[];
}

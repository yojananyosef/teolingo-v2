import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  points: integer("points").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastStreakDate: integer("last_streak_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  xpReward: integer("xp_reward").default(10).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  lessonId: text("lesson_id").references(() => lessons.id).notNull(),
  type: text("type").notNull(), // 'translation', 'multiple-choice', 'listening'
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: text("options"), // JSON string
  hebrewText: text("hebrew_text"),
  audioUrl: text("audio_url"),
  order: integer("order").notNull(),
});

export const flashcards = sqliteTable("flashcards", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(), // 'vocabulary', 'morphological', 'phonetic'
  frontContent: text("front_content").notNull(), // JSON string { text, audioUrl, hints }
  backContent: text("back_content").notNull(), // JSON string { meaning, translit, explanation }
  imeMetadata: text("ime_metadata"), // JSON string { root, colors, gestures }
  order: integer("order").notNull(),
});

export const userFlashcardProgress = sqliteTable("user_flashcard_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  flashcardId: text("flashcard_id").references(() => flashcards.id).notNull(),
  nextReview: integer("next_review", { mode: "timestamp" }).notNull(),
  interval: integer("interval").default(0).notNull(), // en días
  easeFactor: integer("ease_factor").default(250).notNull(), // factor SRS (2.5 original)
  repetitionCount: integer("repetition_count").default(0).notNull(),
  lastQuality: integer("last_quality").notNull(), // 0-5 basado en IME
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => ({
  userFlashcardIdx: uniqueIndex("user_flashcard_idx").on(table.userId, table.flashcardId),
}));

export const userProgress = sqliteTable("user_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  lessonId: text("lesson_id").references(() => lessons.id).notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false).notNull(),
  accuracy: integer("accuracy").default(0).notNull(),
  isPerfect: integer("is_perfect", { mode: "boolean" }).default(false).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
}, (table) => ({
  userLessonIdx: uniqueIndex("user_lesson_idx").on(table.userId, table.lessonId),
}));

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirementType: text("requirement_type").notNull(), // 'points', 'streak', 'lessons'
  requirementValue: integer("requirement_value").notNull(),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  achievementId: text("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const anchorTexts = sqliteTable("anchor_texts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  reference: text("reference").notNull(),
  hebrewText: text("hebrew_text").notNull(),
  translation: text("translation").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

export const alphabet = sqliteTable("alphabet", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  char: text("char").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});

export const rhythmParadigms = sqliteTable("rhythm_paradigms", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  root: text("root").notNull(),
  forms: text("forms").notNull(), // JSON string: { hebrew, translit, meaning }[]
  order: integer("order").notNull(),
});

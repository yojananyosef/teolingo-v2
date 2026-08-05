import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  points: integer("points").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastStreakDate: integer("last_streak_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  role: text("role").default("student").notNull(),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpiresAt: integer("reset_password_expires_at", { mode: "timestamp" }),
});

export const lessons = sqliteTable("lessons", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  moduleIndex: integer("module_index").default(1).notNull(),
  xpReward: integer("xp_reward").default(10).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  course: text("course").default("hebrew"),
});

export const exercises = sqliteTable(
  "exercises",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    lessonId: text("lesson_id")
      .references(() => lessons.id)
      .notNull(),
    type: text("type").notNull(), // 'translation', 'multiple-choice', 'listening', 'module-assessment'
    question: text("question").notNull(),
    correctAnswer: text("correct_answer").notNull(),
    options: text("options"), // JSON string
    hebrewText: text("hebrew_text"),
    audioUrl: text("audio_url"),
    hint: text("hint"), // Feedback Inteligente para scaffolding
    order: integer("order").notNull(),
  },
  (table) => ({
    exercisesLessonIdx: index("exercises_lesson_idx").on(table.lessonId),
  }),
);

export const flashcards = sqliteTable("flashcards", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(), // 'vocabulary', 'morphological', 'phonetic'
  frontContent: text("front_content").notNull(), // JSON string { text, audioUrl, hints }
  backContent: text("back_content").notNull(), // JSON string { meaning, translit, explanation }
  imeMetadata: text("ime_metadata"), // JSON string { root, colors, gestures }
  category: text("category").default("general").notNull(), // 'freq-1', 'freq-2', etc.
  order: integer("order").notNull(),
  course: text("course").default("hebrew"),
});

export const userFlashcardProgress = sqliteTable(
  "user_flashcard_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    flashcardId: text("flashcard_id")
      .references(() => flashcards.id)
      .notNull(),
    nextReview: integer("next_review", { mode: "timestamp" }).notNull(),
    interval: integer("interval").default(0).notNull(), // en días
    easeFactor: integer("ease_factor").default(250).notNull(), // factor SRS (2.5 original)
    repetitionCount: integer("repetition_count").default(0).notNull(),
    lastQuality: integer("last_quality").notNull(), // 0-5 basado en IME
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => ({
    userFlashcardIdx: uniqueIndex("user_flashcard_idx").on(table.userId, table.flashcardId),
    userFlashcardNextReviewIdx: index("user_flashcard_next_review_idx").on(
      table.userId,
      table.nextReview,
    ),
  }),
);

export const userProgress = sqliteTable(
  "user_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    lessonId: text("lesson_id")
      .references(() => lessons.id)
      .notNull(),
    isCompleted: integer("is_completed", { mode: "boolean" }).default(false).notNull(),
    accuracy: integer("accuracy").default(0).notNull(),
    isPerfect: integer("is_perfect", { mode: "boolean" }).default(false).notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (table) => ({
    userLessonIdx: uniqueIndex("user_lesson_idx").on(table.userId, table.lessonId),
  }),
);

export const achievements = sqliteTable("achievements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirementType: text("requirement_type").notNull(), // 'points', 'streak', 'lessons'
  requirementValue: integer("requirement_value").notNull(),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  achievementId: text("achievement_id")
    .references(() => achievements.id)
    .notNull(),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const anchorTexts = sqliteTable("anchor_texts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  reference: text("reference").notNull(),
  hebrewText: text("hebrew_text").notNull(),
  translation: text("translation").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

export const alphabet = sqliteTable("alphabet", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  char: text("char").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
});

export const rhythmParadigms = sqliteTable("rhythm_paradigms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  root: text("root").notNull(),
  forms: text("forms").notNull(), // JSON string: { hebrew, translit, meaning }[]
  order: integer("order").notNull(),
});

export const israeliUnits = sqliteTable("israeli_units", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  grammarScope: text("grammar_scope"), // e.g., 'sustantivos y artículos'
  maxWords: integer("max_words").default(20).notNull(),
  order: integer("order").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const israeliVocabulary = sqliteTable("israeli_vocabulary", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  unitId: text("unit_id")
    .references(() => israeliUnits.id)
    .notNull(),
  flashcardId: text("flashcard_id")
    .references(() => flashcards.id)
    .notNull(),
  order: integer("order").notNull(),
});

export const israeliSentences = sqliteTable("israeli_sentences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  unitId: text("unit_id")
    .references(() => israeliUnits.id)
    .notNull(),
  hebrewText: text("hebrew_text").notNull(),
  translation: text("translation").notNull(),
  audioUrl: text("audio_url"),
  order: integer("order").notNull(),
});

export const userIsraeliProgress = sqliteTable(
  "user_israeli_progress",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    unitId: text("unit_id")
      .references(() => israeliUnits.id)
      .notNull(),
    isCompleted: integer("is_completed", { mode: "boolean" }).default(false).notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (table) => ({
    userUnitIdx: uniqueIndex("user_unit_idx").on(table.userId, table.unitId),
  }),
);

export const userMistakes = sqliteTable(
  "user_mistakes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    exerciseId: text("exercise_id")
      .references(() => exercises.id)
      .notNull(),
    mistakeCount: integer("mistake_count").default(1).notNull(),
    lastMistakeAt: integer("last_mistake_at", { mode: "timestamp" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => ({
    userExerciseIdx: uniqueIndex("user_exercise_idx").on(table.userId, table.exerciseId),
    userMistakesUserIdx: index("user_mistakes_user_idx").on(table.userId),
  }),
);

export const quizzes = sqliteTable("quizzes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  teacherId: text("teacher_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  updatedByName: text("updated_by_name"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  timeLimitSeconds: integer("time_limit_seconds").default(300).notNull(),
  allowedAttempts: integer("allowed_attempts").default(3).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const quizQuestions = sqliteTable("quiz_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  quizId: text("quiz_id")
    .references(() => quizzes.id)
    .notNull(),
  exerciseId: text("exercise_id")
    .references(() => exercises.id)
    .notNull(),
  order: integer("order").notNull(),
});

export const quizAssignments = sqliteTable("quiz_assignments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  quizId: text("quiz_id")
    .references(() => quizzes.id)
    .notNull(),
  studentId: text("student_id")
    .references(() => users.id)
    .notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false).notNull(),
  score: integer("score"),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const quizAttempts = sqliteTable(
  "quiz_attempts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    quizId: text("quiz_id")
      .references(() => quizzes.id)
      .notNull(),
    studentId: text("student_id")
      .references(() => users.id)
      .notNull(),
    isPassed: integer("is_passed", { mode: "boolean" }).default(false).notNull(),
    score: integer("score"),
    timeLimitSeconds: integer("time_limit_seconds").default(300).notNull(),
    timeSpentSeconds: integer("time_spent_seconds").notNull(),
    timedOut: integer("timed_out", { mode: "boolean" }).default(false).notNull(),
    correctCount: integer("correct_count").default(0).notNull(),
    incorrectCount: integer("incorrect_count").default(0).notNull(),
    correctExerciseIds: text("correct_exercise_ids").default("[]").notNull(),
    incorrectExerciseIds: text("incorrect_exercise_ids").default("[]").notNull(),
    startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    quizAttemptsStudentQuizIdx: index("quiz_attempts_student_quiz_idx").on(
      table.studentId,
      table.quizId,
    ),
  }),
);

export const catedraControl = sqliteTable("catedra_control", {
  id: text("id").primaryKey(),
  isPaused: integer("is_paused", { mode: "boolean" }).default(false).notNull(),
  pausedBy: text("paused_by").references(() => users.id),
  pausedAt: integer("paused_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const catedraExceptions = sqliteTable("catedra_exceptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: text("student_id")
    .references(() => users.id)
    .notNull(),
  activeUntil: integer("active_until", { mode: "timestamp" }).notNull(),
  grantedBy: text("granted_by").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL ?? process.env.TURSO_CONNECTION_URL ?? "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("Database URL is required to run migrations.");
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log("Running migration: add quiz attempts table...");

  const tableInfo = await client.execute({ sql: "PRAGMA table_info(quiz_attempts);", args: [] });
  const rows = (tableInfo as any).rows ?? [];

  if (rows.length > 0) {
    console.log("Table quiz_attempts already exists. Migration skipped.");
    return;
  }

  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        quiz_id TEXT NOT NULL REFERENCES quizzes(id),
        student_id TEXT NOT NULL REFERENCES users(id),
        is_passed INTEGER NOT NULL DEFAULT 0,
        score INTEGER,
        time_limit_seconds INTEGER NOT NULL DEFAULT 300,
        time_spent_seconds INTEGER NOT NULL,
        timed_out INTEGER NOT NULL DEFAULT 0,
        correct_count INTEGER NOT NULL DEFAULT 0,
        incorrect_count INTEGER NOT NULL DEFAULT 0,
        correct_exercise_ids TEXT NOT NULL DEFAULT '[]',
        incorrect_exercise_ids TEXT NOT NULL DEFAULT '[]',
        started_at INTEGER NOT NULL,
        completed_at INTEGER NOT NULL
      );
    `,
    args: [],
  });

  await client.execute({
    sql: "CREATE INDEX IF NOT EXISTS quiz_attempts_quiz_id_idx ON quiz_attempts (quiz_id);",
    args: [],
  });

  await client.execute({
    sql: "CREATE INDEX IF NOT EXISTS quiz_attempts_student_id_idx ON quiz_attempts (student_id);",
    args: [],
  });

  await client.execute({
    sql: "CREATE INDEX IF NOT EXISTS quiz_attempts_completed_at_idx ON quiz_attempts (completed_at);",
    args: [],
  });

  console.log("Migration complete: quiz_attempts table created.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

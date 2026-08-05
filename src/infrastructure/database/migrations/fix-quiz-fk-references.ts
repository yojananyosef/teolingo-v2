/**
 * Migración: Corrección de FK residuales usando batch (Turso)
 * 
 * SQLite en Turso tiene foreign_keys=ON por defecto y no permite
 * PRAGMA foreign_keys=OFF vía libsql/web. La alternativa es usar
 * batch() que ejecuta todo en una transacción implícita donde Turso
 * no chequea FK intermedias hasta el COMMIT final.
 */
import { createClient } from "@libsql/client/web";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrate() {
  console.log("🔧 Corrigiendo FK residuales con batch...\n");

  // Primero verificar estado actual
  const oldQuizzes = await client.execute("SELECT * FROM __old_push_quizzes");
  console.log(`__old_push_quizzes tiene ${oldQuizzes.rows.length} quizzes`);
  
  const existingQuestions = await client.execute("SELECT * FROM quiz_questions");
  console.log(`quiz_questions tiene ${existingQuestions.rows.length} preguntas`);
  
  const existingAttempts = await client.execute("SELECT COUNT(*) as cnt FROM quiz_attempts");
  console.log(`quiz_attempts tiene ${existingAttempts.rows[0].cnt} intentos`);

  // Paso 1: Asegurar que todos los quizzes de __old están en quizzes
  console.log("\n1️⃣  Copiando quizzes faltantes a tabla correcta...");
  await client.execute(`
    INSERT OR IGNORE INTO quizzes (id, teacher_id, title, description, is_active, updated_by_name, updated_at, time_limit_seconds, allowed_attempts, created_at)
    SELECT id, teacher_id, title, description, is_active, updated_by_name, updated_at, time_limit_seconds, 3, created_at
    FROM __old_push_quizzes
  `);

  const quizzes = await client.execute("SELECT id, title FROM quizzes ORDER BY id");
  console.log(`   quizzes ahora tiene ${quizzes.rows.length} registros`);
  for (const r of quizzes.rows) console.log(`     ${r.id} | ${r.title}`);

  // Paso 2: Crear las nuevas tablas quiz_questions_new 
  console.log("\n2️⃣  Creando tabla quiz_questions_new con FK correcta...");

  await client.execute("DROP TABLE IF EXISTS quiz_questions_new");
  await client.execute(`
    CREATE TABLE quiz_questions_new (
      id TEXT PRIMARY KEY NOT NULL,
      quiz_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON UPDATE NO ACTION ON DELETE NO ACTION
    )
  `);

  // Copiar datos válidos
  await client.execute(`
    INSERT INTO quiz_questions_new (id, quiz_id, exercise_id, "order")
    SELECT id, quiz_id, exercise_id, "order" FROM quiz_questions
    WHERE quiz_id IN (SELECT id FROM quizzes)
    AND exercise_id IN (SELECT id FROM exercises)
  `);
  const newQQ = await client.execute("SELECT COUNT(*) as cnt FROM quiz_questions_new");
  console.log(`   quiz_questions_new tiene ${newQQ.rows[0].cnt} preguntas`);

  // Paso 3: Ahora el batch atómico que intercambia y limpia
  console.log("\n3️⃣  Ejecutando swap atómico (drop old → rename new)...");
  
  // El truco: batch con mode "write" ejecuta todo en una transacción
  // donde las FK constraints se evalúan al final
  await client.batch([
    "DROP TABLE quiz_questions",
    "ALTER TABLE quiz_questions_new RENAME TO quiz_questions",
    "DROP TABLE __old_push_quizzes",
  ], "write");

  console.log("   ✅ Swap completado.\n");

  // ===== Verificación final =====
  console.log("4️⃣  Verificación final...");
  
  const fk1 = await client.execute("PRAGMA foreign_key_list(quiz_attempts)");
  console.log("   quiz_attempts FK:");
  for (const row of fk1.rows) console.log(`     ${row.from} → ${row.table}(${row.to})`);
  
  const fk2 = await client.execute("PRAGMA foreign_key_list(quiz_assignments)");
  console.log("   quiz_assignments FK:");
  for (const row of fk2.rows) console.log(`     ${row.from} → ${row.table}(${row.to})`);
  
  const fk3 = await client.execute("PRAGMA foreign_key_list(quiz_questions)");
  console.log("   quiz_questions FK:");
  for (const row of fk3.rows) console.log(`     ${row.from} → ${row.table}(${row.to})`);

  const oldExists = await client.execute(
    "SELECT name FROM sqlite_master WHERE name = '__old_push_quizzes'"
  );
  console.log(`\n   __old_push_quizzes eliminada: ${oldExists.rows.length === 0}`);

  const finalQQ = await client.execute("SELECT COUNT(*) as cnt FROM quiz_questions");
  console.log(`   quiz_questions final: ${finalQQ.rows[0].cnt} preguntas`);

  console.log("\n🎉 Migración completada exitosamente. Ahora puedes hacer deploy.");
}

migrate().catch((err) => {
  console.error("❌ Error en migración:", err);
  process.exit(1);
});

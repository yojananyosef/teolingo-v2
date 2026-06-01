import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("❌ No se encontró TURSO_DATABASE_URL en el entorno.");
  process.exit(1);
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log("🛠️ Añadiendo la columna 'allowed_attempts' de forma directa y 100% segura...");
  try {
    // 1. Ejecutar ALTER TABLE para agregar la columna con valor por defecto 3
    await client.execute("ALTER TABLE quizzes ADD COLUMN allowed_attempts INTEGER NOT NULL DEFAULT 3;");
    console.log("✅ Columna 'allowed_attempts' agregada exitosamente a la tabla 'quizzes'.");
  } catch (error: any) {
    if (error?.message?.includes("duplicate column name") || error?.message?.includes("already exists")) {
      console.log("ℹ️ La columna 'allowed_attempts' ya existe en la tabla 'quizzes'.");
    } else {
      console.error("❌ Error al ejecutar la migración:", error);
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

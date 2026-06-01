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
  console.log("🧹 Limpiando tablas temporales antiguas de Drizzle...");
  try {
    await client.execute("DROP TABLE IF EXISTS __old_push_quizzes;");
    console.log("✅ Tabla __old_push_quizzes eliminada con éxito.");
  } catch (error) {
    console.error("❌ Error al eliminar la tabla:", error);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

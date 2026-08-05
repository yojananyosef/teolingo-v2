export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/**
 * Encapsula la ejecución de Server Actions garantizando respuestas estructuradas
 * e intercepción limpia de excepciones no controladas.
 */
export async function safeAction<T>(
  actionFn: () => Promise<T>,
): Promise<ActionResponse<T>> {
  try {
    const data = await actionFn();
    return { success: true, data };
  } catch (err: unknown) {
    console.error("❌ Action execution error:", err);
    const message =
      err instanceof Error ? err.message : "Ocurrió un error inesperado en el servidor.";
    return { success: false, error: message, code: "INTERNAL_ERROR" };
  }
}

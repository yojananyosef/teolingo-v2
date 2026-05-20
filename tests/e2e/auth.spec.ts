import { expect, test } from "@playwright/test";

test.describe("Flujo de Autenticación", () => {
  test.beforeEach(async ({ page }) => {
    // Resetear base de datos u otras preparaciones previas si es necesario,
    // o apuntar a una DB de prueba local.
  });

  test("Debe permitir a un usuario nuevo registrarse y luego iniciar sesión", async ({ page }) => {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPassword = "password123";

    // 1. Ir a la página de registro
    await page.goto("/auth/register");
    await expect(page.locator("h1")).toContainText(/Registro|Crear Cuenta|Crea tu cuenta/i);

    // 2. Llenar el formulario de registro
    await page.fill('input[name="displayName"]', "Usuario de Prueba");
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // 3. Enviar el formulario
    await page.click('button[type="submit"]');

    // 4. Esperar redirección directa a la ruta /learn (el registro inicia sesión automáticamente)
    await page.waitForURL("**/learn*");
    await expect(page.locator("body")).toBeVisible();
  });
});

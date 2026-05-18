import { test, expect } from "@playwright/test";

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
    await expect(page.locator("h1")).toContainText(/Registro|Crear Cuenta/i);

    // 2. Llenar el formulario de registro
    await page.fill('input[name="name"]', "Usuario de Prueba");
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    // 3. Enviar el formulario
    await page.click('button[type="submit"]');

    // 4. Esperar redirección o mensaje de éxito (dependiendo de la UX actual, a /auth/login o directo a dashboard)
    await page.waitForURL("**/auth/login*");
    
    // 5. Iniciar sesión con el nuevo usuario
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // 6. Verificar que entró al dashboard o learn
    await page.waitForURL("**/learn*");
    await expect(page.locator("body")).toBeVisible();
  });
});

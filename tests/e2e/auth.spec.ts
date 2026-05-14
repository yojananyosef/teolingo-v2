import { test, expect } from "@playwright/test";

test.describe("Flujo de Autenticación", () => {
  test("Redirige a la pantalla de login si no hay sesión", async ({ page }) => {
    await page.goto("/learn");
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  // Note: Para una prueba completa de login, deberíamos insertar un usuario de prueba en la BD 
  // o crear un mock del endpoint. Por ahora verificamos la UI y el ruteo básico.
  test("La página de login carga correctamente", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("h1")).toContainText("Bienvenido de nuevo");
    await expect(page.locator("input[name='email']")).toBeVisible();
    await expect(page.locator("input[name='password']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

test.describe("Navegación y Lecciones", () => {
  test("La landing page principal carga", async ({ page }) => {
    await page.goto("/");
    // Asumiendo que hay un texto de bienvenida o el nombre de la app
    await expect(page.locator("text=teolingo")).toBeVisible();
  });
});

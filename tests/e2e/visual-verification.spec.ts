import { test } from "@playwright/test";

const artifactDir = "C:\\Users\\j\\.gemini\\antigravity\\brain\\97fb49f8-78ab-489a-b79e-0aec3ce97e62";

test("Capture screenshots after registering", async ({ page }) => {
  test.setTimeout(120000);
  const email = `ss_test_${Date.now()}@test.com`;
  const pw = "test1234";

  // 1. Register a fresh user
  await page.goto("/auth/register");
  await page.waitForSelector('input[name="displayName"]', { timeout: 15000 });
  await page.fill('input[name="displayName"]', "Screenshot Tester");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pw);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  console.log("After register:", page.url());

  // 2. If redirected to login, log in
  if (page.url().includes("/auth/login")) {
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', pw);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(4000);
  }

  console.log("After auth:", page.url());

  // 3. Learn page - full-page screenshot to see whole roadmap
  await page.goto("/learn");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${artifactDir}\\roadmap_desktop.png`, fullPage: true });
  console.log("Captured roadmap_desktop.png");

  // 4. Learn - Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}\\roadmap_mobile.png`, fullPage: true });
  console.log("Captured roadmap_mobile.png");

  // 5. Practice nouns - Mobile (bug 2 viewport)
  await page.goto("/lesson/practice?mode=nouns&random=0");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${artifactDir}\\practice_mobile.png`, fullPage: false });
  console.log("Captured practice_mobile.png");

  // 6. Practice nouns - Desktop
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}\\practice_desktop.png`, fullPage: false });
  console.log("Captured practice_desktop.png");
});

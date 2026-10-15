// Documentation captures only: no pixel baseline or automated visual comparison.
import { test, expect } from "@playwright/test";
for (const [name, path, heading] of [
  ["home", "/", "Your next chapter"],
  ["catalog", "/courses", "Find your next skill."],
  ["details", "/courses/react", "Building interfaces with React"],
  ["lesson", "/learn/react/practice", "Track completion with state"],
  ["my-learning", "/my-learning", "A little progress, every day."],
]) {
  test(`capture ${name}`, async ({ page }, info) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "learnhub.learning.v1",
        JSON.stringify({ react: ["foundations", "practice"] }),
      );
    });
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      heading,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `docs/screenshots/${name}-${info.project.name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
}

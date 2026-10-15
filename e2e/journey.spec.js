import { test, expect } from "@playwright/test";
test("complete learning journey, reload and deliberate reset", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your next chapter",
  );
  await page
    .getByRole("link", { name: "Explore courses ↗", exact: true })
    .click();
  await page.getByLabel("Search courses").fill("nonsense");
  await expect(
    page.getByText("No courses found", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .first()
    .click();
  await expect(page.locator(".course-card")).toHaveCount(9);
  await page.getByLabel("Category", { exact: true }).selectOption("Design");
  await page.getByLabel("Level", { exact: true }).selectOption("Intermediate");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByLabel("Search courses").fill("JavaScript");
  await page.getByRole("link", { name: "JavaScript essentials" }).click();
  await page
    .getByRole("button", { name: "Add to My Learning +", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Add to My Learning +", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Continue learning" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(
    page.getByRole("button", { name: "Lesson completed" }),
  ).toBeDisabled();
  await page.reload();
  await expect(page.getByRole("status")).toHaveText("33% complete");
  await page.getByRole("link", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByRole("status")).toHaveText("67% complete");
  await page
    .getByRole("link", { name: /My Learning/ })
    .first()
    .click();
  await expect(page.locator(".course-card")).toHaveCount(1);
  await expect(page.getByText("67% complete")).toBeVisible();
  await page.getByRole("button", { name: "Reset learning progress" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Reset learning progress" }).click();
  await page.getByRole("button", { name: "Yes, reset all learning" }).click();
  await expect(page.getByText("Your next chapter is waiting.")).toBeVisible();
});
test("invalid routes, malformed storage and responsive layout", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("learnhub.learning.v1", "{bad"),
  );
  await page.reload();
  for (const path of ["/unknown", "/courses/missing", "/learn/react/missing"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "syllabus",
    );
  }
  await page.goto("/courses");
  await expect(page.locator(".course-card")).toHaveCount(9);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

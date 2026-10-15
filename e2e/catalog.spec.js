import { test, expect } from "@playwright/test";

test("reset clears URL filters and stays reset after reload", async ({
  page,
}) => {
  await page.goto("/courses?category=Design");
  await expect(page.locator(".course-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page).toHaveURL(/\/courses$/);
  await page.reload();
  await expect(page.getByLabel("Category", { exact: true })).toHaveValue("All");
  await expect(page.locator(".course-card")).toHaveCount(9);
});

test("shared URLs reproduce every filter and reject unknown enum values", async ({
  page,
  context,
}) => {
  await page.goto("/courses");
  await page.getByLabel("Search courses").fill("interface");
  await page.getByLabel("Category", { exact: true }).selectOption("Design");
  await page.getByLabel("Level", { exact: true }).selectOption("Beginner");
  await page.getByLabel("Sort by", { exact: true }).selectOption("title");
  const shared = await context.newPage();
  await shared.goto(page.url());
  await shared.reload();
  await expect(shared.getByLabel("Search courses")).toHaveValue("interface");
  await expect(shared.getByLabel("Category", { exact: true })).toHaveValue(
    "Design",
  );
  await expect(shared.getByLabel("Level", { exact: true })).toHaveValue(
    "Beginner",
  );
  await expect(shared.getByLabel("Sort by", { exact: true })).toHaveValue(
    "title",
  );
  await expect(shared.locator(".course-card h3")).toHaveText([
    "User interface design fundamentals",
  ]);
  await shared.close();
  await page.goto("/courses?category=invalid&level=unknown&sort=nonsense");
  await expect(page.getByLabel("Category", { exact: true })).toHaveValue("All");
  await expect(page.getByLabel("Level", { exact: true })).toHaveValue("All");
  await expect(page.getByLabel("Sort by", { exact: true })).toHaveValue(
    "featured",
  );
  await expect(page.locator(".course-card")).toHaveCount(9);
});

test("Back and Forward restore filter controls, results, and reset state", async ({
  page,
}) => {
  await page.goto("/courses?category=Design");
  await page.getByLabel("Level", { exact: true }).selectOption("Intermediate");
  await page.getByLabel("Sort by", { exact: true }).selectOption("duration");
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.goBack();
  await expect(page.getByLabel("Level", { exact: true })).toHaveValue(
    "Intermediate",
  );
  await expect(page.getByLabel("Sort by", { exact: true })).toHaveValue(
    "duration",
  );
  await expect(page.locator(".course-card h3")).toHaveText([
    "Accessible digital experiences",
  ]);
  await page.goBack();
  await expect(page.getByLabel("Sort by", { exact: true })).toHaveValue(
    "featured",
  );
  await page.goBack();
  await expect(page.getByLabel("Level", { exact: true })).toHaveValue("All");
  await expect(page.locator(".course-card")).toHaveCount(2);
  await page.goForward();
  await expect(page.getByLabel("Level", { exact: true })).toHaveValue(
    "Intermediate",
  );
  await page.goForward();
  await expect(page.getByLabel("Sort by", { exact: true })).toHaveValue(
    "duration",
  );
  await page.goForward();
  await expect(page).toHaveURL(/\/courses$/);
  await expect(page.locator(".course-card")).toHaveCount(9);
});

test("search typing replaces history and Back returns to the previous selection", async ({
  page,
}) => {
  await page.goto("/courses");
  await page.getByLabel("Category", { exact: true }).selectOption("Data");
  const before = await page.evaluate(() => history.length);
  await page.getByLabel("Search courses").pressSequentially("Practical");
  await expect(page).toHaveURL(/search=Practical/);
  await expect(page.locator(".course-card")).toHaveCount(1);
  expect(await page.evaluate(() => history.length)).toBe(before);
  await page.goBack();
  await expect(page.getByLabel("Search courses")).toHaveValue("");
  await expect(page.getByLabel("Category", { exact: true })).toHaveValue("All");
  await page.goForward();
  await expect(page.getByLabel("Search courses")).toHaveValue("Practical");
  await expect(page.locator(".course-card h3")).toHaveText([
    "Practical data analysis",
  ]);
});

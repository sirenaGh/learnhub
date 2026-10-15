import { test, expect } from "@playwright/test";

test("keyboard enrollment moves focus to Continue learning and preserves route focus", async ({
  page,
}) => {
  await page.goto("/courses/react");
  const add = page.getByRole("button", { name: "Add to My Learning +" });
  await add.focus();
  await page.keyboard.press("Enter");
  const next = page.getByRole("link", { name: "Continue learning" });
  await expect(next).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compose a lesson card",
  );
});

test("keyboard focus follows direct enrollment and reset open, cancel, and confirm", async ({
  page,
}) => {
  await page.goto("/learn/react/practice");
  await page
    .getByRole("button", { name: "Add to My Learning", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Track completion with state",
    }),
  ).toBeFocused();
  await page.getByRole("link", { name: "My Learning 1" }).click();
  const reset = page.getByRole("button", { name: "Reset learning progress" });
  await reset.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(reset).toBeFocused();
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Yes, reset all learning" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Your next chapter is waiting." }),
  ).toBeFocused();
  await page.reload();
  await expect(page.locator(".course-card")).toHaveCount(0);
});

test("four distinct lessons reach 100%, end correctly, and remain reviewable after reload", async ({
  page,
}) => {
  await page.goto("/courses/react");
  await expect(
    page.getByText("90 estimated minutes · 4 text lessons", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add to My Learning +" }).click();
  await page.getByRole("link", { name: "Continue learning" }).click();
  const titles = [
    "Compose a lesson card",
    "Track completion with state",
    "Design predictable interactions",
    "Persist and verify the checklist",
  ];
  const minutes = [15, 25, 25, 25];
  for (let i = 0; i < titles.length; i++) {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(titles[i]);
    await expect(
      page.getByText(`LESSON ${i + 1} OF 4 · ${minutes[i]} MIN ESTIMATE`),
    ).toBeVisible();
    await page.getByRole("button", { name: "Mark lesson complete" }).click();
    await expect(page.getByRole("status")).toHaveText(
      `${(i + 1) * 25}% complete`,
    );
    await expect(
      page.getByRole("button", { name: "Lesson completed" }),
    ).toBeDisabled();
    if (i < titles.length - 1)
      await page.getByRole("link", { name: "Next lesson" }).click();
  }
  await expect(page.getByRole("link", { name: "Next lesson" })).toHaveCount(0);
  await page.getByRole("link", { name: "Back to My Learning" }).click();
  await expect(page.getByText("100% complete")).toBeVisible();
  await page
    .getByRole("link", { name: "Building interfaces with React" })
    .click();
  await page.reload();
  await expect(page.getByText(/Course completed · 100%/)).toBeVisible();
  await expect(page.getByText(/Your next lesson is ready/)).toHaveCount(0);
  await page.getByRole("link", { name: "Review lessons" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(titles[0]);
  await expect(
    page.getByRole("button", { name: "Lesson completed" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toHaveText("100% complete");
});

test("failed storage writes show a warning while learning continues in memory", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException(
        "Storage blocked for this test",
        "QuotaExceededError",
      );
    };
  });
  await page.goto("/learn/react/foundations");
  await page
    .getByRole("button", { name: "Add to My Learning", exact: true })
    .click();
  await expect(page.getByRole("alert")).toHaveText(
    "Browser storage is unavailable. Progress will last only for this visit.",
  );
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByRole("status")).toHaveText("25% complete");
  await page.getByRole("link", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByRole("status")).toHaveText("50% complete");
  await page.getByRole("link", { name: "My Learning 1" }).click();
  await expect(page.getByText("50% complete")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(1);
  await page.reload();
  await expect(page.getByText("Your next chapter is waiting.")).toBeVisible();
});

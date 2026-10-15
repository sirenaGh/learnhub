import { defineConfig } from "@playwright/test";
import base from "./playwright.config.js";
export default defineConfig({
  ...base,
  testDir: "./e2e/captures",
  testMatch: "**/*.capture.js",
  outputDir: "test-results/captures",
});

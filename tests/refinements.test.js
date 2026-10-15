import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultFilters,
  readFilters,
  writeFilters,
} from "../src/state/catalog.js";
import { courses } from "../src/data/courses.js";
import { courseMinutes } from "../src/data/course-utils.js";
import { complete, enroll, progress } from "../src/state/learning.js";

test("URL filters round-trip and reset removes only filter parameters", () => {
  const params = new URLSearchParams("source=portfolio");
  const filters = {
    search: "React & state",
    category: "Development",
    level: "Intermediate",
    sort: "duration",
  };
  assert.deepEqual(readFilters(writeFilters(params, filters)), filters);
  assert.equal(
    writeFilters(writeFilters(params, filters), defaultFilters).toString(),
    "source=portfolio",
  );
});

test("invalid URL enums use safe defaults without losing the search text", () => {
  assert.deepEqual(
    readFilters(
      new URLSearchParams("search=React&category=bad&level=bad&sort=bad"),
    ),
    { ...defaultFilters, search: "React" },
  );
});

test("four-lesson progress remains bounded and completion is repeat-safe", () => {
  const course = courses.find((c) => c.id === "react");
  assert.equal(course.lessons.length, 4);
  let state = enroll({}, course.id);
  course.lessons.forEach((lesson, index) => {
    state = complete(state, course.id, lesson.id);
    const again = complete(state, course.id, lesson.id);
    assert.equal(again, state);
    assert.equal(progress(course, again[course.id]), (index + 1) * 25);
  });
  assert.equal(
    progress(course, [...state.react, ...state.react, "unknown"]),
    100,
  );
});

test("empty courses have zero progress and duration", () => {
  const empty = { lessons: [] };
  assert.equal(progress(empty), 0);
  assert.equal(progress(empty, ["old-lesson"]), 0);
  assert.equal(courseMinutes(empty), 0);
});

test("all course totals come from explicit positive lesson estimates", () => {
  for (const course of courses) {
    assert.equal(
      new Set(course.lessons.map((l) => l.id)).size,
      course.lessons.length,
    );
    assert.ok(
      course.lessons.every((l) => Number.isInteger(l.minutes) && l.minutes > 0),
    );
    assert.equal(
      courseMinutes(course),
      course.lessons.reduce((sum, l) => sum + l.minutes, 0),
    );
  }
  assert.equal(courseMinutes(courses.find((c) => c.id === "react")), 90);
});

import test from "node:test";
import assert from "node:assert/strict";
import { courses, selectCourses } from "../src/data/courses.js";
import {
  enroll,
  complete,
  progress,
  sanitize,
  readLearning,
  saveLearning,
} from "../src/state/learning.js";
test("search, combined filters, sorting and reset", () => {
  assert.equal(selectCourses({ search: " REACT " })[0].id, "react");
  assert.deepEqual(
    selectCourses({ category: "Design", level: "Intermediate" }).map(
      (c) => c.id,
    ),
    ["accessibility"],
  );
  assert.equal(selectCourses({ search: "no matches" }).length, 0);
  assert.equal(selectCourses().length, 9);
  const sorted = selectCourses({ sort: "title" }).map((c) => c.title);
  assert.deepEqual(
    sorted,
    [...sorted].sort((a, b) => a.localeCompare(b)),
  );
});
test("enrollment and completion are idempotent; progress counts valid lessons", () => {
  const c = courses[0];
  let state = enroll({}, c.id);
  assert.equal(enroll(state, c.id), state);
  state = complete(state, c.id, c.lessons[0].id);
  assert.equal(complete(state, c.id, c.lessons[0].id), state);
  assert.equal(progress(c, state[c.id]), 33);
  assert.equal(progress(c, ["foundations", "foundations", "invalid"]), 33);
  for (const l of c.lessons) state = complete(state, c.id, l.id);
  assert.equal(progress(c, state[c.id]), 100);
  assert.equal(complete(state, c.id, "invalid"), state);
  assert.deepEqual(enroll({}, "missing"), {});
});
test("storage round trip restores progress and rejects malformed data", () => {
  let value = null;
  const storage = {
    getItem: () => value,
    setItem: (key, next) => {
      value = next;
    },
  };
  const state = complete(enroll({}, "react"), "react", "practice");
  assert.equal(saveLearning(storage, state), true);
  assert.deepEqual(readLearning(storage), state);
  for (const invalid of ["{", "null", "[]", "42", '"hello"']) {
    value = invalid;
    assert.deepEqual(readLearning(storage), {});
  }
  assert.deepEqual(
    sanitize({
      react: ["practice", "practice", "invalid"],
      missing: [],
      git: "bad",
    }),
    { react: ["practice"] },
  );
  assert.deepEqual(
    readLearning({
      getItem() {
        throw Error();
      },
    }),
    {},
  );
  assert.equal(
    saveLearning(
      {
        setItem() {
          throw Error();
        },
      },
      {},
    ),
    false,
  );
});

import { courses } from "../data/courses.js";
export const STORAGE_KEY = "learnhub.learning.v1";
export function sanitize(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    courses
      .filter((c) => Object.hasOwn(value, c.id) && Array.isArray(value[c.id]))
      .map((c) => [
        c.id,
        [
          ...new Set(
            value[c.id].filter((id) => c.lessons.some((l) => l.id === id)),
          ),
        ],
      ]),
  );
}
export function readLearning(storage) {
  try {
    return sanitize(JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch {
    return {};
  }
}
export function saveLearning(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
export function enroll(state, id) {
  return courses.some((c) => c.id === id) && !Object.hasOwn(state, id)
    ? { ...state, [id]: [] }
    : state;
}
export function complete(state, id, lesson) {
  if (
    !courses.find((c) => c.id === id)?.lessons.some((l) => l.id === lesson) ||
    !Object.hasOwn(state, id) ||
    state[id].includes(lesson)
  )
    return state;
  return { ...state, [id]: [...state[id], lesson] };
}
export function progress(course, done = []) {
  if (course.lessons.length === 0) return 0;
  return Math.round(
    (course.lessons.filter((l) => done.includes(l.id)).length /
      course.lessons.length) *
      100,
  );
}

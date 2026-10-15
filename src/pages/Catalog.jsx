import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

import { selectCourses } from "../data/courses.js";

import Card from "../components/Card.jsx";
import {
  categories,
  levels,
  defaultFilters,
  readFilters,
  writeFilters,
} from "../state/catalog.js";
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);
  const resetTrigger = useRef(null);
  function change(next, replace = false) {
    const updated = writeFilters(params, next);
    if (updated.toString() !== params.toString())
      setParams(updated, { replace });
  }
  function reset() {
    change(defaultFilters);
    resetTrigger.current?.focus();
  }
  const result = selectCourses(filters);
  const field = (key) => ({
    value: filters[key],
    // Typing replaces the current entry; select changes and reset create history.
    onChange: (e) =>
      change({ ...filters, [key]: e.target.value }, key === "search"),
  });
  return (
    <>
      <header className="page-heading">
        <span className="kicker">THE COURSE COLLECTION</span>
        <h1>Find your next skill.</h1>
        <p>Practical ideas. Small steps. Something new to build.</p>
      </header>
      <section className="filters" aria-label="Course filters">
        <label className="search">
          Search courses
          <input
            type="search"
            placeholder="Search by course title…"
            {...field("search")}
          />
        </label>
        <label>
          Category
          <select aria-label="Category" {...field("category")}>
            {categories.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Level
          <select aria-label="Level" {...field("level")}>
            {levels.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select aria-label="Sort by" {...field("sort")}>
            <option value="featured">Featured</option>
            <option value="title">Title A–Z</option>
            <option value="duration">Shortest first</option>
          </select>
        </label>
        <button ref={resetTrigger} className="text-button" onClick={reset}>
          Reset filters
        </button>
      </section>
      <p className="result-count" role="status">
        {result.length} courses · Demo collection
      </p>
      {result.length ? (
        <div className="course-grid">
          {result.map((c) => (
            <Card key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <section className="empty">
          <h2>No courses found</h2>
          <p>Try another title or reset your filters.</p>
          <button className="button" onClick={reset}>
            Reset filters
          </button>
        </section>
      )}
    </>
  );
}

import { Link, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { courses } from "../data/courses.js";
import { courseMinutes } from "../data/course-utils.js";
import { progress } from "../state/learning.js";

import Art from "../components/Art.jsx";
import Missing from "../components/Missing.jsx";
export default function Details({ state, add }) {
  const { courseId } = useParams();
  const c = courses.find((c) => c.id === courseId);
  const saved = c ? Object.hasOwn(state, c.id) : false;
  const continueLink = useRef(null);
  const focusAfterEnrollment = useRef(false);
  useEffect(() => {
    if (saved && focusAfterEnrollment.current) {
      continueLink.current?.focus();
      focusAfterEnrollment.current = false;
    }
  }, [saved]);
  if (!c) return <Missing />;
  const completed =
    saved && c.lessons.length > 0 && progress(c, state[c.id]) === 100;
  const nextLesson =
    c.lessons.find((l) => !state[c.id]?.includes(l.id)) || c.lessons[0];
  return (
    <>
      <Link className="back-link" to="/courses">
        ← All courses
      </Link>
      <section className="detail-hero">
        <div>
          <span className="kicker">
            {c.category} · {c.level}
          </span>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
          <p className="muted">
            By {c.instructor} · Demo instructor
            <br />
            {courseMinutes(c)} estimated minutes · {c.lessons.length} text
            lessons
          </p>
          {!nextLesson ? (
            <p>No lessons are available for this course yet.</p>
          ) : saved ? (
            <Link
              ref={continueLink}
              className="button"
              to={`/learn/${c.id}/${nextLesson.id}`}
            >
              {completed ? "Review lessons →" : "Continue learning →"}
            </Link>
          ) : (
            <button
              className="button"
              onClick={() => {
                focusAfterEnrollment.current = true;
                add(c.id);
              }}
            >
              Add to My Learning +
            </button>
          )}
          <p className="small-note">
            {completed
              ? "✓ Course completed · 100%. Revisit any lesson below."
              : saved && nextLesson
                ? "Added to My Learning. Your next lesson is ready."
                : "Free demo course · No account required"}
          </p>
        </div>
        <Art course={c} />
      </section>
      <section className="reading">
        <h2>Your lesson outline</h2>
        <p>
          {c.id === "react"
            ? "Build a small lesson checklist through four worked examples. Estimates include reading and independent practice."
            : "Sample content: introductory lessons provide a guided practice framework, not a comprehensive curriculum."}
        </p>
        <ol className="outline">
          {c.lessons.map((l) => (
            <li key={l.id}>
              <strong>{l.title}</strong>
              <span className="lesson-duration">{l.minutes} min</span>
              {saved && (
                <Link to={`/learn/${c.id}/${l.id}`}>Open lesson →</Link>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

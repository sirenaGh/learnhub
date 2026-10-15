import { Link, NavLink, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { courses } from "../data/courses.js";
import { progress } from "../state/learning.js";
import Missing from "../components/Missing.jsx";
export default function Lesson({ state, mark, add }) {
  const { courseId, lessonId } = useParams();
  const c = courses.find((c) => c.id === courseId);
  const index = c?.lessons.findIndex((l) => l.id === lessonId);
  const lesson = c?.lessons[index];
  const saved = c ? Object.hasOwn(state, c.id) : false;
  const heading = useRef(null);
  const focusAfterEnrollment = useRef(false);
  useEffect(() => {
    if (saved && focusAfterEnrollment.current) {
      heading.current?.focus();
      focusAfterEnrollment.current = false;
    }
  }, [saved]);
  if (!lesson) return <Missing />;
  if (!saved)
    return (
      <section className="empty">
        <h1>Make this course yours.</h1>
        <p>Add {c.title} to save your progress.</p>
        <button
          className="button"
          onClick={() => {
            focusAfterEnrollment.current = true;
            add(c.id);
          }}
        >
          Add to My Learning
        </button>
      </section>
    );
  const done = state[c.id].includes(lesson.id);
  return (
    <>
      <Link className="back-link" to={`/courses/${c.id}`}>
        ← {c.title}
      </Link>
      <div className="lesson-layout">
        <aside>
          <h2>Course lessons</h2>
          <progress
            value={progress(c, state[c.id])}
            max="100"
            aria-label="Course progress"
          />
          <p role="status">{progress(c, state[c.id])}% complete</p>
          <nav aria-label="Lessons">
            {c.lessons.map((l, i) => (
              <NavLink key={l.id} to={`/learn/${c.id}/${l.id}`}>
                {state[c.id].includes(l.id) ? "✓" : `0${i + 1}`} · {l.title}
              </NavLink>
            ))}
          </nav>
        </aside>
        <article className="lesson-content">
          <span className="kicker">
            LESSON {index + 1} OF {c.lessons.length} · {lesson.minutes} MIN
            ESTIMATE
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {lesson.title}
          </h1>
          <p className="lead">A guided practice in {c.label.toLowerCase()}.</p>
          <h2>{lesson.heading || "From an idea to understanding"}</h2>
          <p>{lesson.body}</p>
          {lesson.code && (
            <pre
              className="code-example"
              tabIndex={0}
              aria-label="Code example"
            >
              <code>{lesson.code}</code>
            </pre>
          )}
          {lesson.explanation && <p>{lesson.explanation}</p>}
          <div className="exercise">
            <span className="kicker">TRY IT YOURSELF</span>
            <h2>Your practice task</h2>
            <p>{lesson.exercise}</p>
            {lesson.check && (
              <p>
                <strong>Check your understanding:</strong> {lesson.check}
              </p>
            )}
          </div>
          <button
            className="button"
            disabled={done}
            onClick={() => mark(c.id, lesson.id)}
          >
            {done ? "✓ Lesson completed" : "Mark lesson complete"}
          </button>
          <div className="lesson-pagination">
            {index > 0 && (
              <Link to={`/learn/${c.id}/${c.lessons[index - 1].id}`}>
                ← Previous lesson
              </Link>
            )}
            {index < c.lessons.length - 1 ? (
              <Link to={`/learn/${c.id}/${c.lessons[index + 1].id}`}>
                Next lesson →
              </Link>
            ) : (
              <Link to="/my-learning">Back to My Learning →</Link>
            )}
          </div>
        </article>
      </div>
    </>
  );
}

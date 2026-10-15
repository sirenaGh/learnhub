import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { courses } from "../data/courses.js";

import Card from "../components/Card.jsx";
export default function Learning({ state, reset }) {
  const selected = courses.filter((c) => Object.hasOwn(state, c.id));
  const [confirming, setConfirming] = useState(false);
  const resetTrigger = useRef(null);
  const cancelButton = useRef(null);
  const emptyHeading = useRef(null);
  const focusTarget = useRef(null);
  useEffect(() => {
    const targets = {
      cancel: cancelButton,
      reset: resetTrigger,
      empty: emptyHeading,
    };
    targets[focusTarget.current]?.current?.focus();
    focusTarget.current = null;
  }, [confirming, selected.length]);
  return (
    <>
      <header className="page-heading">
        <span className="kicker">YOUR PERSONAL LEARNING SPACE</span>
        <h1>A little progress, every day.</h1>
        <p>
          Your courses and completed lessons are saved only in this browser.
          Clearing browser data removes them.
        </p>
      </header>
      {selected.length ? (
        <>
          <div className="course-grid">
            {selected.map((c) => (
              <Card key={c.id} course={c} saved={state[c.id]} />
            ))}
          </div>
          <section className="reset-panel">
            <h2>Start fresh</h2>
            <p>
              Remove all saved courses and lesson progress from this browser.
            </p>
            {confirming ? (
              <div
                role="group"
                aria-label="Confirm learning reset"
                aria-describedby="reset-description"
              >
                <p id="reset-description">
                  Delete all learning progress? This cannot be undone.
                </p>
                <button
                  className="button"
                  onClick={() => {
                    focusTarget.current = "empty";
                    reset();
                    setConfirming(false);
                  }}
                >
                  Yes, reset all learning
                </button>{" "}
                <button
                  ref={cancelButton}
                  className="text-button"
                  aria-describedby="reset-description"
                  onClick={() => {
                    focusTarget.current = "reset";
                    setConfirming(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                ref={resetTrigger}
                className="text-button"
                onClick={() => {
                  focusTarget.current = "cancel";
                  setConfirming(true);
                }}
              >
                Reset learning progress
              </button>
            )}
          </section>
        </>
      ) : (
        <section className="empty">
          <h2 ref={emptyHeading} tabIndex={-1}>
            Your next chapter is waiting.
          </h2>
          <p>Add a course from the catalog to begin.</p>
          <Link className="button" to="/courses">
            Find a course ↗
          </Link>
        </section>
      )}
    </>
  );
}

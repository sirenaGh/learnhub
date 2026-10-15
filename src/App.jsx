import Lesson from "./pages/Lesson.jsx";
import Learning from "./pages/Learning.jsx";
import Details from "./pages/Details.jsx";
import Catalog from "./pages/Catalog.jsx";
import Home from "./pages/Home.jsx";
import Missing from "./components/Missing.jsx";

import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";

import {
  complete,
  enroll,
  readLearning,
  saveLearning,
} from "./state/learning.js";

export default function App() {
  const [state, setState] = useState(() => {
    try {
      return readLearning(window.localStorage);
    } catch {
      return {};
    }
  });
  const [warning, setWarning] = useState("");
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus();
  }, [location.pathname]);
  function update(next) {
    setState(next);
    let saved = false;
    try {
      saved = saveLearning(window.localStorage, next);
    } catch {
      /* Storage may be blocked. */
    }
    setWarning(
      saved
        ? ""
        : "Browser storage is unavailable. Progress will last only for this visit.",
    );
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-wrap">
          <Link className="brand" to="/">
            <span className="brand-mark">L↗</span>LearnHub
            <span className="brand-dot">.</span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/courses">Courses</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
          <NavLink className="learning-link" to="/my-learning">
            My Learning <span>{Object.keys(state).length}</span>
          </NavLink>
        </div>
      </header>
      <main id="main" tabIndex="-1" className="container">
        {warning && <p role="alert">{warning}</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Catalog />} />
          <Route
            path="/courses/:courseId"
            element={
              <Details state={state} add={(id) => update(enroll(state, id))} />
            }
          />
          <Route
            path="/my-learning"
            element={<Learning state={state} reset={() => update({})} />}
          />
          <Route
            path="/learn/:courseId/:lessonId"
            element={
              <Lesson
                state={state}
                add={(id) => update(enroll(state, id))}
                mark={(id, l) => update(complete(state, id, l))}
              />
            }
          />
          <Route
            path="/about"
            element={
              <section className="reading about">
                <span className="kicker">ABOUT THIS PROJECT</span>
                <h1>A space for curious minds.</h1>
                <p className="lead">
                  LearnHub is a frontend portfolio demonstration of a simple,
                  complete learning journey.
                </p>
                <h2>Explore. Practice. Keep going.</h2>
                <p>
                  Browse nine sample courses, save one to your collection, and
                  complete short text lessons. All courses, instructors, and
                  lessons are fictional demo content.
                </p>
                <h2>Built with clear boundaries</h2>
                <p>
                  Selections and progress stay in your current browser. There
                  are no accounts, payments, certificates, or backend services.
                  This is not a production learning management system.
                </p>
                <Link className="button" to="/courses">
                  Explore the collection ↗
                </Link>
              </section>
            }
          />
          <Route path="*" element={<Missing />} />
        </Routes>
      </main>
      <footer>
        <div className="container footer-inner">
          <div>
            <Link className="brand" to="/">
              LearnHub.
            </Link>
            <p>A little learning. A world of possibility.</p>
          </div>
          <div>
            <Link to="/courses">Explore courses</Link>
            <Link to="/about">About the project</Link>
            <span>Frontend demo · Browser-only progress</span>
          </div>
        </div>
      </footer>
    </>
  );
}

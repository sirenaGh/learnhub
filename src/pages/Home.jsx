import { Link } from "react-router-dom";
import { courses } from "../data/courses.js";

import Card from "../components/Card.jsx";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="kicker">● A LITTLE CURIOSITY GOES A LONG WAY</span>
          <h1>
            Your next chapter
            <br />
            starts with <em>learning.</em>
          </h1>
          <p>
            Make room for something new. Explore practical courses in
            development, design, and data—one thoughtful lesson at a time.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/courses">
              Explore courses ↗
            </Link>
            <Link to="/my-learning">My learning →</Link>
          </div>
          <div className="hero-note">
            ◎ Learn at your pace. Pick up where you left off.
          </div>
        </div>
        <div
          className="hero-visual"
          aria-label="Illustration of a learning workspace"
        >
          <span className="floating top-tag">✦ MAKE SOMETHING NEW</span>
          <div className="workspace">
            <small>
              ● ● ● <span>your learning space</span>
            </small>
            <div>
              <b>‹/›</b>
              <span className="kicker">SMALL STEPS, REAL SKILLS</span>
              <h2>
                Ideas into
                <br />
                possibilities.
              </h2>
              <i />
              <i />
              <i />
            </div>
          </div>
          <span className="floating bottom-tag">
            ✓ One lesson at a time<small>Keep your curiosity moving.</small>
          </span>
          <b className="visual-star">✳</b>
        </div>
      </section>
      <section className="category-strip">
        <span>Where will curiosity take you?</span>
        {["Development", "Design", "Data"].map((x, i) => (
          <Link key={x} to={`/courses?category=${x}`}>
            <b>{["⌘", "◈", "▥"][i]}</b>
            {x}
            <span>↗</span>
          </Link>
        ))}
      </section>
      <section className="featured">
        <div className="section-heading">
          <div>
            <span className="kicker">A GOOD PLACE TO BEGIN</span>
            <h2>Small lessons. New possibilities.</h2>
          </div>
          <Link to="/courses">View all courses →</Link>
        </div>
        <div className="course-grid">
          {courses.slice(0, 3).map((c) => (
            <Card key={c.id} course={c} />
          ))}
        </div>
      </section>
      <section className="bottom-banner">
        <div>
          <span className="kicker">BUILT FOR EXPLORATION</span>
          <h2>Your learning, at your own pace.</h2>
          <p>
            Add a course, work through lessons, and watch your progress grow.
          </p>
        </div>
        <Link className="button" to="/about">
          About LearnHub ↗
        </Link>
      </section>
    </>
  );
}

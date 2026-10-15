import { Link } from "react-router-dom";

export default function Missing() {
  return (
    <section className="empty">
      <span className="kicker">404 · A LITTLE OFF COURSE</span>
      <h1>This page isn’t on the syllabus.</h1>
      <p>The requested page, course, or lesson could not be found.</p>
      <Link className="button" to="/courses">
        Explore courses →
      </Link>
    </section>
  );
}

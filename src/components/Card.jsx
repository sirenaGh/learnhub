import { Link } from "react-router-dom";

import { progress } from "../state/learning.js";
import Art from "../components/Art.jsx";
import { courseMinutes } from "../data/course-utils.js";
export default function Card({ course, saved }) {
  return (
    <article className="course-card">
      <Art course={course} />
      <div className="card-body">
        <div className="eyebrow">
          {course.category}
          <span>{course.level}</span>
        </div>
        <h3>
          <Link to={`/courses/${course.id}`}>{course.title}</Link>
        </h3>
        <p>{course.description}</p>
        <div className="card-meta">
          <span>
            {courseMinutes(course)} min · {course.lessons.length} lessons
          </span>
          <span>↗</span>
        </div>
        {saved !== undefined && (
          <>
            <progress
              value={progress(course, saved)}
              max="100"
              aria-label={`${course.title} progress`}
            />
            <small>{progress(course, saved)}% complete</small>
          </>
        )}
      </div>
    </article>
  );
}

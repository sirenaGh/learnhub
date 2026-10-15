export default function Art({ course }) {
  return (
    <div
      className={`course-art ${course.color} art-${course.category.toLowerCase()}`}
      aria-hidden="true"
    >
      <span>{course.label}</span>
      <div className="art-window">
        <small>● ● ●</small>
        {course.category === "Data" ? (
          <div className="art-chart">
            <i />
            <i />
            <i />
            <i />
          </div>
        ) : (
          <strong>{course.category === "Development" ? "‹/›" : "Aa"}</strong>
        )}
        {course.category === "Design" && (
          <div className="art-swatches">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <b className="art-star">✳</b>
    </div>
  );
}

export function courseMinutes(course) {
  return course.lessons.reduce((total, lesson) => total + lesson.minutes, 0);
}

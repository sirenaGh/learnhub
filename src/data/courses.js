import { practice } from "./practice.js";
import { reactLessons } from "./react-lessons.js";
import { courseMinutes } from "./course-utils.js";
const topics = [
  [
    "web-foundations",
    "Web development foundations",
    "Development",
    "Beginner",
    "HTML & CSS",
    "Build accessible, responsive pages with semantic HTML and modern CSS.",
  ],
  [
    "javascript",
    "JavaScript essentials",
    "Development",
    "Beginner",
    "JavaScript",
    "Reason about values, functions, arrays, and browser events.",
  ],
  [
    "react",
    "Building interfaces with React",
    "Development",
    "Intermediate",
    "React",
    "Compose reusable components and manage predictable interface state.",
  ],
  [
    "design",
    "User interface design fundamentals",
    "Design",
    "Beginner",
    "UI Design",
    "Create useful interfaces with thoughtful hierarchy, spacing, and color.",
  ],
  [
    "accessibility",
    "Accessible digital experiences",
    "Design",
    "Intermediate",
    "Accessibility",
    "Build experiences for keyboards and assistive technology.",
  ],
  [
    "git",
    "Git and collaborative workflows",
    "Development",
    "Beginner",
    "Git",
    "Track changes and collaborate through understandable commits.",
  ],
  [
    "data",
    "Practical data analysis",
    "Data",
    "Beginner",
    "Data Analysis",
    "Inspect data quality and communicate useful findings.",
  ],
  [
    "visualization",
    "Communicating with data",
    "Data",
    "Intermediate",
    "Visualization",
    "Choose honest charts for comparisons, trends, and uncertainty.",
  ],
  [
    "testing",
    "Frontend testing strategies",
    "Development",
    "Advanced",
    "Testing",
    "Verify important behaviors at the right level.",
  ],
];
export const courses = topics.map(
  ([id, title, category, level, label, description], i) => ({
    id,
    title,
    category,
    level,
    label,
    description,
    instructor: ["Maya Chen", "Alex Morgan", "Sam Rivera"][i % 3],
    color: ["mint", "lavender", "peach", "blue"][i % 4],
    lessons:
      id === "react"
        ? reactLessons
        : [
            {
              id: "foundations",
              minutes: 15,
              title: "Understand the foundations",
              body: `Start with a concrete goal in ${label}. Write down who needs the result and what they should be able to do. Separate required behavior from implementation preferences. A small, testable goal makes decisions easier.`,
              exercise: `Write a brief for a small ${label} project. Identify its audience, desired outcome, and one way to verify success.`,
            },
            {
              id: "practice",
              minutes: 25,
              title: "Put ideas into practice",
              body: practice[id][0],
              exercise: practice[id][1],
            },
            {
              id: "review",
              minutes: 20,
              title: "Review and extend your work",
              body: "Compare your result with the original goal. Try ordinary, empty, repeated, and unexpected inputs. Describe limitations honestly. Reproducible checks are part of a useful finished project.",
              exercise:
                "Improve one weak point in your example. Write a short note about what you learned and what you would investigate next.",
            },
          ],
  }),
);
export function selectCourses({
  search = "",
  category = "All",
  level = "All",
  sort = "featured",
} = {}) {
  const result = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.trim().toLowerCase()) &&
      (category === "All" || c.category === category) &&
      (level === "All" || c.level === level),
  );
  return sort === "title"
    ? result.sort((a, b) => a.title.localeCompare(b.title))
    : sort === "duration"
      ? result.sort((a, b) => courseMinutes(a) - courseMinutes(b))
      : result;
}

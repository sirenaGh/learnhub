// Worked demo course. Existing lesson IDs remain stable so saved progress survives.
export const reactLessons = [
  {
    id: "foundations",
    title: "Compose a lesson card",
    minutes: 15,
    heading: "Give each component one clear job",
    body: "A component turns data into a piece of the interface. Begin with a lesson card that receives a title and an estimated duration as props. Props are inputs: the card should display them without changing them. Keeping the content outside the component lets the same layout describe different lessons.",
    code: `function LessonCard({ title, minutes }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{minutes} minutes of practice</p>
    </article>
  );
}

<LessonCard title="Working with state" minutes={25} />`,
    explanation:
      "The braces in JSX evaluate a JavaScript expression. The card describes a reusable structure; the caller supplies the content. Semantic elements keep the reading order understandable without relying on visual styling.",
    exercise:
      "Create two LessonCard instances with different titles and durations. Add a description prop. Keep the heading level appropriate for the page that contains the cards.",
    check:
      "Changing the title of one card should not affect the other. Explain which code owns the content and which code owns the layout.",
  },
  {
    id: "practice",
    title: "Track completion with state",
    minutes: 25,
    heading: "Store facts, then derive the display",
    body: "A lesson checklist needs one source of truth: the IDs of completed lessons. Do not also store a completion count or percentage because these can drift out of sync. React state updates should create a new value. A functional updater reads the latest previous state, even when updates are queued.",
    code: `const [completed, setCompleted] = useState([]);

function completeLesson(id) {
  setCompleted(previous =>
    previous.includes(id)
      ? previous
      : [...previous, id]
  );
}

const percent = lessons.length === 0
  ? 0
  : Math.round(
      lessons.filter(lesson =>
        completed.includes(lesson.id)
      ).length / lessons.length * 100
    );`,
    explanation:
      "The includes guard makes completion idempotent: repeating the same action has no extra effect. Filtering the actual lessons also prevents unknown IDs from inflating the percentage. With four lessons, one valid completion is 25%.",
    exercise:
      "Build a four-lesson checklist using stable IDs. Complete the same lesson twice and confirm that it still counts once. Add a fifth lesson to the data and check that the percentage adjusts automatically.",
    check:
      "Why would incrementing a separate percentage by 25 on every click break when a course has five lessons?",
  },
  {
    id: "review",
    title: "Design predictable interactions",
    minutes: 25,
    heading: "Connect events, labels, and focus",
    body: "Use a native button for completion and a link for navigation. A disabled completed button communicates that the action is no longer available. When an action replaces the focused control, move focus to the new task: for example, from enrollment to the first lesson heading. Do this after React has rendered the new element, using a ref and an effect.",
    code: `<button
  type="button"
  disabled={completed.includes(lesson.id)}
  onClick={() => completeLesson(lesson.id)}
>
  {completed.includes(lesson.id)
    ? "Lesson completed"
    : "Mark lesson complete"}
</button>

<p role="status">{percent}% complete</p>`,
    explanation:
      "The live status describes the changed progress without moving the reader away from the current lesson. Use one concise status for that update. Focus management is for changes in the available task, rather than every small state update.",
    exercise:
      "Navigate your checklist using only Tab and Enter. Add an enrollment step, then ensure focus lands on a useful element after enrollment. Verify that keyboard focus remains visible.",
    check:
      "Which interaction needs a focus move, and which only needs a status update? Explain the difference using your checklist.",
  },
  {
    id: "persistence",
    title: "Persist and verify the checklist",
    minutes: 25,
    heading: "Treat browser storage as an unreliable boundary",
    body: "localStorage stores strings and can contain stale or malformed data. Parse inside a try/catch and validate the result against known lesson IDs. Storage can also reject writes. Keep the current in-memory state usable and tell the learner that it will not survive a reload when saving fails.",
    code: `function restoreCompleted(storage, lessons) {
  try {
    const value = JSON.parse(
      storage.getItem("checklist.v1")
    );
    if (!Array.isArray(value)) return [];
    return [...new Set(value)].filter(id =>
      lessons.some(lesson => lesson.id === id)
    );
  } catch {
    return [];
  }
}`,
    explanation:
      "JSON parsing is only the first step: valid JSON can still have the wrong shape. The returned array contains only unique IDs that belong to the current course. In a browser test, reload after completing a lesson and assert the visible percentage rather than an internal variable name.",
    exercise:
      "Save your checklist, reload, and verify restoration. Then try malformed JSON and a storage object whose setItem throws. Confirm that the app keeps working and displays an honest persistence warning.",
    check:
      "List one pure unit test and one browser test that cover different failures in this workflow. Explain why a successful save alone does not prove reload behavior.",
  },
];

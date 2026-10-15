export const practice = {
  "web-foundations": [
    "Use a button for an action and an anchor for navigation. A heading describes the section below it. CSS Grid can adapt a card list with repeat(auto-fit, minmax(240px, 1fr)). Keep the HTML reading order useful even without styles.",
    "Build a page with a header, main, and footer. Add three course cards in a responsive grid. Narrow the viewport and verify that text and controls stay within the screen.",
  ],
  javascript: [
    "Array.filter returns a new array containing items that match a predicate. For title search, normalize both the query and each title with toLowerCase(). Use trim() on the query so accidental spaces do not hide results. Keep the original array unchanged.",
    "Write a function that filters three course objects by title. Try an empty query, uppercase letters, and a query with no matches. Explain why an empty query returns every course.",
  ],
  react: [
    "State should contain the smallest source of truth. Store completed lesson IDs rather than a percentage, then derive the percentage during render. Use a stable ID for each list key. When updating a collection, create a new array instead of mutating the previous value.",
    "Build a three-item lesson checklist with useState. Derive completedCount from the checked items. Verify that clicking a completed item cannot append a duplicate ID.",
  ],
  design: [
    "Visual hierarchy communicates priority. Use size and spacing to distinguish a page title from a section title. Group related controls together. One primary action per region makes the next step clear; supporting actions can use less visual weight.",
    "Sketch a course card with a category, title, description, and duration. Remove an unnecessary border or color. Ask someone which element they notice first and compare that with your intended hierarchy.",
  ],
  accessibility: [
    "Keyboard users need a visible focus indicator and a logical tab order. Native buttons support keyboard activation automatically. Every input needs an associated label; a placeholder disappears as the user types and cannot replace that label.",
    "Navigate a form using only Tab, Shift+Tab, Enter, and Space. Record any unreachable controls. Add visible labels and a focus outline, then repeat the same journey.",
  ],
  git: [
    "git diff shows unstaged changes; git diff --staged shows the next commit. A focused commit should explain one coherent change. Branches let you work independently while pull requests make the proposed difference reviewable.",
    "In a disposable practice repository, edit two files and inspect git diff. Stage only one file, inspect git diff --staged, and explain what will be included in the next commit.",
  ],
  data: [
    "Before calculating an average, inspect missing values, duplicates, and units. A missing value is not automatically zero. The median is less sensitive to outliers than the mean. Record any exclusions so another analyst can reproduce the result.",
    "Compare the mean and median of [10, 12, 12, 14, 100]. Explain the effect of 100. Decide how to handle one missing measurement and describe the assumption rather than silently replacing it.",
  ],
  visualization: [
    "Use bars for category comparisons and a line for ordered changes over time. Bar lengths normally need a zero baseline because viewers compare their lengths. Label units directly and avoid implying more precision than the measurements support.",
    "Sketch a chart comparing three course durations. Include minutes on the axis and a descriptive title. Try truncating the baseline, then explain how the visual impression changes.",
  ],
  testing: [
    "Test externally visible behavior instead of internal variable names. Unit tests suit pure calculations; browser tests suit navigation and persistence. A useful assertion should fail when the behavior breaks, not when an unrelated layout detail changes.",
    "Write a test that completes the same lesson twice and expects one completion. Add a separate reload test that restores stored progress. Explain which defect each test catches and why both levels are useful.",
  ],
};

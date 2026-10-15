export const categories = ["All", "Development", "Design", "Data"];
export const levels = ["All", "Beginner", "Intermediate", "Advanced"];
export const defaultFilters = {
  search: "",
  category: "All",
  level: "All",
  sort: "featured",
};

// URL values are untrusted. Unknown enum values behave like the default.
export function readFilters(params) {
  return {
    search: params.get("search") || "",
    category: categories.includes(params.get("category"))
      ? params.get("category")
      : "All",
    level: levels.includes(params.get("level")) ? params.get("level") : "All",
    sort: ["featured", "title", "duration"].includes(params.get("sort"))
      ? params.get("sort")
      : "featured",
  };
}

export function writeFilters(params, filters) {
  const next = new URLSearchParams(params);
  for (const key of Object.keys(defaultFilters)) {
    if (filters[key] === defaultFilters[key]) next.delete(key);
    else next.set(key, filters[key]);
  }
  return next;
}

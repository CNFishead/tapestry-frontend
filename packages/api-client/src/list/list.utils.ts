export function cleanParams(params: Record<string, any>) {
  const cleaned: Record<string, any> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") cleaned[k] = v;
  }
  return cleaned;
}

// Optional helper so callers can build filters without hand-concatenating strings.
export type FilterValue = string | number | boolean | Record<string, any>;

export function buildFilterString(filters?: Record<string, FilterValue>) {
  if (!filters) return undefined;
  const parts: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;

    // Only stringify OBJECTS. Stringifying primitives would break your AdvFilters merge logic.
    const encoded =
      typeof value === "object" && !Array.isArray(value)
        ? JSON.stringify(value)
        : String(value);

    parts.push(`${key};${encoded}`);
  }

  return parts.join("|");
}

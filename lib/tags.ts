export function parseTags(input: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of input.split(/[,，]/)) {
    const tag = raw.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }

  return result;
}
export function normalizeTags(raw: string[] | string): string[] {
  if (typeof raw === "string") {
    return parseTags(raw);
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of raw) {
    const tag = item.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }

  return result;
}
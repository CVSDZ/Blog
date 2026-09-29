export type FrontmatterKey = "title" | "slug" | "summary" | "category" | "tags";

export type FrontmatterData = Partial<Record<FrontmatterKey, string | string[]>>;

export type FrontmatterParseResult =
  | { status: "none"; content: string; metadata: FrontmatterData }
  | { status: "ok"; content: string; metadata: FrontmatterData }
  | { status: "invalid"; content: string; metadata: FrontmatterData };

const FRONTMATTER_KEYS: readonly FrontmatterKey[] = [
  "title",
  "slug",
  "summary",
  "category",
  "tags",
];

const DELIMITER_PATTERN = /^---\s*$/;
const KEY_VALUE_PATTERN = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/;
const LIST_ITEM_PATTERN = /^-\s+(.*)$/;

function isFrontmatterKey(key: string): key is FrontmatterKey {
  return (FRONTMATTER_KEYS as readonly string[]).includes(key);
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if (
      (first === '"' && last === '"') ||
      (first === "'" && last === "'")
    ) {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
}

function parseInlineList(value: string): string[] {
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => stripQuotes(item))
    .filter((item) => item.length > 0);
}

export function splitFrontmatter(raw: string): FrontmatterParseResult {
  const normalized = raw.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");

  if (!DELIMITER_PATTERN.test(lines[0] ?? "")) {
    return { status: "none", content: normalized, metadata: {} };
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (DELIMITER_PATTERN.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return { status: "invalid", content: normalized, metadata: {} };
  }

  const blockLines = lines.slice(1, endIndex);
  const content = lines.slice(endIndex + 1).join("\n");

  const metadata: FrontmatterData = {};
  let currentListKey: FrontmatterKey | null = null;
  let currentList: string[] | null = null;

  const flushList = () => {
    if (!currentListKey || !currentList || currentList.length === 0) {
      currentListKey = null;
      currentList = null;
      return;
    }

    if (currentListKey === "tags") {
      metadata.tags = currentList;
    } else {
      const first = currentList[0];
      if (first) metadata[currentListKey] = first;
    }

    currentListKey = null;
    currentList = null;
  };

  for (const line of blockLines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const listItem = LIST_ITEM_PATTERN.exec(trimmed);
    if (listItem) {
      if (!currentListKey) {
        return { status: "invalid", content: normalized, metadata: {} };
      }
      if (!currentList) currentList = [];
      const item = stripQuotes(listItem[1]);
      if (item) currentList.push(item);
      continue;
    }

    const keyValue = KEY_VALUE_PATTERN.exec(trimmed);
    if (!keyValue) {
      return { status: "invalid", content: normalized, metadata: {} };
    }

    flushList();

    const key = keyValue[1];
    const valueRaw = keyValue[2].trim();

    if (!isFrontmatterKey(key)) {
      continue;
    }

    if (valueRaw.startsWith("[") && valueRaw.endsWith("]")) {
      const list = parseInlineList(valueRaw);
      if (key === "tags") {
        metadata.tags = list;
      } else {
        const first = list[0];
        if (first) metadata[key] = first;
      }
      continue;
    }

    if (valueRaw === "") {
      currentListKey = key;
      currentList = [];
      continue;
    }

    const value = stripQuotes(valueRaw);
    if (value) metadata[key] = value;
  }

  flushList();

  return { status: "ok", content, metadata };
}
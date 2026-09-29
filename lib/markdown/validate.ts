export const MAX_MARKDOWN_BYTES = 1_048_576;

export type MarkdownFileValidation =
  | { ok: true; file: File }
  | {
      ok: false;
      reason: "unsupported-type" | "too-large" | "no-file" | "multiple";
      picked: File | null;
    };

const ALLOWED_EXTENSIONS = [".md", ".markdown"];

export function isMarkdownFileName(name: string): boolean {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) return false;
  const extension = name.slice(dotIndex).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(extension);
}

export function validateMarkdownFile(
  files: readonly File[]
): MarkdownFileValidation {
  if (files.length === 0) {
    return { ok: false, reason: "no-file", picked: null };
  }

  const first = files[0];

  if (files.length > 1) {
    return { ok: false, reason: "multiple", picked: first };
  }

  if (!isMarkdownFileName(first.name)) {
    return { ok: false, reason: "unsupported-type", picked: first };
  }

  if (first.size > MAX_MARKDOWN_BYTES) {
    return { ok: false, reason: "too-large", picked: first };
  }

  return { ok: true, file: first };
}
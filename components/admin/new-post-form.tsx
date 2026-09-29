"use client";

import { useState } from "react";
import {
  MarkdownUploader,
  type MarkdownUploadResult,
} from "@/components/admin/markdown-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { normalizeTags } from "@/lib/tags";

const errorMessages: Record<string, string> = {
  required: "slug、标题、正文为必填项",
  slug: "该 slug 已存在，请换一个",
  unknown: "创建失败，请稍后重试",
};

function toText(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  if (Array.isArray(value)) {
    const first = value[0];
    return first ? first.trim() : "";
  }
  return value.trim();
}

export function NewPostForm({
  action,
  errorCode,
}: {
  action: (formData: FormData) => void | Promise<void>;
  errorCode?: string;
}) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [slugLocked, setSlugLocked] = useState(false);

  const handleImported = (result: MarkdownUploadResult) => {
    const { metadata, fileName, content: importedContent } = result;

    setContent(importedContent);

    if (title.trim() === "") {
      const metaTitle = toText(metadata.title);
      const fallback = fileName.replace(/\.[^.]+$/, "");
      setTitle(metaTitle || fallback);
    }

    if (!slugLocked && slug.trim() === "") {
      const metaSlug = toText(metadata.slug);
      if (metaSlug) {
        setSlug(metaSlug);
        setSlugLocked(true);
      }
    }

    if (summary.trim() === "") {
      const metaSummary = toText(metadata.summary);
      if (metaSummary) setSummary(metaSummary);
    }

    if (category.trim() === "") {
      const metaCategory = toText(metadata.category);
      if (metaCategory) setCategory(metaCategory);
    }

    if (tags.trim() === "") {
      const list = normalizeTags(metadata.tags ?? []);
      if (list.length > 0) setTags(list.join(", "));
    }
  };

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <MarkdownUploader
        onImported={handleImported}
        hasExistingContent={() => content.trim().length > 0}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">slug（URL 标识，唯一）</span>
        <Input
          name="slug"
          required
          placeholder="my-first-post"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setSlugLocked(true);
          }}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">标题</span>
        <Input
          name="title"
          required
          placeholder="文章标题"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">摘要（可选）</span>
        <Input
          name="summary"
          placeholder="一句话简介，显示在列表页"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">分类（可选）</span>
        <Input
          name="category"
          placeholder="如：大模型开发"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">标签（可选，用逗号分隔）</span>
        <Input
          name="tags"
          placeholder="如：RAG, 微调, 提示工程"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">正文（支持 Markdown）</span>
        <Textarea
          name="content"
          required
          placeholder="# 标题&#10;&#10;正文内容……"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          className="size-4 rounded border"
        />
        <span>立即发布（不勾选则保存为草稿）</span>
      </label>

      {errorCode ? (
        <p className="text-sm text-destructive">
          {errorMessages[errorCode] ?? "创建失败，请稍后重试"}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
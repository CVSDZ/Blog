import Link from "next/link";
import { createPostAction } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const errorMessages: Record<string, string> = {
  required: "slug、标题、正文为必填项",
  slug: "该 slug 已存在，请换一个",
  unknown: "创建失败，请稍后重试",
};

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">新建文章</h1>
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          返回后台
        </Link>
      </div>

      <form action={createPostAction} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">slug（URL 标识，唯一）</span>
          <Input name="slug" required placeholder="my-first-post" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">标题</span>
          <Input name="title" required placeholder="文章标题" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">摘要（可选）</span>
          <Input name="summary" placeholder="一句话简介，显示在列表页" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">分类（可选）</span>
          <Input name="category" placeholder="如：大模型开发" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">标签（可选，用逗号分隔）</span>
          <Input name="tags" placeholder="如：RAG, 微调, 提示工程" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">正文（支持 Markdown）</span>
          <Textarea name="content" required placeholder="# 标题&#10;&#10;正文内容……" />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            className="size-4 rounded border"
          />
          <span>立即发布（不勾选则保存为草稿）</span>
        </label>

        {error ? (
          <p className="text-sm text-destructive">
            {errorMessages[error] ?? "创建失败，请稍后重试"}
          </p>
        ) : null}

        <div className="flex gap-3">
          <Button type="submit">保存</Button>
        </div>
      </form>
    </div>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostForEdit } from "@/lib/posts";
import { deletePostAction, updatePostAction } from "../../actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmForm } from "@/components/admin/confirm-form";
import { cn } from "@/lib/utils";

const errorMessages: Record<string, string> = {
  required: "标题、正文为必填项",
  unknown: "保存失败，请稍后重试",
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const post = await getPostForEdit(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">编辑文章</h1>
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          返回后台
        </Link>
      </div>

      <form
        action={updatePostAction}
        className="mt-8 flex flex-col gap-5"
      >
        <input type="hidden" name="id" value={post.id} />
        <input type="hidden" name="slug" value={post.slug} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">slug（创建后不可修改）</span>
          <Input value={post.slug} readOnly />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">标题</span>
          <Input name="title" required defaultValue={post.title} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">摘要（可选）</span>
          <Input
            name="summary"
            defaultValue={post.summary ?? ""}
            placeholder="一句话简介，显示在列表页"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">分类（可选）</span>
          <Input
            name="category"
            defaultValue={post.category ?? ""}
            placeholder="如：大模型开发"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">标签（可选，用逗号分隔）</span>
          <Input
            name="tags"
            defaultValue={post.tags.join(", ")}
            placeholder="如：RAG, 微调, 提示工程"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">正文（支持 Markdown）</span>
          <Textarea name="content" required defaultValue={post.content} />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
            className="size-4 rounded border"
          />
          <span>立即发布（取消勾选则退回草稿）</span>
        </label>

        {error ? (
          <p className="text-sm text-destructive">
            {errorMessages[error] ?? "保存失败，请稍后重试"}
          </p>
        ) : null}

        <div>
          <Button type="submit">保存修改</Button>
        </div>
      </form>

      <div className="mt-10 border-t pt-6">
        <ConfirmForm
          action={deletePostAction}
          message={`确定删除「${post.title}」吗？此操作不可恢复。`}
          className="flex justify-end"
        >
          <input type="hidden" name="id" value={post.id} />
          <input type="hidden" name="slug" value={post.slug} />
          <Button type="submit" variant="destructive">
            删除文章
          </Button>
        </ConfirmForm>
      </div>
    </div>
  );
}
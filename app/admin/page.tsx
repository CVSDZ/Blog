import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmForm } from "@/components/admin/confirm-form";
import { deletePostAction } from "./posts/actions";
import { cn } from "@/lib/utils";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">后台管理</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts/new"
            className={cn(buttonVariants())}
          >
            新建文章
          </Link>
          <form action={logout}>
            <Button type="submit" variant="outline">
              退出登录
            </Button>
          </form>
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        当前登录：{user?.email}
      </p>

      {error === "delete" ? (
        <p className="mt-2 text-sm text-destructive">删除失败，请稍后重试。</p>
      ) : null}

      <div className="mt-8">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">还没有文章。</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-lg border">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.title}</span>
                  {post.published ? null : (
                    <Badge className="bg-muted text-muted-foreground">
                      草稿
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {post.date}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" })
                    )}
                  >
                    编辑
                  </Link>
                  <ConfirmForm
                    action={deletePostAction}
                    message={`确定删除「${post.title}」吗？此操作不可恢复。`}
                  >
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="slug" value={post.slug} />
                    <Button type="submit" variant="destructive" size="sm">
                      删除
                    </Button>
                  </ConfirmForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
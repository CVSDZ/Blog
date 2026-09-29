import Link from "next/link";
import { createPostAction } from "./actions";
import { NewPostForm } from "@/components/admin/new-post-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

      <NewPostForm action={createPostAction} errorCode={error} />
    </div>
  );
}
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createPost } from "@/lib/posts";
import { parseTags } from "@/lib/tags";

export async function createPostAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const published = formData.get("published") === "on";

  if (!slug || !title || !content) {
    redirect("/admin/posts/new?error=required");
  }

  const result = await createPost({
    slug,
    title,
    summary: summary || null,
    content,
    category: category || null,
    tags,
    published,
  });

  if (!result.ok) {
    if (result.reason === "duplicate-slug") {
      redirect("/admin/posts/new?error=slug");
    }
    redirect("/admin/posts/new?error=unknown");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
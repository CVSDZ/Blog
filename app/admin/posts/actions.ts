"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deletePost, updatePost } from "@/lib/posts";
import { parseTags } from "@/lib/tags";

function revalidatePostPages(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/posts/${slug}`);
  }
}

export async function updatePostAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const tags = parseTags(String(formData.get("tags") ?? ""));
  const published = formData.get("published") === "on";

  if (!id) {
    redirect("/admin");
  }

  if (!title || !content) {
    redirect(`/admin/posts/${id}/edit?error=required`);
  }

  const result = await updatePost(id, {
    title,
    summary: summary || null,
    content,
    category: category || null,
    tags,
    published,
  });

  if (!result.ok) {
    redirect(`/admin/posts/${id}/edit?error=unknown`);
  }

  revalidatePostPages(slug);
  redirect("/admin");
}

export async function deletePostAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (id) {
    const result = await deletePost(id);
    if (!result.ok) {
      redirect("/admin?error=delete");
    }
  }

  revalidatePostPages(slug);
  redirect("/admin");
}
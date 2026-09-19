import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Post = {
  slug: string;
  title: string;
  summary: string | null;
  date: string;
  tags: string[];
};

type PostRow = {
  slug: string;
  title: string;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
};

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, summary, tags, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`查询文章失败：${error.message}`);
  }

  const rows = (data ?? []) as PostRow[];

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    date: row.created_at.slice(0, 10),
    tags: row.tags ?? [],
  }));
}
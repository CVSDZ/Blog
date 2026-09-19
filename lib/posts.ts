import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Post = {
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  date: string;
  tags: string[];
};

type PostRow = {
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  tags: string[] | null;
  created_at: string;
};

export type PostFilters = {
  category?: string;
  tag?: string;
};

export async function getPublishedPosts(
  filters: PostFilters = {}
): Promise<Post[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("posts")
    .select("slug, title, summary, category, tags, created_at")
    .eq("published", true);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.tag) {
    query = query.contains("tags", [filters.tag]);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw new Error(`查询文章失败：${error.message}`);
  }

  const rows = (data ?? []) as PostRow[];

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: row.category,
    date: row.created_at.slice(0, 10),
    tags: row.tags ?? [],
  }));
}

export type PostDetail = Post & {
  content: string;
};

type PostDetailRow = PostRow & {
  content: string;
};

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, summary, content, category, tags, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(`查询文章失败：${error.message}`);
  }

  if (!data) return null;

  const row = data as PostDetailRow;

  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    category: row.category,
    date: row.created_at.slice(0, 10),
    tags: row.tags ?? [],
  };
}

export type PostFilterOptions = {
  categories: string[];
  tags: string[];
};

export async function getPostFilters(): Promise<PostFilterOptions> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("category, tags")
    .eq("published", true);

  if (error) {
    throw new Error(`查询筛选条件失败：${error.message}`);
  }

  const rows = (data ?? []) as {
    category: string | null;
    tags: string[] | null;
  }[];

  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const row of rows) {
    if (row.category) categories.add(row.category);
    for (const tag of row.tags ?? []) tags.add(tag);
  }

  return {
    categories: [...categories].sort((a, b) => a.localeCompare(b)),
    tags: [...tags].sort((a, b) => a.localeCompare(b)),
  };
}

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  date: string;
};

type AdminPostRow = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  created_at: string;
};

export async function getAllPosts(): Promise<AdminPost[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, published, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`查询文章失败：${error.message}`);
  }

  const rows = (data ?? []) as AdminPostRow[];

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    published: row.published,
    date: row.created_at.slice(0, 10),
  }));
}

export type NewPost = {
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  category: string | null;
  tags: string[];
  published: boolean;
};

export type CreatePostResult =
  | { ok: true }
  | { ok: false; reason: "duplicate-slug" | "unknown"; message: string };

export async function createPost(
  input: NewPost
): Promise<CreatePostResult> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("posts").insert({
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    content: input.content,
    category: input.category,
    tags: input.tags,
    published: input.published,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, reason: "duplicate-slug", message: error.message };
    }
    return { ok: false, reason: "unknown", message: error.message };
  }

  return { ok: true };
}

export type EditablePost = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  category: string | null;
  tags: string[];
  published: boolean;
};

export async function getPostForEdit(
  id: string
): Promise<EditablePost | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, summary, content, category, tags, published")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") return null;
    throw new Error(`查询文章失败：${error.message}`);
  }

  if (!data) return null;

  return data as EditablePost;
}

export type UpdatePostInput = {
  title: string;
  summary: string | null;
  content: string;
  category: string | null;
  tags: string[];
  published: boolean;
};

export type MutationResult = { ok: true } | { ok: false; message: string };

export async function updatePost(
  id: string,
  input: UpdatePostInput
): Promise<MutationResult> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("posts")
    .update({
      title: input.title,
      summary: input.summary,
      content: input.content,
      category: input.category,
      tags: input.tags,
      published: input.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}

export async function deletePost(id: string): Promise<MutationResult> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
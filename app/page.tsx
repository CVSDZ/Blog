import { getPostFilters, getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";
import { PostFilters } from "@/components/post/post-filters";

type SearchParams = {
  category?: string;
  tag?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, tag } = await searchParams;

  const [posts, filters] = await Promise.all([
    getPublishedPosts({ category, tag }),
    getPostFilters(),
  ]);

  const activeLabel = category
    ? `分类：${category}`
    : tag
      ? `标签：${tag}`
      : null;

  return (
    <div>
      <section className="border-b bg-gradient-to-b from-muted/60 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight">大模型学习笔记</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            分享大模型开发的学习心得与记录。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <PostFilters
          categories={filters.categories}
          tags={filters.tags}
          activeCategory={category}
          activeTag={tag}
        />

        <h2 className="mt-8 mb-4 text-xl font-semibold">
          {activeLabel ?? "最新文章"}
        </h2>

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {activeLabel
              ? "该筛选下暂无文章。"
              : "还没有文章。去 Supabase 插入一篇 published=true 的文章试试。"}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

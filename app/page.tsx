import { posts } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";

export default function Home() {
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
        <h2 className="mb-4 text-xl font-semibold">最新文章</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

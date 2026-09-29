import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <Card className="linear-card h-full transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-10">
            {post.summary}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <time className="shrink-0 text-xs text-muted-foreground">
            {post.date}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}
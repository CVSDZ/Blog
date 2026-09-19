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
      <Card className="h-full transition-shadow hover:shadow-md">
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
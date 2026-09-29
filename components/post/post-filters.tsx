import Link from "next/link";
import { cn } from "@/lib/utils";

type PostFiltersProps = {
  categories: string[];
  tags: string[];
  activeCategory?: string;
  activeTag?: string;
};

export function PostFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
}: PostFiltersProps) {
  if (categories.length === 0 && tags.length === 0) {
    return null;
  }

  const linkClass = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-sm transition-all duration-200",
      active
        ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_12px_rgba(99,102,241,0.3)]"
        : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">分类：</span>
        <Link href="/" className={linkClass(!activeCategory && !activeTag)}>
          全部
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/?category=${encodeURIComponent(category)}`}
            className={linkClass(activeCategory === category)}
          >
            {category}
          </Link>
        ))}
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">标签：</span>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className={linkClass(activeTag === tag)}
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
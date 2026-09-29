export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-6 text-sm text-muted-foreground">
        <p>© 2026 大模型学习笔记</p>
        <a
          href="https://github.com/CVSDZ/Blog"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
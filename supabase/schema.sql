-- 文章表（v1）
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content text not null,
  tags text[] not null default '{}',
  category text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 开启行级安全（RLS）
alter table public.posts enable row level security;

-- 匿名用户：只能读已发布文章
create policy "匿名读已发布" on public.posts
  for select
  to anon
  using (published = true);

-- 登录作者：可读写全部（个人博客仅作者本人登录，authenticated 即作者）
create policy "作者读写全部" on public.posts
  for all
  to authenticated
  using (true)
  with check (true);
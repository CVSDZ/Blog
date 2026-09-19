export type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
};

export const posts: Post[] = [
  {
    slug: "learn-llm-roadmap",
    title: "从零开始学大模型：我的学习路线",
    summary: "记录我为什么开始学大模型，第一阶段的学习路线、工具链和踩过的坑。",
    date: "2026-09-19",
    tags: ["学习路线", "入门"],
  },
  {
    slug: "what-is-rag",
    title: "RAG 是什么：检索增强生成入门",
    summary: "用大白话解释 RAG 的来龙去脉，以及它和微调到底有什么区别。",
    date: "2026-09-18",
    tags: ["RAG", "概念"],
  },
  {
    slug: "pgvector-vector-search",
    title: "向量检索与 pgvector 初探",
    summary: "为什么语义搜索要靠向量，以及 Supabase 的 pgvector 该怎么上手。",
    date: "2026-09-17",
    tags: ["向量检索", "Supabase"],
  },
  {
    slug: "supabase-first-week",
    title: "用 Supabase 搭博客后端的第一周",
    summary: "从注册到建表再到 RLS，记录我用 Supabase 直查的实战过程。",
    date: "2026-09-16",
    tags: ["Supabase", "后端"],
  },
];
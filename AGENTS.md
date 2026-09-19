# AGENTS.md — 项目协作规范

> 本文件是 AI 智能体与人在本项目的协作契约。所有代码改动前，AI 必须先读本文件并遵守。

## 1. 项目概述

个人博客，用于分享大模型（LLM）开发学习心得与记录。

**协作模式（vibe coding）：** AI 负责写代码，用户担任「产品经理 + 验收员」角色。AI 应减少让用户硬啃代码，重点产出「计划 → 代码 → 验证 → 复盘」的完整过程。

## 2. 技术栈（已确定，禁止随意引入新依赖）

- 框架：Next.js（App Router）+ TypeScript + Tailwind CSS + shadcn/ui
- 数据库/认证/存储：Supabase（Postgres + Auth + Storage + RLS + pgvector）
- 数据访问：`supabase-js` 直查（**第一阶段不用 ORM**；后续用户主动要求再引入 Prisma）
- 部署：Vercel（连接 GitHub 自动部署）
- 评论：Giscus；搜索：Pagefind
- AI 能力（后期阶段）：Vercel AI SDK + DeepSeek / OpenRouter

## 3. 目录结构约定

遵循 Next.js App Router 默认结构。业务模块按功能分目录，不放巨型单文件。

## 4. 代码规范

- 使用 TypeScript 严格类型，避免 `any`
- 组件单一职责，命名清晰表意
- **不写冗余注释**，只在其逻辑非显而易见时才写
- 环境变量放 `.env.local`，**绝不提交**；示例放 `.env.example`
- 提交前确保 `npm run lint` 与 `npm run build` 通过

## 5. 数据库约定

- 建表用 Supabase **SQL Editor** 手写 SQL，不用代码迁移建表
- 表名/字段名用 `snake_case`
- **必须开启 RLS**：「公开内容匿名可读，写操作仅限已认证管理员」
- API Key / service_role key 只放服务端，绝不暴露到前端

## 6. 功能范围

v1 范围：文章 CRUD、分类/标签、Markdown 渲染、后台管理、评论（Giscus）。
后期再扩展：AI 文章摘要、标签生成、RAG 问答。

## 7. AI 协作流程（强制）

1. **计划先行**：任何非平凡改动，先输出实施计划（改哪些文件、为什么），等用户确认后再动手
2. **小步提交**：一次只做 1 个功能点，完成即运行验证
3. **验证**：每步完成后跑 lint/build；涉及数据的改动说明如何自测
4. **验收**：改动后用 `git diff` 展示，并用一句话解释每个改动的目的
5. **复盘**：功能完成时，用 3-5 行中文写决策记录（做了什么、为什么、踩了什么坑）
6. **报错处理**：遇到报错，把**原始错误信息**贴给用户，不要臆测乱改

## 8. 沟通语言

全程使用简体中文回复与文档。
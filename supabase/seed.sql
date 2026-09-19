-- 更新测试文章正文为丰富 Markdown，用于验证 react-markdown 渲染
update public.posts
set content = $$
# 欢迎来到我的博客

这是**第一篇**文章，从 Supabase 数据库读出来，用 react-markdown 渲染。

## 功能特性

- GitHub 风格 Markdown（remark-gfm）
- 表格、删除线、任务列表
- 代码块

### 代码示例

```js
const hello = (name) => `Hello, ${name}!`;
console.log(hello("世界"));
```

### 表格

| 技术 | 作用 |
|------|------|
| Next.js | 全栈框架 |
| Supabase | 后端 |

> 这是一段引用。
$$
where slug = 'first-post';
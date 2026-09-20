"use client";

import Giscus from "@giscus/react";
import { GISCUS_CONFIG } from "@/lib/giscus";

export function GiscusComments() {
  if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
    return null;
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-4 text-xl font-semibold">评论</h2>
      <Giscus
        repo={GISCUS_CONFIG.repo}
        repoId={GISCUS_CONFIG.repoId}
        category={GISCUS_CONFIG.category}
        categoryId={GISCUS_CONFIG.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
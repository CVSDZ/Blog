"use client";

import { useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { splitFrontmatter, type FrontmatterData } from "@/lib/markdown/frontmatter";
import { validateMarkdownFile } from "@/lib/markdown/validate";
import { normalizeTags } from "@/lib/tags";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MarkdownImportWarning = "encoding" | "frontmatter-invalid";

export type MarkdownUploadResult = {
  fileName: string;
  content: string;
  metadata: FrontmatterData;
  warnings: readonly MarkdownImportWarning[];
};

type UploadStatus = "idle" | "processing" | "success" | "error";

const REJECT_MESSAGES: Record<
  "unsupported-type" | "too-large" | "multiple",
  string
> = {
  "unsupported-type": "仅支持 .md 或 .markdown 文件",
  "too-large": "文件不能超过 1 MB",
  multiple: "一次仅支持上传 1 个文件",
};

function toWarningsMessages(warnings: readonly MarkdownImportWarning[]): string[] {
  const messages: string[] = [];
  if (warnings.includes("encoding")) {
    messages.push("文件可能不是 UTF-8 编码，请检查正文内容");
  }
  if (warnings.includes("frontmatter-invalid")) {
    messages.push("frontmatter 解析失败，已按纯正文导入");
  }
  return messages;
}

const emptySubscribe = () => () => {};

function getClientFileApiSupported(): boolean {
  return typeof FileReader === "function" && typeof File !== "undefined";
}

function getServerFileApiSupported(): boolean {
  return true;
}

export function MarkdownUploader({
  onImported,
  hasExistingContent,
}: {
  onImported: (result: MarkdownUploadResult) => void;
  hasExistingContent: () => boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  const supported = useSyncExternalStore(
    emptySubscribe,
    getClientFileApiSupported,
    getServerFileApiSupported
  );
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const resetMessages = () => {
    setStatus("idle");
    setMessage(null);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const picked = input.files ? Array.from(input.files) : [];
    input.value = "";

    if (processingRef.current) {
      console.info("[markdown-uploader] 处理中，忽略本次选择");
      return;
    }

    const validation = validateMarkdownFile(picked);

    if (!validation.ok) {
      if (validation.reason === "no-file") {
        return;
      }
      console.info("[markdown-uploader] 校验失败", validation.reason);
      setSelectedFileName(null);
      setStatus("error");
      setMessage(REJECT_MESSAGES[validation.reason]);
      return;
    }

    const file = validation.file;
    console.info("[markdown-uploader] 开始读取文件", file.name);
    setSelectedFileName(file.name);
    setStatus("processing");
    setMessage("正在读取并解析文件…");
    setProcessing(true);
    processingRef.current = true;

    const reader = new FileReader();

    reader.onerror = () => {
      console.info("[markdown-uploader] 文件读取失败");
      processingRef.current = false;
      setProcessing(false);
      setStatus("error");
      setMessage("文件读取失败，请重新选择");
    };

    reader.onload = () => {
      try {
        const raw = typeof reader.result === "string" ? reader.result : "";
        const warnings: MarkdownImportWarning[] = [];

        const parsed = splitFrontmatter(raw);
        if (parsed.status === "invalid") {
          warnings.push("frontmatter-invalid");
        }
        if (raw.includes("\uFFFD")) {
          warnings.push("encoding");
        }

        const content = parsed.status === "invalid" ? raw : parsed.content;

        if (content.trim().length === 0) {
          console.info("[markdown-uploader] 文件正文为空");
          processingRef.current = false;
          setProcessing(false);
          setSelectedFileName(null);
          setStatus("error");
          setMessage("文件正文为空");
          return;
        }

        if (hasExistingContent()) {
          const confirmed = window.confirm(
            "正文已有内容，是否用文件内容覆盖？"
          );
          if (!confirmed) {
            console.info("[markdown-uploader] 作者取消覆盖");
            processingRef.current = false;
            setProcessing(false);
            resetMessages();
            return;
          }
        }

        const metadata: FrontmatterData =
          parsed.status === "invalid" ? {} : { ...parsed.metadata };
        if (metadata.tags !== undefined) {
          metadata.tags = normalizeTags(metadata.tags);
        }

        console.info("[markdown-uploader] 解析完成，回调填充表单", file.name);
        onImported({ fileName: file.name, content, metadata, warnings });

        processingRef.current = false;
        setProcessing(false);
        setStatus("success");
        setMessage(["已从文件填充正文", ...toWarningsMessages(warnings)].join("；"));
      } catch {
        console.info("[markdown-uploader] 解析异常");
        processingRef.current = false;
        setProcessing(false);
        setStatus("error");
        setMessage("文件解析失败，请重新选择");
      }
    };

    reader.readAsText(file, "utf-8");
  };

  const handleRemove = () => {
    console.info("[markdown-uploader] 移除已选文件");
    setSelectedFileName(null);
    resetMessages();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">从 Markdown 文件导入</span>
          <span className="text-xs text-muted-foreground">
            支持 .md / .markdown，单个文件不超过 1 MB
          </span>
        </div>

        <label
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            !supported || processing ? "pointer-events-none opacity-50" : "cursor-pointer"
          )}
        >
          选择 .md 文件
          <input
            ref={inputRef}
            type="file"
            accept=".md,.markdown"
            className="sr-only"
            disabled={!supported || processing}
            onChange={handleChange}
          />
        </label>
      </div>

      {!supported ? (
        <p className="text-sm text-destructive">
          当前浏览器不支持文件上传，请手工粘贴正文
        </p>
      ) : null}

      {selectedFileName ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">已选文件：{selectedFileName}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 underline hover:text-foreground"
          >
            移除
          </button>
        </div>
      ) : null}

      {message ? (
        <p
          className={cn(
            "text-sm",
            status === "error" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
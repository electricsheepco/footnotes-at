"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Markdown } from "./Markdown";
import { FootnoteStatus } from "@prisma/client";

interface EditorProps {
  mode: "create" | "edit";
  footnote?: {
    id: string;
    title: string | null;
    body: string;
    status: FootnoteStatus;
    slug: string | null;
    tags: { tag: { name: string } }[];
  };
  authorHandle: string;
}

export function Editor({ mode, footnote, authorHandle }: EditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(footnote?.title || "");
  const [body, setBody] = useState(footnote?.body || "");
  const [tags, setTags] = useState(
    footnote?.tags.map((t) => t.tag.name).join(", ") || ""
  );

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [emailSubscribers, setEmailSubscribers] = useState(false);

  const status = footnote?.status || "DRAFT";
  const isPublished = status === "PUBLISHED";
  const isUnlisted = status === "UNLISTED";
  const isDraft = status === "DRAFT";

  async function save() {
    setError("");
    setSaving(true);

    try {
      const payload = {
        title: title.trim() || undefined,
        body: body.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t),
      };

      if (mode === "create") {
        const res = await fetch("/api/admin/footnotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
          router.push(`/admin/edit/${data.id}`);
          router.refresh();
        } else {
          setError(data.error || "Failed to create");
        }
      } else {
        const res = await fetch(`/api/admin/footnotes/${footnote!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
          router.refresh();
        } else {
          setError(data.error || "Failed to save");
        }
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (!footnote) return;

    setError("");
    setPublishing(true);

    try {
      // Save first
      const saveRes = await fetch(`/api/admin/footnotes/${footnote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          body: body.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t),
        }),
      });

      if (!saveRes.ok) {
        const data = await saveRes.json();
        setError(data.error || "Failed to save");
        return;
      }

      // Then publish
      const res = await fetch(`/api/admin/footnotes/${footnote.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          emailSubscribers,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowEmailOption(false);
        setEmailSubscribers(false);
        router.refresh();
      } else {
        setError(data.error || "Failed to publish");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setPublishing(false);
    }
  }

  async function unlist() {
    if (!footnote) return;

    setError("");

    try {
      const res = await fetch(`/api/admin/footnotes/${footnote.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlist" }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to unlist");
      }
    } catch {
      setError("Something went wrong");
    }
  }

  async function revertToDraft() {
    if (!footnote) return;

    setError("");

    try {
      const res = await fetch(`/api/admin/footnotes/${footnote.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft" }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to revert");
      }
    } catch {
      setError("Something went wrong");
    }
  }

  async function deleteFootnote() {
    if (!footnote) return;
    if (!confirm("Delete this footnote? This cannot be undone.")) return;

    setError("");

    try {
      const res = await fetch(`/api/admin/footnotes/${footnote.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete");
      }
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full font-medium bg-transparent border-0 border-b border-neutral-200 dark:border-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600 focus:outline-none pb-2 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
        />
      </div>

      {/* Body */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-neutral-500 dark:text-neutral-400">
            Body
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {showPreview ? (
          <div className="min-h-[300px] p-4 border border-neutral-200 dark:border-neutral-800 rounded">
            {body.trim() ? (
              <Markdown content={body} />
            ) : (
              <p className="text-neutral-400 dark:text-neutral-500 italic">
                Nothing to preview
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something..."
            rows={12}
            className="w-full p-4 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded focus:border-neutral-400 dark:focus:border-neutral-600 focus:outline-none resize-y font-mono text-sm placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm text-neutral-500 dark:text-neutral-400 block mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="notes, ideas, code"
          className="w-full px-3 py-2 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded focus:border-neutral-400 dark:focus:border-neutral-600 focus:outline-none text-sm placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
        />
      </div>

      {/* Status indicator */}
      {mode === "edit" && (
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              isPublished
                ? "bg-green-500"
                : isUnlisted
                  ? "bg-yellow-500"
                  : "bg-neutral-400"
            }`}
          />
          <span className="text-neutral-500 dark:text-neutral-400">
            {isPublished && "Published"}
            {isUnlisted && "Unlisted"}
            {isDraft && "Draft"}
            {isPublished && footnote?.slug && (
              <a
                href={`/@${authorHandle}/${footnote.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                View →
              </a>
            )}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Email option for publish */}
      {showEmailOption && (
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={emailSubscribers}
              onChange={(e) => setEmailSubscribers(e.target.checked)}
              className="rounded"
            />
            <span>Email this to subscribers</span>
          </label>
          <div className="mt-4 flex gap-2">
            <button
              onClick={publish}
              disabled={publishing}
              className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish"}
            </button>
            <button
              onClick={() => {
                setShowEmailOption(false);
                setEmailSubscribers(false);
              }}
              className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!showEmailOption && (
        <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={save}
            disabled={saving || !body.trim()}
            className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : mode === "create" ? "Save Draft" : "Save"}
          </button>

          {mode === "edit" && isDraft && (
            <button
              onClick={() => setShowEmailOption(true)}
              disabled={!body.trim()}
              className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors disabled:opacity-50"
            >
              Publish…
            </button>
          )}

          {mode === "edit" && isPublished && (
            <button
              onClick={unlist}
              className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Unlist
            </button>
          )}

          {mode === "edit" && isUnlisted && (
            <>
              <button
                onClick={() => setShowEmailOption(true)}
                className="px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors"
              >
                Republish…
              </button>
              <button
                onClick={revertToDraft}
                className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Revert to draft
              </button>
            </>
          )}

          {mode === "edit" && (
            <button
              onClick={deleteFootnote}
              className="ml-auto px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

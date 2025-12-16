"use client";

import { useState } from "react";

interface DogEarButtonProps {
  footnoteId: string;
  isDogEared: boolean;
  onDogEar: (footnoteId: string) => Promise<void>;
  onUndogEar: (footnoteId: string) => Promise<void>;
}

export function DogEarButton({
  footnoteId,
  isDogEared,
  onDogEar,
  onUndogEar,
}: DogEarButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      if (isDogEared) {
        await onUndogEar(footnoteId);
      } else {
        await onDogEar(footnoteId);
      }
    } catch (error) {
      console.error("Dog-ear error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
      onFocus={() => setShowLabel(true)}
      onBlur={() => setShowLabel(false)}
      disabled={loading}
      className="flex items-center gap-1.5 font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors disabled:opacity-50"
      aria-label={isDogEared ? "Remove dog-ear" : "Dog-ear this footnote"}
    >
      {/* Bootstrap Icons file-earmark style - page with folded corner */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="transition-colors"
      >
        {isDogEared ? (
          // Filled file-earmark (dog-eared state) - bi-file-earmark-fill
          <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z" />
        ) : (
          // Outline file-earmark (default state) - bi-file-earmark
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
        )}
      </svg>

      {/* Label on hover/focus */}
      <span
        className={`text-xs whitespace-nowrap transition-opacity duration-150 ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        {isDogEared ? "Dog-eared" : "Dog-ear"}
      </span>
    </button>
  );
}

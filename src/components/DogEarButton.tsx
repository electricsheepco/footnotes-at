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
      {/* Folded corner icon - like a page corner being folded */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="transition-colors"
      >
        {isDogEared ? (
          // Folded corner (dog-eared state) - triangle fold visible
          <>
            {/* Page background */}
            <path
              d="M2 1h14v16H2V1z"
              fill="currentColor"
              fillOpacity="0.05"
            />
            {/* Page border */}
            <path
              d="M2 1h14v16H2V1z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Folded corner - filled triangle */}
            <path
              d="M16 1v5h-5l5-5z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Fold crease line */}
            <path
              d="M11 6L16 1"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </>
        ) : (
          // Flat corner (default state) - just the corner outline
          <>
            {/* Page border */}
            <path
              d="M2 1h14v16H2V1z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Corner hint - subtle dashed line */}
            <path
              d="M11 1v5h5"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="2 2"
              fill="none"
            />
          </>
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

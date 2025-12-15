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

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      if (isDogEared) {
        await onUndogEar(footnoteId);
      } else {
        await onDogEar(footnoteId);
      }
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
      className="relative group flex items-center gap-1 font-ui text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors disabled:opacity-50"
      aria-label={isDogEared ? "Remove dog-ear" : "Dog-ear this footnote"}
    >
      {/* Folded corner icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-colors"
      >
        {isDogEared ? (
          // Folded corner (dog-eared state)
          <>
            <path
              d="M3 2h7l4 4v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 2v3a1 1 0 0 0 1 1h3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
              fillOpacity="0.3"
            />
          </>
        ) : (
          // Unfolded corner (default state)
          <path
            d="M3 2h10a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        )}
      </svg>

      {/* Label on hover/focus */}
      <span
        className={`text-xs transition-opacity ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        {isDogEared ? "Dog-eared" : "Dog-ear"}
      </span>
    </button>
  );
}

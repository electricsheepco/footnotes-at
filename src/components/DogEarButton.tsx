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
      {/* Folded corner icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-colors"
      >
        {isDogEared ? (
          // Filled folded corner (dog-eared state)
          <path
            d="M0 0h10l6 6v10H0V0z"
            fill="currentColor"
          />
        ) : (
          // Outline folded corner (default state)
          <path
            d="M1 1h8l5 5v8H1V1z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
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

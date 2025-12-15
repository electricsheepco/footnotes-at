"use client";

import { useEffect, useState, useCallback } from "react";

interface TextSelectionPopoverProps {
  containerRef: React.RefObject<HTMLElement | null>;
  onDogEar: (selectedText: string) => Promise<void>;
  disabled?: boolean;
}

interface PopoverPosition {
  x: number;
  y: number;
}

export function TextSelectionPopover({
  containerRef,
  onDogEar,
  disabled = false,
}: TextSelectionPopoverProps) {
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMouseUp = useCallback(() => {
    if (disabled) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setPosition(null);
      setSelectedText("");
      return;
    }

    // Check if selection is within the container
    const container = containerRef.current;
    if (!container) {
      setPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;

    // Check if selection is inside the container
    if (!container.contains(commonAncestor)) {
      setPosition(null);
      return;
    }

    // Get position for popover
    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setPosition({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top - 8,
    });
    setSelectedText(text);
  }, [containerRef, disabled]);

  const handleClick = useCallback((e: MouseEvent) => {
    // Close popover if clicking outside
    const target = e.target as HTMLElement;
    if (!target.closest("[data-dogear-popover]")) {
      // Small delay to allow the dog-ear button click to process
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setPosition(null);
          setSelectedText("");
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
    };
  }, [handleMouseUp, handleClick]);

  async function handleDogEar() {
    if (loading || !selectedText) return;
    setLoading(true);

    try {
      await onDogEar(selectedText);

      // Clear selection
      window.getSelection()?.removeAllRanges();
      setPosition(null);
      setSelectedText("");
    } finally {
      setLoading(false);
    }
  }

  if (!position) return null;

  return (
    <div
      data-dogear-popover
      className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={handleDogEar}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded shadow-lg hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 2h7l4 4v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M10 2v3a1 1 0 0 0 1 1h3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        Dog-ear
      </button>
      {/* Arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
    </div>
  );
}

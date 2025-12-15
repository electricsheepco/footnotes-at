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

    // Small delay to let selection finalize
    setTimeout(() => {
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
    }, 10);
  }, [containerRef, disabled]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("[data-dogear-popover]")) {
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
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleMouseUp, handleClickOutside]);

  async function handleDogEar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading || !selectedText) return;
    setLoading(true);

    try {
      await onDogEar(selectedText);

      // Clear selection
      window.getSelection()?.removeAllRanges();
      setPosition(null);
      setSelectedText("");
    } catch (error) {
      console.error("Dog-ear error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!position) return null;

  return (
    <div
      data-dogear-popover
      className="absolute z-50 transform -translate-x-1/2 -translate-y-full pointer-events-auto"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={handleDogEar}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium rounded shadow-lg hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors disabled:opacity-50"
      >
        {/* Folded corner icon */}
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
          <path
            d="M2 1h14v16H2V1z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M16 1v5h-5l5-5z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
        Dog-ear
      </button>
      {/* Arrow pointing down */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
    </div>
  );
}

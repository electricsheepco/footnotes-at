"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DogEarButton } from "./DogEarButton";
import { TextSelectionPopover } from "./TextSelectionPopover";

interface DogEarWrapperProps {
  footnoteId: string;
  initialDogEar?: { selectedText: string | null } | null;
  isLoggedIn: boolean;
  children: React.ReactNode;
}

export function DogEarWrapper({
  footnoteId,
  initialDogEar,
  isLoggedIn,
  children,
}: DogEarWrapperProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [dogEar, setDogEar] = useState(initialDogEar);
  const [isDogEared, setIsDogEared] = useState(!!initialDogEar);

  // Sync with initial state
  useEffect(() => {
    setDogEar(initialDogEar);
    setIsDogEared(!!initialDogEar);
  }, [initialDogEar]);

  const redirectToLogin = useCallback(() => {
    // Redirect to login with current page as the return destination
    const currentPath = window.location.pathname;
    router.push(`/login?next=${encodeURIComponent(currentPath)}`);
  }, [router]);

  const handleDogEar = useCallback(
    async (selectedText?: string) => {
      if (!isLoggedIn) {
        redirectToLogin();
        return;
      }

      const res = await fetch("/api/dogear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footnoteId, selectedText }),
      });

      if (res.ok) {
        const data = await res.json();
        setDogEar({ selectedText: data.dogEar.selectedText });
        setIsDogEared(true);
      }
    },
    [footnoteId, isLoggedIn, redirectToLogin]
  );

  const handleUndogEar = useCallback(async () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    const res = await fetch(`/api/dogear?footnoteId=${footnoteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setDogEar(null);
      setIsDogEared(false);
    }
  }, [footnoteId, isLoggedIn, redirectToLogin]);

  const handleDogEarWithSelection = useCallback(
    async (selectedText: string) => {
      await handleDogEar(selectedText);
    },
    [handleDogEar]
  );

  const handleDogEarWithoutSelection = useCallback(async () => {
    await handleDogEar();
  }, [handleDogEar]);

  return (
    <div className="relative">
      {/* Dog-ear button in top-right corner - always visible */}
      <div className="absolute top-0 right-0">
        <DogEarButton
          footnoteId={footnoteId}
          isDogEared={isDogEared}
          onDogEar={handleDogEarWithoutSelection}
          onUndogEar={handleUndogEar}
        />
      </div>

      {/* Content with selection handling and underline */}
      <div ref={contentRef} className="relative">
        {/* Render children with underline applied if there's selected text */}
        <DogEarContent selectedText={dogEar?.selectedText || null}>
          {children}
        </DogEarContent>

        {/* Text selection popover - always available, will redirect if not logged in */}
        <TextSelectionPopover
          containerRef={contentRef}
          onDogEar={handleDogEarWithSelection}
        />
      </div>
    </div>
  );
}

// Component to render content with private underline
function DogEarContent({
  selectedText,
  children,
}: {
  selectedText: string | null;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !selectedText) return;

    // Remove any existing underlines
    const existingMarks = containerRef.current.querySelectorAll(
      "[data-dogear-underline]"
    );
    existingMarks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(
          document.createTextNode(mark.textContent || ""),
          mark
        );
        parent.normalize();
      }
    });

    // Find and underline the selected text
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const text = node.textContent || "";
      const index = text.indexOf(selectedText);

      if (index !== -1) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + selectedText.length);

        const mark = document.createElement("span");
        mark.setAttribute("data-dogear-underline", "true");
        mark.className = "dogear-underline";

        range.surroundContents(mark);
        break; // Only one underline per footnote
      }
    }
  }, [selectedText]);

  return <div ref={containerRef}>{children}</div>;
}

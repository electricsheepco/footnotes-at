"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DogEarButton } from "./DogEarButton";

interface FootnoteCardDogEarProps {
  footnoteId: string;
  isLoggedIn: boolean;
  initialDogEared: boolean;
}

export function FootnoteCardDogEar({
  footnoteId,
  isLoggedIn,
  initialDogEared,
}: FootnoteCardDogEarProps) {
  const router = useRouter();
  const [isDogEared, setIsDogEared] = useState(initialDogEared);

  async function handleDogEar() {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      return;
    }

    const res = await fetch("/api/dogear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ footnoteId }),
    });

    if (res.ok) {
      setIsDogEared(true);
    }
  }

  async function handleUndogEar() {
    if (!isLoggedIn) {
      return;
    }

    const res = await fetch(`/api/dogear?footnoteId=${footnoteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setIsDogEared(false);
    }
  }

  return (
    <DogEarButton
      footnoteId={footnoteId}
      isDogEared={isDogEared}
      onDogEar={handleDogEar}
      onUndogEar={handleUndogEar}
    />
  );
}

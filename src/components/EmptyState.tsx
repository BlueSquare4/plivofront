// src/components/EmptyState.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EmptyState({
  message = "You have no items yet.",
  cta     = "Add your first service",
  href    = "/admin",
}: {
  message?: string;
  cta?: string;
  href?: string;
}) {
  const router = useRouter();
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <p className="mb-6">Get started by creating a new service.</p>
      <Button onClick={() => router.push(href)}>{cta}</Button>
    </div>
  );
}

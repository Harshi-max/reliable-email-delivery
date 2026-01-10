"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  fallback?: string;
  label?: string;
  forceRedirect?: boolean;
};

export default function BackButton({
  fallback = "/dashboard",
  label = "Back",
  forceRedirect = false,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (!forceRedirect && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

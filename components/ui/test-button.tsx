// Create a test file: /app/components/ui/test-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export default function TestButton() {
  return (
    <Button
      onClick={() => console.log("Clicked!")}
      className="fixed bottom-8 right-8 z-[9999] h-14 w-14 rounded-full p-0 shadow-2xl bg-red-600 text-white"
      aria-label="Test button"
    >
      <ArrowUp className="h-6 w-6" />
    </Button>
  )
}
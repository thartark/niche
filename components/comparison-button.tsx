"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"
import { useComparison } from "@/lib/comparison-store"

interface ComparisonButtonProps {
  watchId: number
}

export function ComparisonButton({ watchId }: ComparisonButtonProps) {
  const { addWatch, removeWatch, isInComparison } = useComparison()
  const inComparison = isInComparison(watchId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeWatch(watchId)
    } else {
      addWatch(watchId)
    }
  }

  return (
    <Button variant={inComparison ? "default" : "outline"} size="sm" onClick={handleToggle} className="gap-2">
      <Scale className="h-4 w-4" />
      {inComparison ? "In Comparison" : "Compare"}
    </Button>
  )
}

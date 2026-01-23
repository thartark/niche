"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Scale } from "lucide-react"
import { useComparison } from "@/lib/comparison-store"
import Link from "next/link"

export function ComparisonBar() {
  const { watchIds, removeWatch, clearAll } = useComparison()

  if (watchIds.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Comparing {watchIds.length} watches</span>
          </div>
          <div className="flex gap-2">
            {watchIds.map((id) => (
              <Badge key={id} variant="secondary" className="gap-1">
                Watch #{id}
                <button
                  type="button"
                  onClick={() => removeWatch(id)}
                  className="ml-1 rounded-full hover:bg-muted"
                  aria-label={`Remove watch ${id}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
          <Button asChild size="sm">
            <Link href="/compare">Compare Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface SaveWatchButtonProps {
  watchId: number
  initialSaved?: boolean
}

export function SaveWatchButton({ watchId, initialSaved = false }: SaveWatchButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)

    try {
      if (saved) {
        await fetch(`/api/user/saved-watches?watchId=${watchId}`, { method: "DELETE" })
        setSaved(false)
      } else {
        await fetch("/api/user/saved-watches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ watchId }),
        })
        setSaved(true)
      }
      router.refresh()
    } catch (error) {
      console.error("[v0] Error toggling save:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} disabled={loading} className="h-9 w-9">
      <Heart className={`h-5 w-5 ${saved ? "fill-destructive text-destructive" : ""}`} />
      <span className="sr-only">{saved ? "Remove from saved" : "Save watch"}</span>
    </Button>
  )
}

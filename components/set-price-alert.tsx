"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface SetPriceAlertProps {
  watchId: number
  currentPrice: number
  brand: string
  model: string
}

export function SetPriceAlert({ watchId, currentPrice, brand, model }: SetPriceAlertProps) {
  const [targetPrice, setTargetPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/user/price-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watchId,
          targetPrice: Number.parseFloat(targetPrice),
        }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setTargetPrice("")
        }, 3000)
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Error creating price alert:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Set Price Alert
        </CardTitle>
        <CardDescription>
          Get notified when similar {brand} {model} watches are listed at your target price
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-price">Target Price (USD)</Label>
            <Input
              id="target-price"
              type="number"
              placeholder={`e.g., ${Math.floor(currentPrice * 0.85)}`}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              min="0"
              step="100"
            />
            <p className="text-xs text-muted-foreground">Current price: ${currentPrice.toLocaleString()}</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || success}>
            {success ? "Alert Created!" : loading ? "Creating..." : "Create Alert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

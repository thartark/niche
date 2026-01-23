"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, TrendingDown, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface PriceAlertsProps {
  alerts: any[]
}

export function PriceAlerts({ alerts }: PriceAlertsProps) {
  const router = useRouter()

  const handleDelete = async (alertId: number) => {
    if (!confirm("Delete this price alert?")) return

    await fetch(`/api/user/price-alerts?alertId=${alertId}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Alerts</CardTitle>
        <CardDescription>Get notified when watches reach your target price</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <Bell className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No price alerts set</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const priceDiff = alert.current_price - alert.target_price
              const metTarget = priceDiff <= 0

              return (
                <div key={alert.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={alert.image_url || "/placeholder.svg"}
                      alt={`${alert.brand} ${alert.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {alert.brand} {alert.model} {alert.year}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Target: ${alert.target_price.toLocaleString()}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Current: ${alert.current_price.toLocaleString()}</span>
                      {metTarget ? (
                        <Badge variant="default" className="gap-1">
                          <TrendingDown className="h-3 w-3" />
                          Target Met!
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          (${Math.abs(priceDiff).toLocaleString()} to go)
                        </span>
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => handleDelete(alert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

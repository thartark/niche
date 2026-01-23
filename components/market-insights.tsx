import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Activity } from "lucide-react"
import { sql } from "@/lib/db"

interface MarketInsightsProps {
  brand: string
  model: string
  currentPrice: number
}

export async function MarketInsights({ brand, model, currentPrice }: MarketInsightsProps) {
  // Get similar watches for comparison
  const similarWatches = await sql`
    SELECT price, condition, year_manufactured
    FROM watches
    WHERE brand = ${brand} 
    AND model = ${model}
    AND status = 'available'
    AND id != (SELECT id FROM watches WHERE brand = ${brand} AND model = ${model} LIMIT 1)
    LIMIT 10
  `

  if (similarWatches.length === 0) {
    return null
  }

  const prices = similarWatches.map((w) => Number.parseFloat(w.price as any))
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const pricePosition = currentPrice < avgPrice * 0.9 ? "below" : currentPrice > avgPrice * 1.1 ? "above" : "at"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Insights</CardTitle>
        <CardDescription>
          Based on {similarWatches.length} similar {brand} {model} listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Average
            </div>
            <p className="text-lg font-semibold text-foreground">
              ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              Range
            </div>
            <p className="text-lg font-semibold text-foreground">
              ${minPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} - $
              {maxPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Position
            </div>
            <Badge
              variant={pricePosition === "below" ? "default" : pricePosition === "above" ? "destructive" : "secondary"}
            >
              {pricePosition === "below" ? "Good Deal" : pricePosition === "above" ? "Premium" : "Fair Price"}
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            This watch is priced <strong>{pricePosition}</strong> the market average.{" "}
            {pricePosition === "below" && "This could be a great opportunity for collectors."}
            {pricePosition === "above" && "This reflects the premium condition or rarity of this piece."}
            {pricePosition === "at" && "The price aligns with current market conditions."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

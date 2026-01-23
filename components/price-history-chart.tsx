"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PriceHistoryChartProps {
  watchId: number
  currentPrice: number
  history: Array<{
    price: number
    marketplace: string
    recorded_at: string
  }>
}

export function PriceHistoryChart({ currentPrice, history }: PriceHistoryChartProps) {
  if (!history || history.length === 0) {
    return null
  }

  // Format data for chart
  const chartData = history
    .map((entry) => ({
      date: new Date(entry.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Number.parseFloat(entry.price as any),
      marketplace: entry.marketplace,
    }))
    .reverse()

  // Calculate trend
  const firstPrice = chartData[0]?.price || currentPrice
  const lastPrice = chartData[chartData.length - 1]?.price || currentPrice
  const priceChange = lastPrice - firstPrice
  const percentChange = (priceChange / firstPrice) * 100

  let trendIcon
  let trendColor
  if (percentChange > 2) {
    trendIcon = <TrendingUp className="h-4 w-4" />
    trendColor = "text-green-600"
  } else if (percentChange < -2) {
    trendIcon = <TrendingDown className="h-4 w-4" />
    trendColor = "text-destructive"
  } else {
    trendIcon = <Minus className="h-4 w-4" />
    trendColor = "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Price History</CardTitle>
            <CardDescription>Market price trends over the last 6 months</CardDescription>
          </div>
          <Badge variant="outline" className={`gap-1 ${trendColor}`}>
            {trendIcon}
            {percentChange > 0 ? "+" : ""}
            {percentChange.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, "Price"]}
            />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Lowest Recorded</p>
            <p className="text-lg font-semibold text-foreground">
              ${Math.min(...chartData.map((d) => d.price)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Highest Recorded</p>
            <p className="text-lg font-semibold text-foreground">
              ${Math.max(...chartData.map((d) => d.price)).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

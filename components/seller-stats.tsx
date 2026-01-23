import { Card, CardContent } from "@/components/ui/card"
import { Star, TrendingUp, Calendar, Award } from "lucide-react"

interface SellerStatsProps {
  trustScore: number
  totalSales: number
  yearsActive: number
  averageRating: string
  reviewCount: number
}

export function SellerStats({ trustScore, totalSales, yearsActive, averageRating, reviewCount }: SellerStatsProps) {
  const getTrustScoreColor = (score: number) => {
    if (score >= 4.8) return "text-green-600"
    if (score >= 4.5) return "text-blue-600"
    if (score >= 4.0) return "text-yellow-600"
    return "text-orange-600"
  }

  const getTrustScoreBadge = (score: number) => {
    if (score >= 4.8) return "Exceptional"
    if (score >= 4.5) return "Outstanding"
    if (score >= 4.0) return "Excellent"
    return "Good"
  }

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Reputation Metrics</h3>

        <div className="space-y-4">
          {/* Trust Score */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>Trust Score</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{getTrustScoreBadge(trustScore)}</span>
            </div>
            <div className="mb-2 flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${getTrustScoreColor(trustScore)}`}>{trustScore.toFixed(2)}</span>
              <span className="text-muted-foreground">/ 5.00</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${
                  trustScore >= 4.8
                    ? "bg-green-600"
                    : trustScore >= 4.5
                      ? "bg-blue-600"
                      : trustScore >= 4.0
                        ? "bg-yellow-600"
                        : "bg-orange-600"
                }`}
                style={{ width: `${(trustScore / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Buyer Rating */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>Buyer Rating</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground">
                {averageRating !== "N/A" ? `${averageRating} / 5.0` : "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">{reviewCount} reviews</div>
            </div>
          </div>

          {/* Total Sales */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Sales</span>
            </div>
            <span className="font-semibold text-foreground">{totalSales}</span>
          </div>

          {/* Years Active */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Years Active</span>
            </div>
            <span className="font-semibold text-foreground">{yearsActive} years</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

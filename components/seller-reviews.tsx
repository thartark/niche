import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Transaction {
  id: number
  buyer_name: string | null
  sale_price: string
  sale_date: string
  buyer_rating: number | null
  buyer_review: string | null
}

interface SellerReviewsProps {
  transactions: Transaction[]
}

export function SellerReviews({ transactions }: SellerReviewsProps) {
  const reviewedTransactions = transactions.filter((t) => t.buyer_review)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
          />
        ))}
      </div>
    )
  }

  if (reviewedTransactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
        <p className="text-muted-foreground">No reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviewedTransactions.map((transaction) => (
        <Card key={transaction.id} className="border-border">
          <CardContent className="p-6">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  {transaction.buyer_rating && renderStars(transaction.buyer_rating)}
                  <span className="text-sm font-semibold text-foreground">{transaction.buyer_rating}/5</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {transaction.buyer_name || "Anonymous"} • {formatDate(transaction.sale_date)}
                </p>
              </div>
            </div>
            {transaction.buyer_review && (
              <p className="text-pretty leading-relaxed text-foreground">{transaction.buyer_review}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

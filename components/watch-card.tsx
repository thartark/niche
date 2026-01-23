import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, MapPin, CheckCircle2 } from "lucide-react"
import { ComparisonButton } from "@/components/comparison-button"

interface WatchCardProps {
  watch: {
    id: number
    brand: string
    model: string
    reference_number: string | null
    year_manufactured: number | null
    condition: string
    price: string
    images: string[]
    featured: boolean
    seller_name: string
    seller_verified: boolean
    seller_location: string
    trust_score: string
    has_box: boolean
    has_papers: boolean
  }
  saved?: boolean
}

export function WatchCard({ watch, saved = false }: WatchCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number.parseFloat(watch.price))

  return (
    <Card className="group overflow-hidden border-border transition-all hover:shadow-lg">
      <Link href={`/watches/${watch.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {watch.featured && (
            <Badge className="absolute left-3 top-3 z-10 bg-primary text-primary-foreground">Featured</Badge>
          )}
          <Image
            src={watch.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={`${watch.brand} ${watch.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {watch.brand} {watch.model}
              </h3>
              <p className="text-sm text-muted-foreground">
                {watch.reference_number && `Ref. ${watch.reference_number}`}
                {watch.reference_number && watch.year_manufactured && " • "}
                {watch.year_manufactured && watch.year_manufactured}
              </p>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {watch.condition.replace("_", " ")}
            </Badge>
            {watch.has_box && (
              <Badge variant="outline" className="text-xs">
                Box
              </Badge>
            )}
            {watch.has_papers && (
              <Badge variant="outline" className="text-xs">
                Papers
              </Badge>
            )}
          </div>

          <div className="mb-3 text-2xl font-bold text-foreground">{formattedPrice}</div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">{watch.seller_name}</span>
              {watch.seller_verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between border-t border-border p-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{watch.seller_location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-medium text-foreground">{Number.parseFloat(watch.trust_score).toFixed(2)}</span>
          </div>
        </div>
        <ComparisonButton watchId={watch.id} />
      </CardFooter>
    </Card>
  )
}

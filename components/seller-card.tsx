import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Star, TrendingUp, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface SellerCardProps {
  seller: {
    id: number
    name: string
    bio: string | null
    avatar_url: string | null
    trust_score: string
    verified: boolean
    location: string | null
    total_sales: number
    years_active: number
    specialties: string[]
  }
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Seller Information</h3>

      <div className="mb-4 flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
          <Image
            src={seller.avatar_url || "/placeholder.svg?height=48&width=48"}
            alt={seller.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{seller.name}</h4>
            {seller.verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
          {seller.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{seller.location}</span>
            </div>
          )}
        </div>
      </div>

      {seller.bio && <p className="mb-4 text-pretty text-sm leading-relaxed text-muted-foreground">{seller.bio}</p>}

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4" />
            <span>Trust Score</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{Number.parseFloat(seller.trust_score).toFixed(2)}</span>
            <span className="text-muted-foreground">/ 5.00</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Total Sales</span>
          </div>
          <span className="font-semibold text-foreground">{seller.total_sales}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Years Active</span>
          </div>
          <span className="font-semibold text-foreground">{seller.years_active}</span>
        </div>
      </div>

      {seller.specialties && seller.specialties.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {seller.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Link href={`/sellers/${seller.id}`}>
        <Button variant="outline" className="w-full bg-transparent">
          View Seller Profile
        </Button>
      </Link>
    </div>
  )
}

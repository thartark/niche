import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, MapPin, ShieldCheck } from "lucide-react"
import { WatchCard } from "@/components/watch-card"
import { SellerReviews } from "@/components/seller-reviews"
import { SellerStats } from "@/components/seller-stats"

export const dynamic = "force-dynamic"

async function getSeller(id: string) {
  try {
    const sellers = await sql`
      SELECT *
      FROM sellers
      WHERE id = ${id}
    `

    if (sellers.length === 0) return null

    const watches = await sql`
      SELECT 
        w.*,
        s.name as seller_name,
        s.trust_score,
        s.verified as seller_verified,
        s.location as seller_location
      FROM watches w
      JOIN sellers s ON w.seller_id = s.id
      WHERE w.seller_id = ${id} AND w.status = 'available'
      ORDER BY w.featured DESC, w.created_at DESC
    `

    const transactions = await sql`
      SELECT *
      FROM transactions
      WHERE seller_id = ${id} AND buyer_rating IS NOT NULL
      ORDER BY sale_date DESC
      LIMIT 10
    `

    return {
      ...sellers[0],
      watches,
      transactions,
    }
  } catch (error) {
    console.error("[v0] Error fetching seller:", error)
    return null
  }
}

export default async function SellerPage({ params }: { params: { id: string } }) {
  const seller = await getSeller(params.id)

  if (!seller) {
    notFound()
  }

  const averageRating =
    seller.transactions.length > 0
      ? (
          seller.transactions.reduce((sum: number, t: any) => sum + (t.buyer_rating || 0), 0) /
          seller.transactions.length
        ).toFixed(1)
      : "N/A"

  const reviewCount = seller.transactions.filter((t: any) => t.buyer_review).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">Horologica</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Discover
            </Link>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary">
              Sellers
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Sellers
          </a>
          <span>/</span>
          <span className="text-foreground">{seller.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Seller Profile */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Profile Card */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-border bg-muted">
                      <Image
                        src={seller.avatar_url || "/placeholder.svg?height=96&width=96"}
                        alt={seller.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="mb-4 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground">{seller.name}</h1>
                      {seller.verified && <CheckCircle2 className="h-6 w-6 text-primary" />}
                    </div>
                    {seller.location && (
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.location}</span>
                      </div>
                    )}
                  </div>

                  {seller.verified && (
                    <div className="mb-4 rounded-lg bg-primary/10 p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Verified Seller</span>
                      </div>
                    </div>
                  )}

                  {seller.bio && (
                    <p className="mb-4 text-pretty text-sm leading-relaxed text-muted-foreground">{seller.bio}</p>
                  )}

                  {seller.specialties && seller.specialties.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {seller.specialties.map((specialty: string) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full">Contact Seller</Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <SellerStats
                trustScore={Number.parseFloat(seller.trust_score)}
                totalSales={seller.total_sales}
                yearsActive={seller.years_active}
                averageRating={averageRating}
                reviewCount={reviewCount}
              />
            </div>
          </div>

          {/* Right Column - Listings & Reviews */}
          <div className="lg:col-span-2">
            {/* Active Listings */}
            <section className="mb-12">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Active Listings</h2>
                  <p className="text-sm text-muted-foreground">
                    {seller.watches.length} {seller.watches.length === 1 ? "watch" : "watches"} available
                  </p>
                </div>
              </div>

              {seller.watches.length === 0 ? (
                <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
                  <p className="text-muted-foreground">No active listings at the moment.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {seller.watches.map((watch: any) => (
                    <WatchCard key={watch.id} watch={watch} />
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">Buyer Reviews</h2>
                <p className="text-sm text-muted-foreground">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"} from verified buyers
                </p>
              </div>

              <SellerReviews transactions={seller.transactions} />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { WatchGallery } from "@/components/watch-gallery"
import { WatchSpecs } from "@/components/watch-specs"
import { ProvenanceTimeline } from "@/components/provenance-timeline"
import { SellerCard } from "@/components/seller-card"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { MarketInsights } from "@/components/market-insights"
import { SetPriceAlert } from "@/components/set-price-alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { getUserSession } from "@/lib/auth"
import { HeaderNav } from "@/components/header-nav"

export const dynamic = "force-dynamic"

async function getWatch(id: string) {
  try {
    const watches = await sql`
      SELECT 
        w.*,
        s.id as seller_id,
        s.name as seller_name,
        s.bio as seller_bio,
        s.avatar_url as seller_avatar,
        s.trust_score,
        s.verified as seller_verified,
        s.location as seller_location,
        s.total_sales,
        s.years_active,
        s.specialties
      FROM watches w
      JOIN sellers s ON w.seller_id = s.id
      WHERE w.id = ${id}
    `

    if (watches.length === 0) return null

    const [provenanceRecords, priceHistory] = await Promise.all([
      sql`
        SELECT *
        FROM provenance_records
        WHERE watch_id = ${id}
        ORDER BY event_date DESC, created_at DESC
      `,
      sql`
        SELECT price, marketplace, recorded_at
        FROM price_history
        WHERE watch_id = ${id}
        ORDER BY recorded_at ASC
      `,
    ])

    return {
      ...watches[0],
      provenance: provenanceRecords,
      priceHistory,
    }
  } catch (error) {
    console.error("[v0] Error fetching watch:", error)
    return null
  }
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  const watch = await getWatch(params.id)
  const user = await getUserSession()

  if (!watch) {
    notFound()
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(Number.parseFloat(watch.price))

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">{watch.brand}</span>
          <span>/</span>
          <span className="text-foreground">{watch.model}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Images & Specs */}
          <div className="lg:col-span-2">
            <WatchGallery images={watch.images} brand={watch.brand} model={watch.model} />

            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">Description</h2>
              <p className="text-pretty leading-relaxed text-foreground">{watch.description}</p>
            </div>

            <div className="mt-8">
              <WatchSpecs watch={watch} />
            </div>

            <div className="mt-8">
              <PriceHistoryChart
                watchId={watch.id}
                currentPrice={Number.parseFloat(watch.price)}
                history={watch.priceHistory}
              />
            </div>

            <div className="mt-8">
              <MarketInsights brand={watch.brand} model={watch.model} currentPrice={Number.parseFloat(watch.price)} />
            </div>

            <div className="mt-8">
              <ProvenanceTimeline records={watch.provenance} />
            </div>
          </div>

          {/* Right Column - Purchase Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Price Card */}
              <div className="rounded-lg border border-border bg-card p-6">
                {watch.featured && <Badge className="mb-4 bg-primary text-primary-foreground">Featured</Badge>}

                <div className="mb-4">
                  <h1 className="mb-2 text-balance text-3xl font-bold text-foreground">
                    {watch.brand} {watch.model}
                  </h1>
                  {watch.reference_number && (
                    <p className="text-sm text-muted-foreground">Ref. {watch.reference_number}</p>
                  )}
                </div>

                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">{formattedPrice}</span>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {watch.condition.replace("_", " ")}
                  </Badge>
                  {watch.has_box && <Badge variant="outline">Box</Badge>}
                  {watch.has_papers && <Badge variant="outline">Papers</Badge>}
                  {watch.year_manufactured && <Badge variant="outline">{watch.year_manufactured}</Badge>}
                </div>

                <Button className="mb-4 w-full" size="lg">
                  Contact Seller
                </Button>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Authenticity verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Secure transaction</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Fast shipping available</span>
                  </div>
                </div>
              </div>

              {user && (
                <SetPriceAlert
                  watchId={watch.id}
                  currentPrice={Number.parseFloat(watch.price)}
                  brand={watch.brand}
                  model={watch.model}
                />
              )}

              {/* Seller Card */}
              <SellerCard
                seller={{
                  id: watch.seller_id,
                  name: watch.seller_name,
                  bio: watch.seller_bio,
                  avatar_url: watch.seller_avatar,
                  trust_score: watch.trust_score,
                  verified: watch.seller_verified,
                  location: watch.seller_location,
                  total_sales: watch.total_sales,
                  years_active: watch.years_active,
                  specialties: watch.specialties,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

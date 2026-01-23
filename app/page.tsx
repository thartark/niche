import { sql } from "@/lib/db"
import { WatchCard } from "@/components/watch-card"
import { DiscoveryFeed } from "@/components/discovery-feed"
import { getUserSession } from "@/lib/auth"
import { HeaderNav } from "@/components/header-nav"

export const dynamic = "force-dynamic"

async function getFeaturedWatches() {
  try {
    const watches = await sql`
      SELECT 
        w.*,
        s.name as seller_name,
        s.trust_score,
        s.verified as seller_verified,
        s.location as seller_location
      FROM watches w
      JOIN sellers s ON w.seller_id = s.id
      WHERE w.status = 'available' AND w.featured = true
      ORDER BY w.created_at DESC
      LIMIT 6
    `
    return watches
  } catch (error) {
    console.error("[v0] Error fetching featured watches:", error)
    return []
  }
}

export default async function HomePage() {
  const featuredWatches = await getFeaturedWatches()
  const user = await getUserSession()

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav user={user} />

      {/* Hero Section */}
      <section className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            The Living Archive of Vintage Watches
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Every watch has a story. Discover curated vintage timepieces with verified provenance, trusted sellers, and
            expert authentication.
          </p>
        </div>
      </section>

      {/* Featured Section */}
      {featuredWatches.length > 0 && (
        <section className="border-b border-border py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Featured Timepieces</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredWatches.map((watch: any) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Discovery Feed */}
      <DiscoveryFeed />
    </div>
  )
}

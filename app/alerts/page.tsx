import { getUserSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { HeaderNav } from "@/components/header-nav"
import { SavedSearches } from "@/components/saved-searches"
import { PriceAlerts } from "@/components/price-alerts"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getUserAlerts(userId: number) {
  const [savedSearches, priceAlerts] = await Promise.all([
    sql`
      SELECT * FROM saved_searches
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `,
    sql`
      SELECT 
        pa.*,
        w.brand,
        w.model,
        w.year,
        w.price as current_price,
        w.image_url
      FROM price_alerts pa
      JOIN watches w ON pa.watch_id = w.id
      WHERE pa.user_id = ${userId}
      ORDER BY pa.created_at DESC
    `,
  ])

  return { savedSearches, priceAlerts }
}

export default async function AlertsPage() {
  const user = await getUserSession()

  if (!user) {
    redirect("/")
  }

  const { savedSearches, priceAlerts } = await getUserAlerts(user.id)

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Alerts & Saved Searches</h1>
          <p className="mt-2 text-muted-foreground">Manage your price alerts and saved search queries</p>
        </div>

        <div className="space-y-8">
          <SavedSearches searches={savedSearches} />
          <PriceAlerts alerts={priceAlerts} />
        </div>
      </main>
    </div>
  )
}

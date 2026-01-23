import { getUserSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { WatchCard } from "@/components/watch-card"
import { HeaderNav } from "@/components/header-nav"
import { redirect } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

async function getSavedWatches(userId: number) {
  const watches = await sql`
    SELECT 
      w.*,
      s.name as seller_name,
      s.trust_score,
      s.verified as seller_verified,
      s.location as seller_location,
      sw.saved_at,
      sw.notes
    FROM saved_watches sw
    JOIN watches w ON sw.watch_id = w.id
    JOIN sellers s ON w.seller_id = s.id
    WHERE sw.user_id = ${userId}
    ORDER BY sw.saved_at DESC
  `
  return watches
}

export default async function SavedWatchesPage() {
  const user = await getUserSession()

  if (!user) {
    redirect("/")
  }

  const savedWatches = await getSavedWatches(user.id)

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Saved Watches</h1>
          <p className="mt-2 text-muted-foreground">
            {savedWatches.length} {savedWatches.length === 1 ? "watch" : "watches"} in your collection
          </p>
        </div>

        {savedWatches.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">No saved watches yet</h2>
            <p className="mb-6 text-muted-foreground">Start building your collection by saving watches you love</p>
            <Button asChild>
              <a href="/">Discover Watches</a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedWatches.map((watch: any) => (
              <WatchCard key={watch.id} watch={watch} saved={true} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

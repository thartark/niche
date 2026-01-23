import { getUserSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { HeaderNav } from "@/components/header-nav"
import { ComparisonTable } from "@/components/comparison-table"
import { redirect } from "next/navigation"
import { Scale } from "lucide-react"

export const dynamic = "force-dynamic"

async function getWatchesForComparison(ids: string) {
  const watchIds = ids.split(",").map((id) => Number.parseInt(id, 10))

  const watches = await sql`
    SELECT 
      w.*,
      s.name as seller_name,
      s.trust_score,
      s.verified as seller_verified,
      s.location as seller_location
    FROM watches w
    JOIN sellers s ON w.seller_id = s.id
    WHERE w.id = ANY(${watchIds})
  `

  return watches
}

export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const user = await getUserSession()

  if (!searchParams.ids) {
    redirect("/")
  }

  const watches = await getWatchesForComparison(searchParams.ids)

  if (watches.length === 0) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Watch Comparison</h1>
              <p className="mt-1 text-muted-foreground">Compare {watches.length} watches side by side</p>
            </div>
          </div>
        </div>

        <ComparisonTable watches={watches} />
      </main>
    </div>
  )
}

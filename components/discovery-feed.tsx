"use client"

import { useState, useEffect } from "react"
import { WatchCard } from "@/components/watch-card"
import { DiscoveryFilters } from "@/components/discovery-filters"
import { Spinner } from "@/components/ui/spinner"

export function DiscoveryFeed() {
  const [watches, setWatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    async function fetchWatches() {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        if ("brand" in filters && filters.brand && filters.brand !== "all") {
          params.append("brand", filters.brand)
        }
        if ("minPrice" in filters && filters.minPrice) {
          params.append("minPrice", filters.minPrice)
        }
        if ("maxPrice" in filters && filters.maxPrice) {
          params.append("maxPrice", filters.maxPrice)
        }
        if ("featured" in filters && filters.featured) {
          params.append("featured", "true")
        }

        const response = await fetch(`/api/watches?${params.toString()}`)
        const data = await response.json()
        setWatches(data)
      } catch (error) {
        console.error("[v0] Error fetching watches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWatches()
  }, [filters])

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <DiscoveryFilters onFilterChange={setFilters} />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Watches</h2>
              <p className="text-sm text-muted-foreground">
                {watches.length} {watches.length === 1 ? "timepiece" : "timepieces"} available
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <Spinner className="h-8 w-8" />
              </div>
            ) : watches.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No watches found matching your filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {watches.map((watch: any) => (
                  <WatchCard key={watch.id} watch={watch} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface SavedSearchesProps {
  searches: any[]
}

export function SavedSearches({ searches }: SavedSearchesProps) {
  const router = useRouter()

  const handleDelete = async (searchId: number) => {
    if (!confirm("Delete this saved search?")) return

    await fetch(`/api/user/saved-searches?searchId=${searchId}`, { method: "DELETE" })
    router.refresh()
  }

  const handleExecute = (queryParams: any) => {
    const params = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      params.set(key, String(value))
    })
    router.push(`/?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Searches</CardTitle>
        <CardDescription>Quick access to your favorite search queries</CardDescription>
      </CardHeader>
      <CardContent>
        {searches.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <Search className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No saved searches yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {searches.map((search) => (
              <div key={search.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{search.name}</h3>
                    {search.notify_on_new && (
                      <Badge variant="secondary" className="gap-1">
                        <Bell className="h-3 w-3" />
                        Alerts ON
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(search.query_params).map(([key, value]) => (
                      <Badge key={key} variant="outline">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExecute(search.query_params)}>
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(search.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

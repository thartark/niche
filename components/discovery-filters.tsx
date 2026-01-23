"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

interface DiscoveryFiltersProps {
  onFilterChange: (filters: {
    brand?: string
    minPrice?: string
    maxPrice?: string
    featured?: boolean
  }) => void
}

export function DiscoveryFilters({ onFilterChange }: DiscoveryFiltersProps) {
  const [brand, setBrand] = useState<string>("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [showFeatured, setShowFeatured] = useState<boolean>(false)

  const handleApplyFilters = () => {
    onFilterChange({
      brand: brand || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      featured: showFeatured,
    })
  }

  const handleReset = () => {
    setBrand("")
    setMinPrice("")
    setMaxPrice("")
    setShowFeatured(false)
    onFilterChange({})
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Filters</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium text-foreground">
            Brand
          </Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger id="brand">
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              <SelectItem value="Rolex">Rolex</SelectItem>
              <SelectItem value="Patek Philippe">Patek Philippe</SelectItem>
              <SelectItem value="Omega">Omega</SelectItem>
              <SelectItem value="Audemars Piguet">Audemars Piguet</SelectItem>
              <SelectItem value="Cartier">Cartier</SelectItem>
              <SelectItem value="Grand Seiko">Grand Seiko</SelectItem>
              <SelectItem value="Seiko">Seiko</SelectItem>
              <SelectItem value="Tudor">Tudor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex-1"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={showFeatured}
            onChange={(e) => setShowFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="featured" className="text-sm font-medium text-foreground">
            Featured only
          </Label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, X, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface ComparisonTableProps {
  watches: any[]
}

export function ComparisonTable({ watches }: ComparisonTableProps) {
  const router = useRouter()

  const handleRemove = (id: number) => {
    const remainingIds = watches.filter((w) => w.id !== id).map((w) => w.id)
    if (remainingIds.length === 0) {
      router.push("/")
    } else {
      router.push(`/compare?ids=${remainingIds.join(",")}`)
    }
  }

  const rows = [
    {
      label: "Image",
      render: (watch: any) => (
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <Image src={watch.images[0] || "/placeholder.svg"} alt={watch.brand} fill className="object-cover" />
        </div>
      ),
    },
    {
      label: "Model",
      render: (watch: any) => (
        <div>
          <p className="font-semibold text-foreground">
            {watch.brand} {watch.model}
          </p>
          {watch.reference_number && <p className="text-sm text-muted-foreground">Ref. {watch.reference_number}</p>}
        </div>
      ),
    },
    {
      label: "Price",
      render: (watch: any) => (
        <p className="text-2xl font-bold text-foreground">
          $
          {Number.parseFloat(watch.price).toLocaleString(undefined, {
            minimumFractionDigits: 0,
          })}
        </p>
      ),
    },
    {
      label: "Condition",
      render: (watch: any) => (
        <Badge variant="secondary" className="capitalize">
          {watch.condition.replace("_", " ")}
        </Badge>
      ),
    },
    {
      label: "Year",
      render: (watch: any) => <span className="text-foreground">{watch.year_manufactured || "N/A"}</span>,
    },
    {
      label: "Case Size",
      render: (watch: any) => <span className="text-foreground">{watch.case_size_mm}mm</span>,
    },
    {
      label: "Movement",
      render: (watch: any) => <span className="text-foreground capitalize">{watch.movement_type}</span>,
    },
    {
      label: "Case Material",
      render: (watch: any) => <span className="text-foreground capitalize">{watch.case_material}</span>,
    },
    {
      label: "Box & Papers",
      render: (watch: any) => (
        <div className="flex gap-2">
          {watch.has_box && <Badge variant="outline">Box</Badge>}
          {watch.has_papers && <Badge variant="outline">Papers</Badge>}
          {!watch.has_box && !watch.has_papers && <span className="text-sm text-muted-foreground">None</span>}
        </div>
      ),
    },
    {
      label: "Seller",
      render: (watch: any) => (
        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{watch.seller_name}</span>
            {watch.seller_verified && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{Number.parseFloat(watch.trust_score).toFixed(2)}</span>
          </div>
        </div>
      ),
    },
    {
      label: "Location",
      render: (watch: any) => <span className="text-sm text-muted-foreground">{watch.seller_location}</span>,
    },
    {
      label: "Actions",
      render: (watch: any) => (
        <div className="flex flex-col gap-2">
          <Button asChild size="sm" className="w-full">
            <Link href={`/watches/${watch.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => handleRemove(watch.id)}>
            <X className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="overflow-x-auto">
      <Card className="min-w-[800px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="p-4 text-left font-semibold text-foreground">Specification</th>
              {watches.map((watch) => (
                <th key={watch.id} className="w-64 p-4 text-center font-semibold text-foreground">
                  Watch #{watch.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={index !== rows.length - 1 ? "border-b border-border" : ""}>
                <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                {watches.map((watch) => (
                  <td key={watch.id} className="p-4 text-center">
                    {row.render(watch)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    const conditions: string[] = ["w.status = 'available'"]

    if (featured === "true") {
      conditions.push("w.featured = true")
    }

    if (brand) {
      conditions.push(`LOWER(w.brand) = LOWER('${brand.replace(/'/g, "''")}')`)
    }

    if (minPrice) {
      conditions.push(`w.price >= ${Number.parseFloat(minPrice)}`)
    }

    if (maxPrice) {
      conditions.push(`w.price <= ${Number.parseFloat(maxPrice)}`)
    }

    const whereClause = conditions.join(" AND ")

    const watches = await sql`
      SELECT 
        w.*,
        s.name as seller_name,
        s.trust_score,
        s.verified as seller_verified,
        s.location as seller_location
      FROM watches w
      JOIN sellers s ON w.seller_id = s.id
      WHERE ${sql.unsafe(whereClause)}
      ORDER BY w.featured DESC, w.created_at DESC
    `

    return NextResponse.json(watches)
  } catch (error) {
    console.error("[v0] Error fetching watches:", error)
    return NextResponse.json({ error: "Failed to fetch watches" }, { status: 500 })
  }
}

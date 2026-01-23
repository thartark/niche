import { type NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const alerts = await sql`
    SELECT 
      pa.*,
      w.brand,
      w.model,
      w.year,
      w.price as current_price,
      w.image_url
    FROM price_alerts pa
    JOIN watches w ON pa.watch_id = w.id
    WHERE pa.user_id = ${user.id}
    ORDER BY pa.created_at DESC
  `

  return NextResponse.json({ alerts })
}

export async function POST(request: NextRequest) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { watchId, targetPrice, condition } = await request.json()

  try {
    const result = await sql`
      INSERT INTO price_alerts (user_id, watch_id, target_price, condition)
      VALUES (${user.id}, ${watchId}, ${targetPrice}, ${condition || null})
      RETURNING *
    `

    return NextResponse.json({ alert: result[0] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const alertId = searchParams.get("alertId")

  if (!alertId) {
    return NextResponse.json({ error: "Missing alertId" }, { status: 400 })
  }

  await sql`
    DELETE FROM price_alerts
    WHERE user_id = ${user.id} AND id = ${alertId}
  `

  return NextResponse.json({ success: true })
}

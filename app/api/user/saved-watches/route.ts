import { type NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const savedWatches = await sql`
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
    WHERE sw.user_id = ${user.id}
    ORDER BY sw.saved_at DESC
  `

  return NextResponse.json({ watches: savedWatches })
}

export async function POST(request: NextRequest) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { watchId, notes } = await request.json()

  try {
    await sql`
      INSERT INTO saved_watches (user_id, watch_id, notes)
      VALUES (${user.id}, ${watchId}, ${notes || null})
      ON CONFLICT (user_id, watch_id) DO UPDATE SET notes = ${notes || null}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save watch" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const watchId = searchParams.get("watchId")

  if (!watchId) {
    return NextResponse.json({ error: "Missing watchId" }, { status: 400 })
  }

  await sql`
    DELETE FROM saved_watches
    WHERE user_id = ${user.id} AND watch_id = ${watchId}
  `

  return NextResponse.json({ success: true })
}

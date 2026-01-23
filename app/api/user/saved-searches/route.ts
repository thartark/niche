import { type NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const savedSearches = await sql`
    SELECT *
    FROM saved_searches
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `

  return NextResponse.json({ searches: savedSearches })
}

export async function POST(request: NextRequest) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, queryParams, notifyOnNew } = await request.json()

  try {
    const result = await sql`
      INSERT INTO saved_searches (user_id, name, query_params, notify_on_new)
      VALUES (${user.id}, ${name}, ${JSON.stringify(queryParams)}, ${notifyOnNew || false})
      RETURNING *
    `

    return NextResponse.json({ search: result[0] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const searchId = searchParams.get("searchId")

  if (!searchId) {
    return NextResponse.json({ error: "Missing searchId" }, { status: 400 })
  }

  await sql`
    DELETE FROM saved_searches
    WHERE user_id = ${user.id} AND id = ${searchId}
  `

  return NextResponse.json({ success: true })
}

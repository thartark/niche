import { type NextRequest, NextResponse } from "next/server"
import { createUser, setUserSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Basic validation
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const user = await createUser(email, password, name)
    await setUserSession(user)

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}

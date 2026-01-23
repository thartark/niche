import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, setUserSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await setUserSession(user)

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}

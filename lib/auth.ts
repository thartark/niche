import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  email: string
  name: string
  avatar_url: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name: string) {
  const passwordHash = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name, avatar_url
  `

  return result[0] as User
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, password_hash, name, avatar_url
    FROM users
    WHERE email = ${email}
  `

  if (result.length === 0) return null

  const user = result[0]
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
  }
}

export async function setUserSession(user: User) {
  const cookieStore = await cookies()
  // In production, use proper session tokens stored in database
  cookieStore.set("user_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getUserSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("user_session")

  if (!session) return null

  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
}

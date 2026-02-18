import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import Database from 'better-sqlite3'
import { jwtVerify, SignJWT } from 'jose'

const sql = new Database('local.db')
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

// Initialize users table if it doesn't exist
sql.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const stmt = sql.prepare(`
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
    RETURNING id, email, name
  `)
  
  return stmt.get(email, hashedPassword, name)
}

export async function verifyUser(email: string, password: string) {
  const stmt = sql.prepare('SELECT * FROM users WHERE email = ?')
  const user = stmt.get(email)
  
  if (!user) return null
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null
  
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(id: number) {
  const stmt = sql.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?')
  return stmt.get(id)
}

// Add these new functions for session handling
export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  
  return token
}

export async function getSession() {
  const token = cookies().get('session')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function getUserSession() {
  const session = await getSession()
  if (!session?.userId) return null
  
  return getUserById(Number(session.userId))
}

export async function logout() {
  cookies().delete('session')
}

node -e '
const Database = require("better-sqlite3");
const db = new Database("./data/watches.db");

console.log("🔄 Setting up database...");

// Drop existing tables to start fresh
db.exec("DROP TABLE IF EXISTS watches");
db.exec("DROP TABLE IF EXISTS users");
console.log("✅ Dropped existing tables");

// Create users table
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    business_name TEXT,
    description TEXT,
    logo_url TEXT,
    rating REAL DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log("✅ users table created");

// Create watches table
db.exec(`
  CREATE TABLE watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    reference_number TEXT,
    year INTEGER,
    condition TEXT,
    price REAL NOT NULL,
    currency TEXT DEFAULT "USD",
    description TEXT,
    images TEXT,
    features TEXT,
    is_featured BOOLEAN DEFAULT 0,
    is_sold BOOLEAN DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
  )
`);
console.log("✅ watches table created");

// Add demo user
const insertUser = db.prepare(`
  INSERT INTO users (name, email, password, business_name, description, is_verified, rating)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const result = insertUser.run(
  "Timepiece Emporium",
  "demo@example.com",
  "$2b$10$demo.hashed.password",
  "Timepiece Emporium",
  "Premium vintage and modern timepieces",
  1,
  4.8
);
console.log("✅ Demo user added with ID:", result.lastInsertRowid);

// Add sample watches
const insertWatch = db.prepare(`
  INSERT INTO watches (seller_id, brand, model, price, condition, image_url, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const watches = [
  [result.lastInsertRowid, "Rolex", "Submariner", 8500, "Excellent", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800", 1],
  [result.lastInsertRowid, "Omega", "Speedmaster", 5200, "Very Good", "https://images.unsplash.com/photo-1614164185128-5cbdaf202e2a?w=800", 1],
  [result.lastInsertRowid, "Tag Heuer", "Carrera", 3800, "Good", "https://images.unsplash.com/photo-1619810237008-ec82ebcfbc2d?w=800", 0],
];

watches.forEach(watch => {
  insertWatch.run(...watch);
});
console.log("✅ Sample watches added");

// Verify
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("📊 Tables now:", tables.map(t => t.name).join(", "));

const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
const watchCount = db.prepare("SELECT COUNT(*) as count FROM watches").get();
console.log(`📊 Records: ${userCount.count} users, ${watchCount.count} watches`);

db.close();
'
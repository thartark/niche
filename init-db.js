// init-db.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the database directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'watches.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    rating REAL DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    reference_number TEXT,
    price REAL NOT NULL,
    condition TEXT,
    year INTEGER,
    description TEXT,
    images TEXT,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers (id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    watch_id INTEGER,
    status TEXT DEFAULT 'pending',
    total_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (watch_id) REFERENCES watches (id)
  );
`);

// Insert sample data
const insertSampleData = db.prepare(`
  INSERT INTO sellers (name, email, rating, total_sales) 
  VALUES (?, ?, ?, ?)
`);

const sellers = [
  ['Timepiece Gallery', 'contact@timepiece.com', 4.8, 125],
  ['Luxury Watches NYC', 'info@luxurywatchesnyc.com', 4.9, 342],
  ['Vintage Watch Co', 'sales@vintagewatchco.com', 4.7, 89]
];

for (const seller of sellers) {
  try {
    insertSampleData.run(...seller);
  } catch (error) {
    console.log('Seller might already exist:', error.message);
  }
}

console.log('Database initialized successfully!');
console.log(`Database location: ${dbPath}`);
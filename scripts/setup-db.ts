import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Ensure the data directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to the database (creates it if it doesn't exist)
const db = new Database(path.join(dbDir, 'watches.db'));

console.log('📦 Setting up database...');

// Create sellers table
db.exec(`
  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
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

console.log('✅ sellers table created');

// Create watches table
db.exec(`
  CREATE TABLE IF NOT EXISTS watches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    reference_number TEXT,
    year INTEGER,
    condition TEXT,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    description TEXT,
    images TEXT,
    features TEXT,
    is_featured BOOLEAN DEFAULT 0,
    is_sold BOOLEAN DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
  )
`);

console.log('✅ watches table created');

// Insert a sample seller
const sellerCount = db.prepare('SELECT COUNT(*) as count FROM sellers').get() as { count: number };

if (sellerCount.count === 0) {
  console.log('📝 Adding sample seller...');
  
  const insertSeller = db.prepare(`
    INSERT INTO sellers (name, email, business_name, description, is_verified, rating)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  insertSeller.run(
    'Timepiece Emporium',
    'sales@timepiece.com',
    'Timepiece Emporium',
    'Premium vintage and modern timepieces',
    1,
    4.8
  );
  
  console.log('✅ Sample seller added');
}

console.log('🎉 Database setup complete!');
db.close();

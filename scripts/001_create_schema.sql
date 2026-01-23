-- Create sellers table for reputation system
CREATE TABLE sellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  location VARCHAR(255),
  trust_score DECIMAL(3, 2) DEFAULT 0.00 CHECK (trust_score >= 0 AND trust_score <= 5),
  total_sales INTEGER DEFAULT 0,
  years_active INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create watches table for digital twin/object pages
CREATE TABLE watches (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  reference_number VARCHAR(100),
  year_manufactured INTEGER,
  condition VARCHAR(50) CHECK (condition IN ('mint', 'excellent', 'very_good', 'good', 'fair')),
  price DECIMAL(12, 2) NOT NULL,
  description TEXT,
  case_material VARCHAR(100),
  case_diameter VARCHAR(50),
  movement_type VARCHAR(100),
  caliber VARCHAR(100),
  serial_number VARCHAR(100),
  has_box BOOLEAN DEFAULT false,
  has_papers BOOLEAN DEFAULT false,
  service_history TEXT,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'pending')),
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create provenance_records table for living history
CREATE TABLE provenance_records (
  id SERIAL PRIMARY KEY,
  watch_id INTEGER REFERENCES watches(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('manufactured', 'purchased', 'serviced', 'restored', 'authenticated', 'sold', 'other')),
  event_date DATE NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  documentation_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table for reputation calculation
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  watch_id INTEGER REFERENCES watches(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
  buyer_name VARCHAR(255),
  sale_price DECIMAL(12, 2) NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  buyer_rating INTEGER CHECK (buyer_rating >= 1 AND buyer_rating <= 5),
  buyer_review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_watches_seller_id ON watches(seller_id);
CREATE INDEX idx_watches_status ON watches(status);
CREATE INDEX idx_watches_featured ON watches(featured);
CREATE INDEX idx_watches_brand ON watches(brand);
CREATE INDEX idx_provenance_watch_id ON provenance_records(watch_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_sellers_trust_score ON sellers(trust_score DESC);

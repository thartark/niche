-- User accounts and saved items
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved watches (watchlist)
CREATE TABLE saved_watches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  watch_id INTEGER REFERENCES watches(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, watch_id)
);

-- Saved searches
CREATE TABLE saved_searches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  query_params JSONB NOT NULL,
  notify_on_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Price alerts
CREATE TABLE price_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  watch_id INTEGER REFERENCES watches(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2) NOT NULL,
  condition VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  triggered_at TIMESTAMP
);

-- Watch comparisons (saved comparison sets)
CREATE TABLE comparison_sets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  watch_ids INTEGER[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Followed sellers
CREATE TABLE followed_sellers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
  followed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, seller_id)
);

-- Price history for market intelligence
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  watch_id INTEGER REFERENCES watches(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  condition VARCHAR(50),
  marketplace VARCHAR(100),
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_saved_watches_user ON saved_watches(user_id);
CREATE INDEX idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(active, watch_id);
CREATE INDEX idx_comparison_sets_user ON comparison_sets(user_id);
CREATE INDEX idx_followed_sellers_user ON followed_sellers(user_id);
CREATE INDEX idx_price_history_watch ON price_history(watch_id, recorded_at);

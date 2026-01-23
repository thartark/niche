-- Seed users
INSERT INTO users (email, password_hash, name, avatar_url) VALUES
('collector@example.com', '$2a$10$rG8K9Y8P.rT7U6V4W5X6Y.Z9A8B7C6D5E4F3G2H1I0J9K8L7M6N5O4', 'James Sullivan', '/placeholder.svg?height=100&width=100'),
('watchenthusiast@example.com', '$2a$10$sH9L0Z9Q.sU8V7W6X5Y4Z.A0B9C8D7E6F5G4H3I2J1K0L9M8N7O6P5', 'Sarah Chen', '/placeholder.svg?height=100&width=100');

-- Seed saved watches (James saves some watches)
INSERT INTO saved_watches (user_id, watch_id, notes) VALUES
(1, 1, 'Dream watch - waiting for right price'),
(1, 3, 'Love the vintage patina'),
(1, 5, 'Considering as investment piece');

-- Seed saved searches
INSERT INTO saved_searches (user_id, name, query_params, notify_on_new) VALUES
(1, 'Rolex Submariners under $15k', '{"brand": "Rolex", "model": "Submariner", "max_price": 15000}', true),
(1, 'Vintage Omega Speedmaster', '{"brand": "Omega", "model": "Speedmaster", "min_year": 1960, "max_year": 1975}', true),
(2, 'Grand Seiko Spring Drive', '{"brand": "Grand Seiko", "movement": "Spring Drive"}', false);

-- Seed price alerts
INSERT INTO price_alerts (user_id, watch_id, target_price, condition, active) VALUES
(1, 1, 12000.00, 'Excellent', true),
(1, 3, 8000.00, 'Very Good', true),
(2, 5, 18000.00, 'Excellent', true);

-- Seed followed sellers
INSERT INTO followed_sellers (user_id, seller_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3);

-- Seed price history for market intelligence
INSERT INTO price_history (watch_id, price, condition, marketplace, recorded_at) VALUES
-- Rolex Submariner 5513 price history (trending up)
(1, 11500.00, 'Excellent', 'Chrono24', NOW() - INTERVAL '6 months'),
(1, 12200.00, 'Excellent', 'Watchbox', NOW() - INTERVAL '4 months'),
(1, 12800.00, 'Excellent', 'Hodinkee Shop', NOW() - INTERVAL '2 months'),
(1, 13500.00, 'Excellent', 'Bob''s Watches', NOW() - INTERVAL '1 month'),

-- Omega Speedmaster price history (stable)
(3, 8800.00, 'Very Good', 'Chrono24', NOW() - INTERVAL '5 months'),
(3, 9000.00, 'Very Good', 'eBay', NOW() - INTERVAL '3 months'),
(3, 8900.00, 'Very Good', 'Watchbox', NOW() - INTERVAL '1 month'),

-- Patek Philippe Calatrava price history (premium stable)
(5, 19500.00, 'Mint', 'Hodinkee Shop', NOW() - INTERVAL '4 months'),
(5, 20000.00, 'Mint', 'Watchbox', NOW() - INTERVAL '2 months'),
(5, 19800.00, 'Mint', 'Chrono24', NOW() - INTERVAL '3 weeks');

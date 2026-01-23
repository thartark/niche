-- Insert sample sellers
INSERT INTO sellers (name, email, bio, location, trust_score, total_sales, years_active, specialties, verified, avatar_url) VALUES
('James Horological', 'james@timepieces.com', 'Vintage watch specialist with over 20 years of experience in Rolex and Omega timepieces. NAWCC certified.', 'London, UK', 4.85, 147, 12, ARRAY['Rolex', 'Omega', 'Tudor'], true, '/placeholder.svg?height=100&width=100'),
('Geneva Watch House', 'contact@genevawatchhouse.com', 'Swiss-based dealer specializing in rare Patek Philippe and Audemars Piguet pieces. Family business since 1978.', 'Geneva, Switzerland', 4.92, 89, 25, ARRAY['Patek Philippe', 'Audemars Piguet', 'Vacheron Constantin'], true, '/placeholder.svg?height=100&width=100'),
('Tokyo Vintage Timepieces', 'hello@tokyovintage.jp', 'Curated collection of Japanese domestic market watches and rare Seiko pieces.', 'Tokyo, Japan', 4.78, 203, 8, ARRAY['Seiko', 'Grand Seiko', 'Citizen'], true, '/placeholder.svg?height=100&width=100'),
('Manhattan Watch Co', 'sales@manhattanwatch.com', 'New York-based dealer with expertise in vintage Cartier and dress watches.', 'New York, USA', 4.65, 56, 5, ARRAY['Cartier', 'Jaeger-LeCoultre', 'IWC'], true, '/placeholder.svg?height=100&width=100');

-- Insert sample watches
INSERT INTO watches (seller_id, brand, model, reference_number, year_manufactured, condition, price, description, case_material, case_diameter, movement_type, caliber, serial_number, has_box, has_papers, service_history, images, status, featured) VALUES
(1, 'Rolex', 'Submariner', '5513', 1967, 'excellent', 28500.00, 'Iconic vintage Rolex Submariner ref. 5513 from 1967. Features the desirable ''meters first'' dial. All original unpolished case with beautiful patina. Recently serviced by a certified watchmaker.', 'Stainless Steel', '40mm', 'Automatic', '1520', 'R1234567', false, false, 'Full service completed in 2024 by RSC', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', true),
(2, 'Patek Philippe', 'Calatrava', '3919J', 1989, 'mint', 18900.00, 'Stunning Patek Philippe Calatrava in 18k yellow gold. The quintessential dress watch. Complete set with box, papers, and archive extract. Barely worn, showing minimal signs of use.', '18k Yellow Gold', '33mm', 'Manual', '215PS', 'PP2891234', true, true, 'Never serviced, keeps excellent time', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', true),
(3, 'Grand Seiko', 'Hi-Beat 36000', 'SBGH267', 2019, 'excellent', 5200.00, 'Modern classic Grand Seiko with the legendary Hi-Beat movement. Stunning Shunbun dial inspired by spring equinox. Full set with warranty card dated 2019. Exceptional finishing and accuracy.', 'Stainless Steel', '40mm', 'Automatic', '9S85', 'GS891234', true, true, 'No service needed, under warranty performance', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', true),
(1, 'Omega', 'Speedmaster Professional', '145.022-69', 1969, 'very_good', 12800.00, 'Legendary Omega Speedmaster from 1969 - the moonwatch year. Authentic ''stepped'' dial with tritium plots showing warm patina. Original bracelet included. A piece of horological history.', 'Stainless Steel', '42mm', 'Manual', '861', 'O28912345', false, false, 'Serviced in 2023', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', true),
(2, 'Audemars Piguet', 'Royal Oak', '15202ST', 2016, 'excellent', 68000.00, 'The iconic ''Jumbo'' Royal Oak in stainless steel. 39mm case with the ultra-thin caliber 2121. Blue tapisserie dial. Complete set with box and papers. Modern classic in exceptional condition.', 'Stainless Steel', '39mm', 'Automatic', '2121', 'AP12345678', true, true, 'Recently serviced by AP', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', true),
(4, 'Cartier', 'Tank Louis', 'W1529756', 2020, 'mint', 4500.00, 'Timeless Cartier Tank Louis in 18k yellow gold on a brown alligator strap. The perfect dress watch. Worn only a handful of times. Complete with box and papers.', '18k Yellow Gold', '29.5mm x 22mm', 'Manual', '8971MC', 'CT891234', true, true, 'No service history needed', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', false),
(3, 'Seiko', '6105-8110', 1970, 'good', 3200.00, 'Vintage Seiko dive watch - the famous ''Captain Willard'' worn in Apocalypse Now. Original dial and hands with lovely patina. Case has honest wear. A true icon from Seiko''s golden age.', 'Stainless Steel', '44mm', 'Automatic', '6105B', 'S7012345', false, false, 'Serviced in 2023, running well', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', false),
(1, 'Tudor', 'Black Bay 58', '79030N', 2021, 'excellent', 3800.00, 'The perfect modern vintage-inspired dive watch. 39mm case wears beautifully. On the factory bracelet with full links. Complete set with warranty card. Barely worn condition.', 'Stainless Steel', '39mm', 'Automatic', 'MT5402', 'TU891234', true, true, 'Under warranty, no service needed', ARRAY['/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800', '/placeholder.svg?height=800&width=800'], 'available', false);

-- Insert provenance records for select watches
INSERT INTO provenance_records (watch_id, event_type, event_date, description, location, verified) VALUES
(1, 'manufactured', '1967-03-15', 'Watch manufactured at Rolex facility', 'Geneva, Switzerland', true),
(1, 'purchased', '1967-06-20', 'Original purchase by Royal Navy officer', 'London, UK', false),
(1, 'serviced', '1985-11-10', 'Movement service and gasket replacement', 'London, UK', false),
(1, 'purchased', '2019-08-15', 'Acquired by James Horological from private collection', 'London, UK', true),
(1, 'serviced', '2024-01-20', 'Complete service by RSC-certified watchmaker', 'London, UK', true),

(2, 'manufactured', '1989-05-12', 'Watch manufactured and cased at Patek Philippe', 'Geneva, Switzerland', true),
(2, 'purchased', '1989-07-08', 'Original purchase from authorized dealer', 'Paris, France', true),
(2, 'authenticated', '2023-11-15', 'Archive extract obtained from Patek Philippe', 'Geneva, Switzerland', true),
(2, 'purchased', '2024-02-10', 'Acquired by Geneva Watch House', 'Geneva, Switzerland', true),

(4, 'manufactured', '1969-07-01', 'Manufactured during Apollo 11 mission year', 'Bienne, Switzerland', true),
(4, 'purchased', '1969-09-22', 'Original retail purchase', 'Houston, USA', false),
(4, 'serviced', '2023-05-15', 'Full movement overhaul', 'London, UK', true);

-- Insert sample transactions
INSERT INTO transactions (watch_id, seller_id, buyer_name, sale_price, sale_date, buyer_rating, buyer_review) VALUES
(1, 1, 'Anonymous', 15200.00, '2023-03-15', 5, 'Exceptional seller. Watch exactly as described. Fast shipping and excellent communication.'),
(1, 1, 'Anonymous', 18900.00, '2023-08-22', 5, 'Very professional transaction. Watch arrived securely packaged.'),
(2, 2, 'Anonymous', 42000.00, '2023-11-10', 5, 'Dream watch finally acquired! Geneva Watch House was incredible to work with.'),
(3, 3, 'Anonymous', 4800.00, '2024-01-05', 5, 'Beautiful Grand Seiko. Seller provided detailed photos and quick responses.');

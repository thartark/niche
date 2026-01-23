-- Add grading and authentication tables

-- Condition grading table
CREATE TABLE IF NOT EXISTS condition_reports (
  id SERIAL PRIMARY KEY,
  watch_id INTEGER NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  grader_name VARCHAR(255) NOT NULL,
  grading_service VARCHAR(100) NOT NULL, -- e.g., "WatchCSA", "AWCI", "Independent Expert"
  overall_grade VARCHAR(20) NOT NULL, -- "Mint", "Excellent", "Very Good", "Good", "Fair"
  case_condition VARCHAR(20) NOT NULL,
  dial_condition VARCHAR(20) NOT NULL,
  movement_condition VARCHAR(20) NOT NULL,
  bracelet_condition VARCHAR(20),
  authenticity_score INTEGER NOT NULL CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
  service_history TEXT,
  notes TEXT,
  report_url VARCHAR(500),
  graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watch complications table (for advanced filtering)
CREATE TABLE IF NOT EXISTS watch_complications (
  id SERIAL PRIMARY KEY,
  watch_id INTEGER NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  complication_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(watch_id, complication_type)
);

-- Update watches table with additional technical details
ALTER TABLE watches 
  ADD COLUMN IF NOT EXISTS movement_type VARCHAR(50), -- "Automatic", "Manual", "Quartz"
  ADD COLUMN IF NOT EXISTS power_reserve INTEGER, -- hours
  ADD COLUMN IF NOT EXISTS water_resistance INTEGER, -- meters
  ADD COLUMN IF NOT EXISTS crystal_type VARCHAR(50), -- "Sapphire", "Hesalite", "Acrylic"
  ADD COLUMN IF NOT EXISTS case_back VARCHAR(50); -- "Exhibition", "Solid", "See-through"

-- Seed condition reports
INSERT INTO condition_reports (watch_id, grader_name, grading_service, overall_grade, case_condition, dial_condition, movement_condition, bracelet_condition, authenticity_score, service_history, notes) VALUES
(1, 'John Mitchell, CMW', 'WatchCSA', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Very Good', 98, 'Complete service 2021 by Rolex Service Center', 'Exceptional example with original papers and box. Minor wear on bracelet consistent with age.'),
(2, 'Sarah Chen', 'Independent Expert', 'Mint', 'Mint', 'Mint', 'Mint', NULL, 100, 'Never serviced (new old stock)', 'Unworn new old stock from 1998. Complete set with all original packaging.'),
(3, 'Robert Williams, AWCI', 'AWCI Certified', 'Very Good', 'Very Good', 'Excellent', 'Excellent', 'Good', 95, 'Service history unknown, recently serviced by certified watchmaker', 'Honest vintage piece with expected patina. Movement running perfectly.'),
(4, 'Marie Dubois', 'Chronoexpert Geneva', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 99, 'Full service by Patek Philippe in 2022', 'Museum-quality piece with complete documentation.'),
(5, 'David Park', 'WatchCSA', 'Good', 'Good', 'Fair', 'Very Good', 'Fair', 92, 'Movement recently serviced, dial original with patina', 'Honest tropical dial example. Rare and desirable patina.'),
(6, 'Lisa Anderson', 'Independent Expert', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 97, 'Complete service 2023', 'Contemporary classic in excellent condition.'),
(7, 'Thomas Mueller', 'German Watch Institute', 'Excellent', 'Excellent', 'Excellent', 'Excellent', NULL, 98, 'Factory service 2022', 'Exceptional Grand Seiko craftsmanship. Perfect condition.'),
(8, 'Carlos Rodriguez', 'Chronoexpert Geneva', 'Mint', 'Mint', 'Mint', 'Mint', 'Mint', 100, 'Unworn from authorized dealer', 'Brand new unworn with full factory warranty.');

-- Update watches with technical details
UPDATE watches SET movement_type = 'Automatic', power_reserve = 70, water_resistance = 200, crystal_type = 'Acrylic', case_back = 'Solid' WHERE id = 1;
UPDATE watches SET movement_type = 'Automatic', power_reserve = 42, water_resistance = 100, crystal_type = 'Sapphire', case_back = 'Solid' WHERE id = 2;
UPDATE watches SET movement_type = 'Manual', power_reserve = 53, water_resistance = 30, crystal_type = 'Acrylic', case_back = 'Solid' WHERE id = 3;
UPDATE watches SET movement_type = 'Manual', power_reserve = 48, water_resistance = 30, crystal_type = 'Sapphire', case_back = 'Exhibition' WHERE id = 4;
UPDATE watches SET movement_type = 'Automatic', power_resistance = 38, water_resistance = 100, crystal_type = 'Acrylic', case_back = 'Solid' WHERE id = 5;
UPDATE watches SET movement_type = 'Automatic', power_reserve = 72, water_resistance = 100, crystal_type = 'Sapphire', case_back = 'Exhibition' WHERE id = 6;
UPDATE watches SET movement_type = 'Automatic', power_reserve = 72, water_resistance = 100, crystal_type = 'Sapphire', case_back = 'Exhibition' WHERE id = 7;
UPDATE watches SET movement_type = 'Automatic', power_reserve = 42, water_resistance = 30, crystal_type = 'Sapphire', case_back = 'Exhibition' WHERE id = 8;

-- Add complications
INSERT INTO watch_complications (watch_id, complication_type) VALUES
(1, 'Date'),
(2, 'Date'),
(2, 'Small Seconds'),
(3, 'Chronograph'),
(4, 'Date'),
(4, 'Small Seconds'),
(5, 'Chronograph'),
(5, 'Date'),
(6, 'Date'),
(6, 'GMT'),
(7, 'Date'),
(8, 'Small Seconds');

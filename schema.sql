-- AuraWash Cloudflare D1 Database Schema & Seed Data

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  pickup_address TEXT NOT NULL,
  pickup_date TEXT NOT NULL,
  pickup_time_slot TEXT NOT NULL,
  delivery_date TEXT NOT NULL,
  delivery_time_slot TEXT NOT NULL,
  services TEXT,
  items TEXT,
  subtotal REAL DEFAULT 0,
  delivery_fee REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  payment_method TEXT,
  special_instructions TEXT,
  current_stage_index INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Pickup Scheduled',
  driver TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 3. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 4. Initial Seed Data (Demo Account & Sample Orders)
INSERT OR IGNORE INTO users (id, name, email, password, phone, address, notes)
VALUES (
  'usr_demo',
  'Sarah Jenkins',
  'demo@aurawash.com',
  'password123',
  '+91 98234 56789',
  'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
  'Please leave bags with tower security or ring bell 602.'
);

INSERT OR IGNORE INTO orders (
  id, user_id, customer_name, customer_email, customer_phone,
  pickup_address, pickup_date, pickup_time_slot, delivery_date,
  delivery_time_slot, services, items, subtotal, delivery_fee,
  discount, total, payment_method, special_instructions,
  current_stage_index, status, driver
) VALUES (
  'AW-9482',
  'usr_demo',
  'Sarah Jenkins',
  'demo@aurawash.com',
  '+91 98234 56789',
  'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
  '2026-09-28',
  'Morning (8:00 AM - 11:00 AM)',
  '2026-09-29',
  'Afternoon (1:00 PM - 4:00 PM)',
  '["Wash & Fold", "Botanical Eco-Wash"]',
  '[{"name":"Everyday Wash & Fold","quantity":8,"unit":"kg","pricePerUnit":89},{"name":"Double Bed Blanket / Quilt","quantity":1,"unit":"pcs","pricePerUnit":299},{"name":"Botanical Eco Sanitizer","quantity":1,"unit":"load","pricePerUnit":99}]',
  1110.00,
  0.00,
  100.00,
  1010.00,
  'UPI / GPay ending in 89',
  'Gentle cycle on comforter, lavender scented botanical wash.',
  2,
  'In Wash & Botanical Care',
  '{"name":"Rohan Sharma","phone":"+91 98451 20412","rating":4.95,"reviewsCount":384,"vehicle":"AuraWash EV Transit #08","etaMinutes":35}'
);

INSERT OR IGNORE INTO orders (
  id, user_id, customer_name, customer_email, customer_phone,
  pickup_address, pickup_date, pickup_time_slot, delivery_date,
  delivery_time_slot, services, items, subtotal, delivery_fee,
  discount, total, payment_method, special_instructions,
  current_stage_index, status, driver
) VALUES (
  'AW-8201',
  'usr_demo',
  'Sarah Jenkins',
  'demo@aurawash.com',
  '+91 98234 56789',
  'Tower 4, Flat 602, Blue Ridge, Hinjawadi Phase 1, Pune, Maharashtra 411057',
  '2026-09-26',
  'Afternoon (1:00 PM - 4:00 PM)',
  '2026-09-27',
  'Evening (5:00 PM - 8:00 PM)',
  '["Dry Cleaning", "Steam Press"]',
  '[{"name":"Kurta & Blazer Suit","quantity":2,"unit":"pcs","pricePerUnit":199},{"name":"Formal Shirts (Hung & Pressed)","quantity":4,"unit":"pcs","pricePerUnit":69}]',
  674.00,
  0.00,
  0.00,
  674.00,
  'UPI (PhonePe)',
  'Light starch on formal collars please.',
  4,
  'Out for Delivery',
  '{"name":"Amit Patil","phone":"+91 98112 38190","rating":5.0,"reviewsCount":512,"vehicle":"AuraWash Electric Van #03","etaMinutes":20}'
);

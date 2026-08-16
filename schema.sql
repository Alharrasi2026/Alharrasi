-- ============================================================
-- Al-Harrasi Ropes Factory — Vercel Postgres Schema
-- Run this ONCE from the Vercel dashboard: Storage → your DB →
-- Query tab → paste this file → Run
-- ============================================================

-- ── SITE CONTENT (texts, editable from /admin) ──────────────
CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,
  value_en    TEXT,
  value_ar    TEXT,
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Seed with the current website texts
INSERT INTO site_content (key, value_en, value_ar) VALUES
  ('hero_eyebrow',   'Est. 2018 — Sultanate of Oman', 'تأسس عام ٢٠١٨ — سلطنة عُمان'),
  ('hero_title',     'Strength Woven Into Every Strand', 'قوة منسوجة في كلّ خيط'),
  ('hero_body',      'Al-Harrasi Ropes Factory manufactures premium polyethylene and polypropylene ropes — built for industrial, marine, and agricultural demands. 100% Omani-made, delivered on time.',
                      'مصنع حبال الحراصي يُنتج حبالاً من البولي إيثيلين والبولي بروبيلين عالية الجودة — مصمَّمة للاستخدامات الصناعية والبحرية والزراعية. صُنع في عُمان ١٠٠٪، ويُسلَّم في الموعد دائماً.'),
  ('stat_founded',   '2018', '٢٠١٨'),
  ('stat_lines',     '7+', '+٧'),
  ('contact_email',  'Alharrasi.ropf@hotmail.com', 'Alharrasi.ropf@hotmail.com'),
  ('contact_whatsapp','96890103771', '96890103771')
ON CONFLICT (key) DO NOTHING;

-- ── MEDIA (images managed from /admin) ───────────────────────
CREATE TABLE IF NOT EXISTS media (
  id          SERIAL PRIMARY KEY,
  slot        TEXT UNIQUE NOT NULL,   -- e.g. 'hero_image', 'product_pp_rope'
  url         TEXT NOT NULL,          -- Vercel Blob public URL
  alt_en      TEXT,
  alt_ar      TEXT,
  updated_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO media (slot, url, alt_en, alt_ar) VALUES
  ('hero_image',        'https://harrasiropes.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-08-18-at-18.15.40_5baec988-1024x682.jpg', 'PP Ropes', 'حبال بولي بروبيلين'),
  ('product_pp_rope',    'https://harrasiropes.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-08-18-at-18.15.40_5baec988-1024x682.jpg', 'PP Rope', 'حبل بولي بروبيلين'),
  ('product_cotton',     'https://harrasiropes.com/wp-content/uploads/2025/06/COTTON-ROPE-768x1024.jpg', 'Cotton Rope', 'حبل قطني'),
  ('product_nylon',      'https://harrasiropes.com/wp-content/uploads/2025/06/PicsArt_11-25-08.16.22-1024x683.jpg', 'Black Nylon Rope', 'حبل نايلون أسود'),
  ('product_balar',      'https://harrasiropes.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-07-30-at-13.34.57_70c4d65e.jpg', 'Balar Twine', 'خيط بالار'),
  ('product_ppball',     'https://harrasiropes.com/wp-content/uploads/2025/06/PP-BALL-FILM-1024x683.jpg', 'PP Ball Film', 'فيلم كرة PP')
ON CONFLICT (slot) DO NOTHING;

-- ── INQUIRIES (contact form submissions) ─────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id          SERIAL PRIMARY KEY,
  first_name  TEXT,
  last_name   TEXT,
  email       TEXT,
  phone       TEXT,
  company     TEXT,
  product     TEXT,
  message     TEXT,
  lang        TEXT DEFAULT 'en',
  status      TEXT DEFAULT 'new',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── ADMIN USER ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Default admin — username: admin / password: Admin@123
-- CHANGE THIS PASSWORD after first login (see README)
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$gmreuln/oQm.XteEiZ4Bbu4DczcgATBoz24JCKtJ/GmY3oA2s6UJK')
ON CONFLICT (username) DO NOTHING;

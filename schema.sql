-- ============================================================
-- Al-Harrasi Ropes Factory — Vercel Postgres Schema
-- Run this ONCE from the Vercel dashboard: Storage → your DB →
-- Query tab → paste this file → Run
-- ============================================================

-- ── SITE CONTENT (all text, editable from /admin) ───────────
CREATE TABLE IF NOT EXISTS site_content (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO site_content (key, value) VALUES
  ('hero_eyebrow',    'تأسس عام ٢٠١٨ · سلطنة عُمان'),
  ('hero_title',      'قوة منسوجة في كلّ خيط'),
  ('hero_desc',       'حرفة عُمانية أصيلة في فتل الحبال، بمعايير مصنع حديث — من الميناء إلى الحقل إلى موقع الإنشاء، الحراصي حاضرة أينما تشتدّ الحاجة إلى المتانة.'),
  ('stat_founded',    '٢٠١٨'),
  ('stat_lines',      '+٧'),
  ('stat_omani',      '١٠٠٪'),
  ('stat_sectors',    '٣'),
  ('about_title',     'خبرة تُفتل جيلاً بعد جيل'),
  ('about_body1',     'مصنع الحراصي للحبال يجمع بين معرفة محلية متوارثة وخطوط إنتاج حديثة، لتزويد السوق العُماني والخليجي بحبال تتحمّل قسوة الاستخدام اليومي دون أن تفقد دقّة الصنعة.'),
  ('about_body2',     'كل بكرة تمر بمراحل فتل ومراقبة جودة صارمة، فتخرج بنفس المتانة والاتقان في كل مرة.'),
  ('timeline_1_title','٢٠١٨ — الانطلاقة'),
  ('timeline_1_body', 'تأسيس المصنع بخط إنتاج أول لحبال البولي بروبيلين في سلطنة عُمان.'),
  ('timeline_2_title','التوسّع'),
  ('timeline_2_body', 'نمو الطاقة الإنتاجية لأكثر من ٧ خطوط تغطي أنواعاً متعددة من الحبال والخيوط.'),
  ('timeline_3_title','اليوم'),
  ('timeline_3_body', 'حضور راسخ في قطاعات الصناعة والملاحة والزراعة، بمنتجات عُمانية الصنع بالكامل.'),
  ('contact_whatsapp','96890103771'),
  ('contact_email',   'Alharrasi.ropf@hotmail.com')
ON CONFLICT (key) DO NOTHING;

-- ── PRODUCTS (managed from /admin) ──────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  sectors      TEXT NOT NULL DEFAULT '',   -- comma-separated: industrial,marine,agri
  material     TEXT NOT NULL DEFAULT '',
  common_use   TEXT NOT NULL DEFAULT '',
  feature      TEXT NOT NULL DEFAULT '',
  icon_key     TEXT NOT NULL DEFAULT 'rings', -- rings | wave | loop | cross | circle | squares
  image_url    TEXT,                          -- optional uploaded photo, overrides icon
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, description, sectors, material, common_use, feature, icon_key, sort_order) VALUES
  ('حبال البولي بروبيلين', 'مقاومة للماء وخفيفة الوزن مع قوة شد عالية — الخيار الأول للموانئ والقوارب والمواقع الصناعية المكشوفة.', 'marine,industrial', 'بولي بروبيلين', 'ربط، رسو، رفع', 'لا يمتص الماء', 'rings', 1),
  ('حبال البولي إيثيلين', 'متانة عالية لتحمّل الأحمال الثقيلة، مصمّمة للاستخدام المستمر في المواقع الصناعية والإنشائية.', 'industrial', 'بولي إيثيلين', 'رفع، تثبيت أحمال', 'تحمّل عالٍ للشد', 'wave', 2),
  ('حبال قطنية', 'ملمس طبيعي ومرونة عالية، مناسبة للاستخدامات الزراعية والحرفية التي تتطلب لمسة يدوية أكثر ليونة.', 'agri', 'قطن طبيعي', 'ربط، أعمال حرفية', 'ملمس طبيعي مريح', 'loop', 3),
  ('حبال نايلون', 'قوة شد استثنائية ومقاومة للتآكل، مثالية للاستخدام المكثف والاحتكاك المستمر.', 'industrial,marine', 'نايلون', 'سحب، ربط ثقيل', 'مقاومة عالية للتآكل', 'cross', 4),
  ('خيط بالار', 'خيط ربط عملي وموثوق، مصمّم للاستخدامات الزراعية اليومية بكميات كبيرة.', 'agri', 'بولي بروبيلين مجدول', 'ربط المحاصيل', 'اقتصادي وموثوق', 'circle', 5),
  ('فيلم كرة PP', 'فيلم لف وتغليف مخصص لبالات القش والمحاصيل الزراعية، يحافظ على جودتها أثناء التخزين.', 'agri', 'بولي بروبيلين', 'لف بالات القش', 'حماية من الرطوبة', 'squares', 6)
ON CONFLICT DO NOTHING;

-- ── MEDIA LIBRARY (Vercel Blob uploads) ─────────────────────
CREATE TABLE IF NOT EXISTS media (
  id          SERIAL PRIMARY KEY,
  url         TEXT NOT NULL,
  pathname    TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ── ADMIN USER ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

-- Default admin — username: admin / password: Harrasi@2026
-- CHANGE THIS PASSWORD after first login (Settings panel in /admin)
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$u0.6G/.58axGI78rOGtrp.xdA/pRTiYo8j7azsrKGxCMEThFoOCxq')
ON CONFLICT (username) DO NOTHING;

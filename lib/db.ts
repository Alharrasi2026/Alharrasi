import { sql } from '@vercel/postgres';

export { sql };

export type Product = {
  id: number;
  name: string;
  description: string;
  sectors: string[];
  material: string;
  common_use: string;
  feature: string;
  icon_key: string;
  image_url: string | null;
  sort_order: number;
};

export type MediaItem = {
  id: number;
  url: string;
  pathname: string;
  uploaded_at: string;
};

type ProductRow = Omit<Product, 'sectors'> & { sectors: string };

function rowToProduct(row: ProductRow): Product {
  return {
    ...row,
    sectors: row.sectors ? row.sectors.split(',').filter(Boolean) : [],
  };
}

// ---------- fallbacks (used until Vercel Postgres is connected) ----------

export const DEFAULT_CONTENT: Record<string, string> = {
  hero_eyebrow: 'تأسس عام ٢٠١٨ · سلطنة عُمان',
  hero_title: 'قوة منسوجة في كلّ خيط',
  hero_desc: 'حرفة عُمانية أصيلة في فتل الحبال، بمعايير مصنع حديث — من الميناء إلى الحقل إلى موقع الإنشاء، الحراصي حاضرة أينما تشتدّ الحاجة إلى المتانة.',
  stat_founded: '٢٠١٨',
  stat_lines: '+٧',
  stat_omani: '١٠٠٪',
  stat_sectors: '٣',
  about_title: 'خبرة تُفتل جيلاً بعد جيل',
  about_body1: 'مصنع الحراصي للحبال يجمع بين معرفة محلية متوارثة وخطوط إنتاج حديثة، لتزويد السوق العُماني والخليجي بحبال تتحمّل قسوة الاستخدام اليومي دون أن تفقد دقّة الصنعة.',
  about_body2: 'كل بكرة تمر بمراحل فتل ومراقبة جودة صارمة، فتخرج بنفس المتانة والاتقان في كل مرة.',
  timeline_1_title: '٢٠١٨ — الانطلاقة',
  timeline_1_body: 'تأسيس المصنع بخط إنتاج أول لحبال البولي بروبيلين في سلطنة عُمان.',
  timeline_2_title: 'التوسّع',
  timeline_2_body: 'نمو الطاقة الإنتاجية لأكثر من ٧ خطوط تغطي أنواعاً متعددة من الحبال والخيوط.',
  timeline_3_title: 'اليوم',
  timeline_3_body: 'حضور راسخ في قطاعات الصناعة والملاحة والزراعة، بمنتجات عُمانية الصنع بالكامل.',
  contact_whatsapp: '96890103771',
  contact_email: 'Alharrasi.ropf@hotmail.com',
};

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'حبال البولي بروبيلين', description: 'مقاومة للماء وخفيفة الوزن مع قوة شد عالية — الخيار الأول للموانئ والقوارب والمواقع الصناعية المكشوفة.', sectors: ['marine', 'industrial'], material: 'بولي بروبيلين', common_use: 'ربط، رسو، رفع', feature: 'لا يمتص الماء', icon_key: 'rings', image_url: null, sort_order: 1 },
  { id: 2, name: 'حبال البولي إيثيلين', description: 'متانة عالية لتحمّل الأحمال الثقيلة، مصمّمة للاستخدام المستمر في المواقع الصناعية والإنشائية.', sectors: ['industrial'], material: 'بولي إيثيلين', common_use: 'رفع، تثبيت أحمال', feature: 'تحمّل عالٍ للشد', icon_key: 'wave', image_url: null, sort_order: 2 },
  { id: 3, name: 'حبال قطنية', description: 'ملمس طبيعي ومرونة عالية، مناسبة للاستخدامات الزراعية والحرفية التي تتطلب لمسة يدوية أكثر ليونة.', sectors: ['agri'], material: 'قطن طبيعي', common_use: 'ربط، أعمال حرفية', feature: 'ملمس طبيعي مريح', icon_key: 'loop', image_url: null, sort_order: 3 },
  { id: 4, name: 'حبال نايلون', description: 'قوة شد استثنائية ومقاومة للتآكل، مثالية للاستخدام المكثف والاحتكاك المستمر.', sectors: ['industrial', 'marine'], material: 'نايلون', common_use: 'سحب، ربط ثقيل', feature: 'مقاومة عالية للتآكل', icon_key: 'cross', image_url: null, sort_order: 4 },
  { id: 5, name: 'خيط بالار', description: 'خيط ربط عملي وموثوق، مصمّم للاستخدامات الزراعية اليومية بكميات كبيرة.', sectors: ['agri'], material: 'بولي بروبيلين مجدول', common_use: 'ربط المحاصيل', feature: 'اقتصادي وموثوق', icon_key: 'circle', image_url: null, sort_order: 5 },
  { id: 6, name: 'فيلم كرة PP', description: 'فيلم لف وتغليف مخصص لبالات القش والمحاصيل الزراعية، يحافظ على جودتها أثناء التخزين.', sectors: ['agri'], material: 'بولي بروبيلين', common_use: 'لف بالات القش', feature: 'حماية من الرطوبة', icon_key: 'squares', image_url: null, sort_order: 6 },
];

// ---------- site content ----------

export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const { rows } = await sql<{ key: string; value: string }>`SELECT key, value FROM site_content`;
    const out: Record<string, string> = { ...DEFAULT_CONTENT };
    for (const r of rows) out[r.key] = r.value;
    return out;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function updateSiteContent(entries: Record<string, string>): Promise<void> {
  const keys = Object.keys(entries);
  for (const key of keys) {
    await sql`
      INSERT INTO site_content (key, value, updated_at)
      VALUES (${key}, ${entries[key]}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
  }
}

// ---------- products ----------

export async function getProducts(): Promise<Product[]> {
  try {
    const { rows } = await sql<ProductRow>`SELECT * FROM products ORDER BY sort_order ASC, id ASC`;
    return rows.length ? rows.map(rowToProduct) : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  const { rows } = await sql<ProductRow>`
    INSERT INTO products (name, description, sectors, material, common_use, feature, icon_key, image_url, sort_order)
    VALUES (${data.name}, ${data.description}, ${data.sectors.join(',')}, ${data.material}, ${data.common_use}, ${data.feature}, ${data.icon_key}, ${data.image_url}, ${data.sort_order})
    RETURNING *
  `;
  return rowToProduct(rows[0]);
}

export async function updateProduct(id: number, data: Partial<Omit<Product, 'id'>>): Promise<void> {
  const current = await sql<ProductRow>`SELECT * FROM products WHERE id = ${id}`;
  if (!current.rows[0]) return;
  const merged = { ...rowToProduct(current.rows[0]), ...data };
  await sql`
    UPDATE products SET
      name = ${merged.name},
      description = ${merged.description},
      sectors = ${merged.sectors.join(',')},
      material = ${merged.material},
      common_use = ${merged.common_use},
      feature = ${merged.feature},
      icon_key = ${merged.icon_key},
      image_url = ${merged.image_url},
      sort_order = ${merged.sort_order}
    WHERE id = ${id}
  `;
}

export async function deleteProduct(id: number): Promise<void> {
  await sql`DELETE FROM products WHERE id = ${id}`;
}

// ---------- media ----------

export async function getMedia(): Promise<MediaItem[]> {
  try {
    const { rows } = await sql<MediaItem>`SELECT * FROM media ORDER BY uploaded_at DESC`;
    return rows;
  } catch {
    return [];
  }
}

export async function addMedia(url: string, pathname: string): Promise<MediaItem> {
  const { rows } = await sql<MediaItem>`
    INSERT INTO media (url, pathname) VALUES (${url}, ${pathname}) RETURNING *
  `;
  return rows[0];
}

export async function deleteMedia(id: number): Promise<MediaItem | null> {
  const { rows } = await sql<MediaItem>`DELETE FROM media WHERE id = ${id} RETURNING *`;
  return rows[0] || null;
}

// ---------- admin ----------

export async function getAdminByUsername(username: string) {
  const { rows } = await sql<{ id: number; username: string; password_hash: string }>`
    SELECT id, username, password_hash FROM admin_users WHERE username = ${username}
  `;
  return rows[0] || null;
}

export async function updateAdminPassword(username: string, passwordHash: string): Promise<void> {
  await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE username = ${username}`;
}

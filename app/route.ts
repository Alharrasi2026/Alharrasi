import fs from 'fs';
import path from 'path';
import { getAllContent, getAllMedia } from '@/lib/db';

export const dynamic = 'force-dynamic'; // always fetch fresh content

export async function GET() {
  const templatePath = path.join(process.cwd(), 'public', 'site-template.html');
  let html = fs.readFileSync(templatePath, 'utf-8');

  let content: Record<string, { en: string; ar: string }> = {};
  let media: Record<string, { url: string }> = {};

  try {
    [content, media] = await Promise.all([getAllContent(), getAllMedia()]);
  } catch (e) {
    // DB not configured yet — fall back to the defaults already in the template's {{tokens}}
    console.error('DB fetch failed, serving template with fallback text:', e);
  }

  const get = (key: string, lang: 'en' | 'ar', fallback: string) =>
    content[key]?.[lang] || fallback;

  const getImg = (slot: string, fallback: string) => media[slot]?.url || fallback;

  const replacements: Record<string, string> = {
    hero_eyebrow_en: get('hero_eyebrow', 'en', 'Est. 2018 — Sultanate of Oman'),
    hero_eyebrow_ar: get('hero_eyebrow', 'ar', 'تأسس عام ٢٠١٨ — سلطنة عُمان'),
    hero_title_en: get('hero_title', 'en', 'Strength<br><em>Woven</em><br>Into Every<br>Strand'),
    hero_title_ar: get('hero_title', 'ar', 'قوة<br><em>منسوجة</em><br>في كلّ<br>خيط'),
    hero_body_en: get('hero_body', 'en',
      'Al-Harrasi Ropes Factory manufactures premium polyethylene and polypropylene ropes — built for industrial, marine, and agricultural demands. 100% Omani-made, delivered on time.'),
    hero_body_ar: get('hero_body', 'ar',
      'مصنع حبال الحراصي يُنتج حبالاً من البولي إيثيلين والبولي بروبيلين عالية الجودة — مصمَّمة للاستخدامات الصناعية والبحرية والزراعية. صُنع في عُمان ١٠٠٪، ويُسلَّم في الموعد دائماً.'),
    contact_email: get('contact_email', 'en', 'Alharrasi.ropf@hotmail.com'),
    contact_whatsapp: get('contact_whatsapp', 'en', '96890103771'),
    contact_whatsapp_display: (get('contact_whatsapp', 'en', '96890103771')).replace(/^968/, '968 '),
    img_hero_image: getImg('hero_image', 'https://harrasiropes.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-08-18-at-18.15.40_5baec988-1024x682.jpg'),
    img_product_pp_rope: getImg('product_pp_rope', 'https://harrasiropes.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-08-18-at-18.15.40_5baec988-1024x682.jpg'),
    img_product_cotton: getImg('product_cotton', 'https://harrasiropes.com/wp-content/uploads/2025/06/COTTON-ROPE-768x1024.jpg'),
    img_product_nylon: getImg('product_nylon', 'https://harrasiropes.com/wp-content/uploads/2025/06/PicsArt_11-25-08.16.22-1024x683.jpg'),
    img_product_balar: getImg('product_balar', 'https://harrasiropes.com/wp-content/uploads/2025/06/WhatsApp-Image-2025-07-30-at-13.34.57_70c4d65e.jpg'),
    img_product_ppball: getImg('product_ppball', 'https://harrasiropes.com/wp-content/uploads/2025/06/PP-BALL-FILM-1024x683.jpg'),
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(`{{${key}}}`).join(value);
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

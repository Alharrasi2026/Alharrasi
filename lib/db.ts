import { sql } from '@vercel/postgres';

export { sql };

export type ContentRow = {
  key: string;
  value_en: string | null;
  value_ar: string | null;
};

export type MediaRow = {
  id: number;
  slot: string;
  url: string;
  alt_en: string | null;
  alt_ar: string | null;
};

export async function getAllContent(): Promise<Record<string, { en: string; ar: string }>> {
  const { rows } = await sql<ContentRow>`SELECT key, value_en, value_ar FROM site_content`;
  const out: Record<string, { en: string; ar: string }> = {};
  for (const r of rows) {
    out[r.key] = { en: r.value_en || '', ar: r.value_ar || '' };
  }
  return out;
}

export async function getAllMedia(): Promise<Record<string, MediaRow>> {
  const { rows } = await sql<MediaRow>`SELECT id, slot, url, alt_en, alt_ar FROM media`;
  const out: Record<string, MediaRow> = {};
  for (const r of rows) out[r.slot] = r;
  return out;
}

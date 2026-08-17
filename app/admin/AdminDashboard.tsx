'use client';

import { useRef, useState } from 'react';
import { Product, MediaItem } from '@/lib/db';
import { ProductIconSmall } from '@/components/icons';

type Panel = 'overview' | 'home' | 'products' | 'media' | 'settings';

const PANEL_TITLES: Record<Panel, string> = {
  overview: 'نظرة عامة',
  home: 'محتوى الرئيسية',
  products: 'المنتجات',
  media: 'مكتبة الصور',
  settings: 'الإعدادات',
};

const SECTOR_OPTIONS: { key: string; label: string }[] = [
  { key: 'industrial', label: 'صناعي' },
  { key: 'marine', label: 'بحري' },
  { key: 'agri', label: 'زراعي' },
];

const ICON_OPTIONS = ['rings', 'wave', 'loop', 'cross', 'circle', 'squares'];

type Props = {
  initialContent: Record<string, string>;
  initialProducts: Product[];
  initialMedia: MediaItem[];
};

export function AdminDashboard({ initialContent, initialProducts, initialMedia }: Props) {
  const [panel, setPanel] = useState<Panel>('overview');
  const [content, setContent] = useState(initialContent);
  const [products, setProducts] = useState(initialProducts);
  const [media, setMedia] = useState(initialMedia);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', material: '', common_use: '', feature: '',
    icon_key: 'circle', image_url: null as string | null, sectors: ['industrial'] as string[],
  });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');

  function showToast(msg: string, error = false) {
    setToast({ msg, error });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  function setField(key: string, value: string) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function saveContent(keys: string[]) {
    setSaving(true);
    const payload: Record<string, string> = {};
    keys.forEach((k) => (payload[k] = content[k] ?? ''));
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) showToast('تم حفظ التغييرات بنجاح');
    else showToast('تعذّر الحفظ', true);
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/media', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'تعذّر رفع الصورة', true);
      return null;
    }
    setMedia((m) => [data, ...m]);
    return data.url as string;
  }

  function resetForm() {
    setForm({ name: '', description: '', material: '', common_use: '', feature: '', icon_key: 'circle', image_url: null, sectors: ['industrial'] });
    setEditingId(null);
  }

  function startEdit(p: Product) {
    setForm({
      name: p.name, description: p.description, material: p.material,
      common_use: p.common_use, feature: p.feature, icon_key: p.icon_key,
      image_url: p.image_url, sectors: p.sectors.length ? p.sectors : ['industrial'],
    });
    setEditingId(p.id);
    setAddOpen(true);
  }

  async function handleProductImage(file: File) {
    setUploadingProductImg(true);
    const url = await uploadFile(file);
    setUploadingProductImg(false);
    if (url) setForm((f) => ({ ...f, image_url: url }));
  }

  async function submitProduct() {
    if (!form.name.trim()) { showToast('اسم المنتج مطلوب', true); return; }
    setSaving(true);
    if (editingId) {
      const res = await fetch(`/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSaving(false);
      if (res.ok) {
        setProducts((ps) => ps.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
        showToast('تم تحديث المنتج بنجاح');
        resetForm();
        setAddOpen(false);
      } else showToast('تعذّر التحديث', true);
    } else {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sort_order: products.length + 1 }),
      });
      const data = await res.json();
      setSaving(false);
      if (res.ok) {
        setProducts((ps) => [...ps, data]);
        showToast('تمت إضافة المنتج بنجاح');
        resetForm();
        setAddOpen(false);
      } else showToast(data.error || 'تعذّر الإضافة', true);
    }
  }

  async function removeProduct(id: number) {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) showToast('تم حذف المنتج');
    else showToast('تعذّر الحذف', true);
  }

  async function addMediaFiles(files: FileList | File[]) {
    setUploadingMedia(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      await uploadFile(file);
    }
    setUploadingMedia(false);
    showToast('تم رفع الصور بنجاح');
  }

  async function removeMedia(id: number) {
    setMedia((m) => m.filter((x) => x.id !== id));
    await fetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  }

  async function savePassword() {
    if (pw1.length < 8) { showToast('كلمة المرور يجب أن تكون ٨ أحرف على الأقل', true); return; }
    if (pw1 !== pw2) { showToast('كلمتا المرور غير متطابقتين', true); return; }
    setSaving(true);
    const res = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw1 }),
    });
    setSaving(false);
    if (res.ok) { showToast('تم تحديث كلمة المرور'); setPw1(''); setPw2(''); }
    else showToast('تعذّر التحديث', true);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  function toggleSector(key: string) {
    setForm((f) => ({
      ...f,
      sectors: f.sectors.includes(key) ? f.sectors.filter((s) => s !== key) : [...f.sectors, key],
    }));
  }

  return (
    <div dir="rtl" lang="ar" className="dash">
      <aside className="sidebar">
        <a className="side-brand" href="/">
          <img src="/logo.png" alt="" />
          الحراصي للحبال
        </a>
        <nav className="side-nav">
          {(Object.keys(PANEL_TITLES) as Panel[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`side-link${panel === key ? ' active' : ''}`}
              onClick={() => setPanel(key)}
            >
              <PanelIcon name={key} />
              {PANEL_TITLES[key]}
            </button>
          ))}
        </nav>
        <button className="logout-btn" type="button" onClick={logout}>
          <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><path d="M8 17H4V3h4" /><path d="M13 14l4-4-4-4" /><path d="M17 10H8" /></svg>
          تسجيل الخروج
        </button>
      </aside>

      <main className="dash-main">
        <div className="dash-top">
          <h2>{PANEL_TITLES[panel]}</h2>
          <span className="admin-chip">مرحباً، المسؤول</span>
        </div>

        {panel === 'overview' && (
          <section className="panel">
            <div className="stat-grid">
              <div className="stat-card"><b>{products.length}</b><span>منتجات منشورة</span></div>
              <div className="stat-card"><b>{media.length}</b><span>صورة في المكتبة</span></div>
              <div className="stat-card"><b>مباشر</b><span>حالة الموقع</span></div>
              <div className="stat-card"><b>{content.stat_founded || '—'}</b><span>سنة التأسيس</span></div>
            </div>
            <div className="card">
              <h3>اختصارات سريعة</h3>
              <div className="shortcut-row">
                <button className="btn btn-ghost" type="button" onClick={() => setPanel('home')}>تعديل نصوص الرئيسية</button>
                <button className="btn btn-ghost" type="button" onClick={() => { setPanel('products'); setAddOpen(true); }}>إضافة منتج جديد</button>
                <button className="btn btn-ghost" type="button" onClick={() => setPanel('media')}>رفع صور</button>
              </div>
            </div>
          </section>
        )}

        {panel === 'home' && (
          <section className="panel">
            <div className="card">
              <h3>قسم البطل (Hero)</h3>
              <div className="field"><label>النص العلوي</label><input value={content.hero_eyebrow || ''} onChange={(e) => setField('hero_eyebrow', e.target.value)} /></div>
              <div className="field"><label>العنوان الرئيسي</label><input value={content.hero_title || ''} onChange={(e) => setField('hero_title', e.target.value)} /></div>
              <div className="field"><label>الوصف</label><textarea value={content.hero_desc || ''} onChange={(e) => setField('hero_desc', e.target.value)} /></div>
              <button className="btn btn-solid" type="button" disabled={saving} onClick={() => saveContent(['hero_eyebrow', 'hero_title', 'hero_desc'])}>
                {saving ? <span className="spinner" /> : 'حفظ التغييرات'}
              </button>
            </div>

            <div className="card">
              <h3>الإحصائيات المعروضة</h3>
              <div className="grid-2">
                <div className="field"><label>سنة التأسيس</label><input value={content.stat_founded || ''} onChange={(e) => setField('stat_founded', e.target.value)} /></div>
                <div className="field"><label>خطوط الإنتاج</label><input value={content.stat_lines || ''} onChange={(e) => setField('stat_lines', e.target.value)} /></div>
                <div className="field"><label>نسبة الصناعة العُمانية</label><input value={content.stat_omani || ''} onChange={(e) => setField('stat_omani', e.target.value)} /></div>
                <div className="field"><label>القطاعات المخدومة</label><input value={content.stat_sectors || ''} onChange={(e) => setField('stat_sectors', e.target.value)} /></div>
              </div>
              <button className="btn btn-solid" type="button" disabled={saving} onClick={() => saveContent(['stat_founded', 'stat_lines', 'stat_omani', 'stat_sectors'])}>
                {saving ? <span className="spinner" /> : 'حفظ التغييرات'}
              </button>
            </div>

            <div className="card">
              <h3>قسم الإرث</h3>
              <div className="field"><label>العنوان</label><input value={content.about_title || ''} onChange={(e) => setField('about_title', e.target.value)} /></div>
              <div className="field"><label>الفقرة الأولى</label><textarea value={content.about_body1 || ''} onChange={(e) => setField('about_body1', e.target.value)} /></div>
              <div className="field"><label>الفقرة الثانية</label><textarea value={content.about_body2 || ''} onChange={(e) => setField('about_body2', e.target.value)} /></div>
              <button className="btn btn-solid" type="button" disabled={saving} onClick={() => saveContent(['about_title', 'about_body1', 'about_body2'])}>
                {saving ? <span className="spinner" /> : 'حفظ التغييرات'}
              </button>
            </div>

            <div className="card">
              <h3>الجدول الزمني</h3>
              {[1, 2, 3].map((n) => (
                <div className="grid-2" key={n}>
                  <div className="field"><label>عنوان المرحلة {n}</label><input value={content[`timeline_${n}_title`] || ''} onChange={(e) => setField(`timeline_${n}_title`, e.target.value)} /></div>
                  <div className="field"><label>وصف المرحلة {n}</label><input value={content[`timeline_${n}_body`] || ''} onChange={(e) => setField(`timeline_${n}_body`, e.target.value)} /></div>
                </div>
              ))}
              <button className="btn btn-solid" type="button" disabled={saving} onClick={() => saveContent(['timeline_1_title', 'timeline_1_body', 'timeline_2_title', 'timeline_2_body', 'timeline_3_title', 'timeline_3_body'])}>
                {saving ? <span className="spinner" /> : 'حفظ التغييرات'}
              </button>
            </div>
          </section>
        )}

        {panel === 'products' && (
          <section className="panel">
            <div className="card">
              <div className="card-head">
                <h3>قائمة المنتجات</h3>
                <button className="btn btn-solid" type="button" onClick={() => { if (addOpen && editingId) resetForm(); setAddOpen((v) => !v); }}>
                  {addOpen ? 'إغلاق' : '+ إضافة منتج جديد'}
                </button>
              </div>

              <div>
                {products.map((p) => (
                  <div className="prod-row" key={p.id}>
                    <div className="prod-thumb">
                      {p.image_url ? <img src={p.image_url} alt="" /> : <ProductIconSmall iconKey={p.icon_key} />}
                    </div>
                    <div className="prod-info">
                      <b>{p.name}</b>
                      <span>{p.sectors.map((s) => SECTOR_OPTIONS.find((o) => o.key === s)?.label || s).join(' · ')}</span>
                    </div>
                    <div className="prod-actions">
                      <button className="icon-btn" type="button" aria-label="تعديل" onClick={() => startEdit(p)}>
                        <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><path d="M4 16l1-4 9-9 3 3-9 9-4 1Z" /></svg>
                      </button>
                      <button className="icon-btn danger" type="button" aria-label="حذف" onClick={() => removeProduct(p.id)}>
                        <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`add-form${addOpen ? ' open' : ''}`}>
                <div className="grid-2">
                  <div className="field"><label>اسم المنتج</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
                  <div className="field">
                    <label>القطاعات</label>
                    <div className="chip-group">
                      {SECTOR_OPTIONS.map((s) => (
                        <label className="chip-check" key={s.key}>
                          <input type="checkbox" checked={form.sectors.includes(s.key)} onChange={() => toggleSector(s.key)} />
                          <span>{s.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="field"><label>وصف مختصر</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
                <div className="grid-2">
                  <div className="field"><label>الخامة</label><input value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} /></div>
                  <div className="field"><label>الاستخدام الشائع</label><input value={form.common_use} onChange={(e) => setForm((f) => ({ ...f, common_use: e.target.value }))} /></div>
                </div>
                <div className="field"><label>الميزة</label><input value={form.feature} onChange={(e) => setForm((f) => ({ ...f, feature: e.target.value }))} /></div>
                <div className="field">
                  <label>صورة المنتج (اختياري — بدونها تُستخدم أيقونة)</label>
                  <div className="upload-mini">
                    <div className="upload-mini-preview">
                      {uploadingProductImg ? <span className="spinner" /> : form.image_url ? <img src={form.image_url} alt="" /> : <ProductIconSmall iconKey={form.icon_key} />}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleProductImage(e.target.files[0])} />
                  </div>
                </div>
                {!form.image_url && (
                  <div className="field">
                    <label>الأيقونة</label>
                    <div className="chip-group">
                      {ICON_OPTIONS.map((k) => (
                        <label className="chip-check" key={k}>
                          <input type="radio" name="icon" checked={form.icon_key === k} onChange={() => setForm((f) => ({ ...f, icon_key: k }))} />
                          <span><ProductIconSmall iconKey={k} style={{ width: 16, height: 16 }} /></span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <button className="btn btn-solid" type="button" disabled={saving} onClick={submitProduct}>
                  {saving ? <span className="spinner" /> : editingId ? 'حفظ التعديل' : 'إضافة المنتج'}
                </button>
              </div>
            </div>
          </section>
        )}

        {panel === 'media' && (
          <section className="panel">
            <div className="card">
              <h3>رفع صور جديدة</h3>
              <div
                className={`dropzone${dragging ? ' drag' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) addMediaFiles(e.dataTransfer.files); }}
              >
                <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.4"><path d="M10 13V4M6 8l4-4 4 4" /><path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" /></svg>
                {uploadingMedia ? 'جارٍ الرفع…' : 'اسحب الصور هنا أو اضغط للاختيار'}
                <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && addMediaFiles(e.target.files)} />
              </div>
              <div className="media-grid">
                {media.length === 0 && <div className="media-empty">لا توجد صور مرفوعة بعد.</div>}
                {media.map((m) => (
                  <div className="media-item" key={m.id}>
                    <img src={m.url} alt="" />
                    <button type="button" aria-label="حذف" onClick={() => removeMedia(m.id)}>
                      <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.8"><path d="M5 5l10 10M5 15L15 5" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {panel === 'settings' && (
          <section className="panel">
            <div className="card">
              <h3>بيانات التواصل</h3>
              <div className="grid-2">
                <div className="field"><label>رقم واتساب</label><input value={content.contact_whatsapp || ''} onChange={(e) => setField('contact_whatsapp', e.target.value)} /></div>
                <div className="field"><label>البريد الإلكتروني</label><input value={content.contact_email || ''} onChange={(e) => setField('contact_email', e.target.value)} /></div>
              </div>
              <button className="btn btn-solid" type="button" disabled={saving} onClick={() => saveContent(['contact_whatsapp', 'contact_email'])}>
                {saving ? <span className="spinner" /> : 'حفظ التغييرات'}
              </button>
            </div>
            <div className="card">
              <h3>تغيير كلمة المرور</h3>
              <div className="grid-2">
                <div className="field"><label>كلمة المرور الجديدة</label><input type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} /></div>
                <div className="field"><label>تأكيد كلمة المرور</label><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
              </div>
              <button className="btn btn-solid" type="button" disabled={saving} onClick={savePassword}>
                {saving ? <span className="spinner" /> : 'تحديث كلمة المرور'}
              </button>
            </div>
          </section>
        )}
      </main>

      {toast && (
        <div className={`toast show${toast.error ? ' error' : ''}`}>
          <svg viewBox="0 0 20 20" fill="none" stroke={toast.error ? 'var(--danger)' : 'var(--success)'} strokeWidth="1.8"><path d="M4 10l4 4 8-8" /></svg>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

function PanelIcon({ name }: { name: Panel }) {
  switch (name) {
    case 'overview':
      return <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><rect x="3" y="3" width="6" height="6" /><rect x="11" y="3" width="6" height="6" /><rect x="3" y="11" width="6" height="6" /><rect x="11" y="11" width="6" height="6" /></svg>;
    case 'home':
      return <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><path d="M3 8.5 10 3l7 5.5" /><path d="M5 8v8h10V8" /></svg>;
    case 'products':
      return <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><path d="M3 6l7-3 7 3-7 3-7-3Z" /><path d="M3 6v8l7 3 7-3V6" /><path d="M10 9v8" /></svg>;
    case 'media':
      return <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><rect x="3" y="3" width="14" height="14" rx="1" /><circle cx="7.5" cy="7.5" r="1.4" /><path d="M17 13l-4.5-4.5L4 17" /></svg>;
    case 'settings':
      return <svg viewBox="0 0 20 20" fill="none" strokeWidth="1.6"><circle cx="10" cy="10" r="2.6" /><path d="M10 2.5v2M10 15.5v2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M2.5 10h2M15.5 10h2M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" /></svg>;
  }
}

'use client';

import { useEffect, useState } from 'react';

type ContentMap = Record<string, { en: string; ar: string }>;
type MediaMap = Record<string, { id: number; slot: string; url: string; alt_en: string | null; alt_ar: string | null }>;

const TEXT_FIELDS: { key: string; label: string }[] = [
  { key: 'hero_eyebrow', label: 'العنوان الفرعي العلوي (Hero Eyebrow)' },
  { key: 'hero_title', label: 'العنوان الرئيسي (Hero Title)' },
  { key: 'hero_body', label: 'وصف الصفحة الرئيسية (Hero Body)' },
  { key: 'contact_email', label: 'البريد الإلكتروني' },
  { key: 'contact_whatsapp', label: 'رقم واتساب (بدون +)' },
];

const IMAGE_SLOTS: { slot: string; label: string }[] = [
  { slot: 'hero_image', label: 'صورة الصفحة الرئيسية' },
  { slot: 'product_pp_rope', label: 'صورة: حبل بولي بروبيلين' },
  { slot: 'product_cotton', label: 'صورة: حبل قطني' },
  { slot: 'product_nylon', label: 'صورة: حبل نايلون أسود' },
  { slot: 'product_balar', label: 'صورة: خيط بالار' },
  { slot: 'product_ppball', label: 'صورة: فيلم كرة PP' },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [content, setContent] = useState<ContentMap>({});
  const [media, setMedia] = useState<MediaMap>({});
  const [toast, setToast] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth').then(r => {
      setAuthed(r.ok);
      setChecking(false);
      if (r.ok) loadData();
    });
  }, []);

  async function loadData() {
    const res = await fetch('/api/content');
    const data = await res.json();
    if (data.success) {
      setContent(data.content);
      setMedia(data.media);
    }
  }

  async function doLogin() {
    setLoginError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setAuthed(true);
      loadData();
    } else {
      setLoginError(data.message || 'خطأ في تسجيل الدخول');
    }
  }

  async function doLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthed(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function saveField(key: string) {
    const val = content[key] || { en: '', ar: '' };
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value_en: val.en, value_ar: val.ar }),
    });
    const data = await res.json();
    showToast(data.success ? '✅ تم الحفظ' : '⚠ خطأ في الحفظ');
  }

  async function uploadImage(slot: string, file: File) {
    setUploading(slot);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slot', slot);
    const res = await fetch('/api/media', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(null);
    if (data.success) {
      showToast('✅ تم رفع الصورة');
      loadData();
    } else {
      showToast('⚠ ' + (data.message || 'خطأ في الرفع'));
    }
  }

  const S = {
    page: { minHeight: '100vh', background: '#F0EAE0', padding: '2rem', direction: 'rtl' as const },
    card: { background: '#fff', borderRadius: 8, padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,.06)' },
    label: { fontWeight: 700, fontSize: '.85rem', color: '#3D2B0E', display: 'block', marginBottom: '.4rem' },
    input: { width: '100%', padding: '.6rem .8rem', border: '1px solid #E8D5B0', borderRadius: 6, fontFamily: 'Tajawal', fontSize: '.9rem', marginBottom: '.6rem', boxSizing: 'border-box' as const },
    btn: { padding: '.55rem 1.2rem', background: '#C8973A', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '.85rem' },
    loginBox: { maxWidth: 360, margin: '10vh auto', background: '#fff', padding: '2.5rem', borderRadius: 8, boxShadow: '0 10px 40px rgba(0,0,0,.15)' },
  };

  if (checking) return <div style={S.page}>...جاري التحقق</div>;

  if (!authed) {
    return (
      <div style={S.page}>
        <div style={S.loginBox}>
          <h2 style={{ color: '#C8973A', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', marginBottom: '1.5rem' }}>
            HARRASI ROPES — لوحة التحكم
          </h2>
          <input style={S.input} placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} />
          <input style={S.input} placeholder="كلمة المرور" type="password" value={password}
                 onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} />
          <button style={{ ...S.btn, width: '100%' }} onClick={doLogin}>دخول ←</button>
          {loginError && <p style={{ color: '#C0392B', fontSize: '.85rem', marginTop: '.75rem' }}>{loginError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', color: '#C8973A', fontSize: '1.8rem' }}>لوحة التحكم — النصوص والصور</h1>
        <button style={{ ...S.btn, background: '#C0392B' }} onClick={doLogout}>خروج</button>
      </div>

      <div style={S.card}>
        <h3 style={{ marginTop: 0 }}>📝 النصوص</h3>
        {TEXT_FIELDS.map(f => (
          <div key={f.key} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #F0EAE0', paddingBottom: '1rem' }}>
            <label style={S.label}>{f.label}</label>
            <input
              style={S.input}
              placeholder="النص بالعربي"
              value={content[f.key]?.ar || ''}
              onChange={e => setContent({ ...content, [f.key]: { ...content[f.key], ar: e.target.value, en: content[f.key]?.en || '' } })}
            />
            <input
              style={S.input}
              placeholder="Text in English"
              value={content[f.key]?.en || ''}
              onChange={e => setContent({ ...content, [f.key]: { ...content[f.key], en: e.target.value, ar: content[f.key]?.ar || '' } })}
            />
            <button style={S.btn} onClick={() => saveField(f.key)}>💾 حفظ</button>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <h3 style={{ marginTop: 0 }}>🖼️ الصور</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {IMAGE_SLOTS.map(s => (
            <div key={s.slot} style={{ border: '1px solid #E8D5B0', borderRadius: 8, padding: '1rem', textAlign: 'center' as const }}>
              <p style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: '.5rem' }}>{s.label}</p>
              {media[s.slot]?.url && (
                <img src={media[s.slot].url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: '.6rem' }} />
              )}
              <label style={{ ...S.btn, display: 'inline-block', cursor: 'pointer' }}>
                {uploading === s.slot ? '⏳ جاري الرفع...' : '⬆️ تغيير الصورة'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && uploadImage(s.slot, e.target.files[0])}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: 24, background: '#1A1208', color: '#F5ECD7', padding: '.8rem 1.4rem', borderRadius: 6 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

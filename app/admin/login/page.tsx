'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذّر تسجيل الدخول');
        setLoading(false);
        return;
      }
      window.location.href = '/admin';
    } catch {
      setError('تعذّر الاتصال بالخادم');
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" lang="ar" className="login-screen">
      <div className="login-card">
        <img src="/logo.png" alt="شعار الحراصي للحبال" />
        <span className="eyebrow center">لوحة التحكم</span>
        <h1>الحراصي للحبال</h1>
        <p className="login-sub">منطقة خاصة بإدارة محتوى الموقع</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <div className="pw-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label="إظهار كلمة المرور"
              >
                👁
              </button>
            </div>
          </div>
          {error && <p className="login-error">{error}</p>}
          <label className="remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            تذكرني على هذا الجهاز
          </label>
          <button type="submit" className="btn btn-solid full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'دخول'}
          </button>
        </form>
        <a className="back-home" href="/">→ العودة للموقع</a>
      </div>
    </div>
  );
}

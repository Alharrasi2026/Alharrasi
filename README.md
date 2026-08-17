# مصنع الحراصي للحبال — الموقع الإلكتروني

موقع Next.js (App Router) بثلاث صفحات: الرئيسية، المجموعة الكاملة (المنتجات)، ولوحة تحكم `/admin` لتعديل النصوص والمنتجات والصور دون كتابة كود.

## التقنيات
- **Next.js 14** (App Router) + TypeScript
- **Vercel Postgres** — تخزين النصوص والمنتجات
- **Vercel Blob** — تخزين الصور المرفوعة
- **jose + bcryptjs** — تسجيل دخول الأدمن بجلسة JWT في كوكي httpOnly

## التطوير محلياً
```bash
npm install
cp .env.example .env.local   # ثم عدّل AUTH_SECRET
npm run dev
```
بدون ربط قاعدة بيانات، الموقع يعمل فوراً بمحتوى افتراضي (نفس نصوص المصنع الحالية) — مفيد للمعاينة السريعة. لوحة `/admin` تحتاج قاعدة بيانات فعلية لتسجيل الدخول والحفظ.

## خطوات النشر على Vercel

### ١ — ارفع المشروع إلى GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/alharrasi-ropes.git
git push -u origin main
```

### ٢ — استورد المشروع في Vercel
اذهب إلى [vercel.com/new](https://vercel.com/new) واختر المستودع. أول نشر سيفشل لأن قاعدة البيانات غير مربوطة بعد — طبيعي، أكمل للخطوة التالية.

### ٣ — أضف Vercel Postgres
من داخل المشروع في Vercel → تبويب **Storage** → **Create Database** → **Postgres** → اربطها بالمشروع. بعدها من تبويب **Query** الصق محتوى `schema.sql` بالكامل واضغط **Run**.

### ٤ — أضف Vercel Blob
من نفس تبويب **Storage** → **Create Database** → **Blob** → اربطها بالمشروع.

### ٥ — أضف متغيرات البيئة
**Project Settings → Environment Variables:**

| المتغير | القيمة |
|---|---|
| `AUTH_SECRET` | نص عشوائي طويل (٣٢ حرف فأكثر) |

> `POSTGRES_URL` و `BLOB_READ_WRITE_TOKEN` تُضاف تلقائياً عند ربط قاعدة البيانات والـ Blob في الخطوتين ٣ و٤.

### ٦ — أعد النشر
من تبويب **Deployments** → آخر نشر → **Redeploy**.

### ٧ — ربط دومين alharrasiropes.com
**Project Settings → Domains** → أضف الدومين، وأضف سجلات الـ DNS التي يعطيك إياها Vercel في لوحة تحكم Namecheap.

## تسجيل الدخول للوحة التحكم
بعد تشغيل `schema.sql`، افتح `/admin` وسجّل الدخول بـ:
- **اسم المستخدم:** `admin`
- **كلمة المرور:** `Harrasi@2026`

**غيّر كلمة المرور فوراً** من لوحة التحكم → الإعدادات → تغيير كلمة المرور.

## هيكل المشروع
```
app/
  page.tsx              الصفحة الرئيسية
  products/              صفحة المجموعة الكاملة + فلترة القطاعات
  admin/
    login/page.tsx       تسجيل الدخول
    page.tsx + AdminDashboard.tsx   لوحة التحكم
  api/
    content/              GET عام، PUT محمي — نصوص الموقع
    products/              GET عام، POST محمي — قائمة المنتجات
    products/[id]/          PUT / DELETE محمي — تعديل وحذف منتج
    media/                  GET/POST/DELETE محمي — مكتبة الصور (Vercel Blob)
    admin/login|logout|password/   تسجيل الدخول والخروج وتغيير كلمة المرور
lib/db.ts               استعلامات قاعدة البيانات
lib/auth.ts              الجلسات (JWT)
middleware.ts            يحمي /admin ويحوّل لتسجيل الدخول عند عدم وجود جلسة
schema.sql                هيكل قاعدة البيانات + بيانات أولية
```

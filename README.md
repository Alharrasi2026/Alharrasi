# مصنع حبال الحراصي — نسخة Vercel
## Al-Harrasi Ropes Factory — Vercel-Ready Version

هذه نسخة معاد بناؤها بالكامل بتقنية **Next.js** لتعمل مباشرة على **Vercel** (مجاني للبداية)، مع:
- 🌐 نفس تصميم الموقع الأصلي 100%
- 🔐 لوحة تحكم بسيطة `/admin` لتغيير **النصوص والصور فقط**
- 📧 نموذج تواصل يرسل بريداً إلكترونياً (Resend) ويعطي رابط واتساب
- 🗄️ قاعدة بيانات Vercel Postgres + تخزين صور Vercel Blob

---

## 🚀 خطوات النشر على Vercel

### الخطوة 1 — ارفع المشروع على GitHub
1. أنشئ مستودع (repository) جديد فارغ على GitHub
2. ارفع كل ملفات هذا المجلد إليه:
```bash
git init
git add .
git commit -m "Al-Harrasi Ropes - Vercel version"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harrasi-ropes.git
git push -u origin main
```

### الخطوة 2 — استورد المشروع في Vercel
1. اذهب إلى https://vercel.com/new
2. اختر المستودع اللي رفعته
3. اضغط **Deploy** (سيفشل أول مرة لأن قاعدة البيانات غير مربوطة بعد — طبيعي، أكمل للخطوة التالية)

### الخطوة 3 — أضف قاعدة بيانات Vercel Postgres
1. من داخل مشروعك في Vercel → تبويب **Storage**
2. اضغط **Create Database** → اختر **Postgres**
3. اربطها بالمشروع (Connect to Project)
4. بعد الربط، اذهب إلى تبويب **Query** داخل قاعدة البيانات
5. الصق محتوى ملف `schema.sql` بالكامل واضغط **Run**

### الخطوة 4 — أضف Vercel Blob (لتخزين الصور)
1. من نفس تبويب **Storage** → **Create Database** → اختر **Blob**
2. اربطها بالمشروع أيضاً

### الخطوة 5 — أضف متغيرات البيئة (Environment Variables)
من **Project Settings → Environment Variables** أضف:

| المتغير | القيمة |
|---|---|
| `AUTH_SECRET` | أي نص عشوائي طويل (32+ حرف) |
| `RESEND_API_KEY` | مفتاح من https://resend.com (مجاني، للإيميلات) |
| `MAIL_FROM` | `Al-Harrasi Ropes <onboarding@resend.dev>` |
| `MAIL_TO` | `Alharrasi.ropf@hotmail.com` |
| `WA_PHONE` | `96890103771` |

> ملاحظة: متغيرات `POSTGRES_URL` و `BLOB_READ_WRITE_TOKEN` تُضاف تلقائياً عند ربط قاعدة البيانات والـ Blob في الخطوتين 3 و 4.

### الخطوة 6 — أعد النشر (Redeploy)
من تبويب **Deployments** → اضغط على آخر نشر → **Redeploy**

### الخطوة 7 — ربط دومين Namecheap
1. في Vercel: **Project Settings → Domains** → أضف الدومين (مثال: `harrasiropes.com`)
2. Vercel سيعطيك سجلات DNS (عادة CNAME أو A record)
3. في Namecheap: **Domain List → Manage → Advanced DNS**
4. أضف السجلات اللي أعطاك إياها Vercel:
   - Type: `A`, Host: `@`, Value: `76.76.21.21` (أو القيمة اللي تظهر لك في Vercel)
   - Type: `CNAME`, Host: `www`, Value: `cname.vercel-dns.com`
5. انتظر 30-60 دقيقة لانتشار DNS
6. Vercel سيفعّل SSL (https) تلقائياً ومجاناً

---

## 🔑 الدخول إلى لوحة التحكم
- الرابط: `https://yourdomain.com/admin`
- اسم المستخدم: `admin`
- كلمة المرور: `Admin@123`

⚠️ **لتغيير كلمة المرور:** شغّل هذا الأمر محلياً لإنشاء كلمة مرور جديدة، ثم حدّث الصف في جدول `admin_users` عبر Vercel Postgres Query tab:
```bash
node -e "console.log(require('bcryptjs').hashSync('كلمة_المرور_الجديدة', 10))"
```
```sql
UPDATE admin_users SET password_hash = 'الهاش_الناتج' WHERE username = 'admin';
```

---

## 💻 التشغيل محلياً (اختياري، للتجربة قبل النشر)
```bash
npm install
cp .env.example .env.local
# عبّي المتغيرات في .env.local (تحتاج قاعدة بيانات Vercel Postgres حتى محلياً،
# أو استخدم vercel env pull بعد ربط المشروع بـ Vercel CLI)
npm run dev
```
افتح `http://localhost:3000`

---

## 📁 هيكل المشروع
```
app/
├── route.ts              ← يخدم الموقع الرئيسي (يقرأ النصوص/الصور من القاعدة)
├── layout.tsx             ← Layout أساسي (للوحة التحكم فقط)
├── admin/page.tsx          ← لوحة التحكم (نصوص + صور)
└── api/
    ├── auth/route.ts       ← تسجيل الدخول/الخروج
    ├── content/route.ts    ← قراءة/تحديث النصوص
    ├── media/route.ts      ← رفع الصور (Vercel Blob)
    └── contact/route.ts    ← استقبال نموذج التواصل + إرسال إيميل
lib/
├── db.ts                  ← اتصال قاعدة البيانات
└── auth.ts                ← جلسة تسجيل الدخول (JWT في كوكي)
public/
└── site-template.html      ← ملف الموقع الأصلي كاملاً مع رموز {{...}} قابلة للاستبدال
schema.sql                  ← أوامر إنشاء الجداول (تُشغَّل مرة واحدة على Vercel Postgres)
```

---

## 💰 التكلفة المتوقعة (خطة Vercel المجانية Hobby)
| الخدمة | الحد المجاني |
|---|---|
| الاستضافة (Bandwidth) | 100 GB شهرياً |
| قاعدة البيانات Postgres | كافية لموقع صغير-متوسط |
| تخزين الصور Blob | 1 GB مساحة، 10 GB نقل شهرياً |
| البريد (Resend) | 3000 إيميل شهرياً مجاناً |

⚠️ **ملاحظة مهمة:** خطة Vercel المجانية (Hobby) مخصصة رسمياً للاستخدام **الشخصي وغير التجاري**. بما أن هذا موقع تجاري لمصنع، يُنصح بالانتقال لخطة **Pro ($20/شهر)** عند بدء الاستخدام الفعلي لتفادي أي قيود مستقبلية. إذا زاد حجم الصور عن 1GB، فكّر أيضاً بالانتقال إلى Supabase Storage كبديل أرخص للتخزين فقط (يمكن دمجه بسهولة لاحقاً).

---

## 📞 للاستفسار
البريد: Alharrasi.ropf@hotmail.com
واتساب: +968 9010 3771

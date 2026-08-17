import { getSiteContent, getProducts } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { RopeDivider } from '@/components/RopeDivider';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductIcon } from '@/components/icons';

export default async function HomePage() {
  const content = await getSiteContent();
  const products = (await getProducts()).slice(0, 3);

  return (
    <div dir="rtl" lang="ar">
      <ScrollReveal />
      <Nav active="home" />

      <header className="hero">
        <div className="wrap">
          <div className="hero-mark reveal">
            <div className="glow" />
            <img src="/logo.png" alt="شعار الحراصي للحبال" />
          </div>
          <span className="eyebrow center">{content.hero_eyebrow}</span>
          <h1 className="reveal">
            <span className="shimmer">{content.hero_title}</span>
          </h1>
          <p className="reveal">{content.hero_desc}</p>
          <div className="hero-actions reveal">
            <a className="btn btn-solid" href={`https://wa.me/${content.contact_whatsapp}`} target="_blank" rel="noopener noreferrer">
              تواصل عبر واتساب
            </a>
            <a className="btn btn-ghost" href="/products">استعرض المجموعة</a>
          </div>

          <div className="ledger reveal">
            <div className="stat"><b>{content.stat_founded}</b><span>سنة التأسيس</span></div>
            <div className="stat"><b>{content.stat_lines}</b><span>خطوط إنتاج</span></div>
            <div className="stat"><b>{content.stat_omani}</b><span>صناعة عُمانية</span></div>
            <div className="stat"><b>{content.stat_sectors}</b><span>قطاعات نخدمها</span></div>
          </div>
        </div>
      </header>

      <RopeDivider />

      <section className="heritage" id="heritage">
        <div className="wrap heritage-grid">
          <div className="reveal">
            <span className="eyebrow">الإرث</span>
            <h2>{content.about_title}</h2>
            <p>{content.about_body1}</p>
            <p>{content.about_body2}</p>
          </div>
          <div className="chrono reveal">
            <div className="c-item">
              <b>{content.timeline_1_title}</b>
              <span>{content.timeline_1_body}</span>
            </div>
            <div className="c-item">
              <b>{content.timeline_2_title}</b>
              <span>{content.timeline_2_body}</span>
            </div>
            <div className="c-item">
              <b>{content.timeline_3_title}</b>
              <span>{content.timeline_3_body}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow center">المجموعة</span>
            <h2>حبال وخيوط مُنتقاة لكل استخدام</h2>
            <p>من الحبال الصناعية الثقيلة إلى الخيوط الزراعية الدقيقة، كل قطعة في مجموعتنا مصمّمة لأداء محدد.</p>
          </div>
          <div className="c-grid">
            {products.map((p) => (
              <div className="c-card reveal" key={p.id}>
                <span className="bl" /><span className="br" />
                <ProductIcon iconKey={p.icon_key} className="coil" />
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="rule" />
              </div>
            ))}
          </div>
          <div className="view-all reveal">
            <a className="btn btn-ghost" href="/products">عرض كل المجموعة</a>
          </div>
        </div>
      </section>

      <section className="atelier" id="atelier">
        <div className="wrap atelier-grid">
          <div className="reveal">
            <span className="eyebrow">لوحة التحكم</span>
            <h2>استوديو محتوى خاص بكم</h2>
            <p>بعد تسجيل الدخول، يملك صاحب المصنع لوحة أنيقة لتحديث الموقع بنفسه، دون الحاجة لمبرمج في كل مرة.</p>
            <ul>
              <li>تعديل النصوص الرئيسية (العناوين، الأوصاف، بيانات التواصل)</li>
              <li>رفع وتبديل صور المنتجات والمصنع بسحب وإفلات</li>
              <li>حفظ فوري، والتغييرات تظهر مباشرة على الموقع المباشر</li>
            </ul>
            <a className="btn btn-solid" href="/admin">فتح لوحة التحكم</a>
          </div>
          <div className="studio reveal">
            <div className="studio-bar"><span className="studio-dot" /><span className="studio-dot" /><span className="studio-dot" /><span>استوديو المحتوى</span></div>
            <div className="studio-body">
              <div className="studio-field"><label>عنوان الصفحة الرئيسية</label><div className="studio-input" /></div>
              <div className="studio-field"><label>الوصف</label><div className="studio-input tall" /></div>
              <div className="studio-row">
                <div className="studio-field"><label>صورة المنتج ١</label><div className="studio-img">رفع صورة</div></div>
                <div className="studio-field"><label>صورة المنتج ٢</label><div className="studio-img">رفع صورة</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap">
          <span className="eyebrow center">تواصل معنا</span>
          <h2 className="reveal">جاهزون لتلبية طلبك القادم</h2>
          <p className="reveal">للاستفسار عن الأسعار أو الكميات، تواصل معنا مباشرة عبر واتساب أو البريد الإلكتروني.</p>
          <div className="hero-actions reveal">
            <a className="btn btn-solid" href={`https://wa.me/${content.contact_whatsapp}`} target="_blank" rel="noopener noreferrer">
              واتساب: {content.contact_whatsapp}
            </a>
            <a className="btn btn-ghost" href={`mailto:${content.contact_email}`}>{content.contact_email}</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

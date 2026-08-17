import { getProducts, getSiteContent } from '@/lib/db';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductFilter } from './ProductFilter';

export const metadata = {
  title: 'المجموعة الكاملة — الحراصي للحبال',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent()]);

  return (
    <div dir="rtl" lang="ar">
      <ScrollReveal />
      <Nav active="products" />

      <header className="banner">
        <div className="wrap">
          <img src="/logo.png" alt="" className="reveal" />
          <span className="eyebrow center">المجموعة الكاملة</span>
          <h1 className="reveal">حبال وخيوط لكل قطاع</h1>
          <p className="reveal">تصفّح مجموعتنا الكاملة، أو صفِّ حسب القطاع الذي تعمل فيه لتصل إلى المنتج المناسب مباشرة.</p>
        </div>
      </header>

      <ProductFilter products={products} />

      <section className="contact-strip">
        <div className="wrap">
          <span className="eyebrow center">لم تجد ما تبحث عنه؟</span>
          <h2>نصنع حسب الطلب أيضاً</h2>
          <p>تواصل معنا لمواصفات أو كميات خاصة، وسنرشدك لأنسب حل.</p>
          <a className="btn btn-solid" href={`https://wa.me/${content.contact_whatsapp}`} target="_blank" rel="noopener noreferrer">
            تواصل عبر واتساب
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

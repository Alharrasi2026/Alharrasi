type Props = { active?: 'home' | 'products' };

export function Nav({ active }: Props) {
  return (
    <nav className="nav">
      <a className="nav-brand" href="/">
        <img src="/logo.png" alt="شعار الحراصي للحبال" />
        الحراصي للحبال
      </a>
      <div className="nav-links">
        <a href="/" className={active === 'home' ? 'active' : ''}>الرئيسية</a>
        <a href="/products" className={active === 'products' ? 'active' : ''}>المجموعة</a>
        <a href="/admin">استوديو المحتوى</a>
        <a href="/#contact">تواصل</a>
      </div>
      <a className="nav-cta" href="/#contact">اطلب عرض سعر</a>
    </nav>
  );
}

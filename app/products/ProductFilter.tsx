'use client';

import { useState } from 'react';
import { Product } from '@/lib/db';
import { ProductIcon } from '@/components/icons';

const SECTOR_LABEL: Record<string, string> = {
  industrial: 'صناعي',
  marine: 'بحري',
  agri: 'زراعي',
};

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function toArabicNumeral(n: number): string {
  return n
    .toString()
    .padStart(2, '0')
    .split('')
    .map((d) => ARABIC_DIGITS[Number(d)])
    .join('');
}

export function ProductFilter({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<'all' | 'industrial' | 'marine' | 'agri'>('all');

  const visible = products.filter((p) => filter === 'all' || p.sectors.includes(filter));

  return (
    <>
      <div className="filters wrap" role="group" aria-label="تصفية حسب القطاع">
        {(['all', 'industrial', 'marine', 'agri'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={`filter-btn${filter === key ? ' active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? 'الكل' : SECTOR_LABEL[key]}
          </button>
        ))}
      </div>

      <section className="catalog wrap">
        {products.map((p, i) => (
          <div className={`item${visible.includes(p) ? '' : ' hide'}`} key={p.id}>
            <div className="item-visual">
              <span className="item-num">{toArabicNumeral(i + 1)}</span>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} />
              ) : (
                <ProductIcon iconKey={p.icon_key} />
              )}
            </div>
            <div className="item-body">
              <div className="item-top">
                <h3>{p.name}</h3>
                <div className="item-tags">
                  {p.sectors.map((s) => (
                    <span className="tag" key={s}>{SECTOR_LABEL[s] || s}</span>
                  ))}
                </div>
              </div>
              <p>{p.description}</p>
              <div className="item-specs">
                <div><b>الخامة</b>{p.material}</div>
                <div><b>الاستخدام الشائع</b>{p.common_use}</div>
                <div><b>الميزة</b>{p.feature}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

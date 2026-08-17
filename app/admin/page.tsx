import { getSiteContent, getProducts, getMedia } from '@/lib/db';
import { AdminDashboard } from './AdminDashboard';

export default async function AdminPage() {
  const [content, products, media] = await Promise.all([getSiteContent(), getProducts(), getMedia()]);

  return <AdminDashboard initialContent={content} initialProducts={products} initialMedia={media} />;
}

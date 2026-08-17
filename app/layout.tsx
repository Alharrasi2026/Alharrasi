import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'الحراصي للحبال',
  description: 'مصنع الحراصي للحبال — حبال وخيوط صناعية وبحرية وزراعية عُمانية الصنع منذ عام ٢٠١٨.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}

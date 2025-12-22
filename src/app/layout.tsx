import type { Metadata } from 'next';
import { Cormorant_Garamond, Lato } from 'next/font/google';
import './globals.css';

// Elegant, modern serif for headings and branding
const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Clean sans-serif for body text
const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gültekin Ataseven Atelier | Luxury Wedding Gowns',
  description: 'Gültekin Ataseven is a luxury bridal atelier creating timeless, elegant wedding dresses for the modern bride. Book your private appointment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}

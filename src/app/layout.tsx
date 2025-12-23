import type { Metadata } from 'next';
import { Lato, Jost, Montserrat } from 'next/font/google';
import './globals.css';

// Clean sans-serif for body text
const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

// Geometric sans-serif for titles and nav (Futura PT alternative)
const jost = Jost({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});

// Elegant sans-serif for descriptions
const montserrat = Montserrat({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-montserrat',
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
      <body className={`${lato.variable} ${jost.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}

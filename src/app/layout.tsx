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
  title: 'Gültekin Ataseven | Gelintikte Yeni Bir Tarz',
  description: 'Gültekin Ataseven, modern gelinler için zamansız ve zarif gelinlikler tasarlayan lüks bir gelinlik atölyesidir. Özel randevunuzu şimdi alın.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${lato.variable} ${jost.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}

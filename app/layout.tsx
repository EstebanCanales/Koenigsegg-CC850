import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Koenigsegg CC850 | Pure Elegance',
  description: 'The visceral return of mechanical purity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} antialiased`}>
      <body className="font-serif bg-white text-[#111111]">{children}</body>
    </html>
  );
}

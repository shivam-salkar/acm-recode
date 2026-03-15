import type { Metadata } from 'next';
import { JetBrains_Mono, Inter, Syne, Archivo_Black } from 'next/font/google';
import './globals.css'; // Global styles
import 'flexlayout-react/style/dark.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
});

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-compact',
});

export const metadata: Metadata = {
  title: 'DeepTrade Terminal - Living Instrument',
  description: 'High-Frequency Market Analysis Terminal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} ${syne.variable} ${archivoBlack.variable} dark`}>
      <body className="font-sans font-medium bg-[#0B0E11] text-gray-200 antialiased overflow-hidden h-screen w-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

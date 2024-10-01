import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '@/utils';

const ubuntu = localFont({
  src: './fonts/Ubuntu-Regular.ttf',
  variable: '--font-ubuntu',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Cantina NRD',
  description: 'Uma cantina do nosso jeito',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${ubuntu.variable} ${ubuntu.variable}`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}

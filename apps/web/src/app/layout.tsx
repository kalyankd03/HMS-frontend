import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Hospital Management System',
    default: 'Hospital Management System',
  },
  description: 'Comprehensive hospital management and patient care system',
  keywords: ['hospital', 'healthcare', 'patient management', 'medical records'],
  authors: [{ name: 'HMS Team' }],
  openGraph: {
    type: 'website',
    siteName: 'Hospital Management System',
    title: 'Hospital Management System',
    description: 'Comprehensive hospital management and patient care system',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Hospital Management System',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              description: 'Comprehensive hospital management and patient care system',
            }),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
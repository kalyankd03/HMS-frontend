import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Hospital Management System',
    default: 'Hospital Management System',
  },
  description: 'Comprehensive hospital management and patient care system',
  keywords: ['hospital', 'healthcare', 'patient management', 'medical records'],
  authors: [{ name: 'HMS Team' }],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo2.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/logo2.png', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Hospital Management System',
    title: 'Hospital Management System',
    description: 'Comprehensive hospital management and patient care system',
    images: [{ url: '/logo2.png' }],
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
  readonly children: React.ReactNode;
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
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
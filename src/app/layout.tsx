import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'HMS - Hospital Management System',
  description: 'Hospital Management System Frontend',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no,email=no,address=no" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <div className="safe-area min-h-screen bg-gray-50">
          <div className="container py-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

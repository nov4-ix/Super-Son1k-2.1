'use client';

import './globals.css';
import './globals-mobile.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'Son1kvers3 - The Generator',
  description: 'Crea música profesional con IA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'The Generator',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0A0C10',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="safe-area-top safe-area-bottom">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🎉 Fiesta Fin de Año 2026 - Pide tu canción',
  description: 'Pide canciones para la fiesta de Nochevieja. ¡Bienvenidos al 2026!',
  keywords: ['fiesta', 'nochevieja', '2026', 'canciones', 'música', 'año nuevo'],
  authors: [{ name: 'Fiesta 2026' }],
  openGraph: {
    title: '🎉 Fiesta Fin de Año 2026',
    description: 'Pide canciones para la fiesta de Nochevieja',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎉</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

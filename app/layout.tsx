import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header'; 
import Footer from './components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://thegrindchronicle.com'),
  title: {
    default: 'The Grind Chronicle | Stories Behind Greatness',
    template: '%s | The Grind Chronicle',
  },
  description: 'Deep, emotional, and human stories behind sports icons and legends.',
  openGraph: {
    title: 'The Grind Chronicle',
    description: 'Stories Behind Greatness.',
    url: 'https://thegrindchronicle.com',
    siteName: 'The Grind Chronicle',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Grind Chronicle',
    description: 'Stories Behind Greatness.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
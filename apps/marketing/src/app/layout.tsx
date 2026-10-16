import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Civet - AI-Powered Website Translation',
  description:
    'Translate your website with AI. Reach global audiences in 110+ languages. 2-minute setup, no coding required. 60% cheaper than Weglot.',
  keywords: [
    'website translation',
    'AI translation',
    'multilingual website',
    'Weglot alternative',
    'website localization',
    'SEO translation',
  ],
  authors: [{ name: 'Civet' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://civet.io',
    siteName: 'Civet',
    title: 'Civet - AI-Powered Website Translation',
    description:
      'Translate your website with AI. Reach global audiences in 110+ languages. 60% cheaper than Weglot.',
    images: [
      {
        url: 'https://civet.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Civet - AI-Powered Website Translation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civet - AI-Powered Website Translation',
    description:
      'Translate your website with AI. Reach global audiences in 110+ languages.',
    images: ['https://civet.io/og-image.jpg'],
    creator: '@civet',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

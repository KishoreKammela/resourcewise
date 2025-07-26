import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  title:
    'ResourceWise | AI-Powered Resource Management for Technical Consultancies',
  description:
    'The intelligent platform for resource allocation, skill matching, and project management. Purpose-built for consultancy companies, ODCs, and IT services organizations.',
  keywords: [
    'resource management',
    'technical consultancy',
    'resource allocation',
    'skill matching',
    'project management software',
    'ODC management',
    'IT services',
    'Gemini API',
    'Genkit',
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    url: siteUrl,
    title:
      'ResourceWise | AI-Powered Resource Management for Technical Consultancies',
    description:
      'Intelligent resource allocation and project management for technical consultancies.',
    siteName: 'ResourceWise',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResourceWise Platform Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'ResourceWise | AI-Powered Resource Management for Technical Consultancies',
    description:
      'The intelligent platform for resource allocation, skill matching, and project management, powered by Gemini AI.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ResourceWise',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'The intelligent platform for resource allocation, skill matching, and project management. Purpose-built for consultancy companies, ODCs, and IT services organizations.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      email: 'sales@resourcwise.com',
    },
    sameAs: [
      'https://twitter.com/resourcwise',
      'https://linkedin.com/company/resourcwise',
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppShell>{children}</AppShell>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

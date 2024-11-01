import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import localFont from 'next/font/local';
import { Toaster, TooltipProvider } from '@/components/ui';
import { QueryProvider, ThemeProvider, ClerkProvider } from '@/provider';

import '@/styles/globals.css';
import '@/styles/index.css';

// Settings font
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const quickSandFont = localFont({
  src: [
    {
      path: './fonts/Quicksand-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Quicksand-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-quicksand',
});

// Settings metadata
export const metadata: Metadata = {
  title: 'cSol',
  description: 'Connect, share, and discover new experiences with cSol.',
};

// Settings viewport
export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const NProgressProviderDynamic = dynamic(
  () => import('@/provider').then((res) => res.NProgressProvider),
  {
    ssr: false,
  },
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="stylesheet" href="https://unpkg.com/cloudinary-video-player@2.1.0/dist/cld-video-player.css" />
          </head>
          <body
            className={`${quickSandFont.className} ${geistMono.variable} ${geistSans.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              themes={['light', 'dark']}
              defaultTheme="light"
              disableTransitionOnChange
            >
              <NProgressProviderDynamic>
                <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
              </NProgressProviderDynamic>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}


'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DriverStatusProvider } from '@/app/contexts/driver-status-context';

// Since we are using client-side state management for the timer, 
// we can remove the static metadata generation.
// export const metadata: Metadata = {
//   title: 'DriveWise',
//   description: 'Your personal dashboard for ride-sharing success.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>DriveWise</title>
        <meta name="description" content="Your personal dashboard for ride-sharing success." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <DriverStatusProvider>
          {children}
          <Toaster />
        </DriverStatusProvider>
      </body>
    </html>
  );
}

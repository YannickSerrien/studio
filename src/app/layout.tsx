
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DriverStatusProvider, useDriverStatus } from '@/app/contexts/driver-status-context';
import type { Settings as AppSettings } from '@/app/lib/data';


function AppContent({ children }: { children: React.ReactNode }) {
  // We need to wrap the logic in a component so we can use the hooks
  const router = useRouter();
  const { showWellnessNudge, setShowWellnessNudge } = useDriverStatus();
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Karen',
    currency: '€',
    country: 'Netherlands',
    city: '3',
  });

  useEffect(() => {
    if (showWellnessNudge) {
      const queryParams = new URLSearchParams({
        prompt: `Hey ${settings.name}, you've been driving for a while now. Time for a well-deserved break! Let me know if you'd like some ideas for how to best spend your break time.`
      }).toString();
      router.push(`/chatbot?${queryParams}`);
      setShowWellnessNudge(false); // Reset the nudge to prevent re-triggering
    }
  }, [showWellnessNudge, router, settings.name, setShowWellnessNudge]);
  
  return <>{children}</>;
}


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
           <AppContent>
             {children}
           </AppContent>
          <Toaster />
        </DriverStatusProvider>
      </body>
    </html>
  );
}

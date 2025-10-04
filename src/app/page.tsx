
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/app/components/dashboard/header';
import { WeeklySummary } from '@/app/components/dashboard/weekly-summary';
import { DailyHighlights } from '@/app/components/dashboard/daily-highlights';
import { IncentiveTracker } from '@/app/components/dashboard/incentive-tracker';
import { WellnessNudge } from '@/app/components/dashboard/wellness-nudge';
import { type Settings as AppSettings } from '@/app/lib/data';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Bot, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import { DriverStatus } from '@/app/components/dashboard/driver-status';

const BREAK_THRESHOLD_SECONDS = 16200; // 4.5 hours

export default function Home() {
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Driver',
    currency: '$',
    location: 'San Francisco, CA',
  });
  const [isDriving, setIsDriving] = useState(false);
  const [drivingSeconds, setDrivingSeconds] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (drivingSeconds > BREAK_THRESHOLD_SECONDS) {
      const queryParams = new URLSearchParams({
        prompt: `Hey ${settings.name}, you've been driving for a while now. Time for a well-deserved break! Let me know if you'd like some ideas for how to best spend your break time.`
      }).toString();
      router.push(`/chatbot?${queryParams}`);
    }
  }, [drivingSeconds, router, settings.name]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">
                <SidebarMenuButton tooltip="Dashboard" isActive={pathname === '/'}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/chatbot">
                <SidebarMenuButton tooltip="AI Chatbot" isActive={pathname === '/chatbot'}>
                  <Bot />
                  <span>AI Chatbot</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SettingsDialog settings={settings} onSettingsChange={setSettings}>
                 <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
              </SettingsDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="mx-auto max-w-7xl">
              <DriverStatus
                isDriving={isDriving}
                setIsDriving={setIsDriving}
                drivingSeconds={drivingSeconds}
                setDrivingSeconds={setDrivingSeconds}
              />
            </div>
            <div className="mx-auto max-w-7xl">
              <IncentiveTracker />
            </div>
            <div className="mx-auto max-w-7xl">
              <WeeklySummary currency={settings.currency} />
            </div>
            <div className="mx-auto max-w-7xl">
              <DailyHighlights currency={settings.currency} />
            </div>
          </main>
          <WellnessNudge showNudge={drivingSeconds > BREAK_THRESHOLD_SECONDS} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

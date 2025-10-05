
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
import { usePathname, useRouter } from 'next/navigation';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import { DriverStatus } from '@/app/components/dashboard/driver-status';
import { useDriverStatus } from '@/app/contexts/driver-status-context';
import { ScheduleDrive } from '@/app/components/dashboard/schedule-drive';

export default function Home() {
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Karen',
    currency: '€',
    country: 'Netherlands',
    city: '3',
  });
  const { showWellnessNudge, setShowWellnessNudge } = useDriverStatus();
  const pathname = usePathname();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (showWellnessNudge) {
      const queryParams = new URLSearchParams({
        prompt: `Hey ${settings.name}, you've been driving for a while now. Time for a well-deserved break! Let me know if you'd like some ideas for how to best spend your break time.`
      }).toString();
      router.push(`/chatbot?${queryParams}`);
      setShowWellnessNudge(false); // Reset the nudge to prevent re-triggering
    }
  }, [showWellnessNudge, router, settings.name, setShowWellnessNudge]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            {/* This is the mobile-only header */}
             <div className="p-4 sm:hidden">
                <Header />
            </div>
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
                <SidebarMenuButton tooltip="Settings" onClick={() => setIsSettingsOpen(true)}>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <div className="hidden sm:block">
            <Header />
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="mx-auto max-w-7xl">
              <DriverStatus />
            </div>
            <div className="mx-auto max-w-7xl">
              <ScheduleDrive city={settings.city} />
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
          <WellnessNudge />
        </div>
      </SidebarInset>
       <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}

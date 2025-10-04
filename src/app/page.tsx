'use client';

import { useState } from 'react';
import { Header } from '@/app/components/dashboard/header';
import { WeeklySummary } from '@/app/components/dashboard/weekly-summary';
import { DailyHighlights } from '@/app/components/dashboard/daily-highlights';
import { IncentiveTracker } from '@/app/components/dashboard/incentive-tracker';
import { WellnessNudge } from '@/app/components/dashboard/wellness-nudge';
import { type Settings } from '@/app/lib/data';
import { Sidebar, SidebarProvider, SidebarInset, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Bot, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    currency: '$',
    location: 'San Francisco, CA',
  });
  const pathname = usePathname();

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
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-background">
          <Header settings={settings} onSettingsChange={setSettings} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="mx-auto max-w-7xl">
              <WeeklySummary currency={settings.currency} />
            </div>
            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              <DailyHighlights currency={settings.currency} />
              <IncentiveTracker />
            </div>
          </main>
          <WellnessNudge />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

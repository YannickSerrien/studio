
'use client';

import { useState } from 'react';
import { Header } from '@/app/components/dashboard/header';
import { WeeklySummary } from '@/app/components/dashboard/weekly-summary';
import { DailyHighlights } from '@/app/components/dashboard/daily-highlights';
import { IncentiveTracker } from '@/app/components/dashboard/incentive-tracker';
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
import { Bot, LayoutDashboard, Settings, CarFront } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import { useSettings } from '@/app/contexts/settings-context';


export default function DashboardPage() {
  const { settings, setSettings } = useSettings();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <div className="p-4 sm:hidden">
              {/* Mobile Header Placeholder */}
            </div>
            <SidebarMenuItem>
              <Link href="/dashboard">
                <SidebarMenuButton tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/driving">
                <SidebarMenuButton tooltip="Driving" isActive={pathname === '/driving'}>
                  <CarFront />
                  <span>Driving</span>
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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-muted/20">
            <div className="mx-auto max-w-7xl">
              <IncentiveTracker currency={settings.currency} />
            </div>
            <div className="mx-auto max-w-7xl">
              <WeeklySummary currency={settings.currency} />
            </div>
            <div className="mx-auto max-w-7xl">
              <DailyHighlights currency={settings.currency} />
            </div>
          </main>
        </div>
      </SidebarInset>
       <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}

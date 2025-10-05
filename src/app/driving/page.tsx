
'use client';

import { useState } from 'react';
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
import { Bot, LayoutDashboard, Settings, CarFront } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import { DriverStatus } from '@/app/components/dashboard/driver-status';
import { ScheduleDrive } from '@/app/components/dashboard/schedule-drive';
import { Header } from '@/app/components/dashboard/header';

export default function DrivingPage() {
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Karen',
    currency: '€',
    country: 'Netherlands',
    city: '3',
  });
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
              <Link href="/">
                <SidebarMenuButton tooltip="Dashboard" isActive={pathname === '/'}>
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
              <DriverStatus />
            </div>
            <div className="mx-auto max-w-7xl">
              <ScheduleDrive city={settings.city} currency={settings.currency} />
            </div>
          </main>
        </div>
      </SidebarInset>
       <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}

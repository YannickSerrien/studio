'use client';

import { Suspense } from 'react';
import { Bot, LayoutDashboard, Settings, CarFront } from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import { Header } from '@/app/components/dashboard/header';
import { useSettings } from '@/app/contexts/settings-context';
import { ChatbotClient } from '@/app/components/chatbot/chatbot-client';
import { Skeleton } from '@/components/ui/skeleton';


export default function ChatbotPage() {
  const { settings, setSettings } = useSettings();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
           <div className="p-4 sm:hidden">
              {/* Mobile Header Placeholder */}
            </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard">
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={pathname === '/dashboard'}
                >
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
                <SidebarMenuButton
                  tooltip="AI Chatbot"
                  isActive={pathname === '/chatbot'}
                >
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/20">
            <div className="mx-auto max-w-3xl">
                <Suspense fallback={<Skeleton className="h-[calc(100vh-120px)]" />}>
                    <ChatbotClient />
                </Suspense>
            </div>
          </main>
        </div>
      </SidebarInset>
      <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}

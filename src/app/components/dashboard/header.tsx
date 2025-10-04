
'use client';
import { PanelLeft, Bot, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { type Settings as AppSettings } from '@/app/lib/data';
import { SettingsDialog } from './settings-dialog';

export function Header() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<AppSettings>({
    currency: '$',
    location: 'San Francisco, CA',
  });
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b">
      <div className="flex items-center gap-4">
         <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-2 text-lg font-medium">
                 <Link
                  href="/"
                  className={`flex items-center gap-4 px-2.5 ${pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSheetOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/chatbot"
                  className={`flex items-center gap-4 px-2.5 ${pathname === '/chatbot' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                   onClick={() => setSheetOpen(false)}
                >
                  <Bot className="h-5 w-5" />
                  AI Chatbot
                </Link>
                <button
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-lg font-medium"
                  onClick={() => {
                    setSheetOpen(false);
                    setSettingsOpen(true);
                  }}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
              </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">
          DriveWise
        </h1>
      </div>
       <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setSettingsOpen}>
          {/* This is a dummy trigger because a trigger is required, but we are opening the dialog programmatically. */}
          <button className="hidden"></button>
      </SettingsDialog>
    </header>
  );
}

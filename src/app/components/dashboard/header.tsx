
'use client';
import { PanelLeft, Bot, LayoutDashboard, Settings, CarFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SettingsDialog } from './settings-dialog';
import { useSettings } from '@/app/contexts/settings-context';


export function Header() {
  const pathname = usePathname();
  const { settings, setSettings } = useSettings();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/driving', label: 'Driving', icon: <CarFront className="h-5 w-5" /> },
    { href: '/chatbot', label: 'AI Chatbot', icon: <Bot className="h-5 w-5" /> },
    { href: '/availabilities', label: 'Availabilities', icon: <LayoutDashboard className="h-5 w-5" /> },
  ];

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium mt-4">
                <Link
                  href="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base mb-4"
                  onClick={() => setSheetOpen(false)}
                >
                  <CarFront className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">DriveWise</span>
                </Link>
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 px-2.5 ${pathname === link.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setSheetOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
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
          <h1 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">
            DriveWise
          </h1>
        </div>
        <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setSettingsOpen} />
      </header>
    </>
  );
}


'use client';

import { useState } from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfToday,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, LayoutDashboard, Settings, Calendar, CarFront } from 'lucide-react';
import { SettingsDialog } from '@/app/components/dashboard/settings-dialog';
import type { Settings as AppSettings } from '@/app/lib/data';
import { cn } from '@/lib/utils';
import { Header } from '@/app/components/dashboard/header';


function TimeSlot({ time }: { time: string }) {
  return (
    <div className="flex-none grid grid-cols-[auto_1fr] items-start gap-x-3">
      <p className="text-sm text-muted-foreground text-right">{time}</p>
      <div className="col-span-1 border-t border-border mt-3 w-full"></div>
    </div>
  );
}

export default function AvailabilitiesPage() {
  const [settings, setSettings] = useState<AppSettings>({
    name: 'Karen',
    currency: '€',
    country: 'Netherlands',
    city: '3',
  });
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  let today = startOfToday();
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const [selectedDay, setSelectedDay] = useState(today);

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
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
              <Link href="/driving">
                <SidebarMenuButton tooltip="Driving" isActive={pathname === '/driving'}>
                  <CarFront />
                  <span>Driving</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/availabilities">
                <SidebarMenuButton tooltip="Availabilities" isActive={pathname === '/availabilities'}>
                  <Calendar />
                  <span>Availabilities</span>
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
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-md">
              <h2 className="text-2xl font-bold mb-6">Availabilities</h2>
              <div className="bg-card border rounded-lg shadow-sm">
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {format(firstDayCurrentMonth, 'MMMM yyyy')}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 mt-4 text-center text-xs text-muted-foreground">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 mt-2">
                    {days.map((day, dayIdx) => (
                      <div
                        key={day.toString()}
                        className={cn(
                          dayIdx === 0 && `col-start-${(day.getDay() + 1)}`,
                          'py-1.5'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={cn(
                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                            isSameDay(day, selectedDay) && 'bg-primary text-primary-foreground',
                            !isSameDay(day, selectedDay) && isToday(day) && 'bg-accent/20 text-accent',
                            !isSameDay(day, selectedDay) && !isToday(day) && 'hover:bg-muted'
                          )}
                        >
                          <time dateTime={format(day, 'yyyy-MM-dd')}>
                            {format(day, 'd')}
                          </time>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 md:p-6 border-t">
                  <h3 className="font-semibold text-foreground">
                    <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                      {format(selectedDay, 'EEEE, MMM d')}
                    </time>
                  </h3>
                   <div className="mt-4 flex flex-col space-y-4">
                     {timeSlots.map((time, index) => (
                        <TimeSlot key={index} time={time} />
                      ))}
                    <p className="text-xs text-muted-foreground text-center pt-2">Shown in local time (CEST)</p>
                   </div>
                </div>
              </div>
               <div className="fixed bottom-6 right-6">
                <Button className="rounded-full h-14 w-14 shadow-lg">
                  <Plus className="h-6 w-6" />
                  <span className="sr-only">Add availability</span>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
      <SettingsDialog settings={settings} onSettingsChange={setSettings} open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}

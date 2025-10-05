
'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { earningsData, type DailyMetric } from '@/app/lib/data';
import { ChevronLeft, ChevronRight, Wallet, Car, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, convertAndRound } from '@/lib/utils';
import type { Settings } from '@/app/lib/data';

const chartConfig = {
  earnings: {
    label: 'Earnings',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;

type DailyHighlightsProps = {
  currency: Settings['currency'];
};

const MetricItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);

export function DailyHighlights({ currency }: DailyHighlightsProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  
  const currentWeekData = earningsData[currentWeekIndex];
  const convertedDailyMetrics = currentWeekData.dailyMetrics.map(metric => ({
    ...metric,
    earnings: convertAndRound(metric.earnings, currency),
  }));

  const [selectedDay, setSelectedDay] = useState<DailyMetric | null>(currentWeekData.dailyMetrics[0]);

  const handleBarClick = (data: any) => {
    if (data.activePayload && data.activePayload.length > 0) {
        const originalDay = earningsData[currentWeekIndex].dailyMetrics.find(d => d.date === data.activePayload[0].payload.date);
        setSelectedDay(originalDay || null);
    }
  };

  const goToPreviousWeek = () => {
    const newIndex = Math.min(currentWeekIndex + 1, earningsData.length - 1);
    setCurrentWeekIndex(newIndex);
    setSelectedDay(earningsData[newIndex].dailyMetrics[0]);
  };

  const goToNextWeek = () => {
    const newIndex = Math.max(currentWeekIndex - 1, 0);
    setCurrentWeekIndex(newIndex);
     setSelectedDay(earningsData[newIndex].dailyMetrics[0]);
  };

  const totalEarningsConverted = currentWeekData.dailyMetrics.reduce((acc, day) => acc + day.earnings, 0);


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardDescription>{currentWeekData.weekOf}</CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {currency}
              {convertAndRound(totalEarningsConverted, currency)}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek} disabled={currentWeekIndex === earningsData.length - 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Week</span>
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek} disabled={currentWeekIndex === 0}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Week</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer>
            <BarChart data={convertedDailyMetrics} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} onClick={handleBarClick}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${currency}${value}`} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                {convertedDailyMetrics.map((entry) => (
                  <Cell
                    key={`cell-${entry.date}`}
                    fill={selectedDay?.date === entry.date ? 'hsl(var(--accent))' : 'hsl(var(--secondary))'}
                    className="cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {selectedDay && (
          <div className="rounded-xl border bg-card p-4 shadow-sm animate-in fade-in-0">
            <h3 className="text-lg font-medium leading-none tracking-tight mb-4">
              Metrics for {selectedDay.day}, {selectedDay.date}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricItem icon={<Wallet className="h-5 w-5" />} label="Earnings" value={`${currency}${convertAndRound(selectedDay.earnings, currency)}`} />
              <MetricItem icon={<Car className="h-5 w-5" />} label="Trips" value={selectedDay.trips} />
              <MetricItem icon={<Clock className="h-5 w-5" />} label="Online Time" value={`${selectedDay.onlineHours} hrs`} />
              <MetricItem icon={<Gift className="h-5 w-5" />} label="Tips" value={`${currency}${convertAndRound(selectedDay.tips, currency)}`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

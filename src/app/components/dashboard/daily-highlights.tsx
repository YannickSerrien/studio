'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { dailyHighlightsData, type Settings } from '@/app/lib/data';

const chartConfig = {
  earnings: {
    label: 'Earnings',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;

type DailyHighlightsProps = {
  currency: Settings['currency'];
};

export function DailyHighlights({ currency }: DailyHighlightsProps) {
  const bestDay = dailyHighlightsData.reduce(
    (max, day) => (day.earnings > max.earnings ? day : max),
    dailyHighlightsData[0]
  );

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Daily Highlights</CardTitle>
        <CardDescription>
          Your best day this week was {bestDay.day} with {currency}
          {bestDay.earnings.toFixed(2)} in earnings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <BarChart
              data={dailyHighlightsData}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${currency}${value}`}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                {dailyHighlightsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.day === bestDay.day
                        ? 'hsl(var(--accent))'
                        : 'hsl(var(--secondary))'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

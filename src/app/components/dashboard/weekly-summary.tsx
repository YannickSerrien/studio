import type { FC } from 'react';
import { Wallet, Car, Gift, Route, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { weeklySummaryData, type Settings } from '@/app/lib/data';

const SummaryItem: FC<{ icon: React.ReactNode; label: string; value: string }> =
  ({ icon, label, value }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-secondary-foreground">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

type WeeklySummaryProps = {
  currency: Settings['currency'];
};

export function WeeklySummary({ currency }: WeeklySummaryProps) {
  const { earnings, trips, tips, kms, onlineMinutes } = weeklySummaryData;

  const summaryItems = [
    {
      icon: <Wallet className="h-5 w-5 text-accent" />,
      label: 'Earnings',
      value: `${currency}${earnings.toFixed(2)}`,
    },
    {
      icon: <Car className="h-5 w-5 text-accent" />,
      label: 'Trips',
      value: trips.toString(),
    },
    {
      icon: <Gift className="h-5 w-5 text-accent" />,
      label: 'Tips',
      value: `${currency}${tips.toFixed(2)}`,
    },
    {
      icon: <Route className="h-5 w-5 text-accent" />,
      label: 'Distance',
      value: `${kms} km`,
    },
    {
      icon: <Clock className="h-5 w-5 text-accent" />,
      label: 'Online Time',
      value: formatMinutes(onlineMinutes),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 md:divide-x divide-border">
          {summaryItems.map((item, index) => (
            <div className="px-4 py-2 md:py-0 first:pl-0" key={index}>
              <SummaryItem {...item} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

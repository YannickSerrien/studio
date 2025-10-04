import { Header } from '@/app/components/dashboard/header';
import { WeeklySummary } from '@/app/components/dashboard/weekly-summary';
import { DailyHighlights } from '@/app/components/dashboard/daily-highlights';
import { IncentiveTracker } from '@/app/components/dashboard/incentive-tracker';
import { WellnessNudge } from '@/app/components/dashboard/wellness-nudge';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="mx-auto max-w-7xl">
          <WeeklySummary />
        </div>
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <DailyHighlights />
          <IncentiveTracker />
        </div>
      </main>
      <WellnessNudge />
    </div>
  );
}

import { Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { incentiveData } from '@/app/lib/data';

const HighlightedDescription = ({ text }: { text: string }) => {
  const bonusRegex = /(\$\d+(\.\d{1,2})?\s*bonus)/i;
  const parts = text.split(bonusRegex);

  return (
    <CardDescription>
      {parts.map((part, index) => {
        if (bonusRegex.test(part)) {
          return (
            <span key={index} className="font-bold text-accent">
              {part}
            </span>
          );
        }
        return part;
      })}
    </CardDescription>
  );
};

export function IncentiveTracker() {
  const { title, description, current, goal, unit, daysLeft } = incentiveData;
  const progressPercentage = (current / goal) * 100;
  const tripsLeft = goal - current;
  const dailyTarget = Math.ceil(tripsLeft / daysLeft);

  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <HighlightedDescription text={description} />
          </div>
          <Target className="h-8 w-8 text-accent" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-2">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold">{tripsLeft > 0 ? tripsLeft : '🎉'}</p>
            <p className="text-sm text-muted-foreground">{tripsLeft > 0 ? 'Trips Left' : 'Done!'}</p>
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-start gap-4">
           <div className="space-y-1 text-center sm:text-left">
            <p className="text-3xl font-bold">{daysLeft}</p>
            <p className="text-sm text-muted-foreground">Days Remaining</p>
          </div>

          {tripsLeft > 0 && daysLeft > 0 && (
            <div className="rounded-lg border border-dashed border-accent/50 bg-accent/10 px-4 py-2 text-center sm:text-left">
              <p className="text-sm font-medium text-accent-foreground/90">
                Aim for at least{' '}
                <span className="font-bold text-accent-foreground">
                  {dailyTarget} {unit}
                </span>{' '}
                per day.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
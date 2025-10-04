import { Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { incentiveData } from '@/app/lib/data';

export function IncentiveTracker() {
  const { title, description, current, goal, unit, daysLeft } = incentiveData;
  const progressPercentage = (current / goal) * 100;
  const tripsLeft = goal - current;
  const dailyTarget = Math.ceil(tripsLeft / daysLeft);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Target className="h-8 w-8 text-accent" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <p className="text-2xl font-bold">
              {current}
              <span className="text-base font-normal text-secondary-foreground">
                /{goal} {unit}
              </span>
            </p>
            <p className="text-sm font-medium text-accent">
              {tripsLeft > 0 ? `${tripsLeft} more to go` : 'Completed!'}
            </p>
          </div>
          <Progress
            value={progressPercentage}
            aria-label={`${progressPercentage.toFixed(0)}% complete`}
          />
        </div>
        {tripsLeft > 0 && daysLeft > 0 && (
          <div className="rounded-lg border border-dashed border-accent/50 bg-accent/10 p-3 text-center">
            <p className="text-sm font-medium text-accent-foreground/90">
              Aim for at least{' '}
              <span className="font-bold text-accent-foreground">
                {dailyTarget} {unit}
              </span>{' '}
              today to stay on track.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

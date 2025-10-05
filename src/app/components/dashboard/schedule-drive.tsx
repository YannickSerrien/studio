
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Search, Loader2, AlertTriangle } from 'lucide-react';
import type { Settings } from '@/app/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type ScheduleDriveProps = {
  city: Settings['city'];
};

type ScheduleResult = {
  start_hour: string;
  duration: number;
  total_earnings: number;
  hourly_rate: number;
  path_preview: string;
}

export function ScheduleDrive({ city }: ScheduleDriveProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [bestSchedule, setBestSchedule] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(8);

  const handleFindBestTime = async () => {
    setIsLoading(true);
    setBestSchedule(null);
    setError(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, duration }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The optimization algorithm failed.');
      }

      const data = await response.json();
      const schedules = data?.analysis?.schedule_comparison;

      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        throw new Error('No valid schedules were returned from the analysis.');
      }
      
      // Find the schedule with the highest hourly rate
      const best = schedules.reduce((prev, current) => (prev.hourly_rate > current.hourly_rate) ? prev : current);
      setBestSchedule(best);

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find the Best Time to Drive</CardTitle>
        <CardDescription>
          Select your planned shift duration, and we'll find the most profitable time to start.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="duration-slider">Shift Duration</Label>
            <span className="font-bold text-lg text-accent">{duration} hours</span>
          </div>
          <Slider
            id="duration-slider"
            min={2}
            max={12}
            step={1}
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleFindBestTime} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Schedules...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Best Time to Start
            </>
          )}
        </Button>

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {bestSchedule && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-center animate-in fade-in-0">
            <p className="text-sm text-muted-foreground">For a <span className="font-bold">{bestSchedule.duration}</span>-hour shift, the best time to start is:</p>
            <div className="flex items-center justify-center gap-2 mt-2">
                <Clock className="h-5 w-5 text-accent" />
                <p className="text-lg font-bold text-accent-foreground">
                  Around {bestSchedule.start_hour}
                </p>
            </div>
             <p className="text-xs text-muted-foreground mt-2">
                (Expected hourly rate: €{bestSchedule.hourly_rate.toFixed(2)}/hr)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

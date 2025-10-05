
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertTriangle, Wallet, MapPin, Clock } from 'lucide-react';
import type { Settings } from '@/app/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type ScheduleDriveProps = {
  city: Settings['city'];
  currency: Settings['currency'];
};

type OptimizationResult = {
  start_hour: number;
  total_earnings: number;
  hourly_rate: number;
  optimal_cluster: string;
};

// Fixed duration for each check, e.g., an 8-hour shift
const SHIFT_DURATION = 8;

export function ScheduleDrive({ city, currency }: ScheduleDriveProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [bestShift, setBestShift] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientReady, setClientReady] = useState(false);
  const [timeLabels, setTimeLabels] = useState<Date[]>([]);
  const [timeRange, setTimeRange] = useState([8, 18]); // Default e.g., 8 AM to 6 PM

  // Generate time labels for a 24-hour period in 1-hour intervals
  useEffect(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Start from the current hour
    const labels = Array.from({ length: 24 }, (_, i) => {
      const date = new Date(now.getTime() + i * 60 * 60 * 1000);
      return date;
    });
    setTimeLabels(labels);
    setClientReady(true);
  }, []);

  const formatTime = (hour: number) => {
    if (!clientReady || !timeLabels.length) return '...';
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  const handleFindBestShift = async () => {
    setIsLoading(true);
    setBestShift(null);
    setError(null);

    const startHour = timeRange[0];
    const endHour = timeRange[1];

    if (startHour >= endHour) {
      setError("Please select a valid time range where the start time is before the end time.");
      setIsLoading(false);
      return;
    }

    try {
      const promises: Promise<OptimizationResult>[] = [];

      for (let hour = startHour; hour < endHour; hour++) {
        const promise = fetch('/api/optimize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city, startHour: hour, duration: SHIFT_DURATION }),
        }).then(res => {
            if (!res.ok) {
                throw new Error(`Analysis for ${hour}:00 failed.`);
            }
            return res.json();
        }).then(data => ({
            start_hour: hour,
            total_earnings: data.total_earnings,
            hourly_rate: data.hourly_rate,
            optimal_cluster: data.optimal_path[0],
        }));
        promises.push(promise);
      }

      const results = await Promise.all(promises);

      if (results.length === 0) {
        throw new Error("No time slots to analyze.");
      }

      // Find the result with the highest total earnings
      const bestResult = results.reduce((best, current) => {
        return current.total_earnings > best.total_earnings ? current : best;
      }, results[0]);
      
      setBestShift(bestResult);

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimal Shift Finder</CardTitle>
        <CardDescription>
          Select your availability window to find the most profitable {SHIFT_DURATION}-hour shift.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center font-mono text-lg">
             <div>
                <Label className="font-sans text-xs text-muted-foreground">Available From</Label>
                <p>{formatTime(timeRange[0])}</p>
             </div>
             <div>
                <Label className="font-sans text-xs text-muted-foreground">Available Until</Label>
                <p>{formatTime(timeRange[1])}</p>
             </div>
          </div>
          <Slider
            id="time-range-slider"
            min={0}
            max={23}
            step={1}
            value={timeRange}
            onValueChange={setTimeRange}
            disabled={isLoading || !clientReady}
            className="w-full"
          />
        </div>

        <Button onClick={handleFindBestShift} disabled={isLoading || !clientReady} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Shifts...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Best Shift
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

        {bestShift && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 space-y-3 animate-in fade-in-0">
            <h3 className="font-semibold text-center">Your Optimal {SHIFT_DURATION}-Hour Shift</h3>
            <div className="flex items-center justify-around text-center">
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>Best Start Time</Label>
                <p className="text-xl font-bold text-accent-foreground">{formatTime(bestShift.start_hour)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>Best Start Zone</Label>
                <p className="text-xl font-bold text-accent-foreground">{bestShift.optimal_cluster}</p>
              </div>
            </div>
            <div className="text-center pt-2">
                <Label className="text-xs text-muted-foreground">Forecasted Earnings</Label>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <Wallet className="h-5 w-5 text-accent" />
                    <p className="text-2xl font-bold text-accent-foreground">
                      {currency}{bestShift.total_earnings.toFixed(2)}
                    </p>
                </div>
                 <p className="text-xs text-muted-foreground">
                    (Avg: {currency}{bestShift.hourly_rate.toFixed(2)}/hr)
                </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

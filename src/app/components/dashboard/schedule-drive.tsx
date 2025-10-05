
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertTriangle, Wallet } from 'lucide-react';
import type { Settings } from '@/app/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type ScheduleDriveProps = {
  city: Settings['city'];
  currency: Settings['currency'];
};

type ForecastResult = {
  total_earnings: number;
  hourly_rate: number;
  optimal_path: string[];
}

export function ScheduleDrive({ city, currency }: ScheduleDriveProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State to hold client-side calculated values to prevent hydration mismatch
  const [clientReady, setClientReady] = useState(false);
  const [timeLabels, setTimeLabels] = useState<Date[]>([]);
  const [timeRange, setTimeRange] = useState([12, 48]); // Default: 3 hours from now to 12 hours from now
  
  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    const now = new Date();
    const labels = [];
    for (let i = 0; i < 24 * 4; i++) { // 24 hours, 4 intervals per hour
      const date = new Date(now.getTime() + i * 15 * 60 * 1000);
      labels.push(date);
    }
    setTimeLabels(labels);
    setClientReady(true); // Mark client as ready
  }, []);


  const sliderMin = 0;
  const sliderMax = (timeLabels.length || 0) - 1;

  const formatTime = (sliderValue: number) => {
    if (!clientReady || !timeLabels[sliderValue]) return '...'; // Render placeholder on server
    const date = timeLabels[sliderValue];
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  const durationInHours = useMemo(() => {
    return (timeRange[1] - timeRange[0]) / 4;
  }, [timeRange]);


  const handleForecast = async () => {
    setIsLoading(true);
    setForecast(null);
    setError(null);
    
    if (durationInHours <= 0) {
        setError("Please select a valid time range with a duration greater than zero.");
        setIsLoading(false);
        return;
    }

    try {
      const selectedStartTime = timeLabels[timeRange[0]];
      const startHour = selectedStartTime.getHours();
      
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, startHour, duration: Math.round(durationInHours) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The optimization algorithm failed.');
      }

      const data = await response.json();
      const result = data?.analysis?.best_positions?.[0];

      if (!result) {
        throw new Error('No valid forecast was returned from the analysis.');
      }
      
      const transformedResult: ForecastResult = {
        total_earnings: result.earnings,
        hourly_rate: result.earnings / Math.round(durationInHours),
        optimal_path: result.path
      };
      setForecast(transformedResult);

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Forecaster</CardTitle>
        <CardDescription>
          Select a time window to forecast your potential earnings for that period.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center font-mono text-lg">
             <div>
                <Label className="font-sans text-xs text-muted-foreground">Start Time</Label>
                <p>{formatTime(timeRange[0])}</p>
             </div>
             <div>
                <Label className="font-sans text-xs text-muted-foreground">End Time</Label>
                <p>{formatTime(timeRange[1])}</p>
             </div>
          </div>
          <Slider
            id="time-range-slider"
            min={sliderMin}
            max={sliderMax}
            step={1}
            value={timeRange}
            onValueChange={setTimeRange}
            disabled={isLoading || !clientReady}
            className="w-full"
          />
           <div className="text-center">
              <Label className="text-xs text-muted-foreground">Selected Duration</Label>
              <p className="font-bold text-accent">{durationInHours.toFixed(2)} hours</p>
           </div>
        </div>

        <Button onClick={handleForecast} disabled={isLoading || !clientReady} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating Forecast...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Forecast Earnings
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

        {forecast && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-center animate-in fade-in-0">
            <p className="text-sm text-muted-foreground">
                Forecast for {formatTime(timeRange[0])} - {formatTime(timeRange[1])}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
                <Wallet className="h-6 w-6 text-accent" />
                <p className="text-2xl font-bold text-accent-foreground">
                  {currency}{forecast.total_earnings.toFixed(2)}
                </p>
            </div>
             <p className="text-xs text-muted-foreground mt-1">
                (Hourly average: {currency}{forecast.hourly_rate.toFixed(2)}/hr)
            </p>
            {forecast.optimal_path && (
                 <p className="text-xs text-muted-foreground mt-2">
                    Optimal starting area: <span className="font-semibold">{forecast.optimal_path[0]}</span>
                </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

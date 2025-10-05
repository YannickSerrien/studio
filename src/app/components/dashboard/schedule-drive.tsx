
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MapPin, Clock, Search, Loader2 } from 'lucide-react';
import type { Settings } from '@/app/lib/data';
import { Button } from '@/components/ui/button';

type ScheduleDriveProps = {
  city: Settings['city'];
  currency: Settings['currency'];
};

type Suggestion = {
  start_hour: number;
  description: string;
  hotspot: string;
};

const cityData: Record<string, { name: string; }> = {
  '1': { name: 'Amsterdam' },
  '2': { name: 'Rotterdam' },
  '3': { name: 'Utrecht' },
  '4': { name: 'Eindhoven' },
  '5': { name: 'Den Haag' },
};


export function ScheduleDrive({ city, currency }: ScheduleDriveProps) {
  const [clientReady, setClientReady] = useState(false);
  const [timeRange, setTimeRange] = useState([8, 18]); // Default e.g., 8 AM to 6 PM
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs once on the client after hydration.
    setClientReady(true);
  }, []);

  const formatTime = (hour: number) => {
    if (!clientReady) return '...';
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleFindBestTime = async () => {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);
    const [startHour, endHour] = timeRange;

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, startHour, endHour }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed. Please try again.`);
      }
      
      const result = await response.json();
      setSuggestion(result.suggestion);

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Busiest Time Finder</CardTitle>
        <CardDescription>
          Select your availability window to find the most profitable time to start driving.
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
            min={0}
            max={23}
            step={1}
            value={timeRange}
            onValueChange={setTimeRange}
            disabled={!clientReady || isLoading}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-center">
            <Button onClick={handleFindBestTime} disabled={!clientReady || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {isLoading ? 'Analyzing...' : 'Find Best Time'}
            </Button>
        </div>

        {error && (
            <div className="text-center text-sm text-destructive pt-4">
                <p>{error}</p>
            </div>
        )}

        {suggestion ? (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 space-y-3 animate-in fade-in-0">
            <h3 className="font-semibold text-center">Your Suggested Strategy</h3>
            <div className="flex items-center justify-around text-center">
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>Best Start Time</Label>
                <p className="text-xl font-bold text-accent-foreground">{formatTime(suggestion.start_hour)}</p>
                <p className="text-xs text-muted-foreground">({suggestion.description})</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>Suggested Hotspot</Label>
                <p className="text-xl font-bold text-accent-foreground">{suggestion.hotspot}</p>
                 <p className="text-xs text-muted-foreground">({cityData[city]?.name || 'Your City'})</p>
              </div>
            </div>
            <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                    Starting at this time and location gives you a high probability of finding consistent rides.
                </p>
            </div>
          </div>
        ) : !isLoading && !error && (
             <div className="text-center text-sm text-muted-foreground pt-4">
                Move the slider and click "Find Best Time" to see your optimal strategy.
             </div>
        )}
      </CardContent>
    </Card>
  );
}

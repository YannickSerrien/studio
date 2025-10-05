
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MapPin, Clock, Search } from 'lucide-react';
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


// --- Hardcoded Data ---
const cityData: Record<string, { name: string; hotspot: string }> = {
  '1': { name: 'Amsterdam', hotspot: 'De Pijp' },
  '2': { name: 'Rotterdam', hotspot: 'Witte de Withstraat' },
  '3': { name: 'Utrecht', hotspot: 'Neude' },
  '4': { name: 'Eindhoven', hotspot: 'Stratumseind' },
  '5': { name: 'Den Haag', hotspot: 'Plein' },
};

// Represents typical busy periods. Intensity is on a scale of 1-10.
const busyHoursData: { hour: number; intensity: number; description: string }[] = [
  { hour: 7, intensity: 7, description: 'Morning Commute' },
  { hour: 8, intensity: 8, description: 'Morning Peak' },
  { hour: 9, intensity: 7, description: 'Morning Commute' },
  { hour: 12, intensity: 6, description: 'Lunch Hour' },
  { hour: 13, intensity: 6, description: 'Lunch Hour' },
  { hour: 17, intensity: 8, description: 'Evening Commute' },
  { hour: 18, intensity: 9, description: 'Evening Peak' },
  { hour: 19, intensity: 8, description: 'Evening Commute' },
  { hour: 21, intensity: 7, description: 'Nightlife Start' },
  { hour: 22, intensity: 9, description: 'Nightlife Peak' },
  { hour: 23, intensity: 10, description: 'Nightlife Peak' },
  { hour: 0, intensity: 9, description: 'Nightlife End' }, // After midnight
  { hour: 1, intensity: 8, description: 'Nightlife End' },
];
// --- End Hardcoded Data ---

export function ScheduleDrive({ city, currency }: ScheduleDriveProps) {
  const [clientReady, setClientReady] = useState(false);
  const [timeRange, setTimeRange] = useState([8, 18]); // Default e.g., 8 AM to 6 PM
  const [bestTimeSuggestion, setBestTimeSuggestion] = useState<Suggestion | null>(null);

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

  const handleFindBestTime = () => {
    const [start, end] = timeRange;
    
    // Create a range of hours to check
    let hoursInRange = [];
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        hoursInRange.push(i);
      }
    } else { // Handle overnight ranges (e.g., 22:00 to 02:00)
      for (let i = start; i < 24; i++) {
        hoursInRange.push(i);
      }
      for (let i = 0; i <= end; i++) {
        hoursInRange.push(i);
      }
    }

    // Find the busiest hour within the selected range
    const bestHour = busyHoursData
      .filter(busyHour => hoursInRange.includes(busyHour.hour))
      .reduce((best, current) => (current.intensity > best.intensity ? current : best), { hour: -1, intensity: -1, description: 'N/A' });

    if (bestHour.intensity === -1) {
       setBestTimeSuggestion(null); // No busy hours found in this range
    } else {
      setBestTimeSuggestion({
        start_hour: bestHour.hour,
        description: bestHour.description,
        hotspot: cityData[city]?.hotspot || 'City Center',
      });
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
            disabled={!clientReady}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-center">
            <Button onClick={handleFindBestTime} disabled={!clientReady}>
                <Search className="mr-2 h-4 w-4" />
                Find Best Time
            </Button>
        </div>

        {bestTimeSuggestion ? (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 space-y-3 animate-in fade-in-0">
            <h3 className="font-semibold text-center">Your Suggested Strategy</h3>
            <div className="flex items-center justify-around text-center">
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/>Best Start Time</Label>
                <p className="text-xl font-bold text-accent-foreground">{formatTime(bestTimeSuggestion.start_hour)}</p>
                <p className="text-xs text-muted-foreground">({bestTimeSuggestion.description})</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>Suggested Hotspot</Label>
                <p className="text-xl font-bold text-accent-foreground">{bestTimeSuggestion.hotspot}</p>
                 <p className="text-xs text-muted-foreground">({cityData[city]?.name || 'Your City'})</p>
              </div>
            </div>
            <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                    Starting at this time and location gives you a high probability of finding consistent rides.
                </p>
            </div>
          </div>
        ) : (
             <div className="text-center text-sm text-muted-foreground pt-4">
                Move the slider and click "Find Best Time" to see your optimal strategy.
             </div>
        )}
      </CardContent>
    </Card>
  );
}

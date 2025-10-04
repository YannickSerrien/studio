
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Search, Loader2 } from 'lucide-react';
import type { Settings } from '@/app/lib/data';

type OptimizationResult = {
  best_positions: {
    rank: number;
    cluster: string;
    lat: number;
    lon: number;
    earnings: number;
    path: string[];
  }[];
};

type ScheduleDriveProps = {
  city: Settings['city'];
};

export function ScheduleDrive({ city }: ScheduleDriveProps) {
  const [hours, setHours] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedLocation, setSuggestedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const handleFindBestLocation = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestedLocation(null);
    setUserLocation(null);

    // Get user location first (optional, but good for context)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        },
        () => {
          // Can't get user location, but we can still proceed
          setUserLocation('Could not determine location');
        }
      );
    }

    try {
      // Call our new API route
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hours, city: parseInt(city, 10) }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'The optimization algorithm failed.');
      }

      const result: OptimizationResult = await response.json();
      
      if (result.best_positions && result.best_positions.length > 0) {
        const bestPosition = result.best_positions[0];
        setSuggestedLocation({ lat: bestPosition.lat, lon: bestPosition.lon });
      } else {
        throw new Error('Could not determine the best location from the algorithm.');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Drive</CardTitle>
        <CardDescription>
          Select how long you plan to drive, and we'll suggest the best starting point.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="hours-slider" className="text-sm font-medium">
              Planned Driving Hours
            </label>
            <span className="text-2xl font-bold text-primary">{hours}</span>
          </div>
          <Slider
            id="hours-slider"
            min={1}
            max={12}
            step={1}
            value={[hours]}
            onValueChange={(value) => setHours(value[0])}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleFindBestLocation} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Location...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Best Spot
            </>
          )}
        </Button>
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}
        {suggestedLocation && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-center animate-in fade-in-0">
            <p className="text-sm text-muted-foreground">Based on your plan to drive for {hours} hours, your optimal starting point is:</p>
            <div className="flex items-center justify-center gap-2 mt-2">
                <MapPin className="h-5 w-5 text-accent" />
                <p className="text-lg font-bold text-accent-foreground">
                  Lat: {suggestedLocation.lat.toFixed(4)}, Lon: {suggestedLocation.lon.toFixed(4)}
                </p>
            </div>
             {userLocation && (
              <p className="text-xs text-muted-foreground mt-2">(Your location: {userLocation})</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

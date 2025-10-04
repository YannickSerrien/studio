
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Search, Loader2 } from 'lucide-react';
import type { Settings } from '@/app/lib/data';

type ScheduleDriveProps = {
  city: Settings['city'];
};

const cityLocations: Record<string, { name: string; lat: number; lon: number }> = {
  '1': { name: 'Rijksmuseum, Amsterdam', lat: 52.3600, lon: 4.8852 },
  '2': { name: 'Rotterdam Centraal', lat: 51.9244, lon: 4.4777 },
  '3': { name: 'Utrecht Centraal', lat: 52.0895, lon: 5.1077 },
  '4': { name: 'Eindhoven Airport', lat: 51.4501, lon: 5.4044 },
  '5': { name: 'Den Haag Centraal', lat: 52.0802, lon: 4.3250 },
};

export function ScheduleDrive({ city }: ScheduleDriveProps) {
  const [hours, setHours] = useState(4);
  const [isFinding, setIsFinding] = useState(false);
  const [suggestedLocation, setSuggestedLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const handleFindBestLocation = () => {
    setIsFinding(true);
    setSuggestedLocation(null);
    setUserLocation(null);

    // Simulate a network delay
    setTimeout(() => {
        // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
          },
          () => {
            setUserLocation('Could not determine location');
          }
        );
      } else {
         setUserLocation('Geolocation not supported');
      }

      // Set the hardcoded suggested location based on the selected city
      setSuggestedLocation(cityLocations[city] || cityLocations['3']);
      setIsFinding(false);

    }, 1000);
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
            disabled={isFinding}
          />
        </div>
        <Button onClick={handleFindBestLocation} disabled={isFinding} className="w-full">
          {isFinding ? (
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

        {suggestedLocation && (
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-center animate-in fade-in-0">
            <p className="text-sm text-muted-foreground">Based on your plan to drive for {hours} hours, your optimal starting point is:</p>
            <div className="flex items-center justify-center gap-2 mt-2">
                <MapPin className="h-5 w-5 text-accent" />
                <p className="text-lg font-bold text-accent-foreground">
                  {suggestedLocation.name}
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

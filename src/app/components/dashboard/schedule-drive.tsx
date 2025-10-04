
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Search, Loader2 } from 'lucide-react';

export function ScheduleDrive() {
  const [hours, setHours] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedLocation, setSuggestedLocation] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const handleFindBestLocation = () => {
    setIsLoading(true);
    setError(null);
    setSuggestedLocation(null);
    setUserLocation(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // For now, we're not using the coords, but you would pass them to your algorithm.
        setUserLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);

        // Simulate an API call to your algorithm
        setTimeout(() => {
          // Hardcoded output from your future algorithm
          setSuggestedLocation('Financial District, San Francisco');
          setIsLoading(false);
        }, 1500);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('You denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
        setIsLoading(false);
      }
    );
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
                <p className="text-lg font-bold text-accent-foreground">{suggestedLocation}</p>
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
